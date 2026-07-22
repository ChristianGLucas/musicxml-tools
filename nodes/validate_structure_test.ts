import { MusicXmlInput } from '../gen/messages_pb';
import { validateStructure } from './validate_structure';
import { ctx, FIXTURE_PARTWISE_XML, FIXTURE_STRUCTURAL_ISSUES_XML, FIXTURE_NON_MUSICXML_XML, FIXTURE_MALFORMED_XML } from './testkit';

describe('ValidateStructure', () => {
  it('reports valid=true with no issues for a well-formed score', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_PARTWISE_XML);
    const result = validateStructure(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getValid()).toBe(true);
    expect(result.getForm()).toBe('score-partwise');
    expect(result.getDeclaredPartCount()).toBe(2);
    expect(result.getPartCount()).toBe(2);
    expect(result.getIssuesList()).toHaveLength(0);
  });

  // INDEPENDENT ORACLE: FIXTURE_STRUCTURAL_ISSUES_XML was hand-built with
  // 3 declared parts (P1 real, P2 missing entirely, P3 a literal empty
  // <part/>) and one undeclared content part (P4) — the expected
  // warning/error set is transcribed directly from that construction.
  it('reports a warning for each declared-but-empty part and an error for undeclared content', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_STRUCTURAL_ISSUES_XML);
    const result = validateStructure(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getDeclaredPartCount()).toBe(3);
    const issues = result.getIssuesList().map((i) => ({ severity: i.getSeverity(), message: i.getMessage() }));
    expect(issues).toContainEqual({ severity: 'warning', message: 'part "P2" has no measures' });
    expect(issues).toContainEqual({ severity: 'warning', message: 'part "P3" has no measures' });
    expect(issues).toContainEqual({ severity: 'error', message: 'part "P4" has content but is not declared in part-list' });
    // valid=false because at least one issue is error-severity (the
    // undeclared P4), even though the two warnings alone would not have
    // made it invalid.
    expect(result.getValid()).toBe(false);
  });

  it('reports valid=false with a top-level error for non-MusicXML input', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_NON_MUSICXML_XML);
    const result = validateStructure(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getError()).not.toBe('');
  });

  it('reports valid=false with a top-level error (not a crash) for malformed XML', () => {
    const input = new MusicXmlInput();
    input.setXml(FIXTURE_MALFORMED_XML);
    const result = validateStructure(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getError()).not.toBe('');
  });
});
