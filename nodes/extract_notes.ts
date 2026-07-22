import { MusicXmlPartQuery, ExtractNotesResult, NoteInfo, NotePitch } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError, MAX_NOTES_OUTPUT } from './lib';

/**
 * Extract the notes of a part as a structured array: pitch (step/octave/
 * alter), duration (in the part's current <divisions> units), type (e.g.
 * "quarter"), dot count, voice, staff, rest/tie-start/tie-stop/chord/grace
 * flags. Set part_id to one part's id from ListParts, or leave it empty
 * for every part (each row is still tagged with its own part_id). Use
 * start_measure_index/end_measure_index to page through a large score —
 * output is additionally capped at 20000 rows with `truncated` set if
 * more existed.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractNotes(ax: AxiomContext, input: MusicXmlPartQuery): ExtractNotesResult {
  const out = new ExtractNotesResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: NoteInfo[] = [];
    let total = 0;
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        total += m.notes.length;
        for (const n of m.notes) {
          if (rows.length >= MAX_NOTES_OUTPUT) continue;
          const ni = new NoteInfo();
          ni.setPartId(part.id);
          ni.setMeasureIndex(m.index);
          ni.setMeasureNumber(m.number);
          ni.setIsRest(n.isRest);
          ni.setIsUnpitched(n.isUnpitched);
          if (n.pitch) {
            const np = new NotePitch();
            np.setStep(n.pitch.step);
            np.setAlter(n.pitch.alter);
            np.setAlterSpecified(n.pitch.alterSpecified);
            np.setOctave(n.pitch.octave);
            ni.setPitch(np);
          }
          ni.setDuration(n.duration);
          ni.setType(n.type);
          ni.setDots(n.dots);
          ni.setVoice(n.voice);
          ni.setStaff(n.staff);
          ni.setStaffSpecified(n.staffSpecified);
          ni.setTieStart(n.tieStart);
          ni.setTieStop(n.tieStop);
          ni.setChord(n.chord);
          ni.setGrace(n.grace);
          rows.push(ni);
        }
      }
    }
    out.setNotesList(rows);
    out.setTotalNotes(total);
    out.setTruncated(rows.length < total);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting notes'));
    return out;
  }
}
