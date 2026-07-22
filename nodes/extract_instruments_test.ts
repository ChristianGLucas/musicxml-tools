import { MusicXmlInput } from '../gen/messages_pb';
import { extractInstruments } from './extract_instruments';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_INSTRUMENTS } from './testkit';

describe('ExtractInstruments', () => {
  // INDEPENDENT ORACLE: ORACLE_INSTRUMENTS was transcribed by hand from
  // P2's single <score-instrument> (P1 declares none).
  it('extracts P2\'s score-instrument and the total part/instrument counts', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    const result = extractInstruments(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getPartCount()).toBe(ORACLE_INSTRUMENTS.partCount);
    expect(result.getInstrumentCount()).toBe(ORACLE_INSTRUMENTS.instrumentCount);
    expect(
      result.getInstrumentsList().map((i) => ({
        partId: i.getPartId(),
        instrumentId: i.getInstrumentId(),
        name: i.getName(),
        abbreviation: i.getAbbreviation(),
        sound: i.getSound(),
      })),
    ).toEqual(ORACLE_INSTRUMENTS.instruments);
  });
});
