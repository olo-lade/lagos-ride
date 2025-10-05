
export enum SeatStatus {
  Available = 'available',
  Booked = 'booked',
  Selected = 'selected',
  Aisle = 'aisle',
}

export interface Seat {
  id: string;
  status: SeatStatus;
}

export type SeatLayout = Seat[][];

export interface Bus {
  id: string;
  operator: string;
  operatorLogo: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  from: string;
  to: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  amenities: {
    ac: boolean;
    wifi: boolean;
    power: boolean;
    sleeper: boolean;
  };
  seatLayout: SeatLayout;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

export interface BookingDetails {
  bus: Bus;
  selectedSeats: Seat[];
  totalPrice: number;
  bookingId: string;
  date: string;
}

// --- New Additions ---

export enum AppMode {
  Bus = 'bus',
  Ride = 'ride',
}

export enum AppScreen {
  // Bus Booking
  Search,
  Results,
  Booking,
  Confirmation,
  // Ride Hailing
  RideSearch,
  RideOptions,
  RideInProgress,
  // Driver
  DriverRegistration,
  DriverDashboard,
  // Admin
  AdminLogin,
  AdminPanel,
  // Payment & Wallet
  Payment,
  UserWallet,
}


export interface Vehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  rating: number;
  photoUrl: string;
  vehicle: Vehicle;
  status: 'pending' | 'approved';
}

export interface RideRequestParams {
    pickup: string;
    destination: string;
}

export interface RideOption {
    id: 'standard' | 'premium' | 'carpool';
    type: 'Standard' | 'Premium' | 'Carpool';
    price: number;
    originalPrice?: number;
    surgeMultiplier?: number;
    eta: string; 
    capacity: number;
}

export interface ActiveRide {
    id: string;
    driver: Driver;
    rideOption: RideOption;
    pickup: string;
    destination: string;
    status: 'en_route_to_pickup' | 'in_progress' | 'completed';
}

// --- Driver Dashboard Types ---

export interface RideHistoryItem {
    id: string;
    date: string;
    pickup: string;
    destination: string;
    fare: number;
    tip: number;
    riderRating: number;
}

export interface DriverDashboardData {
    totalEarnings: number;
    weeklyEarnings: number;
    averageRating: number;
    totalTrips: number;
    tripHistory: RideHistoryItem[];
    wallet: Wallet; // Added wallet
}

// --- Admin Panel Types ---

export interface AdminDashboardStats {
    totalRevenue: number;
    totalTrips: number;
    totalDrivers: number;
    totalUsers: number;
    monthlyRevenue: { month: string; revenue: number }[];
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    joinDate: string;
    tripCount: number;
}

export interface AdminTripLog {
    id: string;
    type: 'Ride' | 'Bus';
    userName: string;
    date: string;
    details: string; // e.g., "Ikeja to Lekki"
    amount: number;
    status: 'Completed' | 'In Progress' | 'Booked';
}

// --- Admin Live Map Types ---
export interface LiveBus {
    type: 'bus';
    operator: string;
    from: string;
    to: string;
    status: string;
}

export interface LiveRide {
    type: 'ride';
    driverName: string;
    driverPhoto: string;
    vehicle: string;
    pickup: string;
    destination: string;
    rideType: string;
}

export interface LiveVehicle {
    id: string;
    position: {
        x: number; // percentage
        y: number; // percentage
    };
    details: LiveBus | LiveRide;
}

// --- Admin Pricing Management Types ---
export interface SurgeZone {
    name: string;
    demand: number; // Number of active searches
    supply: number; // Number of available drivers
    multiplier: number;
}

export interface PricingSettings {
    maxSurgeCap: number;
    peakHourMultiplier: number; // e.g., 1.2 for 20% increase
}

// --- Payment & Wallet Types ---

export type TransactionType = 'debit' | 'credit' | 'payout' | 'payout_fee' | 'tip';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
}

export interface Wallet {
    balance: number;
    transactions: Transaction[];
}

export interface PaymentDetails {
    amount: number;
    type: 'Bus Booking' | 'Ride Hailing';
    description: string; // e.g., "Ikeja to Lekki"
}

export interface PayoutRequest {
    id: string;
    driverId: string;
    driverName: string;
    amount: number;
    date: string;
    status: 'pending' | 'completed';
}
