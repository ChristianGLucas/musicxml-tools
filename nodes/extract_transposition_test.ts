import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractTransposition } from './extract_transposition';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_TRANSPOSITION_P2 } from './testkit';

describe('ExtractTransposition', () => {
  // INDEPENDENT ORACLE: ORACLE_TRANSPOSITION_P2 was transcribed by hand
  // from P2's <attributes>/<transpose> (diatonic=-1, chromatic=-2 — the
  // standard MusicXML transposition for a Bb clarinet's written vs.
  // concert pitch, a major second down).
  it('extracts the Bb-clarinet transposition on P2', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P2');
    const result = extractTransposition(ctx, q);
    expect(result.getError()).toBe('');
    expect(
      result.getTranspositionsList().map((t) => ({
        partId: t.getPartId(),
        measureIndex: t.getMeasureIndex(),
        measureNumber: t.getMeasureNumber(),
        diatonic: t.getDiatonic(),
        diatonicSpecified: t.getDiatonicSpecified(),
        chromatic: t.getChromatic(),
        octaveChange: t.getOctaveChange(),
        octaveChangeSpecified: t.getOctaveChangeSpecified(),
        doubleTransposition: t.getDoubleTransposition(),
      })),
    ).toEqual(ORACLE_TRANSPOSITION_P2);
  });

  it('a non-transposing part (P1, e.g. piano) has zero rows — absence means not transposed', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P1');
    const result = extractTransposition(ctx, q);
    expect(result.getTranspositionsList()).toHaveLength(0);
  });
});
