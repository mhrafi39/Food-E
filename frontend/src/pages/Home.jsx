import { motion } from 'framer-motion';
import { ChevronRight, Star, Award, Clock, Zap, ShoppingBag, Sparkles, Package, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Hero Banners with Real Food Images
  const banners = [
    {
      id: 1,
      title: 'Craving a Delicious Burger?',
      subtitle: 'Get 50% OFF on First Order',
      code: 'FOOD50',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80',
      gradient: 'from-orange-600/80 to-red-700/80',
    },
    {
      id: 2,
      title: 'Free Delivery Today!',
      subtitle: 'On Orders Above ৳500',
      code: 'Zero Delivery Fee',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&q=80',
      gradient: 'from-purple-600/80 to-pink-700/80',
    },
    {
      id: 3,
      title: 'Combo Meals Special',
      subtitle: 'Save Up To ৳200',
      code: 'Limited Time',
      image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=1200&q=80',
      gradient: 'from-green-600/80 to-teal-700/80',
    },
  ];

  // Quick Categories with Images
  const categories = [
    { 
      name: 'Burgers', 
      count: '15+ Items',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
      link: '/menu'
    },
    { 
      name: 'Fries', 
      count: '8+ Items',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
      link: '/menu'
    },
    { 
      name: 'Drinks', 
      count: '12+ Items',
      image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&q=80',
      link: '/menu'
    },
    { 
      name: 'Combo Deals', 
      count: 'Save More',
      image: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=400&q=80',
      link: '/deals'
    },
  ];

  // Featured Items with Images
  const featuredItems = [
    {
      id: 'f1',
      name: 'Signature Beef Burger',
      description: 'Premium beef patty with special sauce, lettuce, tomato',
      price: 350,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
      badge: 'Best Seller',
    },
    {
      id: 'f2',
      name: 'Crispy Chicken Burger',
      description: 'Crispy fried chicken with mayo and fresh vegetables',
      price: 320,
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80',
      badge: 'Popular',
    },
    {
      id: 'f3',
      name: 'Cheese Loaded Fries',
      description: 'Golden fries with melted cheddar cheese sauce',
      price: 180,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
      badge: 'Hot',
    },
    {
      id: 'f4',
      name: 'Double Cheese Burger',
      description: 'Two beef patties with double cheese and special sauce',
      price: 420,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80',
      badge: 'New',
    },
  ];

  // Special Offers
  const offers = [
    {
      title: 'Lunch Box Special',
      description: 'Burger + Fries + Drink',
      price: '৳399',
      originalPrice: '৳550',
      time: '11 AM - 3 PM',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80',
      badge: 'Save ৳151',
    },
    {
      title: 'Midnight Feast',
      description: '20% Off on All Items',
      price: '20% OFF',
      time: '10 PM - 2 AM',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
      badge: 'Night Owl',
    },
  ];

  // Stats
  const stats = [
    { icon: <Star className="w-6 h-6" />, value: '4.8★', label: 'Customer Rating' },
    { icon: <ShoppingBag className="w-6 h-6" />, value: '10K+', label: 'Orders Delivered' },
    { icon: <Clock className="w-6 h-6" />, value: '30 min', label: 'Avg Delivery' },
    { icon: <Heart className="w-6 h-6" />, value: '98%', label: 'Satisfaction' },
  ];

  // Features
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Get your food in 30 minutes or its free',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Premium Quality',
      description: 'Only the finest & freshest ingredients',
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Free Delivery',
      description: 'No delivery fee on orders above ৳500',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Hero Banner Carousel with Real Images */}
      <section className="relative h-[350px] md:h-[600px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentBanner === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}></div>
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 md:px-6 flex items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: currentBanner === index ? 1 : 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl text-white"
              >
                <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
                  {banner.code}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-3 md:mb-4 leading-tight">
                  {banner.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8">
                  {banner.subtitle}
                </p>
                <Link
                  to="/menu"
                  className="inline-flex items-center px-6 py-3 md:px-10 md:py-5 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform shadow-2xl text-base md:text-lg"
                >
                  Order Now
                  <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                </Link>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Banner Navigation Dots */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 md:space-x-3 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all ${
                currentBanner === index ? 'bg-white w-8 md:w-12' : 'bg-white/50 w-1.5 md:w-2'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Special Offers with Images */}
      <section className="container mx-auto px-4 py-8 md:py-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
              Special <span className="text-brand">Offers</span> 
            </h2>
            <p className="text-white/60 text-sm md:text-lg">Limited time deals you don't want to miss</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.title}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl md:rounded-3xl h-[200px] md:h-[300px]"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${offer.image})` }}
                ></div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
                
                {/* Content */}
                <div className="relative h-full p-4 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-1 md:px-4 md:py-2 bg-brand rounded-full text-xs md:text-sm font-bold mb-2 md:mb-4">
                      {offer.badge}
                    </span>
                    <h3 className="text-xl md:text-3xl lg:text-4xl font-black mb-1.5 md:mb-3">{offer.title}</h3>
                    <p className="text-xs md:text-lg text-white/90 mb-2 md:mb-4">{offer.description}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xl md:text-4xl font-black text-brand mb-0.5 md:mb-1">{offer.price}</div>
                      {offer.originalPrice && (
                        <div className="text-[10px] md:text-sm text-white/60 line-through">{offer.originalPrice}</div>
                      )}
                      <div className="text-[10px] md:text-sm text-white/60 mt-0.5 md:mt-2">{offer.time}</div>
                    </div>
                    <Link
                      to="/menu"
                      className="px-3 py-1.5 md:px-6 md:py-3 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform text-xs md:text-base"
                    >
                      Order
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Items */}
      <section className="container mx-auto px-4 py-8 md:py-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2">
                Featured <span className="text-brand"> Items</span>
              </h2>
              <p className="text-white/60 text-sm md:text-lg">Our customers' all-time favorites</p>
            </div>
            <Link
              to="/menu"
              className="hidden md:flex items-center text-brand font-bold hover:underline text-lg"
            >
              View All Menu
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FoodCard item={item} className="h-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

       {/* Stats Bar */}
      <section className="bg-gradient-to-r from-brand/10 to-orange-600/10 border-y border-white/10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2 md:space-x-3"
              >
                <div className="p-2 md:p-3 rounded-full bg-brand/20 text-brand shrink-0">
                  <div className="w-4 h-4 md:w-6 md:h-6">{stat.icon}</div>
                </div>
                <div>
                  <div className="text-lg md:text-2xl font-black">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-white/60">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-8 md:py-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
              Why <span className="text-brand">ফুড-ই</span>?
            </h2>
            <p className="text-white/60 text-sm md:text-lg">We deliver excellence in every bite</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 text-center hover:shadow-2xl hover:shadow-brand/20 transition-all"
              >
                <div className="inline-flex p-3 md:p-5 rounded-full bg-brand/20 text-brand mb-4 md:mb-6">
                  <div className="w-6 h-6 md:w-8 md:h-8">{feature.icon}</div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-white/60 text-sm md:text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="container mx-auto px-4 py-8 md:py-20">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl md:rounded-[2rem] h-[280px] md:h-[500px]"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=1200&q=80)' }}
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand/90 to-orange-600/90"></div>
          
          {/* Content */}
          <div className="relative h-full flex items-center justify-center text-center px-4 md:px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black mb-3 md:mb-6 text-white">
                Ready to Order?
              </h2>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white/90 mb-4 md:mb-10">
                Get delicious food delivered to your doorstep in 30 minutes!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-6 py-2.5 md:px-12 md:py-5 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform shadow-2xl flex items-center justify-center text-sm md:text-lg"
                >
                  <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 mr-2" />
                  Browse Menu
                </Link>
                <Link
                  to="/deals"
                  className="w-full sm:w-auto px-6 py-2.5 md:px-12 md:py-5 bg-white/20 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/30 transition-all border-2 border-white/50 text-sm md:text-lg"
                >
                  View Deals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-5 right-5 md:top-10 md:right-10 w-20 h-20 md:w-40 md:h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-5 left-5 md:bottom-10 md:left-10 w-16 h-16 md:w-32 md:h-32 bg-black/10 rounded-full blur-3xl"></div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;
