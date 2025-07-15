import MarkdownIt from 'markdown-it';
import { TaggedLink } from './tagged-link';

describe('TaggedLink Plugin', () => {
  const md = MarkdownIt().use(TaggedLink({
    url: 'https://example.com/wiki/%s',
    className: 'wikilink',
    render_open: '<custom>',
    render_close: '</custom>'
  }));

  test('parses basic #Link syntax', () => {
    const result = md.render('Here is a #TestPage.');
    expect(result).toContain('<custom>');
    expect(result).toContain('</custom>');
    expect(result).toContain('TestPage.');
  });

  test('parses basic #[[Link]] syntax', () => {
    const result = md.render('Here is a #[[TestPage]].');
    expect(result).toContain('<custom>');
    expect(result).toContain('</custom>');
    expect(result).toContain('TestPage');
  });

  test('parses #[[Link|Text]] format', () => {
    const result = md.render('Try #[[TestPage|Click here]] now.');
    expect(result).toContain('<custom>');
    expect(result).toContain('</custom>');
    expect(result).toContain('Click here');
    expect(result).not.toContain('TestPage');
  });

  test('does not parses #[[Link', () => {
    const result = md.render('This is #[[Link without closing.');
    expect(result).not.toContain('<custom>');
    expect(result).not.toContain('</custom>');
    expect(result).toContain('#[[Link');
  });
  
  test('does not parses #[[Link]', () => {
    const result = md.render('This is #[[Link] without closing.');
    expect(result).not.toContain('<custom>');
    expect(result).not.toContain('</custom>');
    expect(result).toContain('#[[Link');
  });

  test('does not parses #[Link]]', () => {
    const result = md.render('Here is a #[Link]].');
    expect(result).not.toContain('<custom>');
    expect(result).not.toContain('</custom>');
    expect(result).toContain('#[Link]].');
  });

  test('does not parses #[[Link|]]', () => {
    const result = md.render('Try #[[TestPage|]] now.');
    expect(result).not.toContain('<custom>');
    expect(result).not.toContain('</custom>');
    expect(result).toContain('TestPage');
  });

  test('does not parse malformed [[Link', () => {
    const result = md.render('This is [[Link without closing.');
    expect(result).toContain('[[Link without closing.');
  });

  test('uses default render if no custom provided', () => {
    const defaultMd = MarkdownIt().use(TaggedLink({}));
    const result = defaultMd.render('Check #[[Google]].');
  
    expect(result.trim()).toBe(
      '<p>Check <a href="/notes/Google" class="tagged-link">Google</a>.</p>'
    );
  });

  test('uses default renderer with custom url and className only', () => {
    const partialMd = MarkdownIt().use(TaggedLink({
      url: 'https://mywiki.org/page/%s',
      className: 'custom-wiki-class',
    }));
  
    const result = partialMd.render('Go to #[[HomePage]].');
    expect(result.trim()).toBe(
      '<p>Go to <a href="https://mywiki.org/page/HomePage" class="custom-wiki-class">HomePage</a>.</p>'
    );
  });  
});