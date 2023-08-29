// Helper function to convert HH:mm:ss formatted time to seconds
const timeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Helper function to convert seconds to HH:mm:ss format
const secondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const calculateCallsTransfersAndPause = (arr, ...dependencies) => {
  const dependencySet = new Set(dependencies);

  const calculateTime = (timeString) => {
    if (!timeString) return "00:00:00";
    const totalSeconds = timeString
      .split(",")
      .reduce((total, time) => total + timeToSeconds(time), 0);
    return secondsToTime(totalSeconds);
  };

  const result = Object.values(
    arr.reduce((acc, obj) => {
      const {
        name,
        calls,
        averageCalltime,
        dnd,
        pause,
        transfers,
        queueName,
      } = obj;

      if (!dependencySet.has(queueName)) {
        return acc;
      }

      const formattedPauseTime = calculateTime(pause);
      const formattedDndTime = calculateTime(dnd);

      if (acc[name]) {
        acc[name].calls += calls;
        acc[name].transfers += transfers;
        acc[name].pause = formattedPauseTime;
        acc[name].dnd = formattedDndTime;
      } else {
        acc[name] = {
          name,
          calls,
          averageCalltime,
          dnd: formattedDndTime,
          pause: formattedPauseTime,
          transfers,
          queueName,
        };
      }
      return acc;
    }, {})
  );

  return result;
};

  export function checkDateDifference(dateFrom, dateTo) {
    const twoYearsInMillis = 2 * 365 * 24 * 60 * 60 * 1000; // Two years in milliseconds
    
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    
    const dateDifference = Math.abs(toDate - fromDate);
    
    if (dateDifference > twoYearsInMillis) {
      return true
    } else {
      return false
    }
  }