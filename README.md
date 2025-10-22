# Scriptable Widgets

A collection of iOS home screen widgets built with [Scriptable](https://scriptable.app), an automation app that lets you write JavaScript to interact with iOS.

## About Scriptable

Scriptable is an iOS app that enables automation and customization through JavaScript. It provides native iOS APIs for creating widgets, interacting with system features, and automating tasks. Learn more at [docs.scriptable.app](https://docs.scriptable.app/).

## Widgets

### Daily Motivational
**File:** `widgets/daily-motivational.js`

Displays an inspirational quote that changes daily, along with three progress rings showing completion percentage for:
- Current day (midnight to midnight)
- Current week (Monday to Sunday)
- Current year

**Widget Size:** Medium

### Year Progress with Quarter
**File:** `widgets/year-progress-with-quarter.js`

Shows year progress with a visual progress bar marked by quarterly milestones (Q1-Q4). Displays:
- Current year and overall percentage
- Large progress bar with quarter markers
- Days passed and days remaining

**Widget Size:** Medium

## Installation

1. Download [Scriptable from the App Store](https://apps.apple.com/us/app/scriptable/id1405459188)
2. Open Scriptable and create a new script
3. Copy the contents of the desired widget file
4. Paste into the script editor and save
5. Add a Scriptable widget to your home screen
6. Long press the widget → Edit Widget → Choose your script

## Development

These widgets are standalone JavaScript files with no external dependencies or build process. Each widget:
- Uses native Scriptable APIs (ListWidget, DrawContext, etc.)
- Implements transparent backgrounds for seamless home screen integration
- Follows a consistent white text color scheme with varying opacity
- Uses native Date objects for all time calculations

## Resources

- [Scriptable Documentation](https://docs.scriptable.app/)
- [Scriptable Community Forum](https://talk.automators.fm/c/scriptable/)
