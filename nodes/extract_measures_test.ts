import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractMeasures } from './extract_measures';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_MEASURES_P1 } from './testkit';

function query(partId: string, start = 0, end = 0): MusicXmlPartQuery {
  const q = new MusicXmlPartQuery();
  q.setXml(FIXTURE_PARTWISE_XML);
  q.setPartId(partId);
  q.setStartMeasureIndex(start);
  q.setEndMeasureIndex(end);
  return q;
}

describe('ExtractMeasures', () => {
  // INDEPENDENT ORACLE: ORACLE_MEASURES_P1 was transcribed by hand from
  // part P1's two <measure> elements (width, attributes presence, and a
  // manual note/rest count) in FIXTURE_PARTWISE_XML.
  it('extracts P1 measures with note/rest counts and attribute-change flags', () => {
    const result = extractMeasures(ctx, query('P1'));
    expect(result.getError()).toBe('');
    expect(result.getTotalMeasures()).toBe(2);
    expect(result.getTruncated()).toBe(false);
    expect(
      result.getMeasuresList().map((m) => ({
        partId: m.getPartId(),
        index: m.getIndex(),
        number: m.getNumber(),
        implicit: m.getImplicit(),
        width: m.getWidth(),
        widthSpecified: m.getWidthSpecified(),
        noteCount: m.getNoteCount(),
        restCount: m.getRestCount(),
        hasAttributes: m.getHasAttributes(),
      })),
    ).toEqual(ORACLE_MEASURES_P1);
  });

  it('empty part_id returns every part\'s measures', () => {
    const result = extractMeasures(ctx, query(''));
    expect(result.getTotalMeasures()).toBe(4); // 2 (P1) + 2 (P2)
  });

  it('an unknown part_id returns zero rows, not an error', () => {
    const result = extractMeasures(ctx, query('NOPE'));
    expect(result.getError()).toBe('');
    expect(result.getMeasuresList()).toHaveLength(0);
    expect(result.getTotalMeasures()).toBe(0);
  });

  it('start/end measure index bounds the range (inclusive)', () => {
    const result = extractMeasures(ctx, query('P1', 1, 1));
    expect(result.getMeasuresList().map((m) => m.getIndex())).toEqual([1]);
  });
});
