import type { Order } from './types';

/**
 * Takes an array of orders and returns their lockers mean
 */
export function getLockersMean(orders: Order[]) {
  return (
    orders.reduce((total, order) => total + order.lockers, 0) / orders.length
  );
}

/**
 * Returns the number of lockers that must be moved from one locker to another locker order
 */
function getPlaceSurplus(
  placeValue: number,
  lockersToMoveCount: number,
  orderLockersCount: number,
) {
  return Math.floor((lockersToMoveCount / orderLockersCount) * placeValue);
}

/**
 * Returns how many lockers must be moved from one order to the next one
 */
export function getLockersToMoveCount(
  lockersMean: number,
  orderSurplus: number,
  nextOrderLockersCount: number,
) {
  const nextOrderLockersLimit = lockersMean - nextOrderLockersCount;

  // In one order, we cannot put more lockers than their mean
  return orderSurplus > nextOrderLockersLimit
    ? nextOrderLockersLimit
    : orderSurplus;
}

/**
 * Returns two consecutive orders' places balanced on a pro rata basis
 */
export function getBalancedPlaces(
  lockersToMoveCount: number,
  order: Order,
  nextOrder: Order,
) {
  const balancedPlaces = {
    currentOrder: order.places,
    nextOrder: nextOrder.places,
  };
  let lockersMovedCount = 0;

  for (const [placeKey, placeValue] of Object.entries(order.places)) {
    const placeSurplus = getPlaceSurplus(
      placeValue,
      lockersToMoveCount,
      order.lockers,
    );

    // If a place has a surplus we need to move it to the next one
    if (placeSurplus > 0) {
      lockersMovedCount += placeSurplus;
      balancedPlaces.currentOrder[placeKey as keyof Order['places']] =
        placeValue - placeSurplus;
      balancedPlaces.nextOrder[placeKey as keyof Order['places']] =
        nextOrder.places[placeKey as keyof Order['places']] + placeSurplus;
    }
  }

  let lockersToMoveRest = lockersToMoveCount - lockersMovedCount;

  // If there are some leftover lockers that must be moved, it has to be done place by place
  if (lockersToMoveRest > 0) {
    for (const placeKey in balancedPlaces.nextOrder) {
      balancedPlaces.currentOrder[placeKey as keyof Order['places']]--;
      balancedPlaces.nextOrder[placeKey as keyof Order['places']]++;
      lockersToMoveRest--;

      if (lockersToMoveRest === 0) {
        break;
      }
    }
  }

  return balancedPlaces;
}

/**
 * Returns an array of perfectly balanced orders
 */
export function getBalancedOrders(orders: Order[] | null) {
  if (orders === null) {
    return null;
  }

  const lockersMean = getLockersMean(orders);

  return orders.reduce<Order[]>((acc, order, index) => {
    const orderLockersCount = order.lockers;
    const orderSurplus = orderLockersCount - lockersMean;

    // We need to balance a pair of orders only if one has a surplus
    if (orderSurplus > 0) {
      const nextOrder = orders[index + 1];
      const lockersToMoveCount = getLockersToMoveCount(
        lockersMean,
        orderSurplus,
        nextOrder.lockers,
      );
      const balancedPlaces = getBalancedPlaces(
        lockersToMoveCount,
        order,
        nextOrder,
      );

      return [
        ...acc,
        {
          date: order.date,
          lockers: order.lockers - lockersToMoveCount,
          places: balancedPlaces.currentOrder,
        },
        {
          date: nextOrder.date,
          lockers: nextOrder.lockers + lockersToMoveCount,
          places: balancedPlaces.nextOrder,
        },
      ];
    }

    return acc;
  }, []);
}
