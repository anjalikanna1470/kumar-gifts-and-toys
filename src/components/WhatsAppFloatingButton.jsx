import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const phoneNumber = '919966327229'; // 099663 27229
  const defaultMessage = encodeURIComponent('Hi Kumar Gifts & Toys, I have an inquiry about custom gifts and toys in Ongole!');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95"
      title="Chat on WhatsApp with Kumar Gifts & Toys"
    >
      <MessageCircle className="w-6 h-6 animate-pulse" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-sm font-semibold pr-1">
        WhatsApp Us
      </span>
    </a>
  );
}
