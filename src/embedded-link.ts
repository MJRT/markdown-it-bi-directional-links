import type { PluginSimple } from "markdown-it";
import type MarkdownIt from "markdown-it";
import type StateInline from "markdown-it/lib/rules_inline/state_inline.d.mts";
import type Token from "markdown-it/lib/token.mjs";
import { convertRuleNameToClassName, pushTokenToState } from "./utils";
import { EMBEDDED_LINK_PATTERN, EMBEDDED_LINK_RULE_NAME } from "./constants";

const RENDER_OPEN_NAME = `${EMBEDDED_LINK_RULE_NAME}_open`;
const RENDER_CLOSE_NAME = `${EMBEDDED_LINK_RULE_NAME}_close`;

export interface EmbeddedLinkOptions {
  url?: string;
  className?: string;
  render_open?: string;
  render_close?: string;
}

export const EmbeddedLink: (options: EmbeddedLinkOptions) => PluginSimple = ({
  url = "/notes/%s",
  className = convertRuleNameToClassName(EMBEDDED_LINK_RULE_NAME),
  render_open,
  render_close,
}) => {
  return (md) => {
    md.inline.ruler.after("text", EMBEDDED_LINK_RULE_NAME, (state) => {
      EMBEDDED_LINK_PATTERN.lastIndex = state.pos;
      const matched = EMBEDDED_LINK_PATTERN.exec(state.src);

      return matched ? genEmbeddedLinkTokens(state, md, matched) : false;
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

export function genEmbeddedLinkTokens(
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
