export const BI_DIRECTIONAL_LINK_RULE_NAME = "bi_directional_link";
export const EMBEDDED_LINK_RULE_NAME = "embedded_link";
export const TAGGED_LINK_RULE_NAME = "tagged_link";
export const TAG_RULE_NAME = "plain_tag";

export const BI_DIRECTIONAL_LINK_PATTERN =
  /\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]/y;

export const EMBEDDED_LINK_PATTERN = new RegExp(
  "!" + BI_DIRECTIONAL_LINK_PATTERN.source,
  BI_DIRECTIONAL_LINK_PATTERN.flags
);

export const TAGGED_LINK_PATTERN = new RegExp(
  "#" + BI_DIRECTIONAL_LINK_PATTERN.source,
  BI_DIRECTIONAL_LINK_PATTERN.flags
);

export const TAG_PATTERN = /#([^\s#<>\[\]|{}'"`\\,!?;:]+)(?=\s|$|[.,!?;:])/y;

