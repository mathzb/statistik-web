export function calculateCallsTransfersAndPause(inputData, ...dependencies) {
  const dependencySet = new Set(dependencies);

  // Iterate through dependencies and add them to the set
  dependencySet.add(...dependencies);

  return inputData.reduce((result, currentItem) => {
    const { name, calls, transfers, pause, dnd, queueName, ...rest } =
      currentItem;

    // Check if any of the dependencies are found in the queueName
    const hasMatchingDependency = dependencies.some((dep) =>
      queueName.includes(dep)
    );

    if (!hasMatchingDependency) {
      return result;
    }

    const existingEntry = result.find((entry) => entry.name === name);

    if (existingEntry) {
      existingEntry.calls += calls;
      existingEntry.transfers += transfers;

      if (pause) {
        const pauseInSeconds = pause.split(":").reduce((acc, val, index) => {
          return (
            acc + parseInt(val) * (index === 0 ? 3600 : index === 1 ? 60 : 1)
          );
        }, 0);

        const totalPauseInSeconds = existingEntry.pause
          .split(":")
          .reduce((acc, val, index) => {
            return (
              acc + parseInt(val) * (index === 0 ? 3600 : index === 1 ? 60 : 1)
            );
          }, 0);

        const totalPause = totalPauseInSeconds + pauseInSeconds;

        const hours = Math.floor(totalPause / 3600);
        const minutes = Math.floor((totalPause % 3600) / 60);
        const secondsLeft = totalPause % 60;
        // existingEntry.pause = formatTime(totalPause);
        existingEntry.pause = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
      }

      if (dnd) {
        const dndInSeconds = dnd.split(":").reduce((acc, val, index) => {
          return (
            acc + parseInt(val) * (index === 0 ? 3600 : index === 1 ? 60 : 1)
          );
        }, 0);

        const totalDndInSeconds = existingEntry.dnd
          .split(":")
          .reduce((acc, val, index) => {
            return (
              acc + parseInt(val) * (index === 0 ? 3600 : index === 1 ? 60 : 1)
            );
          }, 0);

        const totalDnd = totalDndInSeconds + dndInSeconds;

        const hours = Math.floor(totalDnd / 3600);
        const minutes = Math.floor((totalDnd % 3600) / 60);
        const secondsLeft = totalDnd % 60;
        // existingEntry.dnd = formatTime(totalDnd);
        existingEntry.dnd = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
      }
    } else {
      const newEntry = {
        name,
        calls,
        transfers,
        pause: "00:00:00",
        dnd: "00:00:00",
        ...rest,
      };
      if (pause) {
        const pauseInSeconds = pause.split(":").reduce((acc, val, index) => {
          return (
            acc + parseInt(val) * (index === 0 ? 3600 : index === 1 ? 60 : 1)
          );
        }, 0);

        const hours = Math.floor(pauseInSeconds / 3600);
        const minutes = Math.floor((pauseInSeconds % 3600) / 60);
        const secondsLeft = pauseInSeconds % 60;
        // newEntry.pause = formatTime(pauseInSeconds);
        newEntry.pause = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
      }

      if (dnd) {
        const dndInSeconds = dnd.split(":").reduce((acc, val, index) => {
          return (
            acc + parseInt(val) * (index === 0 ? 3600 : index === 1 ? 60 : 1)
          );
        }, 0);

        const hours = Math.floor(dndInSeconds / 3600);
        const minutes = Math.floor((dndInSeconds % 3600) / 60);
        const secondsLeft = dndInSeconds % 60;
        // newEntry.dnd = formatTime(dndInSeconds);
        newEntry.dnd = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
      }
      result.push(newEntry);
    }

    return result;
  }, []);
}

export function checkDateDifference(dateFrom, dateTo) {
  // Calculate the number of milliseconds in two years
  const twoYearsInMillis = 2 * 365 * 24 * 60 * 60 * 1000;

  // Convert the input date strings into JavaScript Date objects
  const fromDate = new Date(dateFrom);
  const toDate = new Date(dateTo);

  // Calculate the absolute difference in milliseconds between the two dates
  const dateDifference = Math.abs(toDate - fromDate);

  // Compare the calculated difference with the two years threshold
  if (dateDifference > twoYearsInMillis) {
    return true; // If the difference is greater than two years, return true
  } else {
    return false; // Otherwise, return false
  }
}

export const addDayToDate = (date) => {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + 1);
  return dateObj.toISOString().split("T")[0];
};

export const handleDisableButton = (dateFrom, dateTo) => dateFrom === ""  || dateTo === "" ? true : dateFrom > dateTo ? true : checkDateDifference(dateFrom, dateTo) ? true : false