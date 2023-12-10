// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment-timezone');
const { isWithinThreedays } = require('../shared-v1/utils/isWithinThreeDays');

describe('When call isWithinThreeDays(threeDayBeforeEventDate)', () => {
  it('should return true', () => {
    const currentDate = moment.tz('Asia/Jakarta').utc(true).toDate();
    currentDate.setDate(currentDate.getDate() + 3);

    expect(isWithinThreedays(currentDate)).toBe(true);
  });
});

describe('When call isWithinThreeDays(twoDayBeforeEventDate)', () => {
  it('should return true', () => {
    const currentDate = moment.tz('Asia/Jakarta').utc(true).toDate();
    currentDate.setDate(currentDate.getDate() + 2);

    expect(isWithinThreedays(currentDate)).toBe(true);
  });
});

describe('When call isWithinThreeDays(oneDayBeforeEventDate)', () => {
  it('should return true', () => {
    const currentDate = moment.tz('Asia/Jakarta').utc(true).toDate();
    currentDate.setDate(currentDate.getDate() + 1);

    expect(isWithinThreedays(currentDate)).toBe(true);
  });
});

describe('When call isWithinThreeDays(moreThreeDayBeforeEventDate)', () => {
  it('should return false', () => {
    const currentDate = moment.tz('Asia/Jakarta').utc(true).toDate();
    currentDate.setDate(currentDate.getDate() + 4);

    expect(isWithinThreedays(currentDate)).toBe(false);
  });
});
