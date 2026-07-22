import { MusicXmlInput, ScoreMetadata, Creator } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract a MusicXML score's work and identification metadata: work title/
 * number, movement title/number (from <work>/<movement-title>), every
 * <creator> (composer, arranger, lyricist, etc. — <identification>
 * distinguishes them by the `type` attribute), rights/copyright text,
 * encoding software and encoding dates, and source.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMetadata(ax: AxiomContext, input: MusicXmlInput): ScoreMetadata {
  const out = new ScoreMetadata();
  try {
    const score = normalizeScore(input.getXml());
    out.setWorkTitle(score.workTitle);
    out.setWorkNumber(score.workNumber);
    out.setMovementTitle(score.movementTitle);
    out.setMovementNumber(score.movementNumber);
    out.setCreatorsList(
      score.creators.map((c) => {
        const cr = new Creator();
        cr.setType(c.type);
        cr.setName(c.name);
        return cr;
      }),
    );
    out.setRights(score.rights);
    out.setEncodingSoftwareList(score.encodingSoftware);
    out.setEncodingDatesList(score.encodingDates);
    out.setSource(score.source);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting metadata'));
    return out;
  }
}
