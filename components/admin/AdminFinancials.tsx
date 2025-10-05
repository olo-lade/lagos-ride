
import React, { useState, useEffect, useCallback } from 'react';
import { getPendingPayouts, approvePayout } from '../../services/mockApi';
import { PayoutRequest } from '../../types';

const AdminFinancials: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'payouts' | 'transactions'>('payouts');
    const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPayouts = useCallback(async () => {
        setIsLoading(true);
        const data = await getPendingPayouts();
        setPayouts(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (activeTab === 'payouts') {
            fetchPayouts();
        }
    }, [activeTab, fetchPayouts]);

    const handleApprovePayout = async (payoutId: string) => {
        await approvePayout(payoutId);
        // Refresh the list
        fetchPayouts();
    };

    return (
        <div>
             <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('payouts')} className={`${activeTab === 'payouts' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Pending Payouts
                    </button>
                    <button onClick={() => setActiveTab('transactions')} className={`${activeTab === 'transactions' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Transaction Log
                    </button>
                </nav>
            </div>
            
            {activeTab === 'payouts' && (
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Driver Payout Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="text-center p-4">Loading...</td></tr>
                                ) : payouts.length > 0 ? (
                                    payouts.map((payout) => (
                                        <tr key={payout.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{payout.driverName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-semibold">₦{payout.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(payout.date).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleApprovePayout(payout.id)}
                                                    className="bg-green-100 text-green-800 text-xs font-bold py-1 px-3 rounded-full hover:bg-green-200 transition"
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                     <tr><td colSpan={4} className="text-center p-8 text-gray-500">No pending payouts.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeTab === 'transactions' && (
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Full Transaction Log</h2>
                     <p className="text-gray-500">This feature is under development and will be available soon.</p>
                     <p className="text-gray-400 text-sm mt-2">A complete, filterable log of all platform financial activities will be displayed here.</p>
                </div>
            )}

        </div>
    );
};

export default AdminFinancials;
