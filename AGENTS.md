# Agent Guidelines for Scriptable Widgets

## Project Overview
iOS Scriptable app widgets written in JavaScript. No build/test/lint infrastructure.

## Code Style
- **Language**: JavaScript (ES6+)
- **Comments**: Brief header comments for files/functions explaining purpose
- **Naming**: camelCase for functions/variables, UPPERCASE for constants
- **Functions**: Pure helper functions for calculations, async for widget creation
- **Formatting**: 2-space indentation, semicolons required
- **Imports**: None - all code self-contained in single files

## Widget Structure
- Transparent backgrounds: `new Color("#ffffff", 0)`
- Standard padding: `widget.setPadding(16, 16, 16, 16)`
- Font hierarchy: bold/semibold for headers (10-18pt), regular for content (11-24pt)
- Color scheme: White text with varying opacity (0.4-1.0)
- Layout: Stack-based (ListWidget, layoutHorizontally/Vertically)

## Conventions
- Entry point: `await createWidget()` -> `Script.setWidget()` or `.presentMedium()`
- Always end with `Script.complete()`
- Date calculations: Use native Date objects, no external libraries
- Canvas drawing: DrawContext for custom graphics with manual arc approximation
