import { MusicXmlInput, ComputeDurationResult, PartDuration } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, measureDurationByVoice, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Compute each part's total notated duration. Per measure, notes are
 * grouped by <voice> (a chord note is excluded from the sum, since
 * <chord/> means it sounds together with the preceding note rather than
 * advancing that voice), each voice's remaining note durations are
 * summed, and the measure's length is the MAXIMUM across voices — then
 * measure lengths are summed across the part. This approximation does not
 * interpret <backup>/<forward> elements, so uses_backup_forward flags
 * whenever any measure in the part contains one — in that case
 * total_duration_divisions/total_quarter_notes may under-count and
 * total_quarter_notes_reliable is forced false regardless of divisions.
 * Otherwise, total_quarter_notes divides the total by the part's LAST
 * <divisions> value and is marked reliable only when divisions never
 * changed mid-part (a mid-part divisions change makes a single quarter-
 * note conversion factor inexact).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function computeDuration(ax: AxiomContext, input: MusicXmlInput): ComputeDurationResult {
  const out = new ComputeDurationResult();
  try {
    const score = normalizeScore(input.getXml());
    out.setPartsList(
      score.parts.map((p) => {
        let totalDivisions = 0;
        let lastDivisions = 0;
        let divisionsSeenCount = 0;
        let divisionsChanged = false;
        let usesBackupForward = false;
        for (const m of p.measures) {
          totalDivisions += measureDurationByVoice(m);
          if (m.usesBackupForward) usesBackupForward = true;
          for (const ac of m.attributesChanges) {
            if (ac.divisions !== null) {
              if (divisionsSeenCount > 0 && ac.divisions !== lastDivisions) divisionsChanged = true;
              lastDivisions = ac.divisions;
              divisionsSeenCount += 1;
            }
          }
        }
        const pd = new PartDuration();
        pd.setPartId(p.id);
        pd.setTotalDurationDivisions(totalDivisions);
        pd.setLastDivisionsPerQuarter(lastDivisions);
        const divisionsKnown = divisionsSeenCount > 0;
        pd.setDivisionsKnown(divisionsKnown);
        const reliable = divisionsKnown && !divisionsChanged && !usesBackupForward;
        pd.setTotalQuarterNotes(reliable ? totalDivisions / lastDivisions : 0);
        pd.setTotalQuarterNotesReliable(reliable);
        pd.setDivisionsChangedMidPart(divisionsChanged);
        pd.setUsesBackupForward(usesBackupForward);
        return pd;
      }),
    );
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'computing duration'));
    return out;
  }
}
