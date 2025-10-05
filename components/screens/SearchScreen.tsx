
import React, { useState, useEffect, useCallback } from 'react';
import { getLagosLocations } from '../../services/mockApi';
import { SearchParams } from '../../types';
import { CalendarIcon, LocationMarkerIcon, SparklesIcon } from '../icons';
import TripPlannerAssistant from '../TripPlannerAssistant';

interface SearchScreenProps {
  onSearch: (params: SearchParams) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const locs = await getLagosLocations();
      setLocations(locs);
      if (locs.length >= 2) {
        setFrom(locs[0]);
        setTo(locs[1]);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      onSearch({ from, to, date });
    }
  };

  const handleAssistantSearch = useCallback((params: Partial<SearchParams>) => {
    if (params.from) setFrom(params.from);
    if (params.to) setTo(params.to);
    if (params.date) setDate(params.date);
  }, []);

  return (
    <>
      <div className="min-h-[50vh] flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1600/900?blur=5&grayscale')"}}>
        <div className="bg-black bg-opacity-50 p-8 rounded-xl w-full max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">Book Your Bus Ticket in Lagos</h2>
          <p className="text-center text-gray-300 mb-6">Easy, Fast, and Reliable</p>
          <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
              <LocationMarkerIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <select id="from" value={from} onChange={e => setFrom(e.target.value)} className="pl-10 w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary">
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
              <LocationMarkerIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <select id="to" value={to} onChange={e => setTo(e.target.value)} className="pl-10 w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary">
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <CalendarIcon className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <input type="date" id="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="pl-10 w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary" />
            </div>
            <button type="submit" className="w-full bg-brand-secondary text-brand-dark font-bold py-2 px-4 rounded-md hover:bg-amber-400 transition duration-300 shadow-sm col-span-1 md:col-span-3 lg:col-span-1">
              Search Buses
            </button>
          </form>
            <div className="text-center mt-4">
                <button 
                    onClick={() => setShowAssistant(true)}
                    className="inline-flex items-center space-x-2 text-white bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition duration-300 backdrop-blur-sm"
                >
                    <SparklesIcon className="h-5 w-5 text-brand-secondary" />
                    <span className="font-medium">Use Trip Planner Assistant</span>
                </button>
            </div>
        </div>
      </div>
      {showAssistant && <TripPlannerAssistant locations={locations} onSearch={handleAssistantSearch} onClose={() => setShowAssistant(false)} />}
    </>
  );
};

export default SearchScreen;
