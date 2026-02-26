import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ item }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(item);
  };

  const handleCardClick = () => {
    navigate(`/food/${item.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass rounded-xl md:rounded-2xl overflow-hidden shadow-xl hover:shadow-brand/20 transition-all cursor-pointer h-full"
    >
      {/* Image */}
      <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-brand/20 to-brand/5">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">{item.emoji || '🍔'}</span>
          </div>
        )}
        {item.badge && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-1 md:px-3 md:py-1 bg-brand text-white text-[10px] md:text-xs font-bold rounded-full">
            {item.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="text-base md:text-lg font-bold mb-2">{item.name}</h3>
        <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] md:text-xs text-white/40 block mb-1">Starting from</span>
            <span className="text-xl md:text-2xl font-black text-brand">৳{item.price}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 md:px-6 md:py-2.5 gradient-brand rounded-lg font-semibold flex items-center space-x-1.5 md:space-x-2 hover:scale-105 transition-transform shadow-lg shadow-brand/30 text-sm md:text-base"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Add</span>
          </button>
        </div>
        
        <p className="text-[10px] md:text-xs text-white/40 text-center mt-2 md:mt-3">
          Click card for details & customization
        </p>
      </div>
    </motion.div>
  );
};

export default FoodCard;
