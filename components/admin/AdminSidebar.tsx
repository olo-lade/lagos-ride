
import React from 'react';
import { DashboardIcon, SteeringWheelIcon, UsersIcon, ClipboardListIcon, LogoutIcon, TicketIcon, MapIcon, CogIcon, CashIcon } from '../icons';

type AdminView = 'dashboard' | 'drivers' | 'users' | 'trips' | 'live_map' | 'pricing' | 'financials';

interface AdminSidebarProps {
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
    onLogout: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
            isActive
                ? 'bg-brand-primary text-white shadow'
                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </button>
);


const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView, onLogout }) => {
    return (
        <div className="w-64 bg-brand-dark text-white flex flex-col p-4 space-y-2">
            <div className="flex items-center space-x-2 p-2 mb-4">
                <TicketIcon className="h-8 w-8 text-brand-secondary" />
                <span className="text-xl font-bold">Lagos Ride Admin</span>
            </div>
            <nav className="flex-grow">
                 <ul className="space-y-2">
                    <li><NavItem icon={<DashboardIcon className="h-5 w-5" />} label="Dashboard" isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} /></li>
                    <li><NavItem icon={<MapIcon className="h-5 w-5" />} label="Live Map" isActive={activeView === 'live_map'} onClick={() => setActiveView('live_map')} /></li>
                    <li><NavItem icon={<CashIcon className="h-5 w-5" />} label="Financials" isActive={activeView === 'financials'} onClick={() => setActiveView('financials')} /></li>
                    <li><NavItem icon={<SteeringWheelIcon className="h-5 w-5" />} label="Drivers" isActive={activeView === 'drivers'} onClick={() => setActiveView('drivers')} /></li>
                    <li><NavItem icon={<UsersIcon className="h-5 w-5" />} label="Users" isActive={activeView === 'users'} onClick={() => setActiveView('users')} /></li>
                    <li><NavItem icon={<ClipboardListIcon className="h-5 w-5" />} label="Trip Logs" isActive={activeView === 'trips'} onClick={() => setActiveView('trips')} /></li>
                    <li><NavItem icon={<CogIcon className="h-5 w-5" />} label="Pricing" isActive={activeView === 'pricing'} onClick={() => setActiveView('pricing')} /></li>
                </ul>
            </nav>
            <div>
                 <NavItem icon={<LogoutIcon className="h-5 w-5" />} label="Logout" isActive={false} onClick={onLogout} />
            </div>
        </div>
    );
};

export default AdminSidebar;
