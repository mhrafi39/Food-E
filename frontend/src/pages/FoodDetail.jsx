import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/FoodCard';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    size: 'regular',
    extras: [],
    sauces: [],
  });

  // All menu items with detailed information
  const allItems = [
    // Burgers
    {
      id: 'm1',
      name: 'Signature Beef Burger',
      description: 'Premium beef patty, lettuce, tomato, special sauce',
      longDescription: 'Our signature burger made with 100% premium beef patty, fresh lettuce, ripe tomatoes, pickles, and our secret special sauce. Served in a toasted sesame bun.',
      price: 350,
      category: 'burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
      badge: 'Best Seller',
      sizes: [
        { id: 'regular', name: 'Regular', price: 350 },
        { id: 'large', name: 'Large', price: 450 },
        { id: 'xlarge', name: 'X-Large', price: 550 },
      ],
      extras: [
        { id: 'cheese', name: 'Extra Cheese', price: 50 },
        { id: 'bacon', name: 'Bacon', price: 80 },
        { id: 'egg', name: 'Fried Egg', price: 40 },
        { id: 'patty', name: 'Extra Patty', price: 150 },
      ],
      sauces: [
        { id: 'ketchup', name: 'Ketchup', price: 0 },
        { id: 'mayo', name: 'Mayonnaise', price: 0 },
        { id: 'mustard', name: 'Mustard', price: 0 },
        { id: 'bbq', name: 'BBQ Sauce', price: 20 },
        { id: 'chili', name: 'Chili Sauce', price: 20 },
      ],
      complementary: ['French Fries', 'Coleslaw', 'Onion Rings'],
    },
    {
      id: 'm2',
      name: 'Crispy Chicken Burger',
      description: 'Crispy fried chicken, mayo, lettuce',
      longDescription: 'Juicy crispy fried chicken breast, creamy mayonnaise, fresh lettuce, and pickles in a soft potato bun.',
      price: 320,
      category: 'burgers',
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
      sizes: [
        { id: 'regular', name: 'Regular', price: 320 },
        { id: 'large', name: 'Large', price: 420 },
      ],
      extras: [
        { id: 'cheese', name: 'Extra Cheese', price: 50 },
        { id: 'bacon', name: 'Bacon', price: 80 },
        { id: 'chicken', name: 'Extra Chicken', price: 120 },
      ],
      sauces: [
        { id: 'mayo', name: 'Mayonnaise', price: 0 },
        { id: 'garlic', name: 'Garlic Sauce', price: 20 },
        { id: 'buffalo', name: 'Buffalo Sauce', price: 20 },
      ],
      complementary: ['French Fries', 'Coleslaw'],
    },
    {
      id: 'm3',
      name: 'Double Decker Burger',
      description: 'Two beef patties, cheese, bacon, special sauce',
      longDescription: 'Double the satisfaction! Two premium beef patties, double cheese, crispy bacon, lettuce, tomato, and our special sauce.',
      price: 450,
      category: 'burgers',
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80',
      badge: 'Premium',
      sizes: [
        { id: 'regular', name: 'Regular', price: 450 },
        { id: 'large', name: 'Monster Size', price: 650 },
      ],
      extras: [
        { id: 'cheese', name: 'Extra Cheese', price: 50 },
        { id: 'bacon', name: 'Extra Bacon', price: 80 },
        { id: 'patty', name: 'Extra Patty', price: 150 },
      ],
      sauces: [
        { id: 'ketchup', name: 'Ketchup', price: 0 },
        { id: 'mayo', name: 'Mayonnaise', price: 0 },
        { id: 'bbq', name: 'BBQ Sauce', price: 20 },
      ],
      complementary: ['French Fries', 'Onion Rings', 'Drink'],
    },
    {
      id: 'm4',
      name: 'Veggie Burger',
      description: 'Plant-based patty, fresh vegetables',
      longDescription: 'Delicious plant-based patty with fresh lettuce, tomatoes, cucumbers, and special veggie sauce. Perfect for vegetarians!',
      price: 280,
      category: 'burgers',
      image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80',
      sizes: [
        { id: 'regular', name: 'Regular', price: 280 },
        { id: 'large', name: 'Large', price: 380 },
      ],
      extras: [
        { id: 'cheese', name: 'Cheese', price: 50 },
        { id: 'avocado', name: 'Avocado', price: 60 },
        { id: 'mushroom', name: 'Grilled Mushroom', price: 40 },
      ],
      sauces: [
        { id: 'mayo', name: 'Veg Mayo', price: 0 },
        { id: 'pesto', name: 'Pesto Sauce', price: 30 },
      ],
      complementary: ['Sweet Potato Fries', 'Garden Salad'],
    },
    // Fries
    {
      id: 'm5',
      name: 'Classic French Fries',
      description: 'Golden crispy fries with salt',
      longDescription: 'Perfectly golden and crispy French fries, lightly salted. The perfect side for any meal!',
      price: 120,
      category: 'fries',
      image: 'https://images.unsplash.com/photo-1630384082747-823fb0e6d4a8?w=800&q=80',
      sizes: [
        { id: 'small', name: 'Small', price: 120 },
        { id: 'medium', name: 'Medium', price: 160 },
        { id: 'large', name: 'Large', price: 200 },
      ],
      extras: [
        { id: 'cheese', name: 'Cheese Sauce', price: 40 },
        { id: 'chili', name: 'Chili', price: 50 },
      ],
      sauces: [
        { id: 'ketchup', name: 'Ketchup', price: 0 },
        { id: 'mayo', name: 'Mayonnaise', price: 0 },
      ],
      complementary: ['Ketchup', 'Mayo'],
    },
    {
      id: 'm6',
      name: 'Cheese Loaded Fries',
      description: 'Fries topped with melted cheese',
      longDescription: 'Crispy fries smothered in rich, melted cheddar cheese sauce. A comfort food favorite!',
      price: 180,
      category: 'fries',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
      badge: 'Popular',
      sizes: [
        { id: 'regular', name: 'Regular', price: 180 },
        { id: 'large', name: 'Large', price: 250 },
      ],
      extras: [
        { id: 'bacon', name: 'Bacon Bits', price: 60 },
        { id: 'jalapeno', name: 'Jalapeños', price: 30 },
      ],
      sauces: [
        { id: 'ranch', name: 'Ranch', price: 20 },
        { id: 'sour', name: 'Sour Cream', price: 20 },
      ],
      complementary: ['Ranch Dip', 'Sour Cream'],
    },
    {
      id: 'm7',
      name: 'Spicy Masala Fries',
      description: 'Fries with special masala seasoning',
      longDescription: 'Our signature fries tossed in authentic Bengali masala spices. A unique desi twist!',
      price: 150,
      category: 'fries',
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80',
      sizes: [
        { id: 'regular', name: 'Regular', price: 150 },
        { id: 'large', name: 'Large', price: 200 },
      ],
      extras: [
        { id: 'extra-masala', name: 'Extra Masala', price: 20 },
      ],
      sauces: [
        { id: 'mint', name: 'Mint Chutney', price: 0 },
        { id: 'tamarind', name: 'Tamarind Sauce', price: 0 },
      ],
      complementary: ['Mint Chutney', 'Tamarind Sauce'],
    },
    // Drinks
    {
      id: 'm8',
      name: 'Coca Cola',
      description: 'Chilled 500ml bottle',
      longDescription: 'Ice-cold Coca Cola to refresh your taste buds.',
      price: 50,
      category: 'drinks',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80',
      sizes: [
        { id: 'regular', name: '500ml', price: 50 },
        { id: 'large', name: '1L', price: 80 },
      ],
      extras: [],
      sauces: [],
      complementary: ['Ice', 'Lemon Slice'],
    },
    {
      id: 'm9',
      name: 'Fresh Lemonade',
      description: 'Homemade fresh lemon drink',
      longDescription: 'Freshly squeezed lemon juice with the perfect balance of sweet and tangy.',
      price: 80,
      category: 'drinks',
      image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80',
      sizes: [
        { id: 'regular', name: 'Regular', price: 80 },
        { id: 'large', name: 'Large', price: 120 },
      ],
      extras: [
        { id: 'mint', name: 'Fresh Mint', price: 20 },
        { id: 'ginger', name: 'Ginger', price: 20 },
      ],
      sauces: [],
      complementary: ['Fresh Mint Leaves', 'Ice'],
    },
    {
      id: 'm10',
      name: 'Mango Lassi',
      description: 'Traditional Bengali yogurt drink',
      longDescription: 'Creamy yogurt blended with sweet mango pulp. A traditional Bangladeshi favorite!',
      price: 100,
      category: 'drinks',
      image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80',
      badge: 'Local Favorite',
      sizes: [
        { id: 'regular', name: 'Regular', price: 100 },
        { id: 'large', name: 'Large', price: 150 },
      ],
      extras: [
        { id: 'extra-mango', name: 'Extra Mango', price: 30 },
      ],
      sauces: [],
      complementary: ['Cardamom', 'Saffron'],
    },
  ];

  const item = allItems.find((i) => i.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Item Not Found</h2>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-3 gradient-brand rounded-lg font-semibold"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // Get similar items from same category
  const similarItems = allItems
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 3);

  const handleSizeChange = (sizeId) => {
    setSelectedOptions({ ...selectedOptions, size: sizeId });
  };

  const toggleExtra = (extraId) => {
    const extras = selectedOptions.extras.includes(extraId)
      ? selectedOptions.extras.filter((e) => e !== extraId)
      : [...selectedOptions.extras, extraId];
    setSelectedOptions({ ...selectedOptions, extras });
  };

  const toggleSauce = (sauceId) => {
    const sauces = selectedOptions.sauces.includes(sauceId)
      ? selectedOptions.sauces.filter((s) => s !== sauceId)
      : [...selectedOptions.sauces, sauceId];
    setSelectedOptions({ ...selectedOptions, sauces });
  };

  const calculateTotalPrice = () => {
    const selectedSize = item.sizes?.find((s) => s.id === selectedOptions.size);
    const basePrice = selectedSize?.price || item.price;
    
    const extrasPrice = selectedOptions.extras.reduce((total, extraId) => {
      const extra = item.extras?.find((e) => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);

    const saucesPrice = selectedOptions.sauces.reduce((total, sauceId) => {
      const sauce = item.sauces?.find((s) => s.id === sauceId);
      return total + (sauce?.price || 0);
    }, 0);

    return (basePrice + extrasPrice + saucesPrice) * quantity;
  };

  const handleAddToCart = () => {
    const selectedSize = item.sizes?.find((s) => s.id === selectedOptions.size);
    const customItem = {
      id: `${item.id}-${Date.now()}`,
      name: `${item.name} (${selectedSize?.name || 'Regular'})`,
      price: calculateTotalPrice() / quantity,
      image: item.image,
      customizations: {
        size: selectedSize?.name,
        extras: selectedOptions.extras.map(id => item.extras?.find(e => e.id === id)?.name),
        sauces: selectedOptions.sauces.map(id => item.sauces?.find(s => s.id === id)?.name),
      },
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(customItem);
    }

    // Show success feedback
    alert(`Added ${quantity} ${item.name} to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12"
    >
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Image & Info */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass rounded-3xl overflow-hidden mb-6 relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-96 object-cover"
              />
              {item.badge && (
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 gradient-brand text-white text-sm font-bold rounded-full shadow-lg">
                    {item.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Complementary Items */}
            {item.complementary && item.complementary.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold mb-3 text-brand">Comes With:</h3>
                <div className="flex flex-wrap gap-2">
                  {item.complementary.map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/5 rounded-full text-sm"
                    >
                      ✓ {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: Details & Customization */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">{item.name}</h1>
            <p className="text-white/60 mb-2">{item.description}</p>
            <p className="text-white/80 mb-6">{item.longDescription}</p>

            {/* Size Selection */}
            {item.sizes && item.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3">Select Size:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {item.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeChange(size.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedOptions.size === size.id
                          ? 'border-brand bg-brand/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="font-semibold">{size.name}</div>
                      <div className="text-brand text-sm">৳{size.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extras */}
            {item.extras && item.extras.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3">Add Extras:</h3>
                <div className="space-y-2">
                  {item.extras.map((extra) => (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                        selectedOptions.extras.includes(extra.id)
                          ? 'border-brand bg-brand/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        {selectedOptions.extras.includes(extra.id) && (
                          <Check className="w-5 h-5 text-brand" />
                        )}
                        <span>{extra.name}</span>
                      </span>
                      <span className="text-brand font-semibold">
                        +৳{extra.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sauces */}
            {item.sauces && item.sauces.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold mb-3">Choose Sauces:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {item.sauces.map((sauce) => (
                    <button
                      key={sauce.id}
                      onClick={() => toggleSauce(sauce.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedOptions.sauces.includes(sauce.id)
                          ? 'border-brand bg-brand/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{sauce.name}</span>
                        {selectedOptions.sauces.includes(sauce.id) && (
                          <Check className="w-4 h-4 text-brand" />
                        )}
                      </div>
                      {sauce.price > 0 && (
                        <div className="text-brand text-xs">+৳{sauce.price}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold">Quantity:</span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 pt-4 border-t border-white/10">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-3xl font-black text-brand">
                  ৳{calculateTotalPrice()}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 gradient-brand rounded-lg font-bold text-lg shadow-lg shadow-brand/50 hover:shadow-brand/70 transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-black mb-8">
              You Might Also <span className="text-brand">Like</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarItems.map((similarItem) => (
                <FoodCard key={similarItem.id} item={similarItem} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FoodDetail;
