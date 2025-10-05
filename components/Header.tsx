
import React from 'react';
import { AppMode } from '../types';
import { CarIcon, SteeringWheelIcon, TicketIcon, DashboardIcon, WalletIcon } from './icons';

interface HeaderProps {
    currentMode: AppMode;
    onModeChange: (mode: AppMode) => void;
    onBecomeDriver: () => void;
    onGoToDashboard: () => void;
    onGoToWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange, onBecomeDriver, onGoToDashboard, onGoToWallet }) => {
  const getButtonClass = (mode: AppMode) => {
    return currentMode === mode
      ? 'bg-brand-primary text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <header className="bg-brand-dark shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onModeChange(currentMode)} // Resets to current mode's home
          >
            <TicketIcon className="h-8 w-8 text-brand-secondary" />
            <h1 className="text-2xl font-bold text-white">Lagos <span className="text-brand-secondary">Ride</span></h1>
          </div>
          
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="bg-gray-800 rounded-full p-1 flex space-x-1">
              <button 
                onClick={() => onModeChange(AppMode.Bus)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${getButtonClass(AppMode.Bus)}`}
              >
                Book a Bus
              </button>
              <button 
                onClick={() => onModeChange(AppMode.Ride)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${getButtonClass(AppMode.Ride)}`}
              >
                Hail a Ride
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
             <button 
                onClick={onGoToDashboard}
                className="hidden sm:flex items-center space-x-2 text-gray-300 hover:text-white transition duration-150 ease-in-out"
            >
              <DashboardIcon className="h-5 w-5" />
              <span className="hidden lg:inline">Dashboard</span>
            </button>
            <button 
                onClick={onBecomeDriver}
                className="hidden sm:flex items-center space-x-2 text-gray-300 hover:text-white transition duration-150 ease-in-out"
            >
              <SteeringWheelIcon className="h-5 w-5" />
              <span className="hidden lg:inline">Become a Driver</span>
            </button>
             <button 
                onClick={onGoToWallet}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 ease-in-out"
                aria-label="My Wallet"
            >
              <WalletIcon className="h-6 w-6" />
            </button>
            <button className="flex items-center space-x-2 bg-brand-primary/80 text-white px-3 py-2 rounded-lg hover:bg-brand-primary transition duration-150 ease-in-out">
              <span>Login</span>
            </button>
          </div>
        </div>
         <div className="md:hidden flex items-center justify-center pb-4">
            <div className="bg-gray-800 rounded-full p-1 flex space-x-1 w-full max-w-sm">
              <button 
                onClick={() => onModeChange(AppMode.Bus)}
                className={`w-1/2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${getButtonClass(AppMode.Bus)}`}
              >
                Bus
              </button>
              <button 
                onClick={() => onModeChange(AppMode.Ride)}
                className={`w-1/2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${getButtonClass(AppMode.Ride)}`}
              >
                Ride
              </button>
            </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
