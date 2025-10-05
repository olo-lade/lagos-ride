
import React, { useState, useEffect } from 'react';
import { ActiveRide } from '../../types';
import { StarIcon } from '../icons';

interface RideInProgressScreenProps {
  ride: ActiveRide;
  onEndRide: () => void;
}

const RideInProgressScreen: React.FC<RideInProgressScreenProps> = ({ ride, onEndRide }) => {
    const [statusText, setStatusText] = useState("Your driver is on the way!");
    const [rideCompleted, setRideCompleted] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setStatusText(`You are on your way to ${ride.destination}.`);
        }, 5000); // 5 seconds to simulate driver arrival

        const timer2 = setTimeout(() => {
            setStatusText(`You have arrived at your destination.`);
            setRideCompleted(true);
        }, 12000); // 12 seconds to simulate trip duration

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [ride.destination]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">{statusText}</h1>
        
        <div className="bg-gray-50 rounded-xl p-4 my-6">
            <div className="flex items-center space-x-4">
                <img src={ride.driver.photoUrl} alt={ride.driver.name} className="w-20 h-20 rounded-full shadow-md" />
                <div>
                    <h2 className="text-xl font-bold">{ride.driver.name}</h2>
                    <div className="flex items-center text-sm text-gray-600">
                        <StarIcon className="h-4 w-4 text-amber-400 mr-1" />
                        <span>{ride.driver.rating}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 border-t pt-4 text-center">
                <p className="text-gray-700 font-semibold">{ride.driver.vehicle.color} {ride.driver.vehicle.make} {ride.driver.vehicle.model}</p>
                <p className="text-brand-primary font-mono font-bold text-lg bg-gray-200 inline-block px-3 py-1 rounded mt-1">{ride.driver.vehicle.licensePlate}</p>
            </div>
        </div>

        {rideCompleted && (
             <div className="text-center">
                 <p className="text-lg font-semibold">Total Fare: <span className="text-brand-primary">₦{ride.rideOption.price.toLocaleString()}</span></p>
                 <p className="text-gray-600">Thank you for riding with Lagos Ride!</p>
                <button
                    onClick={onEndRide}
                    className="mt-6 w-full bg-brand-secondary text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-amber-400 transition duration-300"
                >
                    Find Another Ride
                </button>
            </div>
        )}

        {!rideCompleted && (
             <div className="mt-6 text-center">
                <div className="animate-pulse text-gray-500">Connecting you with your driver...</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-brand-primary h-2.5 rounded-full animate-pulse" style={{width: "45%"}}></div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default RideInProgressScreen;
