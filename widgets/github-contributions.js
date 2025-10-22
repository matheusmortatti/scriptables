// GitHub Contributions Widget - Minimalist Grid
// Displays only the contribution grid

const USERNAME = "matheusmortatti";

async function fetchContributions(username) {
  const url = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;
  const req = new Request(url);
  
  try {
    const res = await req.loadJSON();
    
    if (!res || !res.contributions) {
      console.error("No contribution data found");
      return null;
    }
    
    return organizeIntoWeeks(res.contributions);
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

function organizeIntoWeeks(contributions) {
  if (!contributions || contributions.length === 0) {
    return [];
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
  
  return weeks;
}

function getContributionColor(count, maxCount) {
  if (count === 0) return new Color("#ffffff", 0.1);
  
  const intensity = Math.min(count / Math.max(maxCount * 0.25, 1), 1);
  
  if (intensity < 0.25) return new Color("#ffffff", 0.3);
  if (intensity < 0.5) return new Color("#ffffff", 0.5);
  if (intensity < 0.75) return new Color("#ffffff", 0.7);
  return new Color("#ffffff", 1.0);
}

function drawContributionGrid(weeks) {
  if (!weeks || weeks.length === 0) {
    const canvas = new DrawContext();
    canvas.size = new Size(100, 70);
    canvas.opaque = false;
    return canvas.getImage();
  }
  
  const cellSize = 10;
  const cellGap = 3;
  const cellTotal = cellSize + cellGap;
  
  const displayWeeks = weeks.slice(-26);
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
      path.addRoundedRect(rect, 2, 2);
      
      canvas.addPath(path);
      canvas.setFillColor(getContributionColor(day.count, maxCount));
      canvas.fillPath();
    });
  });
  
  return canvas.getImage();
}

async function createWidget() {
  const widget = new ListWidget();
  
  widget.backgroundColor = new Color("#ffffff", 0);
  widget.setPadding(16, 16, 16, 16);
  
  const weeks = await fetchContributions(USERNAME);
  
  if (!weeks || weeks.length === 0) {
    const errorText = widget.addText("No data");
    errorText.font = Font.semiboldSystemFont(14);
    errorText.textColor = new Color("#ffffff", 0.7);
    return widget;
  }
  
  const gridImage = drawContributionGrid(weeks);
  const imageElement = widget.addImage(gridImage);
  imageElement.centerAlignImage();
  
  return widget;
}

const widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();
