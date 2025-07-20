# 🔗 markdown-it-bi-directional-links

A lightweight, high-performance plugin for [markdown-it](https://github.com/markdown-it/markdown-it) that adds support for bi-directional linking using double-bracket and tag-style syntax—just like in Obsidian and Logseq.

## ✨ Features

- ⚙️ **Pure TypeScript**: Zero dependencies, works in any JavaScript environment (Node.js, Browser, ReactNative, etc.)
- 🚀 **High Performance**: Designed for real-time rendering with minimal overhead
- 🔄 **Multi-style Support**: Compatible with Obsidian-style embeds and Logseq-style tags

## 🧠 Purpose

This plugin extends markdown-it to recognize and render bi-directional link syntax, enabling knowledge graph-style linking in your markdown documents.

## 🔍 Supported Syntax

| Syntax                                                            | Description                     | Status     |
| ----------------------------------------------------------------- | ------------------------------- | ---------- |
| `[[content]]`                                                     | Popular wiki-style link         | ✅ Done    |
| `#content, #[[content]]`                                          | Logseq-style tagged link        | ✅ Done    |
| `[[content\|alias]], #[[content\|alias]], ![[content\|alias]]`    | Display alias text              | ✅ Done    |
| `![[content]]`                                                    | Obsidian-style embedded content | 🚧 Doing   |

> `![[content]]` is currently recognized but lacks a dedicated rendering module. Its default behavior is the same as `[[content]]`. You can specify a custom module via parameters.


## 📦 Installation

```bash
pnpm install markdown-it-bi-directional-links
```

## ⚠️ Important Notes

- ✅ The plugin is ready to use out of the box after installation.

- 🔍 By default, all links (e.g., [[content]]) are displayed as local links, such as `/notes/content`. 

- 🛠️ Recommended: You should override the default renderer to generate internal links, route paths, or custom HTML/Component depending on your application.

## 🤝 Contributing

Pull requests and issues are welcome! Please follow the coding style and include tests where applicable.

## 📄 License

MIT License © 2025 mjrt