import emailjs from '@emailjs/browser';

interface BookingConfirmationParams {
  guestName: string;
  email: string;
  items: Array<{ title: string; price: number; planB?: boolean }>;
  date: string;
  guests: string;
  currency: string;
  totalAmount: number;
  depositAmount: number;
  remainingBalance: number;
}

export async function sendBookingConfirmation(params: BookingConfirmationParams): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS not configured, skipping email');
    return;
  }

  const itemsList = params.items
    .map((item, idx) => `${idx + 1}. ${item.title} - ${params.currency} ${item.price}`)
    .join('\n');

  const templateParams = {
    to_email: params.email,
    guest_name: params.guestName,
    items_list: itemsList,
    booking_date: params.date,
    guests: params.guests,
    total_amount: `${params.currency} ${params.totalAmount}`,
    deposit_amount: `${params.currency} ${params.depositAmount}`,
    remaining_balance: `${params.currency} ${params.remainingBalance}`,
  };

  try {
    await emailjs.send(serviceId, templateId, templateParams, publicKey);
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
}