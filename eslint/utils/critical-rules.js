/**
 * Critical rules that downstream consumers should not disable.
 * Modeled after security/quality baselines used by large-scale product teams.
 */
const CRITICAL_RULES = [
  {
    id: 'kitium/lint-config-extends-kitium',
    reason:
      'Lint configs must extend @kitiumai/lint so central updates and security fixes propagate automatically.',
  },
  {
    id: 'kitium/shared-config-dependency',
    reason:
      'Shared Prettier/Jest configs avoid drift and guarantee consistent formatting and test behavior.',
  },
  {
    id: 'security/detect-object-injection',
    reason:
      'Prevents prototype pollution/object injection attacks that can lead to remote code execution.',
  },
  {
    id: 'security/detect-possible-timing-attacks',
    reason: 'Protects credential and token comparisons from timing side-channel leaks.',
  },
  {
    id: 'no-unsanitized/method',
    reason: 'Blocks unsafe DOM string injection that can introduce XSS vulnerabilities.',
  },
  {
    id: 'no-unsanitized/property',
    reason: 'Blocks unsafe DOM property assignment that can introduce XSS vulnerabilities.',
  },
  {
    id: 'node/no-path-concat',
    reason: 'Mitigates path traversal vulnerabilities when building filesystem paths.',
  },
  {
    id: 'node/no-new-require',
    reason: 'Prevents dynamic require patterns that bypass analyzers and open supply-chain risk.',
  },
];

const RULE_REASON_MAP = new Map(CRITICAL_RULES.map((rule) => [rule.id, rule]));

function isSeverityDisabled(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'number') {
    return value === 0;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'off' || value === '0';
  }

  if (Array.isArray(value)) {
    return isSeverityDisabled(value[0]);
  }

  if (typeof value === 'boolean') {
    return value === false;
  }

  return false;
}

export function warnIfDisablingCriticalRules(ruleOverrides = {}, source = '') {
  const messages = [];
  for (const [ruleId, config] of Object.entries(ruleOverrides)) {
    const meta = RULE_REASON_MAP.get(ruleId);
    if (!meta) {
      continue;
    }

    if (isSeverityDisabled(config)) {
      const prefix = source ? `${source}: ` : '';
      messages.push(
        `${prefix}Attempted to disable "${ruleId}". ${meta.reason} (rule enforced by Kitium)`
      );
    }
  }

  for (const message of messages) {
    console.warn(`[kitium-lint] ${message}`);
  }
}

export const criticalRuleIds = CRITICAL_RULES.map((rule) => rule.id);
