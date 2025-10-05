
import React, { useState, useCallback } from 'react';
import { AppScreen, Bus, SearchParams, BookingDetails, AppMode, RideRequestParams, RideOption, ActiveRide, DriverDashboardData, PaymentDetails, Seat } from './types';
import { searchBuses, getRideOptions, requestRide, getDriverDashboardData, bookSeats } from './services/mockApi';

import Header from './components/Header';
import SearchScreen from './components/screens/SearchScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import BookingScreen from './components/screens/BookingScreen';
import ConfirmationScreen from './components/screens/ConfirmationScreen';
import DriverRegistrationScreen from './components/screens/DriverRegistrationScreen';
import RideSearchScreen from './components/screens/RideSearchScreen';
import RideOptionsScreen from './components/screens/RideOptionsScreen';
import RideInProgressScreen from './components/screens/RideInProgressScreen';
import DriverDashboardScreen from './components/screens/DriverDashboardScreen';
import AdminLoginScreen from './components/screens/AdminLoginScreen';
import AdminPanelLayout from './components/admin/AdminPanelLayout';
import { SteeringWheelIcon } from './components/icons';
import PaymentScreen from './components/screens/PaymentScreen';
import UserWalletScreen from './components/screens/UserWalletScreen';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.Bus);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Search);
  
  // Bus state
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]); // Temp store seats during payment
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Ride state
  const [rideRequestParams, setRideRequestParams] = useState<RideRequestParams | null>(null);
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [selectedRideOption, setSelectedRideOption] = useState<RideOption | null>(null);
  const [surgeReason, setSurgeReason] = useState('');
  const [activeRide, setActiveRide] = useState<ActiveRide | null>(null);

  // Payment state
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);


  // Driver state
  const [dashboardData, setDashboardData] = useState<DriverDashboardData | null>(null);

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const resetAllState = () => {
    setSearchParams(null);
    setBuses([]);
    setSelectedBus(null);
    setBookingDetails(null);
    setRideRequestParams(null);
    setRideOptions([]);
    setActiveRide(null);
    setDashboardData(null);
    setSurgeReason('');
    setPaymentDetails(null);
    setSelectedRideOption(null);
    setSelectedSeats([]);
    setIsLoading(false);
  }

  const handleModeChange = useCallback((mode: AppMode) => {
    resetAllState();
    setAppMode(mode);
    setCurrentScreen(mode === AppMode.Bus ? AppScreen.Search : AppScreen.RideSearch);
  }, []);

  // --- Bus Handlers ---
  const handleBusSearch = useCallback(async (params: SearchParams) => {
    setSearchParams(params);
    setIsLoading(true);
    setCurrentScreen(AppScreen.Results);
    const results = await searchBuses(params);
    setBuses(results);
    setIsLoading(false);
  }, []);

  const handleSelectBus = useCallback((bus: Bus) => {
    setSelectedBus(bus);
    setCurrentScreen(AppScreen.Booking);
  }, []);

  const handleProceedToBusPayment = useCallback((details: PaymentDetails, seats: Seat[]) => {
      setPaymentDetails(details);
      setSelectedSeats(seats);
      setCurrentScreen(AppScreen.Payment);
  }, []);

  // --- Ride Handlers ---
  const handleRideSearch = useCallback(async (params: RideRequestParams) => {
    setRideRequestParams(params);
    setIsLoading(true);
    setCurrentScreen(AppScreen.RideOptions);
    const { options, surgeReason } = await getRideOptions(params);
    setRideOptions(options);
    setSurgeReason(surgeReason);
    setIsLoading(false);
  }, []);

  const handleSelectRideOption = useCallback((option: RideOption, paymentDetails: PaymentDetails) => {
    setSelectedRideOption(option);
    setPaymentDetails(paymentDetails);
    setCurrentScreen(AppScreen.Payment);
  }, []);
  
  const handleEndRide = useCallback(() => {
    handleModeChange(AppMode.Ride);
  }, [handleModeChange]);

  // --- Payment Handler ---
  const handlePaymentSuccess = useCallback(async () => {
    setIsLoading(true);
    if (appMode === AppMode.Bus && selectedBus && selectedSeats.length > 0 && searchParams && paymentDetails) {
        const seatIds = selectedSeats.map(s => s.id);
        const result = await bookSeats(selectedBus.id, seatIds);
        if(result.success) {
          const finalBookingDetails: BookingDetails = {
            bus: selectedBus,
            selectedSeats,
            totalPrice: paymentDetails.amount,
            bookingId: result.bookingId,
            date: searchParams.date
          };
          setBookingDetails(finalBookingDetails);
          setCurrentScreen(AppScreen.Confirmation);
        }
    } else if (appMode === AppMode.Ride && selectedRideOption && rideRequestParams) {
        const ride = await requestRide(selectedRideOption, rideRequestParams);
        setActiveRide(ride);
        setCurrentScreen(AppScreen.RideInProgress);
    }
    setIsLoading(false);
    setPaymentDetails(null);
    setSelectedRideOption(null);
    setSelectedSeats([]);
  }, [appMode, selectedBus, selectedSeats, searchParams, paymentDetails, selectedRideOption, rideRequestParams]);


  // --- Driver Handlers ---
  const handleBecomeDriver = useCallback(() => {
    setCurrentScreen(AppScreen.DriverRegistration);
  }, []);

  const handleDriverRegistrationComplete = useCallback(() => {
      handleModeChange(AppMode.Ride)
  }, [handleModeChange]);

  const handleGoToDashboard = useCallback(async () => {
    setIsLoading(true);
    setCurrentScreen(AppScreen.DriverDashboard);
    const data = await getDriverDashboardData('driver1'); // Using a mock ID
    setDashboardData(data);
    setIsLoading(false);
  }, []);
  
  // --- Wallet Handler ---
  const handleGoToWallet = useCallback(() => {
    setCurrentScreen(AppScreen.UserWallet);
  }, []);

  // --- Admin Handlers ---
  const handleGoToAdminLogin = useCallback(() => {
    setCurrentScreen(AppScreen.AdminLogin);
  }, []);

  const handleAdminLoginSuccess = useCallback(() => {
    setIsAdminLoggedIn(true);
    setCurrentScreen(AppScreen.AdminPanel);
  }, []);
  
  const handleAdminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    handleModeChange(AppMode.Bus);
  }, [handleModeChange]);


  const renderScreen = () => {
    if (currentScreen === AppScreen.AdminLogin) {
      return <AdminLoginScreen onLoginSuccess={handleAdminLoginSuccess} />;
    }

    if (currentScreen === AppScreen.AdminPanel && isAdminLoggedIn) {
      return <AdminPanelLayout onLogout={handleAdminLogout} />;
    }
    
    // Default Public Screens
    if (currentScreen === AppScreen.DriverRegistration) {
        return <DriverRegistrationScreen onComplete={handleDriverRegistrationComplete} />;
    }
    
    if (currentScreen === AppScreen.DriverDashboard) {
        return <DriverDashboardScreen data={dashboardData} isLoading={isLoading} />;
    }
    
    if (currentScreen === AppScreen.Payment && paymentDetails) {
        return <PaymentScreen details={paymentDetails} onPaymentSuccess={handlePaymentSuccess} />;
    }
    
    if (currentScreen === AppScreen.UserWallet) {
        return <UserWalletScreen />;
    }

    if (appMode === AppMode.Bus) {
        switch (currentScreen) {
        case AppScreen.Search:
            return <SearchScreen onSearch={handleBusSearch} />;
        case AppScreen.Results:
            if (!searchParams) return <SearchScreen onSearch={handleBusSearch} />;
            return <ResultsScreen buses={buses} searchParams={searchParams} onSelectBus={handleSelectBus} isLoading={isLoading}/>;
        case AppScreen.Booking:
            if (!selectedBus || !searchParams) return <SearchScreen onSearch={handleBusSearch} />;
            return <BookingScreen bus={selectedBus} searchParams={searchParams} onProceedToPayment={(details, seats) => handleProceedToBusPayment(details, seats)} isProcessing={isLoading} />;
        case AppScreen.Confirmation:
            if (!bookingDetails) return <SearchScreen onSearch={handleBusSearch} />;
            return <ConfirmationScreen details={bookingDetails} />;
        default:
            return <SearchScreen onSearch={handleBusSearch} />;
        }
    }

    if (appMode === AppMode.Ride) {
        switch (currentScreen) {
            case AppScreen.RideSearch:
                return <RideSearchScreen onSearch={handleRideSearch} />;
            case AppScreen.RideOptions:
                if (!rideRequestParams) return <RideSearchScreen onSearch={handleRideSearch} />;
                return <RideOptionsScreen options={rideOptions} requestParams={rideRequestParams} onSelectRide={handleSelectRideOption} isLoading={isLoading} surgeReason={surgeReason}/>;
            case AppScreen.RideInProgress:
                 if (!activeRide) return <RideSearchScreen onSearch={handleRideSearch} />;
                 return <RideInProgressScreen ride={activeRide} onEndRide={handleEndRide} />;
            default:
                return <RideSearchScreen onSearch={handleRideSearch} />;
        }
    }
  };
  
  const isPublicView = currentScreen !== AppScreen.AdminLogin && currentScreen !== AppScreen.AdminPanel;

  return (
    <div className="font-sans antialiased text-gray-900 bg-brand-light min-h-screen flex flex-col">
      {isPublicView && (
          <Header 
            currentMode={appMode} 
            onModeChange={handleModeChange}
            onBecomeDriver={handleBecomeDriver}
            onGoToDashboard={handleGoToDashboard}
            onGoToWallet={handleGoToWallet}
          />
      )}
      <main className="flex-grow">
        {renderScreen()}
      </main>
      {isPublicView && (
        <footer className="bg-brand-dark text-white py-8 mt-12">
            <div className="container mx-auto text-center px-4">
                <div className="mb-4">
                    <button 
                    onClick={handleBecomeDriver}
                    className="inline-flex items-center space-x-2 bg-brand-secondary text-brand-dark font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition duration-300"
                    >
                        <SteeringWheelIcon className="h-6 w-6" />
                        <span>Start Earning - Become a Driver</span>
                    </button>
                </div>
                <p>&copy; {new Date().getFullYear()} Lagos Ride. All rights reserved.</p>
                <p className="text-sm text-gray-400">Your trusted partner for bus and ride travel within Lagos.</p>
                <div className="mt-4">
                    <button onClick={handleGoToAdminLogin} className="text-xs text-gray-500 hover:text-gray-300">Admin Login</button>
                </div>
            </div>
        </footer>
      )}
    </div>
  );
};

export default App;
