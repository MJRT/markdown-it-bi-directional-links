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

  test("parses basic #Link syntax", () => {
    const result = md.render("Here is a #TestPage.");
    expect(result.trim()).toContain(
      "<p>Here is a <custom>TestPage.</custom></p>"
    );
  });

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

  test("does not parse # alone", () => {
    const result = md.render("This is a #");
    expect(result.trim()).toEqual("<p>This is a #</p>");
  });

  test("does parse # with special chars", () => {
    const specials = [{ char: ".", html: "." }];
    specials.forEach(({ char, html }) => {
      const result = md.render(`This is a #${char}word.`);
      expect(result.trim()).toEqual(
        `<p>This is a <custom>${html}word.</custom></p>`
      );
    });
  });

  test("does not parse # with special chars", () => {
    const specials = [
      { char: "{", html: "{" },
      { char: "<", html: "&lt;" },
      { char: "|", html: "|" },
      { char: "'", html: "'" },
      { char: '"', html: "&quot;" },
      { char: "`", html: "`" },
      { char: "\\", html: "\\" },
    ];
    specials.forEach(({ char, html }) => {
      const result = md.render(`This is a #${char}word.`);
      expect(result.trim()).toEqual(`<p>This is a #${html}word.</p>`);
    });
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
});
