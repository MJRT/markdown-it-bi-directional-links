# 🔗 markdown-it-bi-directional-links

A lightweight, high-performance plugin for [markdown-it](https://github.com/markdown-it/markdown-it) that adds support for bi-directional linking using double-bracket and tag-style syntax—just like in Obsidian and Logseq.

## ✨ Features

- ⚙️ **Pure TypeScript**: Zero dependencies, works in any JavaScript environment (Node.js, Browser, ReactNative, etc.)
- 🚀 **High Performance**: Designed for real-time rendering with minimal overhead
- 🔄 **Multi-style Support**: Compatible with Obsidian-style embeds and Logseq-style tags

## 🧠 Purpose

This plugin extends markdown-it to recognize and render bi-directional link syntax, enabling knowledge graph-style linking in your markdown documents.

## 🔍 Supported Syntax

| Syntax                   | Description                     | Status     |
| ------------------------ | ------------------------------- | ---------- |
| `[[content]]`            | Popular wiki-style link         | ✅ Done    |
| `![[content]]`           | Obsidian-style embedded content | ⏳ Planned |
| `#content, #[[content]]` | Logseq-style tag                | ⏳ Planned |

## 📦 Installation

```bash
pnpm install markdown-it-bi-directional-links
```

## ⚠️ Important Notes

- ✅ The plugin is ready to use out of the box after installation.

- 🔍 Default behavior: All links ([[content]], etc.) are rendered as Google search links.

- 🛠️ Recommended: You should override the default renderer to generate internal links, route paths, or custom HTML/Component depending on your application.

## 🤝 Contributing

Pull requests and issues are welcome! Please follow the coding style and include tests where applicable.

## 📄 License

MIT License © 2025 mjrt