import type StateInline from "markdown-it/lib/rules_inline/state_inline.d.mts";
import type Token from "markdown-it/lib/token.mjs";

export const convertRuleNameToClassName = (ruleName: string) => {
  return `md-${ruleName.replace(/_/g, "-")}`;
};

export const pushTokenToState = (token: Token, state: StateInline) => {
  Object.assign(state.push(token.type, token.tag, token.nesting), {
    content: token.content,
    attrs: token.attrs ?? null,
    markup: token.markup,
    info: token.info,
    meta: token.meta,
    block: token.block,
    hidden: token.hidden,
  });
};
