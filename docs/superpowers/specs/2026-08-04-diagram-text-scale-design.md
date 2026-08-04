# Diagram text scale — design

## Goal

Shrink diagram text only on **short** boards (móvil/tablet). Laptop and desktop demos stay at authored size.

## Scale

`--diagram-text-scale = height ≥ 400 ? 1 : clamp(0.7, height/400, 1)`

| Board | Scale |
| --- | --- |
| Laptop / desktop (incl. demos) | **1.0** |
| Mobile / tablet stacked (~270px) | **0.7** |

## Codex justifications (related layout fix)

Fixed `height: 8rem` left empty space under short justification content. Now `height: auto; max-height: 8rem; margin-top: auto` so the diagram surface fills the column.
