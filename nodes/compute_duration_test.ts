import { MusicXmlInput, PartDuration } from '../gen/messages_pb';
import { computeDuration } from './compute_duration';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_DURATION_P1, ORACLE_DURATION_P2 } from './testkit';

function toPlain(p: PartDuration) {
  return {
    partId: p.getPartId(),
    totalDurationDivisions: p.getTotalDurationDivisions(),
    lastDivisionsPerQuarter: p.getLastDivisionsPerQuarter(),
    divisionsKnown: p.getDivisionsKnown(),
    totalQuarterNotes: p.getTotalQuarterNotes(),
    totalQuarterNotesReliable: p.getTotalQuarterNotesReliable(),
    divisionsChangedMidPart: p.getDivisionsChangedMidPart(),
    usesBackupForward: p.getUsesBackupForward(),
  };
}

describe('ComputeDuration', () => {
  // INDEPENDENT ORACLE: ORACLE_DURATION_P1/P2 were computed BY HAND from
  // FIXTURE_PARTWISE_XML using the documented algorithm (group by voice,
  // exclude chord notes, sum per measure, take cross-voice max, sum
  // measures): P1 measure 1 = 4(C#)+2(D)+2(rest)+4(E-dot) = 12 (G4 chord
  // excluded), measure 2 = 4(tie-stop C#)+0(grace) = 4, total 16 at
  // divisions=4 -> 4.0 quarter notes. P2 measure 1 = 16 (whole rest),
  // measure 2 = 16 (whole note), total 32 at divisions=4 -> 8.0 quarter
  // notes.
  it('computes P1 and P2 total duration matching the hand-derived voice-sum-max calculation', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    const result = computeDuration(ctx, input);
    expect(result.getError()).toBe('');
    const byId = new Map(result.getPartsList().map((p) => [p.getPartId(), toPlain(p)]));
    expect(byId.get('P1')).toEqual(ORACLE_DURATION_P1);
    expect(byId.get('P2')).toEqual(ORACLE_DURATION_P2);
  });

  it('flags divisions_changed_mid_part and marks total_quarter_notes unreliable when divisions change', () => {
    const xml = `<score-partwise version="4.0">
      <part-list><score-part id="P1"><part-name>X</part-name></score-part></part-list>
      <part id="P1">
        <measure number="1">
          <attributes><divisions>2</divisions></attributes>
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
        </measure>
        <measure number="2">
          <attributes><divisions>4</divisions></attributes>
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>quarter</type></note>
        </measure>
      </part>
    </score-partwise>`;
    const input = new MusicXmlInput();
    input.setXml(xml);
    const result = computeDuration(ctx, input);
    const p1 = result.getPartsList()[0];
    expect(p1.getDivisionsChangedMidPart()).toBe(true);
    expect(p1.getTotalQuarterNotesReliable()).toBe(false);
    expect(p1.getTotalDurationDivisions()).toBe(6); // 2 + 4, in mixed-meaning divisions units
    expect(p1.getLastDivisionsPerQuarter()).toBe(4);
  });

  // REGRESSION TEST — this is the exact case an independent adversarial
  // review found undercounted while total_quarter_notes_reliable was
  // still (wrongly) true: voice 1 has one quarter note (duration 4);
  // voice 2 uses <backup>/<forward> to pad the same measure to a full
  // whole note (16 divisions) with no note of its own. The true measure
  // length is 16, but this package's voice-sum-max approximation (which
  // does not interpret <backup>/<forward>) only sees voice 1's 4 —
  // uses_backup_forward must flag that gap and force reliable=false
  // rather than silently reporting 4 as trustworthy.
  it('sets uses_backup_forward=true and forces total_quarter_notes_reliable=false when a measure uses <backup>/<forward>', () => {
    const xml = `<score-partwise version="4.0">
      <part-list><score-part id="P1"><part-name>X</part-name></score-part></part-list>
      <part id="P1">
        <measure number="1">
          <attributes><divisions>4</divisions></attributes>
          <note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration><voice>1</voice><type>quarter</type></note>
          <backup><duration>4</duration></backup>
          <forward><duration>16</duration></forward>
        </measure>
      </part>
    </score-partwise>`;
    const input = new MusicXmlInput();
    input.setXml(xml);
    const result = computeDuration(ctx, input);
    const p1 = result.getPartsList()[0];
    expect(p1.getUsesBackupForward()).toBe(true);
    expect(p1.getTotalQuarterNotesReliable()).toBe(false);
    expect(p1.getTotalQuarterNotes()).toBe(0);
    // The known-approximate value is still reported (not hidden), just no
    // longer claimed reliable — a caller who checks uses_backup_forward
    // knows to distrust it.
    expect(p1.getTotalDurationDivisions()).toBe(4);
  });
});
