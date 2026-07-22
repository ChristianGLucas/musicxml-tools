import { MusicXmlInput, SummarizePartsResult, PartSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Summarize every part's measure/note/rest counts in one call — a quick
 * "how big is each part" overview without walking ExtractMeasures or
 * ExtractNotes per part yourself. note_count counts non-rest <note>
 * elements (a chord's member notes each count separately, since each is
 * its own notated note); rest_count counts <rest/> notes.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarizeParts(ax: AxiomContext, input: MusicXmlInput): SummarizePartsResult {
  const out = new SummarizePartsResult();
  try {
    const score = normalizeScore(input.getXml());
    out.setPartsList(
      score.parts.map((p) => {
        const ps = new PartSummary();
        ps.setPartId(p.id);
        ps.setPartName(p.name);
        ps.setMeasureCount(p.measures.length);
        let noteCount = 0;
        let restCount = 0;
        for (const m of p.measures) {
          for (const n of m.notes) {
            if (n.isRest) restCount += 1;
            else noteCount += 1;
          }
        }
        ps.setNoteCount(noteCount);
        ps.setRestCount(restCount);
        return ps;
      }),
    );
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'summarizing parts'));
    return out;
  }
}
