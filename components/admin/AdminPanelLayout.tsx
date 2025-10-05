
import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminDriverManagement from './AdminDriverManagement';
import AdminUserManagement from './AdminUserManagement';
import AdminTripLogs from './AdminTripLogs';
import AdminLiveMap from './AdminLiveMap';
import AdminPricingManagement from './AdminPricingManagement';
import AdminFinancials from './AdminFinancials';

type AdminView = 'dashboard' | 'drivers' | 'users' | 'trips' | 'live_map' | 'pricing' | 'financials';

interface AdminPanelLayoutProps {
    onLogout: () => void;
}

const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');

    const renderView = () => {
        switch(activeView) {
            case 'dashboard': return <AdminDashboard />;
            case 'drivers': return <AdminDriverManagement />;
            case 'users': return <AdminUserManagement />;
            case 'trips': return <AdminTripLogs />;
            case 'live_map': return <AdminLiveMap />;
            case 'pricing': return <AdminPricingManagement />;
            case 'financials': return <AdminFinancials />;
            default: return <AdminDashboard />;
        }
    }

    const getHeaderTitle = () => {
         switch(activeView) {
            case 'dashboard': return 'Dashboard Overview';
            case 'drivers': return 'Driver Management';
            case 'users': return 'User Management';
            case 'trips': return 'Platform Trip Logs';
            case 'live_map': return 'Live Route Map';
            case 'pricing': return 'Dynamic Pricing Management';
            case 'financials': return 'Financials & Payouts';
            default: return 'Dashboard';
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b">
                    <h1 className="text-2xl font-bold text-gray-800">{getHeaderTitle()}</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Admin</span>
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">A</div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderView()}
                </main>
            </div>
        </div>
    );
}

export default AdminPanelLayout;
