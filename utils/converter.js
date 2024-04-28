const convertEpochToDay = (epochTime) => {
  const date = new Date(epochTime * 1000);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  return dayOfWeek;
};

const convertEpochToTime = (epochTime) => {
  const date = new Date(epochTime * 1000);
  const dateString = date.toISOString().split("T")[0];
  return dateString;
};

export { convertEpochToDay, convertEpochToTime };
