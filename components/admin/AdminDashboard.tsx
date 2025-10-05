
import React, { useState, useEffect } from 'react';
import { getAdminDashboardStats, getSurgeZones } from '../../services/mockApi';
import { AdminDashboardStats, SurgeZone } from '../../types';
import { ChartBarIcon, SteeringWheelIcon, UsersIcon, TicketIcon, ZapIcon } from '../icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform hover:scale-105">
        <div className="bg-brand-primary/10 p-4 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [surgeZones, setSurgeZones] = useState<SurgeZone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [statsData, surgeData] = await Promise.all([
                getAdminDashboardStats(),
                getSurgeZones()
            ]);
            setStats(statsData);
            setSurgeZones(surgeData);
            setIsLoading(false);
        };
        fetchData();
    }, []);
    
    const averageSurge = surgeZones.length > 0
        ? (surgeZones.reduce((sum, zone) => sum + zone.multiplier, 0) / surgeZones.length).toFixed(2)
        : '1.00';

    const surgeHotspots = [...surgeZones].sort((a, b) => b.multiplier - a.multiplier).slice(0, 3);

    if (isLoading || !stats) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-80 bg-gray-200 rounded-xl"></div>
                    <div className="h-80 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`₦${stats.totalRevenue.toLocaleString()}`}
                    icon={<ChartBarIcon className="h-7 w-7 text-brand-primary" />}
                />
                <StatCard 
                    title="Total Trips" 
                    value={stats.totalTrips.toLocaleString()}
                    icon={<TicketIcon className="h-7 w-7 text-brand-primary" />}
                />
                 <StatCard 
                    title="Registered Drivers" 
                    value={stats.totalDrivers.toLocaleString()}
                    icon={<SteeringWheelIcon className="h-7 w-7 text-brand-primary" />}
                />
                <StatCard 
                    title="Active Users" 
                    value={stats.totalUsers.toLocaleString()}
                    icon={<UsersIcon className="h-7 w-7 text-brand-primary" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Revenue</h2>
                     <div className="h-80 flex items-end space-x-4 p-4 bg-gray-50 rounded-lg">
                        {stats.monthlyRevenue.map((monthData) => (
                            <div key={monthData.month} className="flex-1 flex flex-col items-center">
                                <div 
                                    className="w-full bg-brand-primary rounded-t-md hover:bg-teal-600 transition-colors"
                                    style={{ height: `${(monthData.revenue / 250000) * 100}%` }}
                                ></div>
                                <span className="text-xs font-medium text-gray-600 mt-2">{monthData.month}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">A simple visual representation of revenue trends.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Live Surge Status</h2>
                    <div className="text-center bg-amber-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-amber-800">City-Wide Average</p>
                        <p className="text-4xl font-extrabold text-amber-600 my-2">{averageSurge}x</p>
                        <div className="flex justify-center items-center space-x-1 text-xs text-amber-700">
                            <ZapIcon className="h-4 w-4" />
                            <span>Dynamic pricing is active</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-700">Current Hotspots</h3>
                        <ul className="space-y-2 mt-2">
                            {surgeHotspots.map(zone => (
                                <li key={zone.name} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                    <span className="text-sm font-medium text-gray-800">{zone.name}</span>
                                    <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{zone.multiplier}x</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
