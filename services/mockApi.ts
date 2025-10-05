
import { Bus, SeatLayout, SeatStatus, SearchParams, Driver, RideRequestParams, RideOption, ActiveRide, DriverDashboardData, RideHistoryItem, AdminDashboardStats, AdminUser, AdminTripLog, LiveVehicle, SurgeZone, PricingSettings, Wallet, Transaction, PayoutRequest } from '../types';

const LAGOS_LOCATIONS = [
  "Ikeja", "Lekki", "Victoria Island", "Surulere", "Yaba", "Apapa", "Ikorodu", "Ajah", "Maryland", "Festac"
];

// --- DYNAMIC PRICING STATE ---
let surgeState: { [key: string]: { demand: number, supply: number } } = {
    "Ikeja": { demand: 25, supply: 20 },
    "Lekki": { demand: 40, supply: 15 },
    "Victoria Island": { demand: 50, supply: 18 },
    "Surulere": { demand: 20, supply: 22 },
    "Yaba": { demand: 30, supply: 25 },
    "Apapa": { demand: 15, supply: 10 },
    "Ikorodu": { demand: 10, supply: 15 },
    "Ajah": { demand: 35, supply: 12 },
    "Maryland": { demand: 18, supply: 16 },
    "Festac": { demand: 12, supply: 14 },
};

let pricingSettings: PricingSettings = {
    maxSurgeCap: 2.5,
    peakHourMultiplier: 1.15, // 15% increase during peak hours
};

// Simulate demand fluctuations
setInterval(() => {
    for (const location in surgeState) {
        surgeState[location].demand += Math.floor(Math.random() * 5) - 2; // Fluctuate by -2 to +2
        surgeState[location].supply += Math.floor(Math.random() * 3) - 1; // Fluctuate by -1 to +1
        if (surgeState[location].demand < 5) surgeState[location].demand = 5;
        if (surgeState[location].supply < 5) surgeState[location].supply = 5;
    }
}, 5000);

const calculateSurgePricing = (pickup: string): { multiplier: number, reason: string } => {
    const zone = surgeState[pickup];
    if (!zone) return { multiplier: 1.0, reason: "Normal fares." };

    const demandRatio = zone.demand / zone.supply;
    let multiplier = 1.0;

    if (demandRatio > 1.2) multiplier = 1.25;
    if (demandRatio > 1.5) multiplier = 1.5;
    if (demandRatio > 2.0) multiplier = 1.8;
    if (demandRatio > 2.5) multiplier = 2.2;

    const currentHour = new Date().getHours();
    const isPeakHour = (currentHour >= 7 && currentHour <= 10) || (currentHour >= 16 && currentHour <= 19);
    
    if (isPeakHour) {
        multiplier *= pricingSettings.peakHourMultiplier;
    }

    multiplier = parseFloat(multiplier.toFixed(2));
    if (multiplier > pricingSettings.maxSurgeCap) {
        multiplier = pricingSettings.maxSurgeCap;
    }
    
    let reason = "Fares are normal.";
    if (multiplier > 1.1) reason = "Fares are slightly higher due to demand.";
    if (multiplier > 1.4) reason = "Fares are higher due to increased demand.";
    if (multiplier > 1.9) reason = "Fares are much higher due to very high demand.";

    return { multiplier, reason };
};


// --- END DYNAMIC PRICING ---


const generateSeatLayout = (): SeatLayout => {
  const layout: SeatLayout = [];
  let availableCount = 40;
  for (let i = 0; i < 10; i++) {
    const row = [
      { id: `A${i + 1}`, status: Math.random() > 0.7 && availableCount > 0 ? (availableCount--, SeatStatus.Booked) : SeatStatus.Available },
      { id: `B${i + 1}`, status: Math.random() > 0.7 && availableCount > 0 ? (availableCount--, SeatStatus.Booked) : SeatStatus.Available },
      { id: 'aisle', status: SeatStatus.Aisle },
      { id: `C${i + 1}`, status: Math.random() > 0.6 && availableCount > 0 ? (availableCount--, SeatStatus.Booked) : SeatStatus.Available },
      { id: `D${i + 1}`, status: Math.random() > 0.8 && availableCount > 0 ? (availableCount--, SeatStatus.Booked) : SeatStatus.Available },
    ];
    layout.push(row);
  }
  return layout;
};


const mockBuses: Omit<Bus, 'from' | 'to'>[] = [
  {
    id: 'bus1',
    operator: 'GIGM',
    operatorLogo: 'https://picsum.photos/seed/gigm/40/40',
    departureTime: '08:00',
    arrivalTime: '10:30',
    duration: '2h 30m',
    price: 8500,
    rating: 4.5,
    reviews: 120,
    amenities: { ac: true, wifi: true, power: true, sleeper: false },
    seatLayout: generateSeatLayout(),
  },
  {
    id: 'bus2',
    operator: 'God Is Good Motors',
    operatorLogo: 'https://picsum.photos/seed/godisgood/40/40',
    departureTime: '09:15',
    arrivalTime: '11:45',
    duration: '2h 30m',
    price: 9200,
    rating: 4.8,
    reviews: 250,
    amenities: { ac: true, wifi: true, power: true, sleeper: true },
    seatLayout: generateSeatLayout(),
  },
  {
    id: 'bus3',
    operator: 'Chisco Transport',
    operatorLogo: 'https://picsum.photos/seed/chisco/40/40',
    departureTime: '11:00',
    arrivalTime: '13:45',
    duration: '2h 45m',
    price: 7800,
    rating: 4.2,
    reviews: 95,
    amenities: { ac: true, wifi: false, power: true, sleeper: false },
    seatLayout: generateSeatLayout(),
  },
  {
    id: 'bus4',
    operator: 'ABC Transport',
    operatorLogo: 'https://picsum.photos/seed/abc/40/40',
    departureTime: '14:30',
    arrivalTime: '17:00',
    duration: '2h 30m',
    price: 8800,
    rating: 4.6,
    reviews: 180,
    amenities: { ac: true, wifi: true, power: false, sleeper: false },
    seatLayout: generateSeatLayout(),
  },
    {
    id: 'bus5',
    operator: 'Young Shall Grow',
    operatorLogo: 'https://picsum.photos/seed/young/40/40',
    departureTime: '07:30',
    arrivalTime: '10:15',
    duration: '2h 45m',
    price: 7500,
    rating: 4.0,
    reviews: 88,
    amenities: { ac: true, wifi: false, power: false, sleeper: false },
    seatLayout: generateSeatLayout(),
  },
];

export const getLagosLocations = async (): Promise<string[]> => {
  return new Promise(resolve => setTimeout(() => resolve(LAGOS_LOCATIONS), 200));
};

export const searchBuses = async (params: SearchParams): Promise<Bus[]> => {
  console.log('Searching for buses with params:', params);
  return new Promise(resolve => {
    setTimeout(() => {
        const results = mockBuses.map(bus => {
            const totalSeats = bus.seatLayout.flat().filter(s => s.status !== SeatStatus.Aisle).length;
            const bookedSeats = bus.seatLayout.flat().filter(s => s.status === SeatStatus.Booked).length;
            const occupancy = bookedSeats / totalSeats;
            let finalPrice = bus.price;
            let originalPrice: number | undefined = undefined;

            if (occupancy > 0.8) { // If bus is over 80% full
                originalPrice = finalPrice;
                finalPrice = Math.round(finalPrice * 1.25);
            }

            return {
                ...bus,
                from: params.from,
                to: params.to,
                price: finalPrice,
                originalPrice,
            }
        });
        resolve(results);
    }, 1000);
  });
};

export const bookSeats = async (busId: string, seatIds: string[]): Promise<{ bookingId: string, success: boolean }> => {
    console.log(`Booking seats ${seatIds.join(', ')} on bus ${busId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ bookingId: `LR${Date.now()}`, success: true });
        }, 1500);
    });
}

// --- Ride-Hailing API additions ---

let mockDrivers: Driver[] = [
  {
    id: 'driver1',
    name: 'Tunde Adebayo',
    email: 'tunde@example.com',
    rating: 4.9,
    photoUrl: 'https://i.pravatar.cc/150?u=driver1',
    vehicle: { make: 'Toyota', model: 'Camry', year: 2021, color: 'Silver', licensePlate: 'LSD 123XY' },
    status: 'approved',
  },
  {
    id: 'driver2',
    name: 'Chioma Okoro',
    email: 'chioma@example.com',
    rating: 4.8,
    photoUrl: 'https://i.pravatar.cc/150?u=driver2',
    vehicle: { make: 'Honda', model: 'Accord', year: 2020, color: 'Black', licensePlate: 'APP 456YZ' },
    status: 'approved',
  },
  {
    id: 'driver3',
    name: 'Musa Ibrahim',
    email: 'musa@example.com',
    rating: 4.9,
    photoUrl: 'https://i.pravatar.cc/150?u=driver3',
    vehicle: { make: 'Lexus', model: 'RX 350', year: 2022, color: 'White', licensePlate: 'GGE 789AB' },
    status: 'pending',
  },
  {
    id: 'driver4',
    name: 'Funke Akindele',
    email: 'funke@example.com',
    rating: 4.7,
    photoUrl: 'https://i.pravatar.cc/150?u=driver4',
    vehicle: { make: 'Kia', model: 'Seltos', year: 2021, color: 'Red', licensePlate: 'KJA 321BC' },
    status: 'approved',
  },
  {
    id: 'driver5',
    name: 'David Adeleke',
    email: 'david@example.com',
    rating: 4.9,
    photoUrl: 'https://i.pravatar.cc/150?u=driver5',
    vehicle: { make: 'Mercedes-Benz', model: 'C-Class', year: 2023, color: 'Blue', licensePlate: 'FST 999CD' },
    status: 'pending',
  },
];

export const registerDriver = async (driverData: any): Promise<{ success: boolean, message: string }> => {
  console.log('Registering driver:', driverData);
  const newDriver: Driver = {
    id: `driver${Date.now()}`,
    name: driverData.fullName,
    email: driverData.email,
    rating: 0,
    photoUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
    vehicle: {
      make: driverData.make,
      model: driverData.model,
      year: parseInt(driverData.year),
      color: driverData.color,
      licensePlate: driverData.licensePlate,
    },
    status: 'pending'
  };
  mockDrivers.push(newDriver);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: 'Registration successful! We will review your documents and get back to you.' });
    }, 2000);
  });
};

export const getRideOptions = async (params: RideRequestParams): Promise<{options: RideOption[], surgeReason: string}> => {
    console.log('Getting ride options for:', params);
    const basePrice = Math.floor(Math.random() * 2000) + 1500; // Random price between 1500 and 3500
    const { multiplier, reason } = calculateSurgePricing(params.pickup);

    const applySurge = (price: number) => {
        return {
            finalPrice: Math.round(price * multiplier),
            originalPrice: multiplier > 1.0 ? price : undefined
        }
    }

    return new Promise(resolve => {
        setTimeout(() => {
            const options: RideOption[] = [
                { 
                    id: 'carpool', type: 'Carpool', 
                    price: applySurge(Math.round(basePrice * 0.7)).finalPrice, 
                    originalPrice: applySurge(Math.round(basePrice * 0.7)).originalPrice,
                    surgeMultiplier: multiplier,
                    eta: '7 mins', capacity: 2 
                },
                { 
                    id: 'standard', type: 'Standard', 
                    price: applySurge(basePrice).finalPrice,
                    originalPrice: applySurge(basePrice).originalPrice,
                    surgeMultiplier: multiplier,
                    eta: '5 mins', capacity: 4 
                },
                { 
                    id: 'premium', type: 'Premium',
                    price: applySurge(Math.round(basePrice * 1.5)).finalPrice,
                    originalPrice: applySurge(Math.round(basePrice * 1.5)).originalPrice,
                    surgeMultiplier: multiplier,
                    eta: '4 mins', capacity: 4 
                },
            ];
            resolve({ options, surgeReason: reason });
        }, 1000);
    });
};

export const requestRide = async (rideOption: RideOption, params: RideRequestParams): Promise<ActiveRide> => {
    console.log('Requesting ride:', rideOption, params);
    return new Promise(resolve => {
        setTimeout(() => {
            const availableDrivers = mockDrivers.filter(d => d.status === 'approved');
            const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
            
            // Add fare to driver's wallet
            const driverWallet = mockDriverWallets[driver.id];
            if (driverWallet) {
                const fare = rideOption.price;
                const platformFee = fare * 0.20;
                const earnings = fare - platformFee;
                driverWallet.balance += earnings;
                const newTransaction: Transaction = {
                    id: `txn_d_${Date.now()}`,
                    date: new Date().toISOString(),
                    amount: earnings,
                    type: 'credit',
                    status: 'completed',
                    description: `Fare from ${params.pickup} to ${params.destination}`,
                };
                driverWallet.transactions.unshift(newTransaction);
            }

            resolve({
                id: `RIDE${Date.now()}`,
                driver,
                rideOption,
                pickup: params.pickup,
                destination: params.destination,
                status: 'en_route_to_pickup',
            });
        }, 2000);
    });
};

// --- Driver Dashboard API ---

const mockRideHistory: RideHistoryItem[] = Array.from({ length: 15 }).map((_, i) => {
    const fare = Math.floor(Math.random() * 3000) + 1000;
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
        id: `trip${i}`,
        date: date.toISOString().split('T')[0],
        pickup: LAGOS_LOCATIONS[Math.floor(Math.random() * LAGOS_LOCATIONS.length)],
        destination: LAGOS_LOCATIONS[Math.floor(Math.random() * LAGOS_LOCATIONS.length)],
        fare,
        tip: Math.random() > 0.6 ? Math.floor(Math.random() * 500) : 0,
        riderRating: Math.floor(Math.random() * 2) + 4, // 4 or 5
    };
});

export const getDriverDashboardData = async (driverId: string): Promise<DriverDashboardData> => {
    console.log(`Fetching dashboard data for driver ${driverId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const totalEarnings = mockRideHistory.reduce((sum, trip) => sum + trip.fare + trip.tip, 0);
            const weeklyEarnings = mockRideHistory
                .filter(trip => new Date(trip.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                .reduce((sum, trip) => sum + trip.fare + trip.tip, 0);
            const averageRating = mockRideHistory.reduce((sum, trip) => sum + trip.riderRating, 0) / mockRideHistory.length;

            resolve({
                totalEarnings,
                weeklyEarnings,
                averageRating: parseFloat(averageRating.toFixed(2)),
                totalTrips: mockRideHistory.length,
                tripHistory: mockRideHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                wallet: mockDriverWallets[driverId],
            });
        }, 1200);
    });
};

// --- Admin Panel API ---

export const adminLogin = async (password: string): Promise<{ success: boolean }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: password === 'admin123' });
        }, 1000);
    });
};

const mockAdminUsers: AdminUser[] = [
    { id: 'user1', name: 'Bolanle Adeoye', email: 'bolanle@example.com', joinDate: '2023-01-15', tripCount: 25 },
    { id: 'user2', name: 'Emeka Nwosu', email: 'emeka@example.com', joinDate: '2023-02-20', tripCount: 12 },
    { id: 'user3', name: 'Aisha Bello', email: 'aisha@example.com', joinDate: '2023-03-10', tripCount: 40 },
    { id: 'user4', name: 'Femi Otedola', email: 'femi@example.com', joinDate: '2023-04-05', tripCount: 5 },
    { id: 'user5', name: 'Zainab Balogun', email: 'zainab@example.com', joinDate: '2023-05-22', tripCount: 33 },
];

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const totalRevenue = mockRideHistory.reduce((sum, trip) => sum + trip.fare + trip.tip, 0) * 15; // Simulate more trips
            resolve({
                totalRevenue: totalRevenue,
                totalTrips: mockRideHistory.length * 15,
                totalDrivers: mockDrivers.length,
                totalUsers: mockAdminUsers.length,
                monthlyRevenue: [
                    { month: 'Jan', revenue: 120500 },
                    { month: 'Feb', revenue: 180000 },
                    { month: 'Mar', revenue: 165000 },
                    { month: 'Apr', revenue: 210000 },
                ]
            });
        }, 800);
    });
};

export const getAdminDrivers = async (): Promise<Driver[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockDrivers), 500));
};

export const approveDriver = async (driverId: string): Promise<{ success: boolean }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            mockDrivers = mockDrivers.map(d => d.id === driverId ? { ...d, status: 'approved' } : d);
            resolve({ success: true });
        }, 700);
    });
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockAdminUsers), 500));
};

export const getAdminTripLogs = async (): Promise<AdminTripLog[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const rideLogs: AdminTripLog[] = mockRideHistory.map(r => ({
                id: r.id,
                type: 'Ride',
                userName: mockAdminUsers[Math.floor(Math.random() * mockAdminUsers.length)].name,
                date: r.date,
                details: `${r.pickup} to ${r.destination}`,
                amount: r.fare + r.tip,
                status: 'Completed',
            }));
            // Add some mock bus logs for variety
            const busLogs: AdminTripLog[] = [
                { id: 'buslog1', type: 'Bus', userName: 'Aisha Bello', date: '2023-05-20', details: 'Ikeja to Ajah', amount: 8500, status: 'Booked'},
                { id: 'buslog2', type: 'Bus', userName: 'Emeka Nwosu', date: '2023-05-18', details: 'Yaba to Lekki', amount: 9200, status: 'Booked'},
            ];
            resolve([...rideLogs, ...busLogs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }, 900);
    });
};

export const getLiveVehicleData = async (): Promise<LiveVehicle[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const approvedDrivers = mockDrivers.filter(d => d.status === 'approved');
            const activeVehicles: LiveVehicle[] = [];

            // Simulate some active rides
            for (let i = 0; i < 5; i++) {
                const driver = approvedDrivers[i % approvedDrivers.length];
                activeVehicles.push({
                    id: `ride_${i}`,
                    position: { x: Math.random() * 95, y: Math.random() * 95 },
                    details: {
                        type: 'ride',
                        driverName: driver.name,
                        driverPhoto: driver.photoUrl,
                        vehicle: `${driver.vehicle.make} ${driver.vehicle.model}`,
                        pickup: LAGOS_LOCATIONS[Math.floor(Math.random() * LAGOS_LOCATIONS.length)],
                        destination: LAGOS_LOCATIONS[Math.floor(Math.random() * LAGOS_LOCATIONS.length)],
                        rideType: ['Standard', 'Premium', 'Carpool'][Math.floor(Math.random()*3)]
                    }
                });
            }

            // Simulate some active buses
            for (let i = 0; i < 3; i++) {
                const bus = mockBuses[i];
                activeVehicles.push({
                    id: `bus_${i}`,
                    position: { x: Math.random() * 95, y: Math.random() * 95 },
                    details: {
                        type: 'bus',
                        operator: bus.operator,
                        from: LAGOS_LOCATIONS[i],
                        to: LAGOS_LOCATIONS[LAGOS_LOCATIONS.length - 1 - i],
                        status: 'En Route'
                    }
                });
            }
            resolve(activeVehicles);
        }, 1000);
    });
};

// --- Admin Pricing API ---
export const getSurgeZones = async (): Promise<SurgeZone[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const zones = Object.entries(surgeState).map(([name, data]) => ({
                name,
                ...data,
                multiplier: parseFloat(calculateSurgePricing(name).multiplier.toFixed(2)),
            }));
            resolve(zones);
        }, 400);
    });
};

export const getPricingSettings = async (): Promise<PricingSettings> => {
     return new Promise(resolve => setTimeout(() => resolve(pricingSettings), 200));
}

export const updatePricingSettings = async (settings: Partial<PricingSettings>): Promise<{ success: boolean }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            pricingSettings = { ...pricingSettings, ...settings };
            resolve({ success: true });
        }, 600);
    });
};

// --- PAYMENT & WALLET API ---

let mockUserWallet: Wallet = {
    balance: 0,
    transactions: [
        { id: 'txn1', date: '2023-05-20T10:00:00Z', amount: 3500, type: 'debit', status: 'completed', description: 'Ride: Ikeja to Lekki' },
        { id: 'txn2', date: '2023-05-18T14:30:00Z', amount: 8500, type: 'debit', status: 'completed', description: 'Bus: GIGM - Yaba to Ajah' },
    ],
};

let mockDriverWallets: { [driverId: string]: Wallet } = {
    'driver1': {
        balance: 25600.50,
        transactions: [
            { id: 'dtxn1', date: '2023-05-20T10:30:00Z', amount: 2800, type: 'credit', status: 'completed', description: 'Fare: Ikeja to Lekki' },
            { id: 'dtxn2', date: '2023-05-19T18:00:00Z', amount: 2200, type: 'credit', status: 'completed', description: 'Fare: Surulere to VI' },
            { id: 'dtxn3', date: '2023-05-18T09:00:00Z', amount: 500, type: 'tip', status: 'completed', description: 'Tip from rider' },
        ],
    },
    'driver2': { balance: 18250.00, transactions: [] },
    'driver4': { balance: 35200.00, transactions: [] },
};

let mockPayoutRequests: PayoutRequest[] = [
    { id: 'payout1', driverId: 'driver2', driverName: 'Chioma Okoro', amount: 15000, date: new Date().toISOString(), status: 'pending' },
];

export const processPayment = async (amount: number, description: string): Promise<{ success: boolean; transactionId: string; }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newTransaction: Transaction = {
                id: `txn_${Date.now()}`,
                date: new Date().toISOString(),
                amount: amount,
                type: 'debit',
                status: 'completed',
                description: description,
            };
            mockUserWallet.transactions.unshift(newTransaction);
            resolve({ success: true, transactionId: newTransaction.id });
        }, 1500);
    });
}

export const getUserWallet = async (): Promise<Wallet> => {
    return new Promise(resolve => setTimeout(() => resolve(mockUserWallet), 500));
}

export const getDriverWallet = async (driverId: string): Promise<Wallet> => {
     return new Promise(resolve => setTimeout(() => resolve(mockDriverWallets[driverId]), 500));
}

export const requestDriverPayout = async (driverId: string, amount: number): Promise<{ success: boolean; }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const driver = mockDrivers.find(d => d.id === driverId);
            if (!driver) return resolve({ success: false });

            const newPayout: PayoutRequest = {
                id: `payout_${Date.now()}`,
                driverId: driverId,
                driverName: driver.name,
                amount: amount,
                date: new Date().toISOString(),
                status: 'pending',
            };
            mockPayoutRequests.unshift(newPayout);
            
            // Deduct from driver's balance and add pending transaction
            const driverWallet = mockDriverWallets[driverId];
            driverWallet.balance -= amount;
            driverWallet.transactions.unshift({
                id: newPayout.id,
                date: newPayout.date,
                amount: amount,
                type: 'payout',
                status: 'pending',
                description: 'Payout to bank account',
            });
            
            resolve({ success: true });
        }, 1000);
    });
};

export const getPendingPayouts = async (): Promise<PayoutRequest[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockPayoutRequests.filter(p => p.status === 'pending')), 600));
};

export const approvePayout = async (payoutId: string): Promise<{ success: boolean; }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const payout = mockPayoutRequests.find(p => p.id === payoutId);
            if (payout) {
                payout.status = 'completed';
                const driverWallet = mockDriverWallets[payout.driverId];
                const transaction = driverWallet.transactions.find(t => t.id === payoutId);
                if (transaction) {
                    transaction.status = 'completed';
                }
            }
            resolve({ success: payout ? true : false });
        }, 800);
    });
};
