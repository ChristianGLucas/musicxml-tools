import { MusicXmlInput, ListPartsResult, PartInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * List the parts declared in a MusicXML score's <part-list>: each part's
 * id (the identifier used by every other per-part node's part_id field),
 * name, abbreviation, and how many <score-instrument>s it declares. Call
 * this first to discover valid part_id values for ExtractMeasures,
 * ExtractNotes, and the other MusicXmlPartQuery-based nodes.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listParts(ax: AxiomContext, input: MusicXmlInput): ListPartsResult {
  const out = new ListPartsResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = score.parts.map((p) => {
      const pi = new PartInfo();
      pi.setId(p.id);
      pi.setName(p.name);
      pi.setAbbreviation(p.abbreviation);
      pi.setInstrumentCount(p.instruments.length);
      return pi;
    });
    out.setPartsList(parts);
    out.setPartCount(parts.length);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'listing parts'));
    return out;
  }
}
