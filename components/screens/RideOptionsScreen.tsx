
import React from 'react';
import { RideOption, RideRequestParams, PaymentDetails } from '../../types';
import { CarIcon, UsersIcon, ZapIcon } from '../icons';

interface RideOptionsScreenProps {
  options: RideOption[];
  requestParams: RideRequestParams;
  onSelectRide: (option: RideOption, paymentDetails: PaymentDetails) => void;
  isLoading: boolean;
  surgeReason: string;
}

const RideTypeIcon: React.FC<{ type: RideOption['id'] }> = ({ type }) => {
    switch(type) {
        case 'carpool': return <UsersIcon className="h-8 w-8 text-brand-primary" />;
        case 'standard': return <CarIcon className="h-8 w-8 text-brand-primary" />;
        case 'premium': return <CarIcon className="h-8 w-8 text-brand-secondary" />;
        default: return <CarIcon className="h-8 w-8 text-brand-primary" />;
    }
}

const RideOptionsScreen: React.FC<RideOptionsScreenProps> = ({ options, requestParams, onSelectRide, isLoading, surgeReason }) => {
    const isSurge = options.length > 0 && (options[0].surgeMultiplier || 1) > 1.05;

  const handleSelect = (option: RideOption) => {
    const paymentDetails: PaymentDetails = {
        amount: option.price,
        type: 'Ride Hailing',
        description: `${requestParams.pickup} to ${requestParams.destination}`
    };
    onSelectRide(option, paymentDetails);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">{requestParams.pickup} to {requestParams.destination}</h2>
        <p className="text-gray-600">Choose your preferred ride</p>
      </div>
      
      <div className="max-w-md mx-auto">
        {isSurge && (
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md mb-4" role="alert">
                <div className="flex">
                    <div className="py-1"><ZapIcon className="h-6 w-6 text-amber-500 mr-4" /></div>
                    <div>
                        <p className="font-bold">Increased Demand</p>
                        <p className="text-sm">{surgeReason}</p>
                    </div>
                </div>
            </div>
        )}

        {isLoading ? (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between animate-pulse">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div>
                                <div className="h-6 bg-gray-200 rounded w-24 mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                ))}
            </div>
        ) : options.length > 0 ? (
          <div className="space-y-4">
            {options.map(option => (
              <div key={option.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                        <RideTypeIcon type={option.id} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{option.type}</h3>
                        <p className="text-sm text-gray-500">{option.eta} away</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                         {option.originalPrice && (
                            <span className="text-gray-500 line-through">₦{option.originalPrice.toLocaleString()}</span>
                         )}
                        <p className="text-lg font-bold text-brand-primary flex items-center">
                            {isSurge && <ZapIcon className="h-4 w-4 text-amber-500 mr-1" />}
                            ₦{option.price.toLocaleString()}
                        </p>
                    </div>
                    <button 
                        onClick={() => handleSelect(option)}
                        className="mt-1 bg-brand-secondary text-brand-dark text-sm font-bold py-1 px-4 rounded-full hover:bg-amber-400 transition"
                    >
                        Select
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <h3 className="text-2xl font-bold text-gray-700">No Rides Available</h3>
              <p className="text-gray-500 mt-2">Please try again in a few moments.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RideOptionsScreen;
