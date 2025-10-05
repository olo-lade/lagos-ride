
import React, { useState, useEffect, useCallback } from 'react';
import { getAdminDrivers, approveDriver } from '../../services/mockApi';
import { Driver } from '../../types';
import { CheckCircleIcon, ClockIcon } from '../icons';

const StatusBadge: React.FC<{ status: Driver['status'] }> = ({ status }) => {
    const isApproved = status === 'approved';
    const bgColor = isApproved ? 'bg-green-100' : 'bg-yellow-100';
    const textColor = isApproved ? 'text-green-800' : 'text-yellow-800';
    const icon = isApproved ? <CheckCircleIcon className="h-4 w-4 mr-1" /> : <ClockIcon className="h-4 w-4 mr-1" />;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
            {icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};


const AdminDriverManagement: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDrivers = useCallback(async () => {
        setIsLoading(true);
        const data = await getAdminDrivers();
        setDrivers(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const handleApprove = async (driverId: string) => {
        await approveDriver(driverId);
        // Refresh the list to show the updated status
        fetchDrivers();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">All Drivers</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                                </tr>
                            ))
                        ) : (
                            drivers.map((driver) => (
                                <tr key={driver.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={driver.photoUrl} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                                <div className="text-sm text-gray-500">{driver.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.year})</div>
                                        <div className="text-sm text-gray-500 font-mono">{driver.vehicle.licensePlate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.rating.toFixed(1)} ★</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={driver.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {driver.status === 'pending' && (
                                            <button 
                                                onClick={() => handleApprove(driver.id)}
                                                className="bg-brand-secondary text-brand-dark text-xs font-bold py-1 px-3 rounded-full hover:bg-amber-400 transition"
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDriverManagement;
