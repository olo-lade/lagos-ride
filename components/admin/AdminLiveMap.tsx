
import React, { useState, useEffect } from 'react';
import { getLiveVehicleData } from '../../services/mockApi';
import { LiveVehicle } from '../../types';
import { CarIcon, TicketIcon, XIcon, ArrowRightIcon } from '../icons';

const VehicleMarker: React.FC<{ vehicle: LiveVehicle; onSelect: (vehicle: LiveVehicle) => void; }> = ({ vehicle, onSelect }) => {
    const isBus = vehicle.details.type === 'bus';
    const markerColor = isBus ? 'bg-blue-500' : 'bg-purple-500';
    const icon = isBus ? <TicketIcon className="h-4 w-4 text-white" /> : <CarIcon className="h-4 w-4 text-white" />;

    return (
        <button
            onClick={() => onSelect(vehicle)}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center ${markerColor} shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:z-10`}
            style={{ left: `${vehicle.position.x}%`, top: `${vehicle.position.y}%` }}
            aria-label={`Select vehicle ${vehicle.id}`}
        >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-inherit opacity-75"></span>
            {icon}
        </button>
    );
};

const VehicleDetailCard: React.FC<{ vehicle: LiveVehicle; onClose: () => void }> = ({ vehicle, onClose }) => {
    const { details } = vehicle;
    const isBus = details.type === 'bus';

    return (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-2xl p-4 z-20 animate-fade-in-right">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-800">{isBus ? 'Bus Details' : 'Ride Details'}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XIcon className="h-5 w-5" />
                </button>
            </div>
            {isBus ? (
                <div className="space-y-2 text-sm">
                    <p><strong>Operator:</strong> <span className="font-medium text-brand-primary">{details.operator}</span></p>
                    <div className="flex items-center text-gray-600">
                        <span>{details.from}</span>
                        <ArrowRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                        <span>{details.to}</span>
                    </div>
                    <p><strong>Status:</strong> <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{details.status}</span></p>
                </div>
            ) : (
                <div>
                     <div className="flex items-center space-x-3 mb-3">
                        <img src={details.driverPhoto} alt={details.driverName} className="w-12 h-12 rounded-full" />
                        <div>
                            <p className="font-bold">{details.driverName}</p>
                            <p className="text-sm text-gray-500">{details.vehicle}</p>
                        </div>
                     </div>
                     <div className="space-y-2 text-sm border-t pt-2">
                        <p><strong>Type:</strong> <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{details.rideType}</span></p>
                        <div className="flex items-center text-gray-600">
                           <span>{details.pickup}</span>
                           <ArrowRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                           <span>{details.destination}</span>
                        </div>
                     </div>
                </div>
            )}
        </div>
    );
};

const AdminLiveMap: React.FC = () => {
    const [vehicles, setVehicles] = useState<LiveVehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getLiveVehicleData();
            setVehicles(data);
            setIsLoading(false);
        };
        fetchData();
        
        // Refresh data every 10 seconds to simulate real-time updates
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);

    }, []);

    return (
        <div className="relative h-[calc(100vh-8rem)] bg-white rounded-xl shadow-md overflow-hidden">
            {isLoading && (
                 <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center z-30">
                     <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 </div>
            )}
            
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://i.imgur.com/8O0zF2j.png')" }} // A stylized, generic map of Lagos
            >
                {vehicles.map(vehicle => (
                    <VehicleMarker key={vehicle.id} vehicle={vehicle} onSelect={setSelectedVehicle} />
                ))}
            </div>

            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <h4 className="font-bold mb-2 text-sm">Legend</h4>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-purple-500"></div><span className="text-xs">Ride</span></div>
                    <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-blue-500"></div><span className="text-xs">Bus</span></div>
                </div>
            </div>

            {selectedVehicle && (
                <VehicleDetailCard vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
            )}
        </div>
    );
};

export default AdminLiveMap;