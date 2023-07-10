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

  // Denne funktion vil tage arrayet med objects og summer alle "calls" og "transfers" og laver et nyt array med de nye data.
  export const calculateCallsTransfers = (arr, dep1 = null, dep2 = null, dep3 = null, dep4 = null, dep5 = null) => Object.values(
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

        if (acc[name]) {
          acc[name].calls += calls;
          acc[name].transfers += transfers;
        } else {
          acc[name] = {
            name,
            calls,
            averageCalltime,
            dnd,
            pause,
            transfers,
            queueName,
          };
        }
        return acc;
      }, {})
  );