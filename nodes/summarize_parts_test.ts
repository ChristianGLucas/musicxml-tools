import { MusicXmlInput } from '../gen/messages_pb';
import { summarizeParts } from './summarize_parts';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_SUMMARY } from './testkit';

describe('SummarizeParts', () => {
  // INDEPENDENT ORACLE: ORACLE_SUMMARY was transcribed by hand by counting
  // <note>/<rest> occurrences per part in FIXTURE_PARTWISE_XML: P1 has 6
  // non-rest notes (C#4, D4, E4, G4-chord, C#4-tie-stop, B3-grace) and 1
  // rest across 2 measures; P2 has 1 rest and 1 note across 2 measures.
  it('summarizes measure/note/rest counts for both parts', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    const result = summarizeParts(ctx, input);
    expect(result.getError()).toBe('');
    expect(
      result.getPartsList().map((p) => ({
        partId: p.getPartId(),
        partName: p.getPartName(),
        measureCount: p.getMeasureCount(),
        noteCount: p.getNoteCount(),
        restCount: p.getRestCount(),
      })),
    ).toEqual(ORACLE_SUMMARY);
  });
});
