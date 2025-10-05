import React, { useState, useMemo, useCallback } from 'react';
import { Bus, Seat, SeatStatus, SearchParams, PaymentDetails } from '../../types';

const SeatComponent: React.FC<{ seat: Seat; onSelect: (seatId: string) => void; }> = ({ seat, onSelect }) => {
  const getSeatClass = (status: SeatStatus) => {
    switch (status) {
      case SeatStatus.Available:
        return 'bg-white border-gray-300 hover:bg-brand-primary hover:text-white cursor-pointer';
      case SeatStatus.Booked:
        return 'bg-gray-300 border-gray-400 cursor-not-allowed';
      case SeatStatus.Selected:
        return 'bg-brand-secondary border-amber-500 text-brand-dark font-bold cursor-pointer';
      case SeatStatus.Aisle:
        return 'bg-transparent border-transparent';
    }
  };

  return (
    <div
      className={`w-10 h-10 rounded-md border flex items-center justify-center text-sm transition-colors duration-200 ${getSeatClass(seat.status)}`}
      onClick={() => seat.status === SeatStatus.Available || seat.status === SeatStatus.Selected ? onSelect(seat.id) : null}
    >
      {seat.status !== SeatStatus.Aisle && seat.id}
    </div>
  );
};

const SeatMap: React.FC<{ bus: Bus; onSeatSelect: (seat: Seat) => void; selectedSeats: Seat[] }> = ({ bus, onSeatSelect, selectedSeats }) => {
    const handleSelect = (seatId: string) => {
        for (const row of bus.seatLayout) {
            const seat = row.find(s => s.id === seatId);
            if (seat) {
                onSeatSelect(seat);
                return;
            }
        }
    };
    
    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
                {bus.seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex space-x-2">
                        {row.map(seat => {
                             const isSelected = selectedSeats.some(s => s.id === seat.id);
                             const currentStatus = isSelected ? SeatStatus.Selected : seat.status;
                             return <SeatComponent key={seat.id} seat={{...seat, status: currentStatus}} onSelect={handleSelect} />;
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

interface BookingScreenProps {
  bus: Bus;
  searchParams: SearchParams;
  // FIX: Update onProceedToPayment signature to include selected seats, matching the parent component's handler.
  onProceedToPayment: (details: PaymentDetails, seats: Seat[]) => void;
  isProcessing: boolean;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ bus, searchParams, onProceedToPayment, isProcessing }) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatSelect = useCallback((seat: Seat) => {
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, { ...seat, status: SeatStatus.Selected }];
      }
    });
  }, []);

  const totalPrice = useMemo(() => {
    return selectedSeats.length * bus.price;
  }, [selectedSeats, bus.price]);

  const handlePayment = () => {
    if (selectedSeats.length === 0) return;
    
    // FIX: Pass the selected seats array along with payment details to the event handler.
    onProceedToPayment({
        amount: totalPrice,
        type: 'Bus Booking',
        description: `${bus.from} to ${bus.to} (${selectedSeats.length} seats)`
    }, selectedSeats);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Select Your Seats</h2>
            <div className="flex space-x-4 mb-4 text-sm">
                <div className="flex items-center"><div className="w-5 h-5 bg-white border border-gray-300 rounded mr-2"></div> Available</div>
                <div className="flex items-center"><div className="w-5 h-5 bg-gray-300 rounded mr-2"></div> Booked</div>
                <div className="flex items-center"><div className="w-5 h-5 bg-brand-secondary rounded mr-2"></div> Selected</div>
            </div>
            <SeatMap bus={bus} onSeatSelect={handleSeatSelect} selectedSeats={selectedSeats} />
          </div>
        </div>
        <aside className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow sticky top-8">
            <h3 className="text-xl font-bold border-b pb-2 mb-4">Booking Summary</h3>
            <div className="space-y-2 text-gray-700">
                <p><strong>Operator:</strong> {bus.operator}</p>
                <p><strong>Route:</strong> {bus.from} to {bus.to}</p>
                <p><strong>Date:</strong> {new Date(searchParams.date).toDateString()}</p>
                <p><strong>Departure:</strong> {bus.departureTime}</p>
            </div>
            <div className="my-4">
                <h4 className="font-semibold">Selected Seats ({selectedSeats.length})</h4>
                {selectedSeats.length > 0 ? (
                    <p className="text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
                        {selectedSeats.map(s => s.id).join(', ')}
                    </p>
                ) : (
                    <p className="text-gray-500 text-sm mt-1">Please select a seat from the map.</p>
                )}
            </div>
            <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Price:</span>
                    <span className="text-brand-primary">₦{totalPrice.toLocaleString()}</span>
                </div>
            </div>
            <button
                onClick={handlePayment}
                disabled={selectedSeats.length === 0 || isProcessing}
                className="w-full mt-6 bg-brand-secondary text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-amber-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingScreen;