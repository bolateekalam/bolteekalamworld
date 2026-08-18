// Continuous Streak & Daily 5-Minute Active Session Tracker Service
// bolateeworld.in / Bolti World

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

export const getUserStreakData = (userEmail = 'user') => {
  try {
    const key = `bw_streak_data_${(userEmail || 'user').toLowerCase().trim()}`;
    const raw = localStorage.getItem(key);
    const todayStr = getTodayString();
    const yestStr = getYesterdayString();

    let data = raw ? JSON.parse(raw) : {
      streak: 1,
      lastActiveDate: todayStr,
      todayActiveSeconds: 60, // start with initial activity
      todayCompleted: false,
      history: [todayStr]
    };

    // Check if missed days
    if (data.lastActiveDate !== todayStr && data.lastActiveDate !== yestStr) {
      // More than 1 day skipped: Reset streak to 1
      data.streak = 1;
      data.todayActiveSeconds = 0;
      data.todayCompleted = false;
      data.lastActiveDate = todayStr;
      localStorage.setItem(key, JSON.stringify(data));
    } else if (data.lastActiveDate === yestStr && !data.todayCompleted) {
      // New day started, reset today's active seconds
      data.todayActiveSeconds = 0;
      data.todayCompleted = false;
    }

    return data;
  } catch (e) {
    return {
      streak: 1,
      lastActiveDate: getTodayString(),
      todayActiveSeconds: 60,
      todayCompleted: false,
      history: []
    };
  }
};

// Record active engagement seconds (e.g. heartbeat every 15s)
export const logActiveTime = (userEmail = 'user', secondsToAdd = 15) => {
  try {
    const key = `bw_streak_data_${(userEmail || 'user').toLowerCase().trim()}`;
    const data = getUserStreakData(userEmail);
    const todayStr = getTodayString();
    const yestStr = getYesterdayString();

    data.todayActiveSeconds = (data.todayActiveSeconds || 0) + secondsToAdd;

    // 5 minutes = 300 seconds
    const TARGET_SECONDS = 300;

    if (data.todayActiveSeconds >= TARGET_SECONDS && !data.todayCompleted) {
      data.todayCompleted = true;

      if (data.lastActiveDate === yestStr) {
        data.streak = (data.streak || 1) + 1;
      } else if (data.lastActiveDate !== todayStr) {
        data.streak = 1;
      }

      data.lastActiveDate = todayStr;
      if (!data.history) data.history = [];
      if (!data.history.includes(todayStr)) data.history.push(todayStr);
    }

    localStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch (e) {
    return { streak: 1, todayActiveSeconds: 60, todayCompleted: false };
  }
};

// Milestone streak targets
export const STREAK_MILESTONES = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];

export const getNextMilestone = (currentStreak = 1) => {
  for (const m of STREAK_MILESTONES) {
    if (currentStreak < m) return m;
  }
  return 360;
};
