---
type: External Reference
title: Open Knowledge Format
description: OKF is a vendor-neutral markdown and YAML-frontmatter format for human- and agent-readable knowledge bundles.
resource: https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf
tags: [okf, knowledge-graph, markdown, google]
timestamp: 2026-06-15T19:00:00+03:00
---

# What We Use

This bundle follows the OKF shape:

* one concept per Markdown file,
* YAML frontmatter for type, title, description, resource, tags, and timestamp,
* standard Markdown links as graph edges,
* `index.md` files for progressive disclosure,
* `log.md` for chronological change history.

# Local Choice

We use relative Markdown links rather than root-absolute links. This keeps the
bundle easy to browse on GitHub, visible in Obsidian graph view, and compatible
with the reference visualizer's relative-link extraction.

# Visualization

The Google reference implementation includes a `visualize` subcommand that
turns an OKF bundle into a self-contained HTML graph view. This project uses
Obsidian as the maintained graph surface, so `knowledge/viz.html` is treated as
an optional generated artifact rather than source knowledge.

# Citations

* https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing
* https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf
* https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md
