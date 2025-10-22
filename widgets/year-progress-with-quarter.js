// Year Progress Widget - Milestone Design
// Large progress bar with quarterly markers

// Calculate year progress
function getYearProgress() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const progress = (now - start) / (end - start);
  return progress;
}

// Create the widget
async function createWidget() {
  const widget = new ListWidget();
  
  // Transparent background
  widget.backgroundColor = new Color("#ffffff", 0);
  widget.setPadding(16, 16, 16, 16);
  
  // Calculate progress
  const progress = getYearProgress();
  const percentage = Math.round(progress * 100);
  const year = new Date().getFullYear();
  
  // Year title
  const titleStack = widget.addStack();
  titleStack.layoutHorizontally();
  titleStack.centerAlignContent();
  
  const yearText = titleStack.addText(`${year}`);
  yearText.font = Font.semiboldSystemFont(18);
  yearText.textColor = Color.white();
  
  titleStack.addSpacer();
  
  const percentText = titleStack.addText(`${percentage}%`);
  percentText.font = Font.boldSystemFont(18);
  percentText.textColor = Color.white();
  
  widget.addSpacer(12);
  
  // Main progress bar
  const barHeight = 16;
  const barContainer = widget.addStack();
  barContainer.layoutHorizontally();
  barContainer.backgroundColor = new Color("#ffffff", 0.2);
  barContainer.cornerRadius = barHeight / 2;
  barContainer.size = new Size(0, barHeight);
  
  // Filled portion
  const filled = barContainer.addStack();
  filled.backgroundColor = Color.white();
  filled.cornerRadius = barHeight / 2;
  
  // Calculate filled width (approximate widget width)
  const totalWidth = 280;
  const filledWidth = totalWidth * progress;
  filled.size = new Size(filledWidth, barHeight);
  
  widget.addSpacer(8);
  
  // Milestone markers
  const markerStack = widget.addStack();
  markerStack.layoutHorizontally();
  markerStack.spacing = 0;
  
  // Q1 marker
  const q1Stack = markerStack.addStack();
  q1Stack.layoutVertically();
  q1Stack.size = new Size(totalWidth * 0.25, 0);
  
  const q1Marker = q1Stack.addStack();
  q1Marker.layoutHorizontally();
  const q1Line = q1Marker.addText("│");
  q1Line.font = Font.systemFont(10);
  q1Line.textColor = progress >= 0.25 ? Color.white() : new Color("#ffffff", 0.4);
  
  const q1Label = q1Stack.addText("Q1");
  q1Label.font = Font.mediumSystemFont(9);
  q1Label.textColor = progress >= 0.25 ? Color.white() : new Color("#ffffff", 0.5);
  
  // Q2 marker
  const q2Stack = markerStack.addStack();
  q2Stack.layoutVertically();
  q2Stack.size = new Size(totalWidth * 0.25, 0);
  
  const q2Marker = q2Stack.addStack();
  q2Marker.layoutHorizontally();
  const q2Line = q2Marker.addText("│");
  q2Line.font = Font.systemFont(10);
  q2Line.textColor = progress >= 0.50 ? Color.white() : new Color("#ffffff", 0.4);
  
  const q2Label = q2Stack.addText("Q2");
  q2Label.font = Font.mediumSystemFont(9);
  q2Label.textColor = progress >= 0.50 ? Color.white() : new Color("#ffffff", 0.5);
  
  // Q3 marker
  const q3Stack = markerStack.addStack();
  q3Stack.layoutVertically();
  q3Stack.size = new Size(totalWidth * 0.25, 0);
  
  const q3Marker = q3Stack.addStack();
  q3Marker.layoutHorizontally();
  const q3Line = q3Marker.addText("│");
  q3Line.font = Font.systemFont(10);
  q3Line.textColor = progress >= 0.75 ? Color.white() : new Color("#ffffff", 0.4);
  
  const q3Label = q3Stack.addText("Q3");
  q3Label.font = Font.mediumSystemFont(9);
  q3Label.textColor = progress >= 0.75 ? Color.white() : new Color("#ffffff", 0.5);
  
  // Q4 marker
  const q4Stack = markerStack.addStack();
  q4Stack.layoutVertically();
  q4Stack.size = new Size(totalWidth * 0.25, 0);
  
  const q4Marker = q4Stack.addStack();
  q4Marker.layoutHorizontally();
  const q4Line = q4Marker.addText("│");
  q4Line.font = Font.systemFont(10);
  q4Line.textColor = progress >= 1.0 ? Color.white() : new Color("#ffffff", 0.4);
  
  const q4Label = q4Stack.addText("Q4");
  q4Label.font = Font.mediumSystemFont(9);
  q4Label.textColor = progress >= 1.0 ? Color.white() : new Color("#ffffff", 0.5);
  
  widget.addSpacer(12);
  
  // Stats section
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const daysPassed = Math.floor(progress * daysInYear);
  const daysRemaining = daysInYear - daysPassed;
  
  // Days info in horizontal layout
  const daysStack = widget.addStack();
  daysStack.layoutHorizontally();
  
  // Days passed
  const passedStack = daysStack.addStack();
  passedStack.layoutVertically();
  
  const passedNum = passedStack.addText(`${daysPassed}`);
  passedNum.font = Font.semiboldSystemFont(24);
  passedNum.textColor = Color.white();
  
  const passedLabel = passedStack.addText("days passed");
  passedLabel.font = Font.regularSystemFont(11);
  passedLabel.textColor = new Color("#ffffff", 0.6);
  
  daysStack.addSpacer();
  
  // Days remaining
  const remainingStack = daysStack.addStack();
  remainingStack.layoutVertically();
  
  const remainingNum = remainingStack.addText(`${daysRemaining}`);
  remainingNum.font = Font.semiboldSystemFont(24);
  remainingNum.textColor = Color.white();
  remainingNum.textOpacity = 0.7;
  
  const remainingLabel = remainingStack.addText("remaining");
  remainingLabel.font = Font.regularSystemFont(11);
  remainingLabel.textColor = new Color("#ffffff", 0.5);
  
  return widget;
}

// Helper function to check leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Run the widget
const widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();
