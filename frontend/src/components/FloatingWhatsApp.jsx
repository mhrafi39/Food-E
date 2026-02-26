import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingWhatsApp = () => {
  const phoneNumber = '+8801XXXXXXXXX'; // Replace with actual number
  const message = 'Hello! I want to order from ফুড-ই 🍔';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 p-4 bg-green-500 text-white rounded-full shadow-2xl shadow-green-500/50 hover:shadow-green-500/70 transition-all md:hidden"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-300"></span>
      </span>
    </motion.button>
  );
};

export default FloatingWhatsApp;
