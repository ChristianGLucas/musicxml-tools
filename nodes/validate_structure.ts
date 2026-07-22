import { MusicXmlInput, ValidateStructureResult, StructuralIssue } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { normalizeScore, errorMessage, BoundsError, MusicXmlParseError } from './lib';

/**
 * Validate basic MusicXML structural correctness: a recognized score-
 * partwise/score-timewise root exists, and <part-list>'s declared score-
 * parts match the actual <part> (or score-timewise <measure>/<part>)
 * content. A declared part with zero measures — whether it appears as a
 * literal empty <part id="..."/> or never appears in the content at all —
 * is a "warning" (valid stays true; both are indistinguishable once
 * normalized, since either way there is simply no measure data for that
 * part id). Content found for a part id that was never declared in
 * <part-list> is an "error"-severity issue (valid=false). This is a
 * structural check only, not full MusicXML schema/DTD validation. A
 * document that fails to parse at all (not XML, or neither root form)
 * sets the top-level `error` instead of `issues`, since no structure
 * could be examined.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateStructure(ax: AxiomContext, input: MusicXmlInput): ValidateStructureResult {
  const out = new ValidateStructureResult();
  try {
    const score = normalizeScore(input.getXml());
    out.setForm(score.form);
    out.setDeclaredPartCount(score.declaredPartIds.length);
    out.setPartCount(score.parts.length);

    const issues: StructuralIssue[] = [];
    for (const id of score.declaredPartIds) {
      const part = score.parts.find((p) => p.id === id);
      if (!part || part.measures.length === 0) {
        const si = new StructuralIssue();
        si.setSeverity('warning');
        si.setMessage(`part "${id}" has no measures`);
        issues.push(si);
      }
    }
    for (const part of score.parts) {
      if (part.undeclared) {
        const si = new StructuralIssue();
        si.setSeverity('error');
        si.setMessage(`part "${part.id}" has content but is not declared in part-list`);
        issues.push(si);
      }
    }

    out.setIssuesList(issues);
    out.setValid(!issues.some((i) => i.getSeverity() === 'error'));
    return out;
  } catch (e) {
    out.setValid(false);
    out.setError(e instanceof BoundsError || e instanceof MusicXmlParseError ? e.message : errorMessage(e, 'validating structure'));
    return out;
  }
}
