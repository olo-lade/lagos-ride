
import React, { useState, useCallback } from 'react';
import { DriverDashboardData, RideHistoryItem, Transaction } from '../../types';
import { ChartBarIcon, StarIcon, SteeringWheelIcon, CashIcon } from '../icons';
import { requestDriverPayout } from '../../services/mockApi';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className="bg-brand-primary/10 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const TripHistoryCard: React.FC<{ trip: RideHistoryItem }> = ({ trip }) => (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-gray-800">{trip.pickup} → {trip.destination}</p>
                <p className="text-sm text-gray-500">{new Date(trip.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-brand-primary">₦{(trip.fare + trip.tip).toLocaleString()}</p>
                {trip.tip > 0 && <p className="text-xs text-green-600">includes ₦{trip.tip} tip</p>}
            </div>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600">Fare: ₦{trip.fare.toLocaleString()}</p>
            <div className="flex items-center space-x-1 text-amber-500">
                <span>{trip.riderRating.toFixed(1)}</span>
                <StarIcon className="h-4 w-4" />
            </div>
        </div>
    </div>
);

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isCredit = transaction.type === 'credit' || transaction.type === 'tip';
    const amountColor = isCredit ? 'text-green-600' : 'text-red-600';
    const sign = isCredit ? '+' : '-';

    return (
        <li className="py-3 flex justify-between items-center">
            <div>
                <p className="font-medium text-gray-800 capitalize">{transaction.description}</p>
                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleString()}</p>
            </div>
            <div className="text-right">
                <p className={`font-bold text-lg ${amountColor}`}>{sign}₦{transaction.amount.toLocaleString()}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {transaction.status}
                </span>
            </div>
        </li>
    );
};


interface DriverDashboardScreenProps {
    data: DriverDashboardData | null;
    isLoading: boolean;
}

const DriverDashboardScreen: React.FC<DriverDashboardScreenProps> = ({ data, isLoading }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'earnings'>('overview');
    const [payoutStatus, setPayoutStatus] = useState<string | null>(null);

    const handlePayout = useCallback(async () => {
        if (data && data.wallet.balance > 0) {
            setPayoutStatus("Processing...");
            // In a real app, you'd use the actual driver ID
            await requestDriverPayout('driver1', data.wallet.balance); 
            setPayoutStatus(`Payout of ₦${data.wallet.balance.toLocaleString()} requested!`);
             // You'd typically want to refresh data here
        }
    }, [data]);

    if (isLoading || !data) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
                 <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                 <div className="space-y-4">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                 </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Driver Dashboard</h1>
                
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('overview')} className={`${activeTab === 'overview' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Overview
                        </button>
                        <button onClick={() => setActiveTab('earnings')} className={`${activeTab === 'earnings' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Earnings & Payouts
                        </button>
                    </nav>
                </div>

                {activeTab === 'overview' && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard 
                                title="Total Earnings" 
                                value={`₦${data.totalEarnings.toLocaleString()}`} 
                                icon={<ChartBarIcon className="h-6 w-6 text-brand-primary" />}
                            />
                            <StatCard 
                                title="This Week" 
                                value={`₦${data.weeklyEarnings.toLocaleString()}`} 
                                icon={<CalendarIcon className="h-6 w-6 text-brand-primary" />}
                            />
                            <StatCard 
                                title="Average Rating" 
                                value={data.averageRating.toFixed(2)}
                                icon={<StarIcon className="h-6 w-6 text-brand-primary" />}
                            />
                            <StatCard 
                                title="Completed Trips" 
                                value={data.totalTrips.toString()}
                                icon={<SteeringWheelIcon className="h-6 w-6 text-brand-primary" />}
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Trips</h2>
                            {data.tripHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {data.tripHistory.map(trip => (
                                        <TripHistoryCard key={trip.id} trip={trip} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-lg shadow">
                                    <h3 className="text-xl font-bold text-gray-700">No Trips Yet</h3>
                                    <p className="text-gray-500 mt-2">Complete your first ride to see your history here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'earnings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                                <p className="text-gray-500 font-medium">Available Balance</p>
                                <p className="text-5xl font-extrabold text-brand-primary my-3">₦{data.wallet.balance.toLocaleString()}</p>
                                <button
                                    onClick={handlePayout}
                                    disabled={data.wallet.balance <= 0 || !!payoutStatus}
                                    className="w-full mt-4 bg-brand-secondary text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-amber-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
                                >
                                    Request Payout
                                </button>
                                {payoutStatus && <p className="text-sm text-gray-600 mt-3">{payoutStatus}</p>}
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
                            {data.wallet.transactions.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {data.wallet.transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No transactions yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Add CalendarIcon as it's used in this component
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default DriverDashboardScreen;
