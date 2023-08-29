export function calculateDND(array) {
    const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday (0 = Sunday, 6 = Saturday)

    const filteredArray = array.filter((obj) => {
      const startTime = new Date(obj.startTime);
      const endTime = new Date(obj.endTime);

      // Check if it's a weekday and within the time range
      if (
        weekdays.includes(startTime.getUTCDay()) &&
        startTime.getUTCHours() >= 7 &&
        startTime.getUTCHours() <= 15
      ) {
        return true;
      }

      // Check if it's a weekday and endTime is within the time range
      if (
        weekdays.includes(endTime.getUTCDay()) &&
        endTime.getUTCHours() >= 7 &&
        endTime.getUTCHours() <= 15
      ) {
        return true;
      }

      return false;
    });

    filteredArray.forEach((obj) => {
      const startTime = new Date(obj.startTime);
      const endTime = new Date(obj.endTime);

      if (
        weekdays.includes(startTime.getUTCDay()) &&
        startTime.getUTCHours() >= 7 &&
        startTime.getUTCHours() <= 15
      ) {
        const diff = endTime.getTime() - startTime.getTime();
        const seconds = Math.floor(diff / 1000);
        const dnd = new Date(seconds * 1000).toISOString().substr(11, 8);
        obj.dnd = dnd;
      } else if (
        weekdays.includes(endTime.getUTCDay()) &&
        endTime.getUTCHours() >= 7 &&
        endTime.getUTCHours() <= 15
      ) {
        const diff = endTime.getTime() - startTime.getTime();
        const seconds = Math.floor(diff / 1000);
        const dnd = new Date(seconds * 1000).toISOString().substr(11, 8);
        obj.dnd = dnd;
      }
    });

    return filteredArray;
  }

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

export const calculateCallsTransfersAndPause = (arr, dep1 = null, dep2 = null, dep3 = null, dep4 = null, dep5 = null) => {
  const result = Object.values(
    arr
      .filter((item) => item.queueName.includes(dep1) || item.queueName.includes(dep2) || item.queueName.includes(dep3) || item.queueName.includes(dep4) || item.queueName.includes(dep5))
      .reduce((acc, obj) => {
        const {
          name,
          calls,
          averageCalltime,
          dnd,
          pause,
          transfers,
          queueName,
        } = obj;

        const pauseInSeconds = pause ? pause.split(",").reduce((total, time) => total + timeToSeconds(time), 0) : 0;
        const formattedPauseTime = secondsToTime(pauseInSeconds);

        const dndInSeconds = dnd ? dnd.split(",").reduce((total, time) => total + timeToSeconds(time), 0) : 0;
        const formattedDndTime = secondsToTime(dndInSeconds)

        if (acc[name]) {
          acc[name].calls += calls;
          acc[name].transfers += transfers;
          acc[name].pause = formattedPauseTime;
          acc[name].dnd = formattedDndTime
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