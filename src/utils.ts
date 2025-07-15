export function convertRuleNameToClassName(ruleName: string) {
  return ruleName.replace(/_/g, "-");
}
