
import React, { useState, useEffect } from 'react';
import { getAdminTripLogs } from '../../services/mockApi';
import { AdminTripLog } from '../../types';

const AdminTripLogs: React.FC = () => {
    const [trips, setTrips] = useState<AdminTripLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            setIsLoading(true);
            const data = await getAdminTripLogs();
            setTrips(data);
            setIsLoading(false);
        };
        fetchTrips();
    }, []);

    return (
         <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">All Trip Logs</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                             Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                </tr>
                            ))
                        ) : (
                            trips.map((trip) => (
                                <tr key={trip.id}>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trip.type === 'Bus' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                            {trip.type}
                                        </span>
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trip.userName}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.details}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(trip.date).toLocaleDateString()}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">₦{trip.amount.toLocaleString()}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTripLogs;
