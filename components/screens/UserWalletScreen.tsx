
import React, { useState, useEffect } from 'react';
import { getUserWallet } from '../../services/mockApi';
import { Wallet, Transaction } from '../../types';
import { WalletIcon } from '../icons';

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    return (
        <li className="py-4 px-2 flex justify-between items-center hover:bg-gray-50 rounded-lg">
            <div>
                <p className="font-medium text-gray-800">{transaction.description}</p>
                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleString()}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-red-600">-₦{transaction.amount.toLocaleString()}</p>
                 <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                </span>
            </div>
        </li>
    );
};


const UserWalletScreen: React.FC = () => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWallet = async () => {
            setIsLoading(true);
            const data = await getUserWallet();
            setWallet(data);
            setIsLoading(false);
        };
        fetchWallet();
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center space-x-3 mb-6">
                    <WalletIcon className="h-8 w-8 text-brand-primary" />
                    <h1 className="text-3xl font-bold text-gray-800">My Wallet</h1>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h2>
                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    ) : wallet && wallet.transactions.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {wallet.transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-8">You have no transactions yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserWalletScreen;
