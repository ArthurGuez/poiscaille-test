import { getBalancedOrders } from './utils';
import { ORDERS } from './constants';

const balancedOrders = getBalancedOrders(ORDERS);

export default function App() {
  if (balancedOrders === null) {
    return <div>Failed to balance orders</div>;
  }

  return (
    <div>
      <h1 className="mt-3 flex justify-center">Results</h1>
      <div className="mx-auto my-8 mt-10 w-8/12 rounded border border-gray-200 p-4 shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none">
        {balancedOrders.map(({ date, lockers, places }) => (
          <div className="mb-3" key={date}>
            <div>Date: {date}</div>
            <div>New number of lockers: {lockers}</div>
            <div>
              {Object.entries(places).map(([placeKey, placeValue]) => (
                <div key={placeKey}>
                  New quantity for place {placeKey}: {placeValue}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
