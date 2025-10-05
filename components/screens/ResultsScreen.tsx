
import React, { useState, useMemo } from 'react';
import { Bus, SearchParams } from '../../types';
import { ArrowRightIcon, StarIcon } from '../icons';

interface ResultsScreenProps {
  buses: Bus[];
  searchParams: SearchParams;
  onSelectBus: (bus: Bus) => void;
  isLoading: boolean;
}

const BusListItem: React.FC<{ bus: Bus; onSelectBus: (bus: Bus) => void; }> = ({ bus, onSelectBus }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row">
    <div className="p-5 flex-grow">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
            <img src={bus.operatorLogo} alt={bus.operator} className="h-10 w-10 rounded-full" />
            <div>
                <h3 className="text-lg font-bold text-gray-800">{bus.operator}</h3>
                <div className="flex items-center text-sm text-gray-500">
                    <StarIcon className="h-4 w-4 text-amber-400 mr-1" />
                    <span>{bus.rating} ({bus.reviews} reviews)</span>
                </div>
            </div>
        </div>
        <div className="text-right">
            <div className="flex items-center justify-end space-x-2">
                 {bus.originalPrice && (
                    <span className="text-gray-500 line-through">₦{bus.originalPrice.toLocaleString()}</span>
                 )}
                <p className="text-xl font-bold text-brand-primary">₦{bus.price.toLocaleString()}</p>
            </div>
            {bus.originalPrice ? (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">High Demand</span>
            ) : (
                <p className="text-xs text-gray-500">per seat</p>
            )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-gray-700">
        <div className="text-center">
            <p className="font-bold text-lg">{bus.departureTime}</p>
            <p className="text-sm text-gray-500">{bus.from}</p>
        </div>
        <div className="flex-grow flex items-center justify-center">
            <div className="w-full text-center">
                <p className="text-sm text-gray-500">{bus.duration}</p>
                <div className="w-full bg-gray-200 rounded-full h-1 my-1">
                    <div className="bg-brand-primary h-1 rounded-full" style={{width: '100%'}}></div>
                </div>
                <p className="text-xs text-gray-400">Non-Stop</p>
            </div>
        </div>
        <div className="text-center">
            <p className="font-bold text-lg">{bus.arrivalTime}</p>
            <p className="text-sm text-gray-500">{bus.to}</p>
        </div>
      </div>
    </div>

    <div className="bg-gray-50 md:w-48 flex items-center justify-center p-4 md:p-0">
        <button 
            onClick={() => onSelectBus(bus)}
            className="w-full h-full bg-brand-primary text-white font-bold py-3 px-6 rounded-md md:rounded-none hover:bg-teal-600 transition duration-300 flex items-center justify-center space-x-2"
        >
            <span>View Seats</span>
            <ArrowRightIcon className="h-5 w-5"/>
        </button>
    </div>
  </div>
);


const ResultsScreen: React.FC<ResultsScreenProps> = ({ buses, searchParams, onSelectBus, isLoading }) => {
  const [filters, setFilters] = useState({ ac: false, sleeper: false, priceRange: [0, 15000] });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const filteredBuses = useMemo(() => {
    return buses.filter(bus => {
      if (filters.ac && !bus.amenities.ac) return false;
      if (filters.sleeper && !bus.amenities.sleeper) return false;
      return true;
    });
  }, [buses, filters]);

  const date = new Date(searchParams.date);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">{searchParams.from} to {searchParams.to}</h2>
        <p className="text-gray-600">{formattedDate}</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">Filter Results</h3>
            <div className="space-y-4">
              <h4 className="font-semibold">Amenities</h4>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="ac" checked={filters.ac} onChange={handleFilterChange} className="rounded text-brand-primary focus:ring-brand-primary"/>
                <span>Air Conditioning</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="sleeper" checked={filters.sleeper} onChange={handleFilterChange} className="rounded text-brand-primary focus:ring-brand-primary"/>
                <span>Sleeper</span>
              </label>
            </div>
          </div>
        </aside>

        <main className="flex-grow">
          {isLoading ? (
             Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-5 mb-4 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/5"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                    </div>
                </div>
             ))
          ) : filteredBuses.length > 0 ? (
            <div className="space-y-4">
              {filteredBuses.map(bus => <BusListItem key={bus.id} bus={bus} onSelectBus={onSelectBus} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <h3 className="text-2xl font-bold text-gray-700">No Buses Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ResultsScreen;
