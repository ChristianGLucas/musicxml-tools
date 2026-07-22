import { MusicXmlInput, ExtractInstrumentsResult, InstrumentInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract every <score-instrument> declared under each part's <score-
 * part> (id, name, abbreviation, and the <instrument-sound> value, e.g.
 * "keyboard.piano"), plus the total part count and total instrument
 * count. A part can declare more than one instrument (e.g. a multi-voice
 * percussion part covering several drum-kit pieces), so this is finer-
 * grained than ListParts, which reports one row per part regardless of
 * how many instruments it declares.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractInstruments(ax: AxiomContext, input: MusicXmlInput): ExtractInstrumentsResult {
  const out = new ExtractInstrumentsResult();
  try {
    const score = normalizeScore(input.getXml());
    const rows: InstrumentInfo[] = [];
    for (const part of score.parts) {
      for (const inst of part.instruments) {
        const ii = new InstrumentInfo();
        ii.setPartId(part.id);
        ii.setInstrumentId(inst.id);
        ii.setName(inst.name);
        ii.setAbbreviation(inst.abbreviation);
        ii.setSound(inst.sound);
        rows.push(ii);
      }
    }
    out.setInstrumentsList(rows);
    out.setPartCount(score.parts.length);
    out.setInstrumentCount(rows.length);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting instruments'));
    return out;
  }
}
