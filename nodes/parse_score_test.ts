import { MusicXmlInput } from '../gen/messages_pb';
import { parseScore } from './parse_score';
import { ctx, FIXTURE_PARTWISE_XML, FIXTURE_TIMEWISE_XML, FIXTURE_MALFORMED_XML, FIXTURE_BILLION_LAUGHS_XML, ORACLE_PARSED_SCORE } from './testkit';

describe('ParseScore', () => {
  // INDEPENDENT ORACLE: ORACLE_PARSED_SCORE was transcribed by hand from
  // FIXTURE_PARTWISE_XML's <work>/<identification>/<part-list>/<part> text.
  it('normalizes a score-partwise document into title/composer/parts', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    const result = parseScore(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getForm()).toBe(ORACLE_PARSED_SCORE.form);
    expect(result.getTitle()).toBe(ORACLE_PARSED_SCORE.title);
    expect(result.getComposer()).toBe(ORACLE_PARSED_SCORE.composer);
    expect(result.getPartsList().map((p) => ({ id: p.getId(), name: p.getName(), measureCount: p.getMeasureCount() }))).toEqual(
      ORACLE_PARSED_SCORE.parts,
    );
  });

  it('normalizes a score-timewise document to the same shape (form reported correctly, title read)', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_TIMEWISE_XML);
    const result = parseScore(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getForm()).toBe('score-timewise');
    expect(result.getTitle()).toBe('Timewise Test');
    expect(result.getPartsList().map((p) => ({ id: p.getId(), measureCount: p.getMeasureCount() }))).toEqual([{ id: 'P1', measureCount: 2 }]);
  });

  it('returns a structured error (not a crash) for malformed XML', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_MALFORMED_XML);
    const result = parseScore(ctx, input);
    expect(result.getError()).not.toBe('');
    expect(result.getPartsList()).toHaveLength(0);
  });

  it('does not expand a billion-laughs entity into the title (passes through literally)', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_BILLION_LAUGHS_XML);
    const result = parseScore(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getTitle()).toBe('&lol2;');
  });
});
