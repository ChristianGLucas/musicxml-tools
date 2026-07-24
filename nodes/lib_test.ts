// Direct unit tests for lib.ts's exported bounds/parsing/musical helpers —
// tested here at small scale (custom max values) rather than only through
// a multi-MB fixture at the real MAX_XML_DEPTH ceiling, which would be
// slow and add nothing checkDepth's own logic doesn't already prove at a
// tiny scale.
import {
  checkDepth,
  BoundsError,
  MusicXmlParseError,
  parseMusicXmlRoot,
  normalizeScore,
  deriveKeyName,
  measureDurationByVoice,
  selectParts,
  measureRange,
  NormalizedScore,
  NMeasure,
} from './lib';
import { FIXTURE_XXE_XML, FIXTURE_BILLION_LAUGHS_XML, FIXTURE_PARTWISE_XML } from './testkit';

describe('checkDepth', () => {
  it('passes shallow XML', () => {
    expect(() => checkDepth('<a><b><c/></b></a>', 3)).not.toThrow();
  });

  it('throws BoundsError for XML nested deeper than the limit', () => {
    const deep = '<a>'.repeat(10) + 'x' + '</a>'.repeat(10);
    expect(() => checkDepth(deep, 5)).toThrow(BoundsError);
  });

  it('does not count self-closing tags as adding depth', () => {
    expect(() => checkDepth('<a><b/><b/><b/></a>', 2)).not.toThrow();
  });
});

describe('parseMusicXmlRoot — XML safety', () => {
  // SECURITY ORACLE, at the lib level (below any node's try/catch): a
  // DOCTYPE declaring a SYSTEM external entity must never be resolved.
  // fast-xml-parser@4.5.7 throws "External entities are not supported"
  // when it encounters one (verified directly against the installed
  // dependency before writing this test) — parseMusicXmlRoot must turn
  // that into a MusicXmlParseError, never let it escape as some other
  // exception type, and never return a root object containing resolved
  // file content.
  it('throws MusicXmlParseError (never resolves the entity) for an XXE payload', () => {
    expect(() => parseMusicXmlRoot(FIXTURE_XXE_XML)).toThrow(MusicXmlParseError);
  });

  it('parses a billion-laughs DOCTYPE without expanding the entity (proves no exponential blowup)', () => {
    const { root } = parseMusicXmlRoot(FIXTURE_BILLION_LAUGHS_XML);
    const work = root.work as Record<string, unknown>;
    expect(work['work-title']).toBe('&lol2;');
  });

  it('throws MusicXmlParseError for a root that is neither score-partwise nor score-timewise', () => {
    expect(() => parseMusicXmlRoot('<catalog><book/></catalog>')).toThrow(MusicXmlParseError);
  });

  it('parses a small valid document fine', () => {
    expect(() => parseMusicXmlRoot('<score-partwise version="4.0"/>', 'xml')).not.toThrow();
  });

  it('parses a large document with no crash', () => {
    // This package no longer caps raw document size itself — the
    // platform's ingress/transport already bounds request size.
    const big = `<score-partwise version="4.0"><!--${'x'.repeat(500_000)}--></score-partwise>`;
    expect(() => parseMusicXmlRoot(big, 'xml')).not.toThrow();
  });
});

describe('deriveKeyName', () => {
  // INDEPENDENT ORACLE: every value below is standard circle-of-fifths
  // music theory, independent of this package's own key-signature
  // extraction code.
  it.each([
    [0, '', 'C major'],
    [2, '', 'D major'],
    [-3, '', 'Eb major'],
    [7, '', 'C# major'],
    [-7, '', 'Cb major'],
    [0, 'minor', 'A minor'],
    [-3, 'minor', 'C minor'],
    [3, 'minor', 'F# minor'],
  ])('fifths=%p mode=%p -> %p', (fifths, mode, expected) => {
    expect(deriveKeyName(fifths as number, mode as string)).toBe(expected);
  });

  it('returns empty for fifths outside the standard -7..7 range', () => {
    expect(deriveKeyName(8, '')).toBe('');
    expect(deriveKeyName(-8, '')).toBe('');
  });

  it('returns empty for a church mode (no relative-major/minor tonic convention)', () => {
    expect(deriveKeyName(0, 'dorian')).toBe('');
  });
});

function note(voice: string, duration: number, chord = false): NMeasure['notes'][number] {
  return {
    isRest: false,
    isUnpitched: false,
    pitch: null,
    duration,
    type: '',
    dots: 0,
    voice,
    staff: 0,
    staffSpecified: false,
    tieStart: false,
    tieStop: false,
    chord,
    grace: false,
    lyrics: [],
    articulationTypes: [],
  };
}

describe('measureDurationByVoice', () => {
  it('takes the max across voices, excluding chord notes from the sum', () => {
    const measure: NMeasure = {
      index: 0,
      number: '1',
      implicit: false,
      width: null,
      widthSpecified: false,
      notes: [note('1', 4), note('1', 4, true), note('2', 2), note('2', 2)],
      attributesChanges: [],
      directions: [],
      usesBackupForward: false,
    };
    // voice 1: 4 (chord note excluded) = 4; voice 2: 2 + 2 = 4; max = 4.
    expect(measureDurationByVoice(measure)).toBe(4);
  });

  it('returns 0 for a measure with no notes', () => {
    const measure: NMeasure = { index: 0, number: '1', implicit: false, width: null, widthSpecified: false, notes: [], attributesChanges: [], directions: [], usesBackupForward: false };
    expect(measureDurationByVoice(measure)).toBe(0);
  });
});

describe('normalizeScore — usesBackupForward detection', () => {
  it('is false for FIXTURE_PARTWISE_XML, which uses no <backup>/<forward>', () => {
    const score = normalizeScore(FIXTURE_PARTWISE_XML);
    for (const part of score.parts) {
      for (const m of part.measures) {
        expect(m.usesBackupForward).toBe(false);
      }
    }
  });

  it('is true for a measure containing <backup>, and false for a sibling measure without one', () => {
    const xml = `<score-partwise version="4.0">
      <part-list><score-part id="P1"><part-name>X</part-name></score-part></part-list>
      <part id="P1">
        <measure number="1">
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>quarter</type></note>
          <backup><duration>4</duration></backup>
        </measure>
        <measure number="2">
          <note><pitch><step>D</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>quarter</type></note>
        </measure>
      </part>
    </score-partwise>`;
    const score = normalizeScore(xml);
    const measures = score.parts[0].measures;
    expect(measures[0].usesBackupForward).toBe(true);
    expect(measures[1].usesBackupForward).toBe(false);
  });

  it('is true for a measure containing <forward>', () => {
    const xml = `<score-partwise version="4.0">
      <part-list><score-part id="P1"><part-name>X</part-name></score-part></part-list>
      <part id="P1">
        <measure number="1">
          <forward><duration>4</duration></forward>
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>quarter</type></note>
        </measure>
      </part>
    </score-partwise>`;
    const score = normalizeScore(xml);
    expect(score.parts[0].measures[0].usesBackupForward).toBe(true);
  });
});

describe('selectParts / measureRange', () => {
  const score: NormalizedScore = {
    form: 'score-partwise',
    version: '4.0',
    workTitle: '',
    workNumber: '',
    movementTitle: '',
    movementNumber: '',
    creators: [],
    rights: '',
    encodingSoftware: [],
    encodingDates: [],
    source: '',
    declaredPartIds: ['A', 'B'],
    parts: [
      { id: 'A', name: '', abbreviation: '', instruments: [], measures: [], undeclared: false },
      { id: 'B', name: '', abbreviation: '', instruments: [], measures: [], undeclared: false },
    ],
  };

  it('empty part_id selects every part', () => {
    expect(selectParts(score, '').map((p) => p.id)).toEqual(['A', 'B']);
  });

  it('a specific part_id selects just that part', () => {
    expect(selectParts(score, 'B').map((p) => p.id)).toEqual(['B']);
  });

  it('an unknown part_id selects nothing', () => {
    expect(selectParts(score, 'ZZZ')).toEqual([]);
  });

  it('measureRange with end<=0 is unbounded from start', () => {
    const measures: NMeasure[] = [0, 1, 2, 3].map((i) => ({ index: i, number: String(i), implicit: false, width: null, widthSpecified: false, notes: [], attributesChanges: [], directions: [], usesBackupForward: false }));
    expect(measureRange(measures, 2, 0).map((m) => m.index)).toEqual([2, 3]);
    expect(measureRange(measures, -5, 0).map((m) => m.index)).toEqual([0, 1, 2, 3]);
    expect(measureRange(measures, 1, 2).map((m) => m.index)).toEqual([1, 2]);
  });
});
