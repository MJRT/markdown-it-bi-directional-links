import MarkdownIt from "markdown-it";
import { EmbeddedLink } from "./embedded-link";

describe("EmbeddedLink Plugin", () => {
  const md = MarkdownIt().use(
    EmbeddedLink({
      url: "https://example.com/wiki/%s",
      className: "wikilink",
      render_open: "<custom>",
      render_close: "</custom>",
    })
  );

  test("parses basic ![[Link]] syntax", () => {
    const result = md.render("Here is a ![[TestPage]].");
    expect(result.trim()).toEqual(
      "<p>Here is a <custom>TestPage</custom>.</p>"
    );
  });

  test("parses ![[Link|Alias]] format", () => {
    const result = md.render("Try ![[TestPage|Click here]] now.");
    expect(result.trim()).toEqual(
      "<p>Try <custom>Click here</custom> now.</p>"
    );
  });

  test("does not parse malformed ![[Link", () => {
    const result = md.render("This is ![[Link without closing.");
    expect(result.trim()).toEqual("<p>This is ![[Link without closing.</p>");
  });

  test("does not parse ![[Link|]]", () => {
    const result = md.render("Try ![[Link|]] now.");
    expect(result.trim()).toEqual("<p>Try ![[Link|]] now.</p>");
  });

  test("does not parse ![[|Text]]", () => {
    const result = md.render("Try ![[|Text]] now.");
    expect(result.trim()).toEqual("<p>Try ![[|Text]] now.</p>");
  });

  test("does not parse ![[|]]", () => {
    const result = md.render("Try ![[|]] now.");
    expect(result.trim()).toEqual("<p>Try ![[|]] now.</p>");
  });

  test("does not parse ![[]]", () => {
    const result = md.render("Try ![[]] now.");
    expect(result.trim()).toEqual("<p>Try ![[]] now.</p>");
  });

  test("does not parse ![[Link]", () => {
    const result = md.render("Try ![[Link] now.");
    expect(result.trim()).toEqual("<p>Try ![[Link] now.</p>");
  });

  test("does not parse ![[", () => {
    const result = md.render("Try ![[ now.");
    expect(result.trim()).toEqual("<p>Try ![[ now.</p>");
  });

  test("uses default render if no custom provided", () => {
    const defaultMd = MarkdownIt().use(EmbeddedLink({}));
    const result = defaultMd.render("Check ![[Google]].");

    expect(result.trim()).toEqual(
      '<p>Check <a href="/notes/Google" class="md-embedded-link">Google</a>.</p>'
    );
  });

  test("uses default renderer with custom url and className only", () => {
    const partialMd = MarkdownIt().use(
      EmbeddedLink({
        url: "https://mywiki.org/page/%s",
        className: "custom-wiki-class",
      })
    );

    const result = partialMd.render("Go to ![[HomePage]].");
    expect(result.trim()).toEqual(
      '<p>Go to <a href="https://mywiki.org/page/HomePage" class="custom-wiki-class">HomePage</a>.</p>'
    );
  });
});
