import { MusicXmlPartQuery, NoteInfo } from '../gen/messages_pb';
import { extractNotes } from './extract_notes';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_NOTES_P1 } from './testkit';

function query(partId: string, start = 0, end = 0): MusicXmlPartQuery {
  const q = new MusicXmlPartQuery();
  q.setXml(FIXTURE_PARTWISE_XML);
  q.setPartId(partId);
  q.setStartMeasureIndex(start);
  q.setEndMeasureIndex(end);
  return q;
}

function toPlain(n: NoteInfo) {
  const pitch = n.getPitch();
  return {
    partId: n.getPartId(),
    measureIndex: n.getMeasureIndex(),
    measureNumber: n.getMeasureNumber(),
    isRest: n.getIsRest(),
    isUnpitched: n.getIsUnpitched(),
    pitch: pitch ? { step: pitch.getStep(), alter: pitch.getAlter(), alterSpecified: pitch.getAlterSpecified(), octave: pitch.getOctave() } : undefined,
    duration: n.getDuration(),
    type: n.getType(),
    dots: n.getDots(),
    voice: n.getVoice(),
    staff: n.getStaff(),
    staffSpecified: n.getStaffSpecified(),
    tieStart: n.getTieStart(),
    tieStop: n.getTieStop(),
    chord: n.getChord(),
    grace: n.getGrace(),
  };
}

describe('ExtractNotes', () => {
  // INDEPENDENT ORACLE: ORACLE_NOTES_P1 was transcribed by hand, note by
  // note, from part P1's <note> elements in FIXTURE_PARTWISE_XML —
  // including the tie split across measures 1/2, the chord flag on the
  // stacked G4, the dotted E4, the eighth rest, and the durationless
  // grace note.
  it('extracts every note of P1 with pitch/duration/type/voice/tie/chord/grace, in document order', () => {
    const result = extractNotes(ctx, query('P1'));
    expect(result.getError()).toBe('');
    expect(result.getTotalNotes()).toBe(7);
    expect(result.getTruncated()).toBe(false);
    expect(result.getNotesList().map(toPlain)).toEqual(ORACLE_NOTES_P1);
  });

  it('empty part_id returns notes from every part, each tagged with its own part_id', () => {
    const result = extractNotes(ctx, query(''));
    expect(result.getTotalNotes()).toBe(9); // 7 (P1) + 2 (P2: 1 rest + 1 note)
    const partIds = new Set(result.getNotesList().map((n) => n.getPartId()));
    expect(partIds).toEqual(new Set(['P1', 'P2']));
  });

  it('a rest note has is_rest=true and no pitch set', () => {
    const result = extractNotes(ctx, query('P1', 0, 0));
    const rest = result.getNotesList()[2];
    expect(rest.getIsRest()).toBe(true);
    expect(rest.hasPitch()).toBe(false);
  });

  it('is deterministic across repeated invocations', () => {
    const a = extractNotes(ctx, query('P1'));
    const b = extractNotes(ctx, query('P1'));
    expect(a.toObject()).toEqual(b.toObject());
  });
});
