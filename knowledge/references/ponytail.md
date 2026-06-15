---
type: External Reference
title: Ponytail Simplification Discipline
description: Ponytail is an agent rule set for choosing the smallest correct implementation before adding abstractions or dependencies.
resource: https://github.com/DietrichGebert/ponytail
tags: [simplification, yagni, agent, review]
timestamp: 2026-06-15T19:00:00+03:00
---

# Rule Ladder

Before writing code, prefer the first rung that works:

1. Do not build it if it is not needed.
2. Use the standard library.
3. Use native platform behavior.
4. Use an already-installed dependency.
5. Prefer one line.
6. Only then write the minimum custom code.

# Boundary

This discipline must not remove validation, data-loss prevention, security,
accessibility, or explicit project assumptions around medicines.

# Application To This Repo

* Remove unsupported UI rather than replacing it with more UI.
* Prefer native date/time controls before custom pickers.
* Keep medical timing rules centralized.
* Use an audit pass before adding abstractions.
* Track repo-specific findings in [Ponytail audit observations](../process/ponytail-audit-observations.md).

# Citations

* https://github.com/DietrichGebert/ponytail
* `C:\tmp\ponytail\skills\ponytail\SKILL.md`
* `C:\tmp\ponytail\skills\ponytail-audit\SKILL.md`
