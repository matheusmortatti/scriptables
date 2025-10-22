// Daily Motivation Widget
// Inspirational quote + progress rings for day, week, and year

// Motivational quotes array
const quotes = [
  "Every day is a fresh start.",
  "Progress, not perfection.",
  "Small steps every day.",
  "You're capable of amazing things.",
  "Make today count.",
  "Believe in yourself.",
  "Keep moving forward.",
  "Your only limit is you.",
  "Dream big, start small.",
  "Embrace the journey.",
  "Stay focused and never give up.",
  "The best time is now.",
  "You are enough.",
  "Create your own sunshine.",
  "Be fearless in pursuit of your goals.",
  "Growth happens outside comfort zones.",
  "Consistency is key.",
  "Today's efforts, tomorrow's results.",
  "You've got this.",
  "Be the energy you want to attract.",
  "Start where you are.",
  "Trust the process.",
  "Make it happen.",
  "You're stronger than you think.",
  "One day at a time.",
  "Rise and shine.",
  "Positive mind, positive life.",
  "Your potential is endless.",
  "Keep going, you're doing great.",
  "Success is a journey."
];

// Get quote for today
function getTodayQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return quotes[dayOfYear % quotes.length];
}

// Calculate day progress (midnight to midnight)
function getDayProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return (now - start) / (end - start);
}

// Calculate week progress (Monday to Sunday)
function getWeekProgress() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);
  
  return (now - monday) / (sunday - monday);
}

// Calculate year progress
function getYearProgress() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  return (now - start) / (end - start);
}

// Draw a simple progress bar
function drawProgressBar(progress, color) {
  const width = 60;
  const height = 60;
  const lineWidth = 6;
  
  const canvas = new DrawContext();
  canvas.size = new Size(width, height);
  canvas.opaque = false;
  
  const center = new Point(width / 2, height / 2);
  const radius = (width - lineWidth) / 2;
  
  // Draw background circle using ellipse
  const bgRect = new Rect(lineWidth / 2, lineWidth / 2, width - lineWidth, height - lineWidth);
  const bgPath = new Path();
  bgPath.addEllipse(bgRect);
  canvas.addPath(bgPath);
  canvas.setStrokeColor(new Color("#ffffff", 0.15));
  canvas.setLineWidth(lineWidth);
  canvas.strokePath();
  
  // Draw progress arc using lines (approximation)
  if (progress > 0) {
    const segments = 100;
    const progressSegments = Math.floor(segments * progress);
    
    for (let i = 0; i < progressSegments; i++) {
      const startAngle = -Math.PI / 2 + (i / segments) * 2 * Math.PI;
      const endAngle = -Math.PI / 2 + ((i + 1) / segments) * 2 * Math.PI;
      
      const startX = center.x + radius * Math.cos(startAngle);
      const startY = center.y + radius * Math.sin(startAngle);
      const endX = center.x + radius * Math.cos(endAngle);
      const endY = center.y + radius * Math.sin(endAngle);
      
      const linePath = new Path();
      linePath.move(new Point(startX, startY));
      linePath.addLine(new Point(endX, endY));
      canvas.addPath(linePath);
      canvas.setStrokeColor(color);
      canvas.setLineWidth(lineWidth);
      canvas.strokePath();
    }
  }
  
  return canvas.getImage();
}

// Create the widget
async function createWidget() {
  const widget = new ListWidget();
  
  // Transparent background
  widget.backgroundColor = new Color("#ffffff", 0);
  widget.setPadding(16, 16, 16, 16);
  
  // Get data
  const quote = getTodayQuote();
  const dayProgress = getDayProgress();
  const weekProgress = getWeekProgress();
  const yearProgress = getYearProgress();
  
  // Date
  const now = new Date();
  const dateFormatter = new DateFormatter();
  dateFormatter.dateFormat = "EEEE, MMM d";
  const dateString = dateFormatter.string(now);
  
  const dateText = widget.addText(dateString.toUpperCase());
  dateText.font = Font.boldSystemFont(11);
  dateText.textColor = new Color("#ffffff", 0.7);
  dateText.letterSpacing = 0.5;
  
  widget.addSpacer(12);
  
  // Quote
  const quoteText = widget.addText(`"${quote}"`);
  quoteText.font = Font.mediumSystemFont(16);
  quoteText.textColor = Color.white();
  quoteText.minimumScaleFactor = 0.8;
  
  widget.addSpacer();
  
  // Progress rings section
  const ringsContainer = widget.addStack();
  ringsContainer.layoutHorizontally();
  ringsContainer.centerAlignContent();
  ringsContainer.spacing = 16;
  
  // Day progress
  const dayStack = ringsContainer.addStack();
  dayStack.layoutVertically();
  dayStack.centerAlignContent();
  
  const dayRing = drawProgressBar(dayProgress, Color.white());
  const dayImage = dayStack.addImage(dayRing);
  dayImage.imageSize = new Size(60, 60);
  
  dayStack.addSpacer(4);
  
  const dayLabel = dayStack.addText("DAY");
  dayLabel.font = Font.semiboldSystemFont(10);
  dayLabel.textColor = new Color("#ffffff", 0.7);
  dayLabel.centerAlignText();
  
  const dayPercent = dayStack.addText(`${Math.round(dayProgress * 100)}%`);
  dayPercent.font = Font.regularSystemFont(12);
  dayPercent.textColor = Color.white();
  dayPercent.centerAlignText();
  
  ringsContainer.addSpacer();
  
  // Week progress
  const weekStack = ringsContainer.addStack();
  weekStack.layoutVertically();
  weekStack.centerAlignContent();
  
  const weekRing = drawProgressBar(weekProgress, new Color("#ffffff", 0.9));
  const weekImage = weekStack.addImage(weekRing);
  weekImage.imageSize = new Size(60, 60);
  
  weekStack.addSpacer(4);
  
  const weekLabel = weekStack.addText("WEEK");
  weekLabel.font = Font.semiboldSystemFont(10);
  weekLabel.textColor = new Color("#ffffff", 0.7);
  weekLabel.centerAlignText();
  
  const weekPercent = weekStack.addText(`${Math.round(weekProgress * 100)}%`);
  weekPercent.font = Font.regularSystemFont(12);
  weekPercent.textColor = Color.white();
  weekPercent.centerAlignText();
  
  ringsContainer.addSpacer();
  
  // Year progress
  const yearStack = ringsContainer.addStack();
  yearStack.layoutVertically();
  yearStack.centerAlignContent();
  
  const yearRing = drawProgressBar(yearProgress, new Color("#ffffff", 0.8));
  const yearImage = yearStack.addImage(yearRing);
  yearImage.imageSize = new Size(60, 60);
  
  yearStack.addSpacer(4);
  
  const yearLabel = yearStack.addText("YEAR");
  yearLabel.font = Font.semiboldSystemFont(10);
  yearLabel.textColor = new Color("#ffffff", 0.7);
  yearLabel.centerAlignText();
  
  const yearPercent = yearStack.addText(`${Math.round(yearProgress * 100)}%`);
  yearPercent.font = Font.regularSystemFont(12);
  yearPercent.textColor = Color.white();
  yearPercent.centerAlignText();
  
  widget.addSpacer(8);
  
  return widget;
}

// Run the widget
const widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();
