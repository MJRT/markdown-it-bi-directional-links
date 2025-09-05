import MarkdownIt from "markdown-it";
import { Tag } from "./tag";

describe("PlainTag Plugin", () => {
  const md = MarkdownIt().use(
    Tag({
      url: "https://example.com/wiki/%s",
      className: "wikilink",
      render_open: "<custom>",
      render_close: "</custom>",
    })
  );

  test("parses basic #Link syntax", () => {
    const result = md.render("Here is a #TestPage.");
    expect(result.trim()).toContain(
      "<p>Here is a <custom>TestPage.</custom></p>"
    );
  });

  test("handles tags at end of sentence", () => {
    const result = md.render("Here is a #TestPage");
    expect(result.trim()).toContain(
      "<p>Here is a <custom>TestPage</custom></p>"
    );
  });

  test("does not parse # alone", () => {
    const result = md.render("This is a #");
    expect(result.trim()).toEqual("<p>This is a #</p>");
  });

  test("does parse # with allowed special chars", () => {
    const allowed = [{ char: ".", html: "." }];
    allowed.forEach(({ char, html }) => {
      const result = md.render(`This is a #${char}word.`);
      expect(result.trim()).toEqual(
        `<p>This is a <custom>${html}word.</custom></p>`
      );
    });
  });

  test("does not parse # with forbidden special chars", () => {
    const forbidden = [
      { char: "{", html: "{" },
      { char: "<", html: "&lt;" },
      { char: "|", html: "|" },
      { char: "'", html: "'" },
      { char: '"', html: "&quot;" },
      { char: "`", html: "`" },
      { char: "\\", html: "\\" },
      { char: "[", html: "[" },
      { char: "]", html: "]" },
    ];
    forbidden.forEach(({ char, html }) => {
      const result = md.render(`This is a #${char}word.`);
      expect(result.trim()).toEqual(`<p>This is a #${html}word.</p>`);
    });
  });

  test("does not parse #[[Link]] syntax", () => {
    const result = md.render("This is a #[[TestPage]].");
    expect(result.trim()).toEqual("<p>This is a #[[TestPage]].</p>");
  });

  test("uses default render if no custom provided", () => {
    const defaultMd = MarkdownIt().use(Tag({}));
    const result = defaultMd.render("Check #Google.");

    expect(result.trim()).toEqual(
      '<p>Check <a href="/notes/Google." class="md-plain-tag">Google.</a></p>'
    );
  });

  test("uses default renderer with custom url and className only", () => {
    const partialMd = MarkdownIt().use(
      Tag({
        url: "https://mywiki.org/page/%s",
        className: "custom-wiki-class",
      })
    );

    const result = partialMd.render("Go to #HomePage.");
    expect(result.trim()).toEqual(
      '<p>Go to <a href="https://mywiki.org/page/HomePage." class="custom-wiki-class">HomePage.</a></p>'
    );
  });

  test("handles multiple tags in same line", () => {
    const result = md.render("Here are #tag1 and #tag2 and #tag3.");
    expect(result.trim()).toEqual(
      "<p>Here are <custom>tag1</custom> and <custom>tag2</custom> and <custom>tag3.</custom></p>"
    );
  });

  test("handles tags with underscores and hyphens", () => {
    const result = md.render("Test #my_app and #test-page.");
    expect(result.trim()).toEqual(
      "<p>Test <custom>my_app</custom> and <custom>test-page.</custom></p>"
    );
  });

  test("handles tags with numbers", () => {
    const result = md.render("Version #v1.2 and #react3 and #2024.");
    expect(result.trim()).toEqual(
      "<p>Version <custom>v1.2</custom> and <custom>react3</custom> and <custom>2024.</custom></p>"
    );
  });

  test("handles tags at start and end of text", () => {
    const result = md.render("#startTag and endTag#");
    expect(result.trim()).toEqual(
      "<p><custom>startTag</custom> and endTag#</p>"
    );
  });

  test("handles different punctuation boundaries", () => {
    const testCases = [
      { input: "Word#tag", output: "<p>Word<custom>tag</custom></p>" },
      { input: "#tag!", output: "<p><custom>tag</custom>!</p>" },
      { input: "#tag?", output: "<p><custom>tag</custom>?</p>" },
      { input: "#tag,", output: "<p><custom>tag</custom>,</p>" },
      { input: "#tag;", output: "<p><custom>tag</custom>;</p>" },
      { input: "#tag:", output: "<p><custom>tag</custom>:</p>" },
    ];

    testCases.forEach(({ input, output }) => {
      const result = md.render(input);
      expect(result.trim()).toEqual(output);
    });
  });

  test("handles mixed case tags", () => {
    const result = md.render("Test #CamelCase and #UPPER_CASE and #lower-case.");
    expect(result.trim()).toEqual(
      "<p>Test <custom>CamelCase</custom> and <custom>UPPER_CASE</custom> and <custom>lower-case.</custom></p>"
    );
  });

  test("handles only render_open custom", () => {
    const customMd = MarkdownIt().use(
      Tag({
        render_open: "<span class='tag'>",
      })
    );
    const result = customMd.render("Here is #test.");
    expect(result.trim()).toEqual(
      '<p>Here is <span class=\'tag\'>test.</a></p>'
    );
  });

  test("handles only render_close custom", () => {
    const customMd = MarkdownIt().use(
      Tag({
        render_close: "</span>",
      })
    );
    const result = customMd.render("Here is #test.");
    expect(result.trim()).toEqual(
      '<p>Here is <a href="/notes/test." class="md-plain-tag">test.</span></p>'
    );
  });

  test("does not parse empty tag content", () => {
    const result = md.render("This is # not a tag");
    expect(result.trim()).toEqual("<p>This is # not a tag</p>");
  });

  test("handles consecutive tags", () => {
    const result = md.render("#tag1#tag2 #tag3");
    expect(result.trim()).toEqual(
      "<p>#tag1<custom>tag2</custom> <custom>tag3</custom></p>"
    );
  });
});