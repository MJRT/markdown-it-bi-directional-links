export const BI_DIRECTIONAL_LINK_RULE_NAME = "bi_directional_link";
export const EMBEDDED_LINK_RULE_NAME = "embedded_link";
export const TAGGED_LINK_RULE_NAME = "tagged_link";

export const BI_DIRECTIONAL_LINK_PATTERN =
  /\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]/y;

export const EMBEDDED_LINK_PATTERN = new RegExp(
  "!" + BI_DIRECTIONAL_LINK_PATTERN.source,
  BI_DIRECTIONAL_LINK_PATTERN.flags
);

export const TAGGED_BRACKET_LINK_PATTERN = new RegExp(
  "#" + BI_DIRECTIONAL_LINK_PATTERN.source,
  BI_DIRECTIONAL_LINK_PATTERN.flags
);

export const TAGGED_PLAIN_PATTERN = /#([^\s#<>\[\]|{}'"\`\\]+)(?=\s|$)/y;

export const TAGGED_LINK_PATTERN = new RegExp(
  [
    "#",
    "(?:",
    TAGGED_BRACKET_LINK_PATTERN.source.replace(/^#/, ""),
    "|",
    TAGGED_PLAIN_PATTERN.source.replace(/^#/, ""),
    ")",
  ].join(""),
  TAGGED_BRACKET_LINK_PATTERN.flags
);
