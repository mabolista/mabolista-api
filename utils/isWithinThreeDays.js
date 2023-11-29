const isWithinThreedays = (eventDate) => {
  const currentDate = new Date();

  // Calculate the date 1 day before event date
  const oneDayBefore = new Date(eventDate);
  oneDayBefore.setDate(eventDate.getDate() - 1);

  // Calculate the date 1 day before event date
  const twoDayBefore = new Date(eventDate);
  twoDayBefore.setDate(eventDate.getDate() - 2);

  // Calculate the date 1 day before event date
  const threeDayBefore = new Date(eventDate);
  threeDayBefore.setDate(eventDate.getDate() - 3);

  if (
    threeDayBefore.toLocaleDateString() === currentDate.toLocaleDateString()
  ) {
    return true;
  }
  if (twoDayBefore.toLocaleDateString() === currentDate.toLocaleDateString()) {
    return true;
  }
  if (oneDayBefore.toLocaleDateString() === currentDate.toLocaleDateString()) {
    return true;
  }

  return false;
};

module.exports = {
  isWithinThreedays
};
