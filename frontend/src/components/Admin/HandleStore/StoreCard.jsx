import { renderStars } from "./utils";
export const StoreRow = ({ store }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {store.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {store.email}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
      {store.address}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <div className="flex items-center">
        <div className="flex mr-2">
          {renderStars(parseFloat(store.average_rating))}
        </div>
        <span>({parseFloat(store.average_rating).toFixed(1)})</span>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {store.total_ratings}
    </td>
  </tr>
);

export const StoreCard = ({ store }) => (
  <div className="p-4 border-b hover:bg-gray-50">
    <h4 className="text-base font-semibold text-gray-900">{store.name}</h4>
    <p className="text-sm text-gray-500">{store.email}</p>
    <p className="text-sm text-gray-500 truncate">{store.address}</p>
    <div className="flex items-center mt-2">
      <div className="flex mr-2">
        {renderStars(parseFloat(store.average_rating))}
      </div>
      <span className="text-sm text-gray-600">
        ({parseFloat(store.average_rating).toFixed(1)})
      </span>
    </div>
    <p className="text-sm text-gray-500 mt-1">
      Total Ratings: {store.total_ratings}
    </p>
  </div>
);


