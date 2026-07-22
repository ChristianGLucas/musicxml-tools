import { MusicXmlInput } from '../gen/messages_pb';
import { listParts } from './list_parts';
import { ctx, FIXTURE_PARTWISE_XML, FIXTURE_MALFORMED_XML, ORACLE_LIST_PARTS } from './testkit';

describe('ListParts', () => {
  // INDEPENDENT ORACLE: ORACLE_LIST_PARTS was transcribed by hand from
  // FIXTURE_PARTWISE_XML's <part-list>.
  it('lists both declared parts with id/name/abbreviation/instrument_count', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    const result = listParts(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getPartCount()).toBe(ORACLE_LIST_PARTS.partCount);
    expect(
      result.getPartsList().map((p) => ({ id: p.getId(), name: p.getName(), abbreviation: p.getAbbreviation(), instrumentCount: p.getInstrumentCount() })),
    ).toEqual(ORACLE_LIST_PARTS.parts);
  });

  it('returns a structured error for malformed XML', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_MALFORMED_XML);
    const result = listParts(ctx, input);
    expect(result.getError()).not.toBe('');
    expect(result.getPartsList()).toHaveLength(0);
  });

  it('is deterministic', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    expect(listParts(ctx, input).toObject()).toEqual(listParts(ctx, input).toObject());
  });
});
