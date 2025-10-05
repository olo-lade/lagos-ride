
import React, { useState, useEffect, useCallback } from 'react';
import { getSurgeZones, getPricingSettings, updatePricingSettings } from '../../services/mockApi';
import { SurgeZone, PricingSettings } from '../../types';

const AdminPricingManagement: React.FC = () => {
    const [zones, setZones] = useState<SurgeZone[]>([]);
    const [settings, setSettings] = useState<PricingSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const [zonesData, settingsData] = await Promise.all([
            getSurgeZones(),
            getPricingSettings()
        ]);
        setZones(zonesData);
        setSettings(settingsData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh data every 5 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) return;
        const { name, value } = e.target;
        setSettings({
            ...settings,
            [name]: parseFloat(value),
        });
    };

    const handleSaveSettings = async () => {
        if (!settings) return;
        setIsSaving(true);
        await updatePricingSettings(settings);
        setIsSaving(false);
        // Optionally show a success message
    };
    
    const getMultiplierColor = (multiplier: number) => {
        if (multiplier > 1.9) return 'text-red-600 bg-red-100';
        if (multiplier > 1.4) return 'text-orange-600 bg-orange-100';
        if (multiplier > 1.0) return 'text-yellow-800 bg-yellow-100';
        return 'text-green-800 bg-green-100';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Live Surge Zones</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demand (Users)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply (Drivers)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surge Multiplier</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                Array.from({length: 8}).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                                        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                                        <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                                    </tr>
                                ))
                            ) : (
                                zones.map(zone => (
                                    <tr key={zone.name}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.name}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{zone.demand}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{zone.supply}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${getMultiplierColor(zone.multiplier)}`}>
                                                {zone.multiplier.toFixed(2)}x
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing Algorithm Settings</h2>
                {settings ? (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="maxSurgeCap" className="block text-sm font-medium text-gray-700">Maximum Surge Cap</label>
                            <input
                                type="number"
                                id="maxSurgeCap"
                                name="maxSurgeCap"
                                value={settings.maxSurgeCap}
                                onChange={handleSettingsChange}
                                step="0.1"
                                min="1"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                            <p className="mt-1 text-xs text-gray-500">The absolute maximum multiplier allowed. e.g., 2.5 means fares cannot exceed 2.5x the base rate.</p>
                        </div>
                         <div>
                            <label htmlFor="peakHourMultiplier" className="block text-sm font-medium text-gray-700">Peak Hour Multiplier</label>
                            <input
                                type="number"
                                id="peakHourMultiplier"
                                name="peakHourMultiplier"
                                value={settings.peakHourMultiplier}
                                onChange={handleSettingsChange}
                                step="0.05"
                                min="1"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                            <p className="mt-1 text-xs text-gray-500">A base multiplier applied during peak commute hours (7-10am & 4-7pm). e.g., 1.15 for a 15% base increase.</p>
                        </div>
                        <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition duration-300"
                        >
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                ) : (
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
                        <div className="h-12 bg-gray-200 rounded w-full"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPricingManagement;
