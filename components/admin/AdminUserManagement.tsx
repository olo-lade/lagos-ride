
import React, { useState, useEffect } from 'react';
import { getAdminUsers } from '../../services/mockApi';
import { AdminUser } from '../../types';

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const data = await getAdminUsers();
            setUsers(data);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    return (
         <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Trips</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                                </tr>
                            ))
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{user.tripCount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;
