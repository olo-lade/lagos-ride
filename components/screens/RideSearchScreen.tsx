
import React, { useState, useEffect } from 'react';
import { getLagosLocations } from '../../services/mockApi';
import { RideRequestParams } from '../../types';
import { LocationMarkerIcon } from '../icons';

interface RideSearchScreenProps {
  onSearch: (params: RideRequestParams) => void;
}

const RideSearchScreen: React.FC<RideSearchScreenProps> = ({ onSearch }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locs = await getLagosLocations();
      setLocations(locs);
      if (locs.length >= 2) {
        setPickup(locs[0]);
        setDestination(locs[1]);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickup && destination) {
      onSearch({ pickup, destination });
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/ride/1600/900?blur=5&grayscale')"}}>
      <div className="bg-black bg-opacity-60 p-8 rounded-xl w-full max-w-2xl mx-auto shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">Need a Ride in Lagos?</h2>
        <p className="text-center text-gray-300 mb-6">Enter your destination to get started.</p>
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="relative">
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <LocationMarkerIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <select id="pickup" value={pickup} onChange={e => setPickup(e.target.value)} className="pl-10 w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary">
              {locations.map(loc => <option key={`from-${loc}`} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div className="relative">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
            <LocationMarkerIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <select id="destination" value={destination} onChange={e => setDestination(e.target.value)} className="pl-10 w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary">
              {locations.map(loc => <option key={`to-${loc}`} value={loc}>{loc}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-brand-secondary text-brand-dark font-bold py-3 px-4 rounded-md hover:bg-amber-400 transition duration-300 shadow-sm">
            Find a Ride
          </button>
        </form>
      </div>
    </div>
  );
};

export default RideSearchScreen;
