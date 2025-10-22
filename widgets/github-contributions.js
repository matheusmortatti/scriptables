// GitHub Contributions Widget
// Displays a GitHub-style contribution graph for a specified user

const USERNAME = "matheusmortatti"; // Configure your GitHub username here

// Fetch contribution data from GitHub
async function fetchContributions(username) {
  const url = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;
  const req = new Request(url);
  
  try {
    const res = await req.loadJSON();
    
    if (!res || !res.contributions) {
      console.error("No contribution data found");
      return null;
    }
    
    return organizeIntoWeeks(res.contributions, res.total.lastYear);
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// Organize contributions into weeks (Sunday to Saturday)
function organizeIntoWeeks(contributions, totalContributions) {
  if (!contributions || contributions.length === 0) {
    return { totalContributions: 0, weeks: [] };
  }
  
  const firstDate = new Date(contributions[0].date);
  const firstDayOfWeek = firstDate.getDay();
  
  const weeks = [];
  let currentWeek = [];
  
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: "", count: 0, level: 0 });
  }
  
  contributions.forEach(day => {
    currentWeek.push(day);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(currentWeek);
  }
  
  return {
    totalContributions: totalContributions,
    weeks: weeks
  };
}

// Get color for contribution count
function getContributionColor(count, maxCount) {
  if (count === 0) return new Color("#ffffff", 0.1);
  
  const intensity = Math.min(count / Math.max(maxCount * 0.25, 1), 1);
  
  if (intensity < 0.25) return new Color("#ffffff", 0.3);
  if (intensity < 0.5) return new Color("#ffffff", 0.5);
  if (intensity < 0.75) return new Color("#ffffff", 0.7);
  return new Color("#ffffff", 1.0);
}

// Draw contribution grid
function drawContributionGrid(weeks) {
  if (!weeks || weeks.length === 0) {
    const canvas = new DrawContext();
    canvas.size = new Size(100, 70);
    canvas.opaque = false;
    return canvas.getImage();
  }
  
  const cellSize = 7;
  const cellGap = 2;
  const cellTotal = cellSize + cellGap;
  
  const displayWeeks = weeks.slice(-17);
  const numWeeks = displayWeeks.length;
  const width = numWeeks * cellTotal - cellGap;
  const height = 7 * cellTotal - cellGap;
  
  const canvas = new DrawContext();
  canvas.size = new Size(width, height);
  canvas.opaque = false;
  canvas.respectScreenScale = true;
  
  let maxCount = 0;
  displayWeeks.forEach(week => {
    week.forEach(day => {
      if (day.count > 0) {
        maxCount = Math.max(maxCount, day.count);
      }
    });
  });
  
  displayWeeks.forEach((week, weekIndex) => {
    week.forEach((day, dayIndex) => {
      const x = weekIndex * cellTotal;
      const y = dayIndex * cellTotal;
      
      const rect = new Rect(x, y, cellSize, cellSize);
      const path = new Path();
      path.addRoundedRect(rect, 1.5, 1.5);
      
      canvas.addPath(path);
      canvas.setFillColor(getContributionColor(day.count, maxCount));
      canvas.fillPath();
    });
  });
  
  return canvas.getImage();
}

// Calculate current streak
function calculateStreak(weeks) {
  const allDays = [];
  weeks.forEach(week => {
    week.forEach(day => {
      if (day.date) {
        allDays.push(day);
      }
    });
  });
  
  allDays.reverse();
  
  let streak = 0;
  for (const day of allDays) {
    if (day.count > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Create the widget
async function createWidget() {
  const widget = new ListWidget();
  
  widget.backgroundColor = new Color("#ffffff", 0);
  widget.setPadding(16, 16, 16, 16);
  
  // Fetch data
  const calendar = await fetchContributions(USERNAME);
  
  if (!calendar) {
    const errorText = widget.addText("Failed to load contributions");
    errorText.font = Font.semiboldSystemFont(14);
    errorText.textColor = new Color("#ffffff", 0.7);
    return widget;
  }
  
  // Header
  const headerStack = widget.addStack();
  headerStack.layoutHorizontally();
  headerStack.centerAlignContent();
  
  const titleText = headerStack.addText("@" + USERNAME);
  titleText.font = Font.semiboldSystemFont(16);
  titleText.textColor = Color.white();
  
  headerStack.addSpacer();
  
  const totalText = headerStack.addText(`${calendar.totalContributions}`);
  totalText.font = Font.boldSystemFont(16);
  totalText.textColor = Color.white();
  
  widget.addSpacer(8);
  
  // Contribution grid
  const gridImage = drawContributionGrid(calendar.weeks);
  const imageElement = widget.addImage(gridImage);
  imageElement.imageSize = new Size(0, 70);
  imageElement.leftAlignImage();
  
  widget.addSpacer(8);
  
  // Stats
  const statsStack = widget.addStack();
  statsStack.layoutHorizontally();
  statsStack.spacing = 16;
  
  // Total contributions
  const totalStack = statsStack.addStack();
  totalStack.layoutVertically();
  
  const totalLabel = totalStack.addText("contributions");
  totalLabel.font = Font.regularSystemFont(10);
  totalLabel.textColor = new Color("#ffffff", 0.6);
  
  const totalValue = totalStack.addText(`this year`);
  totalValue.font = Font.regularSystemFont(10);
  totalValue.textColor = new Color("#ffffff", 0.5);
  
  statsStack.addSpacer();
  
  // Current streak
  const streak = calculateStreak(calendar.weeks);
  const streakStack = statsStack.addStack();
  streakStack.layoutVertically();
  
  const streakNum = streakStack.addText(`${streak} days`);
  streakNum.font = Font.semiboldSystemFont(12);
  streakNum.textColor = streak > 0 ? Color.white() : new Color("#ffffff", 0.5);
  
  const streakLabel = streakStack.addText("current streak");
  streakLabel.font = Font.regularSystemFont(10);
  streakLabel.textColor = new Color("#ffffff", 0.6);
  
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
