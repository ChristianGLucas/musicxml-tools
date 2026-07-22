// Shared test context and fixture MusicXML documents for musicxml-tools
// node unit tests. Not a node and not a test file (no describe/it), so it
// is neither registered as a node nor collected by jest.
import {
  AxiomContext,
  AxiomLogger,
  AxiomSecrets,
  AxiomReflection,
  AxiomMutation,
} from '../gen/axiomContext';

const reflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const mutation: AxiomMutation = {
  flow: {
    addNode: (_p: string, _v: string) => 0,
    addEdge: (_s: number, _d: number) => {},
  },
};

export const ctx: AxiomContext = {
  log: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } satisfies AxiomLogger,
  secrets: { get: (_n: string): [string, boolean] => ['', false] } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection,
  mutation,
};

/**
 * FIXTURE — a 2-part score-partwise document (Piano P1, Clarinet in Bb
 * P2) hand-authored to exercise every node's extraction surface in one
 * pass: work/creator metadata, a transposing instrument with a declared
 * score-instrument, two measures with a time/key/clef change, a dotted
 * note, a chord, a tie split across measures, a grace note, a rest,
 * dynamics, articulations, a metronome + sound tempo, and two-syllable
 * lyrics with an <extend/>. Every value asserted against below is
 * transcribed BY HAND from this XML text into the `*_ORACLE` constants —
 * the oracle is not derived by running this package's own nodes, so it
 * catches a wrong extraction, not just a crash.
 */
export const FIXTURE_PARTWISE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>Test Suite No. 1</work-title>
  </work>
  <identification>
    <creator type="composer">J. Test</creator>
    <creator type="arranger">A. Rranger</creator>
    <rights>Public Domain</rights>
    <encoding>
      <software>MuseScore 4</software>
      <encoding-date>2024-01-15</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
      <part-abbreviation>Pno.</part-abbreviation>
    </score-part>
    <score-part id="P2">
      <part-name>Clarinet in Bb</part-name>
      <part-abbreviation>Cl.</part-abbreviation>
      <score-instrument id="P2-I1">
        <instrument-name>Clarinet in Bb</instrument-name>
        <instrument-sound>wind.reed.clarinet.bflat</instrument-sound>
      </score-instrument>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1" width="120.5">
      <attributes>
        <divisions>4</divisions>
        <key><fifths>2</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <direction>
        <direction-type>
          <dynamics><mf/></dynamics>
        </direction-type>
      </direction>
      <direction>
        <direction-type>
          <metronome>
            <beat-unit>quarter</beat-unit>
            <per-minute>120</per-minute>
          </metronome>
        </direction-type>
        <sound tempo="120"/>
      </direction>
      <note>
        <pitch><step>C</step><alter>1</alter><octave>4</octave></pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>quarter</type>
        <staff>1</staff>
        <tie type="start"/>
        <lyric number="1">
          <syllabic>begin</syllabic>
          <text>Hel</text>
        </lyric>
        <notations>
          <articulations>
            <staccato/>
            <accent/>
          </articulations>
        </notations>
      </note>
      <note>
        <pitch><step>D</step><octave>4</octave></pitch>
        <duration>2</duration>
        <voice>1</voice>
        <type>eighth</type>
        <staff>1</staff>
        <lyric number="1">
          <syllabic>end</syllabic>
          <text>lo</text>
          <extend/>
        </lyric>
      </note>
      <note>
        <rest/>
        <duration>2</duration>
        <voice>1</voice>
        <type>eighth</type>
        <staff>1</staff>
      </note>
      <note>
        <pitch><step>E</step><octave>4</octave></pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>quarter</type>
        <dot/>
        <staff>1</staff>
      </note>
      <note>
        <chord/>
        <pitch><step>G</step><octave>4</octave></pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>quarter</type>
        <staff>1</staff>
      </note>
    </measure>
    <measure number="2">
      <attributes>
        <clef><sign>F</sign><line>4</line></clef>
      </attributes>
      <note>
        <pitch><step>C</step><alter>1</alter><octave>4</octave></pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>quarter</type>
        <staff>1</staff>
        <tie type="stop"/>
      </note>
      <note>
        <grace/>
        <pitch><step>B</step><octave>3</octave></pitch>
        <voice>1</voice>
        <type>16th</type>
        <staff>1</staff>
      </note>
    </measure>
  </part>
  <part id="P2">
    <measure number="1">
      <attributes>
        <divisions>4</divisions>
        <transpose>
          <diatonic>-1</diatonic>
          <chromatic>-2</chromatic>
        </transpose>
      </attributes>
      <note>
        <rest/>
        <duration>16</duration>
        <voice>1</voice>
        <type>whole</type>
      </note>
    </measure>
    <measure number="2">
      <note>
        <pitch><step>E</step><octave>5</octave></pitch>
        <duration>16</duration>
        <voice>1</voice>
        <type>whole</type>
      </note>
    </measure>
  </part>
</score-partwise>
`;

/**
 * FIXTURE — the SAME logical content as FIXTURE_PARTWISE_XML's part P1
 * (2 measures), rewritten in score-timewise form (measure-then-part) to
 * prove the timewise normalization path produces an equivalent structure.
 * Oracle values below are transcribed independently from THIS text.
 */
export const FIXTURE_TIMEWISE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-timewise version="4.0">
  <work>
    <work-title>Timewise Test</work-title>
  </work>
  <part-list>
    <score-part id="P1">
      <part-name>Solo</part-name>
    </score-part>
  </part-list>
  <measure number="1" width="80">
    <part id="P1">
      <attributes>
        <divisions>2</divisions>
        <key><fifths>-1</fifths><mode>minor</mode></key>
        <time><beats>3</beats><beat-type>4</beat-type></time>
      </attributes>
      <note>
        <pitch><step>A</step><octave>3</octave></pitch>
        <duration>2</duration>
        <voice>1</voice>
        <type>quarter</type>
      </note>
      <note>
        <rest/>
        <duration>4</duration>
        <voice>1</voice>
        <type>half</type>
      </note>
    </part>
  </measure>
  <measure number="2">
    <part id="P1">
      <note>
        <pitch><step>A</step><octave>3</octave></pitch>
        <duration>6</duration>
        <voice>1</voice>
        <type>dotted-half</type>
      </note>
    </part>
  </measure>
</score-timewise>
`;

/** FIXTURE — three declared parts (P1 real content, P2 declared but no
 * content at all, P3 declared as a literal empty <part/>) plus one
 * undeclared content part (P4) — for ValidateStructure's warning/error
 * paths. */
export const FIXTURE_STRUCTURAL_ISSUES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <score-part id="P1"><part-name>A</part-name></score-part>
    <score-part id="P2"><part-name>B</part-name></score-part>
    <score-part id="P3"><part-name>C</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <note><rest/><duration>4</duration><voice>1</voice><type>quarter</type></note>
    </measure>
  </part>
  <part id="P3"></part>
  <part id="P4">
    <measure number="1">
      <note><rest/><duration>4</duration><voice>1</voice><type>quarter</type></note>
    </measure>
  </part>
</score-partwise>
`;

/** Not MusicXML at all — a well-formed but unrelated XML document. */
export const FIXTURE_NON_MUSICXML_XML = `<?xml version="1.0"?><catalog><book id="1">Not a score</book></catalog>`;

/** Structurally malformed XML (unclosed tag) — for the error-path test. */
export const FIXTURE_MALFORMED_XML = `<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"</score-part></part-list></score-partwise>`;

/** A DOCTYPE declaring a SYSTEM external entity, in the exact shape a
 * real XXE attack against a naive XML-based node would take (attempting
 * to read a local file into the parsed output). fast-xml-parser has no
 * external-entity support at all and throws rather than resolve it — see
 * lib.ts's header comment for the verified behavior this fixture proves
 * end-to-end through a real node. */
export const FIXTURE_XXE_XML = `<?xml version="1.0"?>
<!DOCTYPE score-partwise [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<score-partwise version="4.0">
  <work><work-title>&xxe;</work-title></work>
</score-partwise>`;

/** A DOCTYPE with an internal general entity in the "billion laughs"
 * pattern — proves the entity is never substituted (passes through as
 * literal, unexpanded text) rather than causing exponential expansion. */
export const FIXTURE_BILLION_LAUGHS_XML = `<?xml version="1.0"?>
<!DOCTYPE score-partwise [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
]>
<score-partwise version="4.0">
  <work><work-title>&lol2;</work-title></work>
</score-partwise>`;

// ---------------------------------------------------------------------------
// Oracles for FIXTURE_PARTWISE_XML — hand-transcribed from the XML above,
// never derived by running this package's own nodes.
// ---------------------------------------------------------------------------

export const ORACLE_DETECT = { isMusicXml: true, form: 'score-partwise', version: '4.0' };

export const ORACLE_METADATA = {
  workTitle: 'Test Suite No. 1',
  workNumber: '',
  movementTitle: '',
  movementNumber: '',
  creators: [
    { type: 'composer', name: 'J. Test' },
    { type: 'arranger', name: 'A. Rranger' },
  ],
  rights: 'Public Domain',
  encodingSoftware: ['MuseScore 4'],
  encodingDates: ['2024-01-15'],
  source: '',
};

export const ORACLE_PARSED_SCORE = {
  form: 'score-partwise',
  title: 'Test Suite No. 1',
  composer: 'J. Test',
  parts: [
    { id: 'P1', name: 'Piano', measureCount: 2 },
    { id: 'P2', name: 'Clarinet in Bb', measureCount: 2 },
  ],
};

export const ORACLE_LIST_PARTS = {
  partCount: 2,
  parts: [
    { id: 'P1', name: 'Piano', abbreviation: 'Pno.', instrumentCount: 0 },
    { id: 'P2', name: 'Clarinet in Bb', abbreviation: 'Cl.', instrumentCount: 1 },
  ],
};

export const ORACLE_INSTRUMENTS = {
  partCount: 2,
  instrumentCount: 1,
  instruments: [{ partId: 'P2', instrumentId: 'P2-I1', name: 'Clarinet in Bb', abbreviation: '', sound: 'wind.reed.clarinet.bflat' }],
};

export const ORACLE_MEASURES_P1 = [
  { partId: 'P1', index: 0, number: '1', implicit: false, width: 120.5, widthSpecified: true, noteCount: 4, restCount: 1, hasAttributes: true },
  { partId: 'P1', index: 1, number: '2', implicit: false, width: 0, widthSpecified: false, noteCount: 2, restCount: 0, hasAttributes: true },
];

export const ORACLE_SUMMARY = [
  { partId: 'P1', partName: 'Piano', measureCount: 2, noteCount: 6, restCount: 1 },
  { partId: 'P2', partName: 'Clarinet in Bb', measureCount: 2, noteCount: 1, restCount: 1 },
];

export const ORACLE_TIME_SIGNATURES_P1 = [{ partId: 'P1', measureIndex: 0, measureNumber: '1', beats: ['4'], beatType: ['4'], symbol: '' }];

export const ORACLE_KEY_SIGNATURES_P1 = [{ partId: 'P1', measureIndex: 0, measureNumber: '1', fifths: 2, mode: '', keyName: 'D major' }];

export const ORACLE_CLEFS_P1 = [
  { partId: 'P1', measureIndex: 0, measureNumber: '1', sign: 'G', line: 2, lineSpecified: true, octaveChange: 0, octaveChangeSpecified: false, staffNumber: 0 },
  { partId: 'P1', measureIndex: 1, measureNumber: '2', sign: 'F', line: 4, lineSpecified: true, octaveChange: 0, octaveChangeSpecified: false, staffNumber: 0 },
];

export const ORACLE_TEMPO_P1 = [
  { partId: 'P1', measureIndex: 0, measureNumber: '1', bpm: 120, bpmSpecified: true, beatUnit: 'quarter', beatUnitDots: 0, metricModulation: false, beatUnit2: '' },
];

export const ORACLE_LYRICS_P1 = [
  { partId: 'P1', measureIndex: 0, measureNumber: '1', noteIndexInMeasure: 0, verseNumber: '1', syllabic: 'begin', text: 'Hel', extend: false },
  { partId: 'P1', measureIndex: 0, measureNumber: '1', noteIndexInMeasure: 1, verseNumber: '1', syllabic: 'end', text: 'lo', extend: true },
];

export const ORACLE_DYNAMICS_P1 = [{ partId: 'P1', measureIndex: 0, measureNumber: '1', dynamicType: 'mf' }];

export const ORACLE_ARTICULATIONS_P1 = [
  { partId: 'P1', measureIndex: 0, measureNumber: '1', noteIndexInMeasure: 0, articulationType: 'staccato' },
  { partId: 'P1', measureIndex: 0, measureNumber: '1', noteIndexInMeasure: 0, articulationType: 'accent' },
];

export const ORACLE_TRANSPOSITION_P2 = [
  { partId: 'P2', measureIndex: 0, measureNumber: '1', diatonic: -1, diatonicSpecified: true, chromatic: -2, octaveChange: 0, octaveChangeSpecified: false, doubleTransposition: false },
];

export const ORACLE_NOTES_P1 = [
  { partId: 'P1', measureIndex: 0, measureNumber: '1', isRest: false, isUnpitched: false, pitch: { step: 'C', alter: 1, alterSpecified: true, octave: 4 }, duration: 4, type: 'quarter', dots: 0, voice: '1', staff: 1, staffSpecified: true, tieStart: true, tieStop: false, chord: false, grace: false },
  { partId: 'P1', measureIndex: 0, measureNumber: '1', isRest: false, isUnpitched: false, pitch: { step: 'D', alter: 0, alterSpecified: false, octave: 4 }, duration: 2, type: 'eighth', dots: 0, voice: '1', staff: 1, staffSpecified: true, tieStart: false, tieStop: false, chord: false, grace: false },
  { partId: 'P1', measureIndex: 0, measureNumber: '1', isRest: true, isUnpitched: false, pitch: undefined, duration: 2, type: 'eighth', dots: 0, voice: '1', staff: 1, staffSpecified: true, tieStart: false, tieStop: false, chord: false, grace: false },
  { partId: 'P1', measureIndex: 0, measureNumber: '1', isRest: false, isUnpitched: false, pitch: { step: 'E', alter: 0, alterSpecified: false, octave: 4 }, duration: 4, type: 'quarter', dots: 1, voice: '1', staff: 1, staffSpecified: true, tieStart: false, tieStop: false, chord: false, grace: false },
  { partId: 'P1', measureIndex: 0, measureNumber: '1', isRest: false, isUnpitched: false, pitch: { step: 'G', alter: 0, alterSpecified: false, octave: 4 }, duration: 4, type: 'quarter', dots: 0, voice: '1', staff: 1, staffSpecified: true, tieStart: false, tieStop: false, chord: true, grace: false },
  { partId: 'P1', measureIndex: 1, measureNumber: '2', isRest: false, isUnpitched: false, pitch: { step: 'C', alter: 1, alterSpecified: true, octave: 4 }, duration: 4, type: 'quarter', dots: 0, voice: '1', staff: 1, staffSpecified: true, tieStart: false, tieStop: true, chord: false, grace: false },
  { partId: 'P1', measureIndex: 1, measureNumber: '2', isRest: false, isUnpitched: false, pitch: { step: 'B', alter: 0, alterSpecified: false, octave: 3 }, duration: 0, type: '16th', dots: 0, voice: '1', staff: 1, staffSpecified: true, tieStart: false, tieStop: false, chord: false, grace: true },
];

export const ORACLE_DURATION_P1 = { partId: 'P1', totalDurationDivisions: 16, lastDivisionsPerQuarter: 4, divisionsKnown: true, totalQuarterNotes: 4, totalQuarterNotesReliable: true, divisionsChangedMidPart: false, usesBackupForward: false };
export const ORACLE_DURATION_P2 = { partId: 'P2', totalDurationDivisions: 32, lastDivisionsPerQuarter: 4, divisionsKnown: true, totalQuarterNotes: 8, totalQuarterNotesReliable: true, divisionsChangedMidPart: false, usesBackupForward: false };
