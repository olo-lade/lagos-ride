
import React from 'react';
import { BookingDetails } from '../../types';

// A simple QR Code generator component (SVG)
const QRCode: React.FC<{ value: string }> = ({ value }) => {
    // This is a simplified placeholder. For a real app, a library would be better.
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(value)}`;
    return <img src={qrData} alt="QR Code" className="w-40 h-40 mx-auto" />;
};


const ConfirmationScreen: React.FC<{ details: BookingDetails }> = ({ details }) => {
  const { bus, selectedSeats, totalPrice, bookingId, date } = details;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl text-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-2">Your e-ticket has been sent to your email. You can also find the details below.</p>
        
        <div className="mt-8 border-dashed border-2 border-gray-300 rounded-xl p-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-mono font-bold text-lg text-brand-primary">{bookingId}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:text-right">
                    <p className="text-sm text-gray-500">Total Amount Paid</p>
                    <p className="font-bold text-lg">₦{totalPrice.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-6">
                <div className="flex-grow">
                    <h3 className="font-bold text-lg">{bus.operator}</h3>
                    <p className="text-gray-600">{bus.from} <span className="font-sans font-bold">→</span> {bus.to}</p>
                    <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Date:</strong> {formattedDate}</p>
                        <p><strong>Departure:</strong> {bus.departureTime}</p>
                        <p><strong>Arrival:</strong> {bus.arrivalTime}</p>
                        <p><strong>Seats:</strong> <span className="font-mono">{selectedSeats.map(s => s.id).join(', ')}</span></p>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <QRCode value={`Booking ID: ${bookingId}, Bus: ${bus.operator}, Seats: ${selectedSeats.map(s => s.id).join(',')}`} />
                    <p className="text-xs text-gray-500 text-center mt-2">Scan at boarding</p>
                </div>
            </div>
        </div>

        <button 
            onClick={() => window.location.reload()}
            className="mt-8 w-full sm:w-auto bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-600 transition duration-300"
        >
            Book Another Trip
        </button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
