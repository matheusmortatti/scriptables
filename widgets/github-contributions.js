// GitHub Contributions Widget
// Displays a GitHub-style contribution graph for a specified user

const USERNAME = "octocat"; // Configure your GitHub username here

// Fetch contribution data from GitHub
async function fetchContributions(username) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;
  
  const url = "https://api.github.com/graphql";
  const req = new Request(url);
  req.method = "POST";
  req.headers = {
    "Content-Type": "application/json"
  };
  req.body = JSON.stringify({
    query: query,
    variables: { username: username }
  });
  
  try {
    const res = await req.loadJSON();
    
    if (res.errors) {
      console.error("GraphQL errors:", JSON.stringify(res.errors));
      return null;
    }
    
    if (!res.data || !res.data.user) {
      console.error("No user data found");
      return null;
    }
    
    return res.data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
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
  const cellSize = 8;
  const cellGap = 2;
  const cellTotal = cellSize + cellGap;
  
  // Get last 12 weeks
  const displayWeeks = weeks.slice(-12);
  const width = displayWeeks.length * cellTotal;
  const height = 7 * cellTotal;
  
  const canvas = new DrawContext();
  canvas.size = new Size(width, height);
  canvas.opaque = false;
  
  // Find max contributions for color scaling
  let maxCount = 0;
  displayWeeks.forEach(week => {
    week.contributionDays.forEach(day => {
      maxCount = Math.max(maxCount, day.contributionCount);
    });
  });
  
  // Draw cells
  displayWeeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach((day, dayIndex) => {
      const x = weekIndex * cellTotal;
      const y = dayIndex * cellTotal;
      
      const rect = new Rect(x, y, cellSize, cellSize);
      const path = new Path();
      path.addRoundedRect(rect, 2, 2);
      
      canvas.addPath(path);
      canvas.setFillColor(getContributionColor(day.contributionCount, maxCount));
      canvas.fillPath();
    });
  });
  
  return canvas.getImage();
}

// Calculate current streak
function calculateStreak(weeks) {
  const allDays = [];
  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      allDays.push(day);
    });
  });
  
  allDays.reverse();
  
  let streak = 0;
  for (const day of allDays) {
    if (day.contributionCount > 0) {
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
