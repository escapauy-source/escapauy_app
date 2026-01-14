import { useCurrency } from '@/contexts/CurrencyContext';
import QRCode from 'react-qr-code';

interface BookingQRProps {
  bookingId: string;
  serviceName: string;
  userName: string;
  totalPrice: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  partnerName?: string;
  adults: number;
  childrenCount: number;
}

export default function BookingQR({
  bookingId,
  serviceName,
  userName,
  totalPrice,
  amountPaid,
  balanceDue,
  currency,
  partnerName,
  adults,
  childrenCount
}: BookingQRProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <div className="text-center">
        <h3 className="font-black text-lg text-slate-900 mb-1">{serviceName}</h3>
        {partnerName && (
          <p className="text-xs text-slate-500 uppercase tracking-wider">{partnerName}</p>
        )}
      </div>

      <div className="flex justify-center bg-slate-50 p-4 rounded-xl">
        <QRCode value={bookingId} size={128} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-600">Titular</span>
          <span className="font-bold text-slate-900">{userName}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-600">Pasajeros</span>
          <span className="font-bold text-slate-900">{adults} ad. {childrenCount > 0 && `, ${childrenCount} niños`}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-600">Total</span>
          <span className="font-bold text-slate-900">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2 rounded-lg">
          <span className="font-bold">Pagado (15%)</span>
          <span className="font-bold">{formatPrice(amountPaid)}</span>
        </div>
        <div className="flex justify-between text-red-600 bg-red-50 p-2 rounded-lg">
          <span className="font-bold">Saldo (85%)</span>
          <span className="font-bold">{formatPrice(balanceDue)}</span>
        </div>
      </div>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">Presentar este código al socio</p>
      </div>
    </div>
  );
}