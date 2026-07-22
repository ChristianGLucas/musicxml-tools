import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractClefs } from './extract_clefs';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_CLEFS_P1 } from './testkit';

describe('ExtractClefs', () => {
  // INDEPENDENT ORACLE: ORACLE_CLEFS_P1 was transcribed by hand from P1's
  // two <attributes>/<clef> elements — treble (G, line 2) in measure 1,
  // bass (F, line 4) in measure 2.
  it('extracts the treble-to-bass clef change for P1', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P1');
    const result = extractClefs(ctx, q);
    expect(result.getError()).toBe('');
    expect(
      result.getClefsList().map((c) => ({
        partId: c.getPartId(),
        measureIndex: c.getMeasureIndex(),
        measureNumber: c.getMeasureNumber(),
        sign: c.getSign(),
        line: c.getLine(),
        lineSpecified: c.getLineSpecified(),
        octaveChange: c.getOctaveChange(),
        octaveChangeSpecified: c.getOctaveChangeSpecified(),
        staffNumber: c.getStaffNumber(),
      })),
    ).toEqual(ORACLE_CLEFS_P1);
  });

  it('a part with no clef returns zero rows', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P2');
    const result = extractClefs(ctx, q);
    expect(result.getClefsList()).toHaveLength(0);
  });
});
