// Shared bounds, SAFE XML parsing, and MusicXML-semantic normalization
// helpers for the musicxml-tools nodes. Not a node and not a test file, so
// it is neither registered nor collected by jest.
//
// The XML tokenizing layer is entirely owned by fast-xml-parser
// (github.com/NaturalIntelligence/fast-xml-parser, MIT) — nothing here
// reimplements XML parsing. What lives here is: (a) input-size and
// nesting-depth bounds enforced BEFORE fast-xml-parser ever sees the input,
// (b) a normalization step that maps BOTH score-partwise and score-timewise
// documents into one common per-part/per-measure shape, and (c) the
// MusicXML-semantic knowledge (which element, at which path, means "note
// duration" / "key signature" / "tempo mark" / etc.) — that knowledge is
// this package's actual value-add, not something any generic XML library
// provides.
//
// SAFETY (XXE): fast-xml-parser has NO external-entity or DTD-ENTITY
// support at all — verified directly against this exact dependency
// (fast-xml-parser@4.5.7): a DOCTYPE declaring a SYSTEM external entity
// makes the parser throw `Error: External entities are not supported`
// (DocTypeReader.readEntityExp) rather than resolve it, and an internal
// general entity declared in a DOCTYPE (the "billion laughs" pattern) is
// never substituted either — `&name;` passes through as literal text,
// unexpanded, because processEntities only handles the five predefined XML
// entities (&amp; &lt; &gt; &apos; &quot;) and numeric character
// references. A plain DOCTYPE with only a PUBLIC/SYSTEM identifier and no
// inline ENTITY declarations (the common, historical form real MusicXML
// files carry, e.g. the Recordare MusicXML DTD reference) parses fine and
// triggers no network access — fast-xml-parser never fetches the
// referenced DTD. We still: reject oversized input before parsing at all,
// and pre-scan nesting depth with a lightweight tag counter (fast-xml-
// parser's own parse is recursive-descent, so a native stack overflow from
// pathologically deep input is a crash we must prevent, not just catch).

import { XMLParser, XMLValidator } from 'fast-xml-parser';

// ---------------------------------------------------------------------------
// Bounds
// ---------------------------------------------------------------------------

/** Ceiling for a whole MusicXML document's raw text. 3 MB — comfortably
 * under the ~4 MiB Axiom transport cap even after part of it is echoed
 * back in an output field, and far beyond any real hand- or software-
 * generated score (a large orchestral score is typically a few hundred KB
 * to low single-digit MB uncompressed). This package never decompresses a
 * .mxl (zip) container — callers must supply already-uncompressed XML
 * text — so there is no separate decompression-bomb surface to bound. */
export const MAX_XML_BYTES = 3_000_000;

/** Ceiling on XML element nesting depth, checked BEFORE the real parse
 * with a cheap linear tag scan. Real MusicXML rarely nests past ~15-20
 * levels (score > part > measure > note > notations > technical > ...);
 * 200 is generous headroom while still bounding pathologically deep input
 * that could otherwise stack-overflow fast-xml-parser's recursive-descent
 * parser — a native crash that cannot be caught with try/catch, so it must
 * be prevented outright rather than handled after the fact. */
export const MAX_XML_DEPTH = 200;

/** Cap on the number of MeasureInfo rows ExtractMeasures returns in one
 * call. Bounds response size independent of MAX_XML_BYTES (many parts times
 * many measures can still add up); a truncated response is flagged, never
 * silently incomplete. */
export const MAX_MEASURES_OUTPUT = 5000;

/** Cap on the number of NoteInfo rows ExtractNotes returns in one call,
 * for the same reason as MAX_MEASURES_OUTPUT. */
export const MAX_NOTES_OUTPUT = 20_000;

export class BoundsError extends Error {}
export class MusicXmlParseError extends Error {}

/** Rejects oversized input (by UTF-8 byte length, not JS string length). */
export function checkBytes(value: string, field: string, max: number): void {
  if (Buffer.byteLength(value, 'utf8') > max) {
    throw new BoundsError(`${field} exceeds ${max} bytes`);
  }
}

/** Cheap linear scan for XML tag nesting depth, independent of
 * fast-xml-parser's own (recursive) traversal. Not a full XML tokenizer —
 * it does not understand comments/CDATA/PI bodies containing literal
 * angle-bracket text — but as a pre-parse DEFENSE-IN-DEPTH bound against
 * pathological nesting it only needs to be conservative, not exact: any
 * imprecision makes it reject slightly more input, never less. */
export function checkDepth(xml: string, max: number): void {
  const tagRe = /<(\/?)([A-Za-z_][\w:.-]*)[^>]*?(\/?)>/g;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(xml)) !== null) {
    const closing = m[1] === '/';
    const selfClosing = m[3] === '/';
    if (closing) {
      depth = Math.max(0, depth - 1);
    } else if (!selfClosing) {
      depth += 1;
      if (depth > max) {
        throw new BoundsError(`xml nesting depth exceeds ${max}`);
      }
    }
  }
}

/** Turns a caught value into a stable error message. */
export function errorMessage(e: unknown, context: string): string {
  if (e instanceof Error) {
    return `${context}: ${e.message}`;
  }
  return `${context}: ${String(e)}`;
}

// ---------------------------------------------------------------------------
// Safe XML parse
// ---------------------------------------------------------------------------

/** Element tags that must always be materialized as an array, even when
 * exactly one occurrence is present — every tag this package treats as a
 * repeatable list. */
const ARRAY_TAGS = new Set([
  'score-part',
  'part-group',
  'part',
  'measure',
  'note',
  'creator',
  'clef',
  'beats',
  'beat-type',
  'beat-unit',
  'beat-unit-dot',
  'lyric',
  'score-instrument',
  'midi-instrument',
  'software',
  'encoding-date',
  'direction',
  'direction-type',
  'sound',
  'attributes',
  'tie',
  'notations',
  'dot',
]);

let parserInstance: XMLParser | null = null;
function getParser(): XMLParser {
  if (!parserInstance) {
    parserInstance = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseTagValue: false,
      parseAttributeValue: false,
      trimValues: true,
      isArray: (tagName: string) => ARRAY_TAGS.has(tagName),
    });
  }
  return parserInstance;
}

export interface ParsedRoot {
  form: 'score-partwise' | 'score-timewise';
  root: Record<string, unknown>;
}

/** Checks well-formedness with fast-xml-parser's own XMLValidator — needed
 * because XMLParser.parse() alone is LENIENT and silently tolerates some
 * genuinely malformed XML (verified directly: a truncated attribute like
 * `<score-part id="P1"</score-part>` parses without error via `.parse()`,
 * dropping the broken attribute rather than rejecting the document, but
 * XMLValidator.validate() correctly flags it). Throws MusicXmlParseError
 * with the validator's own line/column detail; does not affect the
 * separate external-entity rejection, which XMLValidator does not itself
 * perform — verified that a DOCTYPE with a SYSTEM external entity passes
 * validate() as well-formed and is only rejected later, by parse() itself. */
function checkWellFormed(xml: string): void {
  const result = XMLValidator.validate(xml, { allowBooleanAttributes: true });
  if (result !== true) {
    throw new MusicXmlParseError(`XML is not well-formed: ${result.err.msg} (line ${result.err.line}, col ${result.err.col})`);
  }
}

/** Parses MusicXML text into a root object identified as score-partwise or
 * score-timewise. Bounds byte size and nesting depth, and checks well-
 * formedness, before parsing. Throws BoundsError for a size/depth
 * violation, MusicXmlParseError for malformed XML or a document that
 * isn't one of the two recognized MusicXML root forms. Never throws a
 * native/unrecoverable error — any fast-xml-parser exception (including
 * its own "external entities are not supported" rejection) is caught and
 * re-thrown as MusicXmlParseError. */
export function parseMusicXmlRoot(xml: string, field = 'xml'): ParsedRoot {
  checkBytes(xml, field, MAX_XML_BYTES);
  checkDepth(xml, MAX_XML_DEPTH);
  checkWellFormed(xml);
  let parsed: Record<string, unknown>;
  try {
    parsed = getParser().parse(xml) as Record<string, unknown>;
  } catch (e) {
    throw new MusicXmlParseError(errorMessage(e, 'XML parse error'));
  }
  if (isPlainObject(parsed['score-partwise'])) {
    return { form: 'score-partwise', root: parsed['score-partwise'] as Record<string, unknown> };
  }
  if (isPlainObject(parsed['score-timewise'])) {
    return { form: 'score-timewise', root: parsed['score-timewise'] as Record<string, unknown> };
  }
  throw new MusicXmlParseError('root element is neither <score-partwise> nor <score-timewise>');
}

/** Lenient detection — never throws. Used by DetectMusicXml, which must
 * report is_music_xml=false rather than error for non-MusicXML input. */
export function detectMusicXml(xml: string): { isMusicXml: boolean; form: string; version: string; error: string } {
  try {
    checkBytes(xml, 'xml', MAX_XML_BYTES);
    checkDepth(xml, MAX_XML_DEPTH);
  } catch (e) {
    return { isMusicXml: false, form: '', version: '', error: errorMessage(e, 'detecting MusicXML') };
  }
  try {
    checkWellFormed(xml);
  } catch {
    return { isMusicXml: false, form: '', version: '', error: '' };
  }
  let parsed: Record<string, unknown>;
  try {
    parsed = getParser().parse(xml) as Record<string, unknown>;
  } catch {
    return { isMusicXml: false, form: '', version: '', error: '' };
  }
  for (const form of ['score-partwise', 'score-timewise'] as const) {
    const el = parsed[form];
    if (isPlainObject(el)) {
      return { isMusicXml: true, form, version: attr(el, 'version') ?? '', error: '' };
    }
  }
  return { isMusicXml: false, form: '', version: '', error: '' };
}

// ---------------------------------------------------------------------------
// Generic object helpers
// ---------------------------------------------------------------------------

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Normalizes a value that fast-xml-parser may return as either a single
 * object/string or an array (for tags not in ARRAY_TAGS) into an array. */
export function asArray(v: unknown): unknown[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

/** Reads an attribute (the "@_name" convention) as a string, or undefined
 * if absent. */
export function attr(obj: unknown, name: string): string | undefined {
  if (!isPlainObject(obj)) return undefined;
  const v = obj[`@_${name}`];
  return v === undefined ? undefined : String(v);
}

/** Reads an element's effective text: a plain string leaf, or the #text
 * key of a leaf that also carries attributes (mixed content), or '' for
 * anything else (missing, or a non-leaf object with no #text). */
export function str(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (isPlainObject(v)) {
    if ('#text' in v) return String(v['#text']);
    return '';
  }
  return String(v);
}

/** Parses a string as a base-10 integer; non-numeric input yields 0. */
export function toInt(v: unknown): number {
  const n = parseInt(str(v), 10);
  return Number.isNaN(n) ? 0 : n;
}

/** Parses a string as a float; NaN on non-numeric input (caller decides
 * how to treat that — usually "not specified" rather than 0). */
export function toFloat(v: unknown): number {
  return parseFloat(str(v));
}

// ---------------------------------------------------------------------------
// Normalized MusicXML model
// ---------------------------------------------------------------------------

export interface NPitch {
  step: string;
  alter: number;
  alterSpecified: boolean;
  octave: number;
}

export interface NLyric {
  verseNumber: string;
  syllabic: string;
  text: string;
  extend: boolean;
}

export interface NNote {
  isRest: boolean;
  isUnpitched: boolean;
  pitch: NPitch | null;
  duration: number;
  type: string;
  dots: number;
  voice: string;
  staff: number;
  staffSpecified: boolean;
  tieStart: boolean;
  tieStop: boolean;
  chord: boolean;
  grace: boolean;
  lyrics: NLyric[];
  articulationTypes: string[];
}

export interface NTime {
  beats: string[];
  beatType: string[];
  symbol: string;
}

export interface NKey {
  fifths: number;
  mode: string;
}

export interface NClef {
  sign: string;
  line: number | null;
  octaveChange: number | null;
  staffNumber: number;
}

export interface NTranspose {
  diatonic: number | null;
  chromatic: number;
  octaveChange: number | null;
  double: boolean;
}

export interface NAttributesChange {
  divisions: number | null;
  time: NTime | null;
  key: NKey | null;
  clefs: NClef[];
  transpose: NTranspose | null;
}

export interface NTempo {
  bpm: number;
  bpmSpecified: boolean;
  beatUnit: string;
  beatUnitDots: number;
  metricModulation: boolean;
  beatUnit2: string;
}

export interface NDirection {
  dynamics: string[];
  tempo: NTempo | null;
}

export interface NMeasure {
  index: number;
  number: string;
  implicit: boolean;
  width: number | null;
  widthSpecified: boolean;
  notes: NNote[];
  attributesChanges: NAttributesChange[];
  directions: NDirection[];
}

export interface NInstrument {
  id: string;
  name: string;
  abbreviation: string;
  sound: string;
}

export interface NPart {
  id: string;
  name: string;
  abbreviation: string;
  instruments: NInstrument[];
  measures: NMeasure[];
  /** True when this part id appeared in the note/measure content but had
   * no matching <score-part> in <part-list> (a structural problem). */
  undeclared: boolean;
}

export interface NCreator {
  type: string;
  name: string;
}

export interface NormalizedScore {
  form: 'score-partwise' | 'score-timewise';
  version: string;
  workTitle: string;
  workNumber: string;
  movementTitle: string;
  movementNumber: string;
  creators: NCreator[];
  rights: string;
  encodingSoftware: string[];
  encodingDates: string[];
  source: string;
  /** Parts declared in <part-list>, in document order, INCLUDING any that
   * have no matching content part (a structural problem, surfaced by
   * ValidateStructure). */
  declaredPartIds: string[];
  parts: NPart[];
}

function parsePitch(pitchObj: unknown): NPitch | null {
  if (!isPlainObject(pitchObj)) return null;
  const alterRaw = pitchObj.alter;
  return {
    step: str(pitchObj.step),
    alter: alterRaw !== undefined ? toInt(alterRaw) : 0,
    alterSpecified: alterRaw !== undefined,
    octave: toInt(pitchObj.octave),
  };
}

function parseNote(noteObj: unknown): NNote {
  const o = isPlainObject(noteObj) ? noteObj : {};
  const isRest = 'rest' in o;
  const isUnpitched = 'unpitched' in o;
  const pitch = !isRest && !isUnpitched ? parsePitch(o.pitch) : null;
  const durationRaw = o.duration;
  const staffRaw = o.staff;
  const ties = asArray(o.tie);
  const tieStart = ties.some((t) => attr(t, 'type') === 'start');
  const tieStop = ties.some((t) => attr(t, 'type') === 'stop');

  const lyrics: NLyric[] = asArray(o.lyric).map((l) => {
    const lo = isPlainObject(l) ? l : {};
    return {
      verseNumber: attr(lo, 'number') ?? '',
      syllabic: str(lo.syllabic),
      text: str(lo.text),
      extend: 'extend' in lo,
    };
  });

  const articulationTypes: string[] = [];
  for (const notations of asArray(o.notations)) {
    if (!isPlainObject(notations)) continue;
    for (const groupTag of ['articulations', 'technical']) {
      const group = notations[groupTag];
      if (!isPlainObject(group)) continue;
      for (const key of Object.keys(group)) {
        if (key.startsWith('@_')) continue;
        const count = asArray(group[key]).length;
        for (let i = 0; i < count; i++) articulationTypes.push(key);
      }
    }
  }

  return {
    isRest,
    isUnpitched,
    pitch,
    duration: durationRaw !== undefined ? toInt(durationRaw) : 0,
    type: str(o.type),
    dots: asArray(o.dot).length,
    voice: str(o.voice),
    staff: staffRaw !== undefined ? toInt(staffRaw) : 0,
    staffSpecified: staffRaw !== undefined,
    tieStart,
    tieStop,
    chord: 'chord' in o,
    grace: 'grace' in o,
    lyrics,
    articulationTypes,
  };
}

function parseAttributesEl(attrObj: unknown): NAttributesChange {
  const o = isPlainObject(attrObj) ? attrObj : {};
  const divisions = o.divisions !== undefined ? toInt(o.divisions) : null;

  let time: NTime | null = null;
  if (isPlainObject(o.time)) {
    const t = o.time;
    time = {
      beats: asArray(t.beats).map(str),
      beatType: asArray(t['beat-type']).map(str),
      symbol: attr(t, 'symbol') ?? '',
    };
  }

  let key: NKey | null = null;
  if (isPlainObject(o.key) && o.key.fifths !== undefined) {
    key = { fifths: toInt(o.key.fifths), mode: str(o.key.mode) };
  }

  const clefs: NClef[] = asArray(o.clef).map((c) => {
    const co = isPlainObject(c) ? c : {};
    return {
      sign: str(co.sign),
      line: co.line !== undefined ? toInt(co.line) : null,
      octaveChange: co['clef-octave-change'] !== undefined ? toInt(co['clef-octave-change']) : null,
      staffNumber: attr(co, 'number') !== undefined ? toInt(attr(co, 'number')) : 0,
    };
  });

  let transpose: NTranspose | null = null;
  if (isPlainObject(o.transpose)) {
    const tr = o.transpose;
    transpose = {
      diatonic: tr.diatonic !== undefined ? toInt(tr.diatonic) : null,
      chromatic: toInt(tr.chromatic),
      octaveChange: tr['octave-change'] !== undefined ? toInt(tr['octave-change']) : null,
      double: 'double' in tr,
    };
  }

  return { divisions, time, key, clefs, transpose };
}

function parseDirectionEl(dirObj: unknown): NDirection {
  const o = isPlainObject(dirObj) ? dirObj : {};
  const dynamics: string[] = [];
  let metronome: Record<string, unknown> | undefined;

  for (const dt of asArray(o['direction-type'])) {
    if (!isPlainObject(dt)) continue;
    for (const dynGroup of asArray(dt.dynamics)) {
      if (!isPlainObject(dynGroup)) continue;
      for (const key of Object.keys(dynGroup)) {
        if (key.startsWith('@_')) continue;
        if (key === 'other-dynamics') {
          dynamics.push(str(dynGroup[key]) || 'other-dynamics');
          continue;
        }
        const count = asArray(dynGroup[key]).length;
        for (let i = 0; i < count; i++) dynamics.push(key);
      }
    }
    if (isPlainObject(dt.metronome)) {
      metronome = dt.metronome;
    }
  }

  const soundWithTempo = asArray(o.sound).find((s) => attr(s, 'tempo') !== undefined);

  let tempo: NTempo | null = null;
  if (soundWithTempo || metronome) {
    const beatUnits = metronome ? asArray(metronome['beat-unit']).map(str) : [];
    const perMinuteRaw = metronome ? metronome['per-minute'] : undefined;
    const soundBpm = soundWithTempo ? toFloat(attr(soundWithTempo, 'tempo')) : NaN;
    const perMinuteBpm = perMinuteRaw !== undefined ? toFloat(perMinuteRaw) : NaN;
    const bpm = !Number.isNaN(soundBpm) ? soundBpm : perMinuteBpm;
    tempo = {
      bpm: Number.isNaN(bpm) ? 0 : bpm,
      bpmSpecified: !Number.isNaN(bpm),
      beatUnit: beatUnits[0] ?? '',
      beatUnitDots: metronome ? asArray(metronome['beat-unit-dot']).length : 0,
      metricModulation: beatUnits.length > 1,
      beatUnit2: beatUnits[1] ?? '',
    };
  }

  return { dynamics, tempo };
}

/** Builds one normalized measure from either a score-partwise <measure>
 * object directly, or a score-timewise <measure><part> content object —
 * both share the same note/attributes/direction child shape. number/
 * implicit/width come from the surrounding <measure> element in either
 * form (in score-timewise those attributes live on the outer <measure>,
 * shared across that row's parts, hence the override params). */
function buildMeasure(
  contentObj: unknown,
  index: number,
  overrideNumber: string,
  overrideImplicit: boolean,
  overrideWidth: number | null,
  overrideWidthSpecified: boolean,
): NMeasure {
  const o = isPlainObject(contentObj) ? contentObj : {};
  return {
    index,
    number: overrideNumber,
    implicit: overrideImplicit,
    width: overrideWidth,
    widthSpecified: overrideWidthSpecified,
    notes: asArray(o.note).map(parseNote),
    attributesChanges: asArray(o.attributes).map(parseAttributesEl),
    directions: asArray(o.direction).map(parseDirectionEl),
  };
}

function measureAttrs(measureObj: unknown): { number: string; implicit: boolean; width: number | null; widthSpecified: boolean } {
  const widthRaw = attr(measureObj, 'width');
  return {
    number: attr(measureObj, 'number') ?? '',
    implicit: attr(measureObj, 'implicit') === 'yes',
    width: widthRaw !== undefined ? toFloat(widthRaw) : null,
    widthSpecified: widthRaw !== undefined,
  };
}

/** Normalizes a MusicXML document (either root form) into one common
 * per-part/per-measure structure. Throws BoundsError/MusicXmlParseError —
 * callers catch and translate into their own output message's `error`
 * field; never throws anything else. */
export function normalizeScore(xml: string, field = 'xml'): NormalizedScore {
  const { form, root } = parseMusicXmlRoot(xml, field);

  const work = root.work;
  const workTitle = isPlainObject(work) ? str(work['work-title']) : '';
  const workNumber = isPlainObject(work) ? str(work['work-number']) : '';
  const movementTitle = str(root['movement-title']);
  const movementNumber = str(root['movement-number']);

  const identification = root.identification;
  const idObj = isPlainObject(identification) ? identification : {};
  const creators: NCreator[] = asArray(idObj.creator).map((c) => ({
    type: attr(c, 'type') ?? '',
    name: str(c),
  }));
  const rights = str(idObj.rights);
  const encoding = idObj.encoding;
  const encObj = isPlainObject(encoding) ? encoding : {};
  const encodingSoftware = asArray(encObj.software).map(str);
  const encodingDates = asArray(encObj['encoding-date']).map(str);
  const source = str(idObj.source);

  const partListObj = root['part-list'];
  const scoreParts = isPlainObject(partListObj) ? asArray(partListObj['score-part']) : [];
  const declaredPartIds: string[] = [];
  const declared = new Map<string, { name: string; abbreviation: string; instruments: NInstrument[] }>();
  for (const sp of scoreParts) {
    const id = attr(sp, 'id') ?? '';
    declaredPartIds.push(id);
    const spo = isPlainObject(sp) ? sp : {};
    const instruments: NInstrument[] = asArray(spo['score-instrument']).map((si) => {
      const sio = isPlainObject(si) ? si : {};
      return {
        id: attr(sio, 'id') ?? '',
        name: str(sio['instrument-name']),
        abbreviation: str(sio['instrument-abbreviation']),
        sound: str(sio['instrument-sound']),
      };
    });
    declared.set(id, { name: str(spo['part-name']), abbreviation: str(spo['part-abbreviation']), instruments });
  }

  const partsById = new Map<string, NPart>();
  const partOrder: string[] = [];

  function getOrCreatePart(id: string): NPart {
    let p = partsById.get(id);
    if (!p) {
      const info = declared.get(id);
      p = {
        id,
        name: info?.name ?? '',
        abbreviation: info?.abbreviation ?? '',
        instruments: info?.instruments ?? [],
        measures: [],
        undeclared: !declared.has(id),
      };
      partsById.set(id, p);
      partOrder.push(id);
    }
    return p;
  }

  if (form === 'score-partwise') {
    for (const partObj of asArray(root.part)) {
      const id = attr(partObj, 'id') ?? '';
      const part = getOrCreatePart(id);
      const measuresRaw = isPlainObject(partObj) ? asArray(partObj.measure) : [];
      part.measures = measuresRaw.map((mObj, idx) => {
        const ma = measureAttrs(mObj);
        return buildMeasure(mObj, idx, ma.number, ma.implicit, ma.width, ma.widthSpecified);
      });
    }
  } else {
    for (const measureObj of asArray(root.measure)) {
      const ma = measureAttrs(measureObj);
      const partContents = isPlainObject(measureObj) ? asArray(measureObj.part) : [];
      for (const partContentObj of partContents) {
        const id = attr(partContentObj, 'id') ?? '';
        const part = getOrCreatePart(id);
        part.measures.push(buildMeasure(partContentObj, part.measures.length, ma.number, ma.implicit, ma.width, ma.widthSpecified));
      }
    }
  }

  // Include declared parts that had zero content measures (still a real
  // part, just empty) — getOrCreatePart was never called for those.
  for (const id of declaredPartIds) {
    if (!partsById.has(id)) {
      const info = declared.get(id)!;
      partsById.set(id, { id, name: info.name, abbreviation: info.abbreviation, instruments: info.instruments, measures: [], undeclared: false });
    }
  }
  // Order parts by part-list order first (the conventional MusicXML
  // authoring order), then append any undeclared parts found only in
  // content, in first-seen order.
  const finalOrder = [...declaredPartIds, ...partOrder.filter((id) => !declaredPartIds.includes(id))];
  const parts = finalOrder.map((id) => partsById.get(id)!).filter((p, i, arr) => arr.findIndex((q) => q.id === p.id) === i);

  return {
    form,
    version: attr(root, 'version') ?? '',
    workTitle,
    workNumber,
    movementTitle,
    movementNumber,
    creators,
    rights,
    encodingSoftware,
    encodingDates,
    source,
    declaredPartIds,
    parts,
  };
}

// ---------------------------------------------------------------------------
// Derived musical helpers
// ---------------------------------------------------------------------------

const MAJOR_KEY_NAMES: Record<number, string> = {
  '-7': 'Cb', '-6': 'Gb', '-5': 'Db', '-4': 'Ab', '-3': 'Eb', '-2': 'Bb', '-1': 'F',
  '0': 'C', '1': 'G', '2': 'D', '3': 'A', '4': 'E', '5': 'B', '6': 'F#', '7': 'C#',
} as unknown as Record<number, string>;

const MINOR_KEY_NAMES: Record<number, string> = {
  '-7': 'Ab', '-6': 'Eb', '-5': 'Bb', '-4': 'F', '-3': 'C', '-2': 'G', '-1': 'D',
  '0': 'A', '1': 'E', '2': 'B', '3': 'F#', '4': 'C#', '5': 'G#', '6': 'D#', '7': 'A#',
} as unknown as Record<number, string>;

/** Derives a tonic + mode name from a MusicXML key signature (<fifths>,
 * <mode>) via the standard circle-of-fifths convention. Empty mode is
 * treated as "major" (the MusicXML default when <mode> is absent). Returns
 * '' for fifths outside the standard -7..7 range, or for a mode other than
 * major/minor (e.g. a church mode like "dorian"), since those don't derive
 * a tonic from fifths via the same relative-major/minor convention. */
export function deriveKeyName(fifths: number, mode: string): string {
  const normalizedMode = mode === '' ? 'major' : mode.toLowerCase();
  if (normalizedMode !== 'major' && normalizedMode !== 'minor') return '';
  const table = normalizedMode === 'minor' ? MINOR_KEY_NAMES : MAJOR_KEY_NAMES;
  const tonic = table[fifths];
  if (tonic === undefined) return '';
  return `${tonic} ${normalizedMode}`;
}

/** Resolves a MusicXmlPartQuery's part_id against a normalized score.
 * Empty part_id selects every part (returned in the score's part order).
 * A non-empty part_id that doesn't match any part returns an empty array
 * — callers treat that as "no such part" without a separate not-found
 * flag, since every per-part result message already reports 0 rows. */
export function selectParts(score: NormalizedScore, partId: string): NPart[] {
  if (partId === '') return score.parts;
  return score.parts.filter((p) => p.id === partId);
}

/** Slices a part's measures to an inclusive [start, end] 0-based index
 * range. end <= 0 means unbounded (through the last measure); start < 0
 * is clamped to 0. */
export function measureRange(measures: NMeasure[], start: number, end: number): NMeasure[] {
  const lo = Math.max(0, start);
  const hi = end > 0 ? end : measures.length - 1;
  return measures.filter((m) => m.index >= lo && m.index <= hi);
}

/** A measure's notated length, in the part's current <divisions> units,
 * computed by grouping the measure's notes by <voice> (a chord note is
 * excluded, since <chord/> means it sounds together with the PRECEDING
 * note rather than advancing the voice's cursor), summing each voice's
 * remaining note durations, and taking the maximum across voices — the
 * measure's actual length is set by its longest notated voice.
 *
 * This intentionally does NOT interpret <backup>/<forward> elements: since
 * fast-xml-parser groups same-tag siblings together, the interleaved
 * document order between <note>/<backup>/<forward> is not preserved, so a
 * true playback-cursor walk isn't available from this parse. Grouping by
 * voice is a documented approximation with one known gap: a voice that
 * pads time using a bare <forward> with no note in ANY voice reaching that
 * same length would be under-counted. Real-world MusicXML almost always
 * has at least one voice whose notes/rests span the full measure, so this
 * matches the true measure length in the overwhelming common case. */
export function measureDurationByVoice(measure: NMeasure): number {
  const perVoice = new Map<string, number>();
  for (const note of measure.notes) {
    if (note.chord) continue;
    const key = note.voice || '';
    perVoice.set(key, (perVoice.get(key) ?? 0) + note.duration);
  }
  let max = 0;
  for (const total of perVoice.values()) {
    if (total > max) max = total;
  }
  return max;
}
