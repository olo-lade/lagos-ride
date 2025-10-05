
import React, { useState, useCallback } from 'react';
import { parseTripRequest } from '../services/geminiService';
import { SearchParams } from '../types';
import { SparklesIcon, XIcon } from './icons';

interface TripPlannerAssistantProps {
  locations: string[];
  onSearch: (params: Partial<SearchParams>) => void;
  onClose: () => void;
}

const TripPlannerAssistant: React.FC<TripPlannerAssistantProps> = ({ locations, onSearch, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = useCallback(async () => {
    if (!query) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await parseTripRequest(query, locations);
      if (result) {
        onSearch(result);
        onClose();
      } else {
        setError('Could not understand your request. Please try rephrasing.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query, locations, onSearch, onClose]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6 text-brand-primary" />
            <h2 className="text-xl font-bold text-gray-800">Trip Planner Assistant</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Describe your trip, and our AI assistant will fill out the form for you.
          <br/>
          e.g., "I want to go from Ikeja to VI tomorrow"
        </p>
        <div className="space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tell us your travel plans..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleParse}
            disabled={isLoading || !query}
            className="w-full flex justify-center items-center bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition duration-300"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
                'Plan My Trip'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlannerAssistant;

