import { MusicXmlPartQuery, ExtractLyricsResult, LyricSyllable } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, selectParts, measureRange, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Extract a part's sung lyrics as syllables aligned to notes: verse
 * number (<lyric number="...">, empty means implicitly verse 1), syllabic
 * position ("single"/"begin"/"middle"/"end"), text, and whether a
 * following <extend/> continues the syllable — each tagged with
 * note_index_in_measure, the 0-based position of the owning note among
 * ALL <note> elements (including rests) in that measure, so a syllable
 * can be lined back up against ExtractNotes' output for the same part.
 * Set part_id to one part's id from ListParts (required in practice —
 * lyrics are normally only present on vocal parts).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractLyrics(ax: AxiomContext, input: MusicXmlPartQuery): ExtractLyricsResult {
  const out = new ExtractLyricsResult();
  try {
    const score = normalizeScore(input.getXml());
    const parts = selectParts(score, input.getPartId());
    const rows: LyricSyllable[] = [];
    for (const part of parts) {
      const ranged = measureRange(part.measures, input.getStartMeasureIndex(), input.getEndMeasureIndex());
      for (const m of ranged) {
        m.notes.forEach((n, noteIdx) => {
          for (const lyric of n.lyrics) {
            const ls = new LyricSyllable();
            ls.setPartId(part.id);
            ls.setMeasureIndex(m.index);
            ls.setMeasureNumber(m.number);
            ls.setNoteIndexInMeasure(noteIdx);
            ls.setVerseNumber(lyric.verseNumber);
            ls.setSyllabic(lyric.syllabic);
            ls.setText(lyric.text);
            ls.setExtend(lyric.extend);
            rows.push(ls);
          }
        });
      }
    }
    out.setSyllablesList(rows);
    return out;
  } catch (e) {
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'extracting lyrics'));
    return out;
  }
}
