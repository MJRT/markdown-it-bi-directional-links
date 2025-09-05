import MarkdownIt from "markdown-it";
import { TaggedLink } from "./tagged-link";

describe("TaggedLink Plugin", () => {
  const md = MarkdownIt().use(
    TaggedLink({
      url: "https://example.com/wiki/%s",
      className: "wikilink",
      render_open: "<custom>",
      render_close: "</custom>",
    })
  );

  test("parses basic #[[Link]] syntax", () => {
    const result = md.render("Here is a #[[TestPage]].");
    expect(result.trim()).toEqual(
      "<p>Here is a <custom>TestPage</custom>.</p>"
    );
  });

  test("parses #[[Link|Text]] format", () => {
    const result = md.render("Try #[[TestPage|Click here]] now.");
    expect(result.trim()).toEqual(
      "<p>Try <custom>Click here</custom> now.</p>"
    );
  });

  test("does not parses #[[Link", () => {
    const result = md.render("This is #[[Link without closing.");
    expect(result.trim()).toEqual("<p>This is #[[Link without closing.</p>");
  });

  test("does not parses #[[Link]", () => {
    const result = md.render("This is #[[Link] without closing.");
    expect(result.trim()).toContain("<p>This is #[[Link] without closing.</p>");
  });

  test("does not parses #[Link]]", () => {
    const result = md.render("Here is a #[Link]].");
    expect(result.trim()).toEqual("<p>Here is a #[Link]].</p>");
  });

  test("does not parses #[[Link|]]", () => {
    const result = md.render("Try #[[TestPage|]] now.");
    expect(result.trim()).toEqual("<p>Try #[[TestPage|]] now.</p>");
  });

  test("does not parse malformed [[Link", () => {
    const result = md.render("This is [[Link without closing.");
    expect(result.trim()).toEqual("<p>This is [[Link without closing.</p>");
  });

  test("uses default render if no custom provided", () => {
    const defaultMd = MarkdownIt().use(TaggedLink({}));
    const result = defaultMd.render("Check #[[Google]].");

    expect(result.trim()).toEqual(
      '<p>Check <a href="/notes/Google" class="md-tagged-link">Google</a>.</p>'
    );
  });

  test("uses default renderer with custom url and className only", () => {
    const partialMd = MarkdownIt().use(
      TaggedLink({
        url: "https://mywiki.org/page/%s",
        className: "custom-wiki-class",
      })
    );

    const result = partialMd.render("Go to #[[HomePage]].");
    expect(result.trim()).toEqual(
      '<p>Go to <a href="https://mywiki.org/page/HomePage" class="custom-wiki-class">HomePage</a>.</p>'
    );
  });

  test("does not parse #Link syntax (PlainTag responsibility)", () => {
    const result = md.render("This is a #plainTag.");
    expect(result.trim()).toEqual("<p>This is a #plainTag.</p>");
  });

  test("does not parse #[[|Text]]", () => {
    const result = md.render("Try #[[|Text]] now.");
    expect(result.trim()).toEqual("<p>Try #[[|Text]] now.</p>");
  });

  test("does not parse #[[|]]", () => {
    const result = md.render("Try #[[|]] now.");
    expect(result.trim()).toEqual("<p>Try #[[|]] now.</p>");
  });

  test("does not parse #[[]]", () => {
    const result = md.render("Try #[[]] now.");
    expect(result.trim()).toEqual("<p>Try #[[]] now.</p>");
  });

  test("handles multiple bracket tags in same line", () => {
    const result = md.render("See #[[Page1]] and #[[Page2|Alias]] for more.");
    expect(result.trim()).toEqual(
      "<p>See <custom>Page1</custom> and <custom>Alias</custom> for more.</p>"
    );
  });

  test("handles bracket tags with special characters in content", () => {
    const result = md.render("Test #[[My-Page_1]] and #[[CamelCase]].");
    expect(result.trim()).toEqual(
      "<p>Test <custom>My-Page_1</custom> and <custom>CamelCase</custom>.</p>"
    );
  });

  test("handles bracket tags with special characters in alias", () => {
    const result = md.render("Try #[[ComplexPage|Click_Here-Now]] please.");
    expect(result.trim()).toEqual(
      "<p>Try <custom>Click_Here-Now</custom> please.</p>"
    );
  });

  test("handles bracket tags at start and end of text", () => {
    const result = md.render("[[StartPage]] and [[EndPage]]");
    expect(result.trim()).toEqual(
      "<p>[[StartPage]] and [[EndPage]]</p>"
    );
  });

  test("handles only render_open custom for bracket tags", () => {
    const customMd = MarkdownIt().use(
      TaggedLink({
        render_open: "<span class='bracket-link'>",
      })
    );
    const result = customMd.render("Test #[[Link]].");
    expect(result.trim()).toEqual(
      '<p>Test <span class=\'bracket-link\'>Link</a>.</p>'
    );
  });

  test("handles only render_close custom for bracket tags", () => {
    const customMd = MarkdownIt().use(
      TaggedLink({
        render_close: "</span>",
      })
    );
    const result = customMd.render("Test #[[Link]].");
    expect(result.trim()).toEqual(
      '<p>Test <a href="/notes/Link" class="md-tagged-link">Link</span>.</p>'
    );
  });

  test("does not parse bracket tags with empty content", () => {
    const result = md.render("Test #[[]] and #[[|]].");
    expect(result.trim()).toEqual("<p>Test #[[]] and #[[|]].</p>");
  });

  test("handles consecutive bracket tags", () => {
    const result = md.render("[[Page1]][[Page2]] #[[Page3]]");
    expect(result.trim()).toEqual(
      "<p>[[Page1]][[Page2]] <custom>Page3</custom></p>"
    );
  });
});
