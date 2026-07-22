import { MusicXmlInput, ParsedScore, ParsedPart } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Parse a MusicXML score (score-partwise or score-timewise, normalized to
 * one common shape) into a lightweight overview: title, composer, and each
 * part with its measure count. For the full per-note/per-measure detail,
 * use ListParts + ExtractMeasures/ExtractNotes on a specific part instead —
 * this node is the quick "what is this score" summary.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseScore(ax: AxiomContext, input: MusicXmlInput): ParsedScore {
  const out = new ParsedScore();
  try {
    const score = normalizeScore(input.getXml());
    out.setForm(score.form);
    out.setTitle(score.workTitle || score.movementTitle);
    const composer = score.creators.find((c) => c.type.toLowerCase() === 'composer') ?? score.creators[0];
    out.setComposer(composer ? composer.name : '');
    out.setPartsList(
      score.parts.map((p) => {
        const pp = new ParsedPart();
        pp.setId(p.id);
        pp.setName(p.name);
        pp.setMeasureCount(p.measures.length);
        return pp;
      }),
    );
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'parsing score'));
    return out;
  }
}
