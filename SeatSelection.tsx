import { useState, useEffect, useMemo } from 'react';
import { Monitor } from 'lucide-react';

interface SeatSelectionProps {
  requiredSeats: number;
  selectedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
}

// Generate seat layout with some random filled seats
const generateSeatLayout = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const filledPercentage = 0.3; // 30% seats are filled
  
  const layout: Record<string, { seatNumber: string; isFilled: boolean }[]> = {};
  
  rows.forEach((row) => {
    layout[row] = [];
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatNumber = `${row}${i}`;
      const isFilled = Math.random() < filledPercentage;
      layout[row].push({ seatNumber, isFilled });
    }
  });
  
  return layout;
};

const SeatSelection = ({ requiredSeats, selectedSeats, onSeatsChange }: SeatSelectionProps) => {
  // Memoize the seat layout so it doesn't regenerate on every render
  const seatLayout = useMemo(() => generateSeatLayout(), []);

  const handleSeatClick = (seatNumber: string, isFilled: boolean) => {
    if (isFilled) return;

    if (selectedSeats.includes(seatNumber)) {
      // Deselect the seat
      onSeatsChange(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      // Select the seat if we haven't reached the limit
      if (selectedSeats.length < requiredSeats) {
        onSeatsChange([...selectedSeats, seatNumber]);
      }
    }
  };

  const getSeatClassName = (seatNumber: string, isFilled: boolean) => {
    if (isFilled) {
      return 'bg-muted text-muted-foreground cursor-not-allowed opacity-50';
    }
    if (selectedSeats.includes(seatNumber)) {
      return 'bg-primary text-primary-foreground border-primary';
    }
    return 'bg-background border-2 border-green-500 text-green-500 hover:bg-green-500/10 cursor-pointer';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Select Your Seats ({selectedSeats.length}/{requiredSeats})
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded border-2 border-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-muted opacity-50"></div>
            <span>Filled</span>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="relative">
        <div className="w-3/4 mx-auto h-8 bg-gradient-to-b from-primary/30 to-transparent rounded-t-full flex items-center justify-center">
          <Monitor className="h-4 w-4 text-primary mr-2" />
          <span className="text-xs text-primary font-medium">SCREEN</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[500px] space-y-2">
          {Object.entries(seatLayout).map(([row, seats]) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-6 text-sm font-medium text-muted-foreground">{row}</span>
              <div className="flex gap-1 flex-1 justify-center">
                {seats.slice(0, 6).map(({ seatNumber, isFilled }) => (
                  <button
                    key={seatNumber}
                    onClick={() => handleSeatClick(seatNumber, isFilled)}
                    disabled={isFilled}
                    className={`w-8 h-8 rounded text-xs font-medium flex items-center justify-center transition-all ${getSeatClassName(
                      seatNumber,
                      isFilled
                    )}`}
                  >
                    {seatNumber.slice(1)}
                  </button>
                ))}
                {/* Aisle gap */}
                <div className="w-6"></div>
                {seats.slice(6).map(({ seatNumber, isFilled }) => (
                  <button
                    key={seatNumber}
                    onClick={() => handleSeatClick(seatNumber, isFilled)}
                    disabled={isFilled}
                    className={`w-8 h-8 rounded text-xs font-medium flex items-center justify-center transition-all ${getSeatClassName(
                      seatNumber,
                      isFilled
                    )}`}
                  >
                    {seatNumber.slice(1)}
                  </button>
                ))}
              </div>
              <span className="w-6 text-sm font-medium text-muted-foreground">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Seats Display */}
      {selectedSeats.length > 0 && (
        <div className="bg-secondary/70 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Selected Seats</p>
          <p className="font-semibold text-primary">
            {selectedSeats.sort().join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
