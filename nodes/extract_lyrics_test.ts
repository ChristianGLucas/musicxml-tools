import { MusicXmlPartQuery } from '../gen/messages_pb';
import { extractLyrics } from './extract_lyrics';
import { ctx, FIXTURE_PARTWISE_XML, ORACLE_LYRICS_P1 } from './testkit';

describe('ExtractLyrics', () => {
  // INDEPENDENT ORACLE: ORACLE_LYRICS_P1 was transcribed by hand from the
  // two <lyric> elements on P1's first two notes ("Hel" begin, "lo" end
  // with <extend/>), aligned to their 0-based note index in the measure.
  it('extracts the two-syllable lyric aligned to note_index_in_measure', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P1');
    const result = extractLyrics(ctx, q);
    expect(result.getError()).toBe('');
    expect(
      result.getSyllablesList().map((s) => ({
        partId: s.getPartId(),
        measureIndex: s.getMeasureIndex(),
        measureNumber: s.getMeasureNumber(),
        noteIndexInMeasure: s.getNoteIndexInMeasure(),
        verseNumber: s.getVerseNumber(),
        syllabic: s.getSyllabic(),
        text: s.getText(),
        extend: s.getExtend(),
      })),
    ).toEqual(ORACLE_LYRICS_P1);
  });

  it('a part with no lyrics returns zero rows', () => {
    const q = new MusicXmlPartQuery();
    q.setXml(FIXTURE_PARTWISE_XML);
    q.setPartId('P2');
    const result = extractLyrics(ctx, q);
    expect(result.getSyllablesList()).toHaveLength(0);
  });
});
