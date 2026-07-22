import { MusicXmlInput } from '../gen/messages_pb';
import { extractMetadata } from './extract_metadata';
import { ctx, FIXTURE_PARTWISE_XML, FIXTURE_MALFORMED_XML, ORACLE_METADATA } from './testkit';

describe('ExtractMetadata', () => {
  // INDEPENDENT ORACLE: ORACLE_METADATA was transcribed by hand from
  // FIXTURE_PARTWISE_XML's <work>/<identification> block.
  it('extracts work title, creators, rights, and encoding info', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    const result = extractMetadata(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getWorkTitle()).toBe(ORACLE_METADATA.workTitle);
    expect(result.getMovementTitle()).toBe(ORACLE_METADATA.movementTitle);
    expect(result.getCreatorsList().map((c) => ({ type: c.getType(), name: c.getName() }))).toEqual(ORACLE_METADATA.creators);
    expect(result.getRights()).toBe(ORACLE_METADATA.rights);
    expect(result.getEncodingSoftwareList()).toEqual(ORACLE_METADATA.encodingSoftware);
    expect(result.getEncodingDatesList()).toEqual(ORACLE_METADATA.encodingDates);
    expect(result.getSource()).toBe(ORACLE_METADATA.source);
  });

  it('returns empty fields (not an error) for a document with no identification/work', () => {
    const input = new MusicXmlInput();
    input.setXml('<score-partwise version="4.0"><part-list></part-list></score-partwise>');
    const result = extractMetadata(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getWorkTitle()).toBe('');
    expect(result.getCreatorsList()).toHaveLength(0);
  });

  it('returns a structured error for malformed XML', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_MALFORMED_XML);
    const result = extractMetadata(ctx, input);
    expect(result.getError()).not.toBe('');
  });
});
