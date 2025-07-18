import type { PluginSimple } from "markdown-it";
import type MarkdownIt from "markdown-it";
import type StateInline from "markdown-it/lib/rules_inline/state_inline.d.mts";
import type Token from "markdown-it/lib/token.mjs";
import { convertRuleNameToClassName, pushTokenToState } from "./utils";

export const BI_DIRECTIONAL_LINK_PATTERN =
  /\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]/y;
const RULE_NAME = "bi_directional_link";
const RENDER_OPEN_NAME = `${RULE_NAME}_open`;
const RENDER_CLOSE_NAME = `${RULE_NAME}_close`;

export interface BiDirectionalLinkOptions {
  url?: string;
  className?: string;
  render_open?: string;
  render_close?: string;
}

export const BiDirectionalLink: (
  options: BiDirectionalLinkOptions
) => PluginSimple = ({
  url = "/notes/%s",
  className = convertRuleNameToClassName(RULE_NAME),
  render_open,
  render_close,
}) => {
  return (md) => {
    md.inline.ruler.after("text", RULE_NAME, (state) => {
      BI_DIRECTIONAL_LINK_PATTERN.lastIndex = state.pos;
      const matched = BI_DIRECTIONAL_LINK_PATTERN.exec(state.src);

      return matched ? genBiDirectionalLinkTokens(state, md, matched) : false;
    });

    md.renderer.rules[RENDER_OPEN_NAME] = (tokens, idx) => {
      return (
        render_open ||
        `<a href="${url.replace(
          "%s",
          tokens[idx]!.attrGet("title")!
        )}" class="${className}">`
      );
    };

    md.renderer.rules[RENDER_CLOSE_NAME] = () => {
      return render_close || `</a>`;
    };
  };
};

export function genBiDirectionalLinkTokens(
  state: StateInline,
  md: MarkdownIt,
  match: RegExpMatchArray
) {
  const link = match[1]!;
  const text = match[2];

  // add opening token
  state.push(RENDER_OPEN_NAME, "", 1).attrSet("title", `${link}`);

  // add self-closing token
  const parsedTokens = md.parseInline(text || link, state.env) || [];

  // this must use deep copy to update current state
  parsedTokens?.forEach((token: Token) => {
    token?.children?.forEach((child: Token) => pushTokenToState(child, state));
  });

  // and closing tokens
  state.push(RENDER_CLOSE_NAME, "", -1);

  // Update the position
  state.pos += match![0].length;

  return true;
}
