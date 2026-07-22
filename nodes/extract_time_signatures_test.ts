import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractTimeSignatures } from './extract_time_signatures';
import { ctx, FIXTURE_PARTWISE_XML, FIXTURE_TIMEWISE_XML, ORACLE_TIME_SIGNATURES_P1 } from './testkit';

describe('ExtractTimeSignatures', () => {
  // INDEPENDENT ORACLE: ORACLE_TIME_SIGNATURES_P1 was transcribed by hand
  // from P1's <attributes>/<time> in FIXTURE_PARTWISE_XML (4/4, declared
  // once, in measure 1 — no change in measure 2).
  it('extracts the single 4/4 time signature change for P1', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P1');
    const result = extractTimeSignatures(ctx, q);
    expect(result.getError()).toBe('');
    expect(
      result.getChangesList().map((c) => ({
        partId: c.getPartId(),
        measureIndex: c.getMeasureIndex(),
        measureNumber: c.getMeasureNumber(),
        beats: c.getBeatsList(),
        beatType: c.getBeatTypeList(),
        symbol: c.getSymbol(),
      })),
    ).toEqual(ORACLE_TIME_SIGNATURES_P1);
  });

  it('extracts a 3/4 time signature from the timewise fixture', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_TIMEWISE_XML);
    q.setPartId('P1');
    const result = extractTimeSignatures(ctx, q);
    expect(result.getChangesList()).toHaveLength(1);
    expect(result.getChangesList()[0].getBeatsList()).toEqual(['3']);
    expect(result.getChangesList()[0].getBeatTypeList()).toEqual(['4']);
  });

  it('a part with no time signature returns zero rows, not an error', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P2');
    const result = extractTimeSignatures(ctx, q);
    expect(result.getError()).toBe('');
    expect(result.getChangesList()).toHaveLength(0);
  });
});
