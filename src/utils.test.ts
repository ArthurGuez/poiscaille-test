import { describe, expect, it } from 'vitest';

import {
  getBalancedOrders,
  getBalancedPlaces,
  getLockersMean,
  getLockersToMoveCount,
} from './utils';
import { ORDERS } from './constants';

describe('getLockersMean', () => {
  const lockersMean = getLockersMean(ORDERS);

  it('should return 41', () => {
    expect(lockersMean).toBe(41);
  });
});

describe('getLockersToMoveCount', () => {
  const lockersMean = 41;

  it('should return 4', () => {
    const orderSurplus = 4;
    const nextOrderLockers = ORDERS[1].lockers;
    const lockersToMoveCount = getLockersToMoveCount(
      lockersMean,
      orderSurplus,
      nextOrderLockers,
    );
    expect(lockersToMoveCount).toBe(4);
  });

  it('should return 21', () => {
    const orderSurplus = 29;
    const nextOrderLockers = ORDERS[3].lockers;
    const lockersToMoveCount = getLockersToMoveCount(
      lockersMean,
      orderSurplus,
      nextOrderLockers,
    );
    expect(lockersToMoveCount).toBe(21);
  });
});

describe('getBalancedPlaces', () => {
  const balancedPlaces = getBalancedPlaces(
    4,
    {
      date: 20220404,
      lockers: 45,
      places: { a: 20, b: 15, c: 10 },
    },
    {
      date: 20220411,
      lockers: 29,
      places: { a: 10, b: 10, c: 9 },
    },
  );
  const expectedResult = {
    currentOrder: { a: 18, b: 13, c: 10 },
    nextOrder: { a: 12, b: 12, c: 9 },
  };

  it('should return balanced places', () => {
    expect(balancedPlaces).toStrictEqual(expectedResult);
  });
});

describe('getBalancedOrders', () => {
  const expectedResult = [
    {
      date: 20220504,
      lockers: 41,
      places: { a: 18, b: 13, c: 10 },
    },
    {
      date: 20220511,
      lockers: 33,
      places: { a: 12, b: 12, c: 9 },
    },
    {
      date: 20220518,
      lockers: 49,
      places: { a: 21, b: 14, c: 14 },
    },
    {
      date: 20220525,
      lockers: 41,
      places: { a: 14, b: 16, c: 11 },
    },
  ];
  const balancedOrders = getBalancedOrders(ORDERS);

  it('should return an array of balanced orders', () => {
    expect(balancedOrders).toEqual(expectedResult);
  });
});
