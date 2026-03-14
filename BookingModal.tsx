import { useState, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Movie } from '@/hooks/useMovies';
import { useCreateBooking, useProcessPayment } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CreditCard, Loader2, Check, ArrowLeft, Smartphone, Building2, Download, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import SeatSelection from './SeatSelection';

type PaymentMethod = 'debit' | 'credit' | 'upi' | null;

interface BookingModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

// Theater data with showtimes
const theaterData = [
  {
    name: 'PVR Cinemas - Phoenix Mall',
    location: 'Lower Parel',
    showtimes: ['10:00 AM', '1:30 PM', '4:45 PM', '7:30 PM', '10:15 PM'],
  },
  {
    name: 'INOX - Infinity Mall',
    location: 'Malad West',
    showtimes: ['11:00 AM', '2:15 PM', '5:30 PM', '8:45 PM'],
  },
  {
    name: 'Cinepolis - Andheri',
    location: 'Andheri West',
    showtimes: ['9:30 AM', '12:45 PM', '4:00 PM', '7:15 PM', '10:30 PM'],
  },
  {
    name: 'PVR ICON - Oberoi Mall',
    location: 'Goregaon East',
    showtimes: ['10:30 AM', '1:45 PM', '5:00 PM', '8:15 PM'],
  },
];

type BookingStep = 'select' | 'seats' | 'payment' | 'confirmed';

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const processPayment = useProcessPayment();

  const [step, setStep] = useState<BookingStep>('select');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [seats, setSeats] = useState(1);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  const totalAmount = movie.price * seats;
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please sign in to book tickets');
      navigate('/auth');
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        seats,
        total_amount: totalAmount,
        show_date: selectedDate,
        show_time: selectedTime,
        theater_name: selectedTheater,
      });

      setBookingId(booking.id);
      setStep('payment');
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!bookingId || !paymentMethod) return;

    // Validate payment details
    if (paymentMethod === 'debit' || paymentMethod === 'credit') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (!cardCvv || cardCvv.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV');
        return;
      }
      if (!cardName.trim()) {
        toast.error('Please enter the cardholder name');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID');
        return;
      }
    }

    try {
      await processPayment.mutateAsync(bookingId);
      setStep('confirmed');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleClose = () => {
    setStep('select');
    setBookingId(null);
    setSeats(1);
    setSelectedTime(null);
    setSelectedTheater(null);
    setSelectedSeatNumbers([]);
    setPaymentMethod(null);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setUpiId('');
    onClose();
  };

  const handleBackToSeats = () => {
    setPaymentMethod(null);
    setStep('seats');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSelectShowtime = (theater: string, time: string) => {
    setSelectedTheater(theater);
    setSelectedTime(time);
  };

  const handleProceedToSeats = () => {
    setSelectedSeatNumbers([]);
    setStep('seats');
  };

  const handleBackToSelect = () => {
    setSelectedSeatNumbers([]);
    setStep('select');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === 'select' && 'Book Tickets'}
            {step === 'seats' && 'Select Your Seats'}
            {step === 'payment' && 'Complete Payment'}
            {step === 'confirmed' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            {/* Movie Info */}
            <div className="flex gap-4">
              <img
                src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100'}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <p className="text-muted-foreground text-sm">{movie.genres.join(', ')}</p>
                <p className="text-muted-foreground text-sm">{movie.language} • {movie.certification}</p>
                <p className="text-primary font-semibold mt-2">₹{movie.price} per ticket</p>
              </div>
            </div>

            {/* Number of Seats */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" /> Number of Seats
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 font-bold"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-8 text-center">{seats}</span>
                <button
                  onClick={() => setSeats(Math.min(10, seats + 1))}
                  className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Horizontal Date Selection Row */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" /> Select Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {dates.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedTime(null);
                        setSelectedTheater(null);
                      }}
                      className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all min-w-[72px] shrink-0 border ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-secondary border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wide">{format(date, 'EEE')}</span>
                      <span className="text-lg font-bold">{format(date, 'd')}</span>
                      <span className="text-xs">{format(date, 'MMM')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theaters and Showtimes for Selected Date */}
            <div className="space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Halls &amp; Showtimes — {format(new Date(selectedDate), 'EEE, MMM d')}
              </h2>

              <div className="space-y-3">
                {theaterData.map((theater) => (
                  <div
                    key={theater.name}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedTheater === theater.name
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-secondary/50 hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{theater.name}</h3>
                        <p className="text-muted-foreground text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {theater.location}
                        </p>
                      </div>
                      {selectedTheater === theater.name && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {theater.showtimes.map((time) => {
                        const isSelected = selectedTheater === theater.name && selectedTime === time;
                        return (
                          <button
                            key={`${theater.name}-${time}`}
                            onClick={() => handleSelectShowtime(theater.name, time)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border hover:border-primary hover:text-primary'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Summary */}
            {selectedTheater && selectedTime && (
              <div className="bg-secondary/70 p-4 rounded-lg border border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Selection</h3>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Date</span>
                    <p className="font-medium">{format(new Date(selectedDate), 'EEE, MMM d')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Time</span>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Theater</span>
                    <p className="font-medium truncate">{selectedTheater.split(' - ')[0]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Seats</span>
                    <p className="font-medium">{seats}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Total & Continue Button */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-muted-foreground text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-primary">₹{totalAmount}</p>
              </div>
              <Button
                onClick={handleProceedToSeats}
                disabled={!selectedTheater || !selectedTime}
                className="px-8"
              >
                Select Seats
              </Button>
            </div>
          </div>
        )}

        {step === 'seats' && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={handleBackToSelect}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to showtime selection</span>
            </button>

            {/* Booking Summary */}
            <div className="bg-secondary/70 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <img
                  src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100'}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedDate), 'EEE, MMM d')} • {selectedTime}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedTheater}</p>
                  <p className="text-sm text-primary font-medium mt-1">{seats} Ticket(s)</p>
                </div>
              </div>
            </div>

            {/* Seat Selection Grid */}
            <SeatSelection
              requiredSeats={seats}
              selectedSeats={selectedSeatNumbers}
              onSeatsChange={setSelectedSeatNumbers}
            />

            {/* Total & Book Button */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-muted-foreground text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-primary">₹{totalAmount}</p>
              </div>
              <Button
                onClick={handleBooking}
                disabled={createBooking.isPending || selectedSeatNumbers.length !== seats}
                className="px-8"
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Proceed to Pay'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6 py-4">
            {/* Back Button */}
            <button
              onClick={handleBackToSeats}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to seat selection</span>
            </button>

            {/* Booking Summary */}
            <div className="bg-secondary/70 p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Booking Summary</h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100'}
                  alt={movie.title}
                  className="w-14 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{movie.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedDate), 'EEE, MMM d')} • {selectedTime}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedTheater}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <div>
                  <span className="text-muted-foreground">Seats:</span>
                  <span className="ml-2 font-medium">{selectedSeatNumbers.join(', ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <span className="ml-2 font-bold text-primary">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-sm font-medium mb-3">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('debit')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    paymentMethod === 'debit'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 hover:border-muted-foreground/50'
                  }`}
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm font-medium">Debit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    paymentMethod === 'credit'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 hover:border-muted-foreground/50'
                  }`}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm font-medium">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 hover:border-muted-foreground/50'
                  }`}
                >
                  <Smartphone className="h-6 w-6" />
                  <span className="text-sm font-medium">UPI</span>
                </button>
              </div>
            </div>

            {/* Payment Form */}
            {(paymentMethod === 'debit' || paymentMethod === 'credit') && (
              <div className="space-y-4 bg-secondary/50 p-4 rounded-lg border border-border">
                <h4 className="font-medium">
                  {paymentMethod === 'debit' ? 'Debit' : 'Credit'} Card Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        type="password"
                        placeholder="***"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        maxLength={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-4 bg-secondary/50 p-4 rounded-lg border border-border">
                <h4 className="font-medium">UPI Payment</h4>
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter your UPI ID (e.g., name@paytm, name@ybl, name@oksbi)
                  </p>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Amount to Pay</span>
                <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
              </div>
              <Button
                onClick={handlePayment}
                disabled={!paymentMethod || processPayment.isPending}
                className="w-full"
                size="lg"
              >
                {processPayment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${totalAmount}`
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                🔒 Your payment is secured with 256-bit encryption
              </p>
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Booking Confirmed!</h3>
              <p className="text-muted-foreground text-sm">Your e-ticket is ready</p>
            </div>

            {/* Downloadable Receipt */}
            <div ref={receiptRef} className="border border-border rounded-xl overflow-hidden bg-card">
              {/* Receipt Header */}
              <div className="bg-primary px-5 py-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    <span className="font-bold text-lg">CineTicket</span>
                  </div>
                  <span className="text-xs opacity-80">E-TICKET</span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-5 space-y-4">
                <div className="flex gap-4">
                  <img
                    src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=80'}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-foreground">{movie.title}</h4>
                    <p className="text-xs text-muted-foreground">{movie.genres.join(', ')}</p>
                    <p className="text-xs text-muted-foreground">{movie.language} • {movie.certification}</p>
                  </div>
                </div>

                <div className="h-px bg-border" style={{ borderStyle: 'dashed' }} />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Date</span>
                    <p className="font-medium text-foreground">{format(new Date(selectedDate), 'EEE, MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Time</span>
                    <p className="font-medium text-foreground">{selectedTime}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Theater</span>
                    <p className="font-medium text-foreground">{selectedTheater}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Seats</span>
                    <p className="font-medium text-foreground">{selectedSeatNumbers.sort().join(', ')}</p>
                  </div>
                </div>

                <div className="h-px bg-border" style={{ borderStyle: 'dashed' }} />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Booking ID</span>
                    <p className="font-mono text-sm font-medium text-foreground">{bookingId?.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Total Paid</span>
                    <p className="text-xl font-bold text-primary">₹{totalAmount}</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center pt-2">
                  <QRCodeSVG
                    value={JSON.stringify({
                      bookingId,
                      movie: movie.title,
                      date: selectedDate,
                      time: selectedTime,
                      theater: selectedTheater,
                      seats: selectedSeatNumbers,
                      amount: totalAmount,
                    })}
                    size={140}
                    level="M"
                    className="rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Scan at the theater entrance</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const el = receiptRef.current;
                  if (!el) return;
                  import('html2canvas').then(({ default: html2canvas }) => {
                    html2canvas(el, { backgroundColor: null, scale: 2 }).then((canvas) => {
                      const link = document.createElement('a');
                      link.download = `ticket-${bookingId?.slice(0, 8)}.png`;
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    });
                  }).catch(() => toast.error('Download failed'));
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Download Ticket
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
