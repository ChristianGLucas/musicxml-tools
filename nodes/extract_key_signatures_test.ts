import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractKeySignatures } from './extract_key_signatures';
import { ctx, FIXTURE_PARTWISE_XML, FIXTURE_TIMEWISE_XML, ORACLE_KEY_SIGNATURES_P1 } from './testkit';

describe('ExtractKeySignatures', () => {
  // INDEPENDENT ORACLE: ORACLE_KEY_SIGNATURES_P1 was transcribed by hand.
  // fifths=2 with no <mode> is standard music-theory ground truth for D
  // major (2 sharps: F#, C#) — verifiable independently of this package.
  it('extracts fifths=2 as "D major" (mode absent -> defaults to major)', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P1');
    const result = extractKeySignatures(ctx, q);
    expect(result.getError()).toBe('');
    expect(
      result.getChangesList().map((c) => ({
        partId: c.getPartId(),
        measureIndex: c.getMeasureIndex(),
        measureNumber: c.getMeasureNumber(),
        fifths: c.getFifths(),
        mode: c.getMode(),
        keyName: c.getKeyName(),
      })),
    ).toEqual(ORACLE_KEY_SIGNATURES_P1);
  });

  // INDEPENDENT ORACLE: fifths=-1 mode="minor" is D minor (1 flat: Bb) —
  // standard music-theory ground truth, verifiable independently.
  it('extracts fifths=-1 mode=minor as "D minor" from the timewise fixture', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_TIMEWISE_XML);
    q.setPartId('P1');
    const result = extractKeySignatures(ctx, q);
    expect(result.getChangesList()).toHaveLength(1);
    const c = result.getChangesList()[0];
    expect(c.getFifths()).toBe(-1);
    expect(c.getMode()).toBe('minor');
    expect(c.getKeyName()).toBe('D minor');
  });

  it('a part with no key signature returns zero rows', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P2');
    const result = extractKeySignatures(ctx, q);
    expect(result.getChangesList()).toHaveLength(0);
  });
});
