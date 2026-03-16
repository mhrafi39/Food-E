import { Phone, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/40 border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-black text-brand mb-4">ফুড-ই</h3>
            <p className="text-white/60 mb-4">
              Premium Bangladesh Burgers & Fries in Dhaka
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-brand transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-brand transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center space-x-3 text-white/80 hover:text-brand transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-brand transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+880 1XXX-XXXXXX</span>
              </a>
              <a
                href="https://maps.google.com/?q=Banani,Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/80 hover:text-brand transition-colors group"
              >
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-brand transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Banani, Dhaka</span>
              </a>
            </div>
          </div>

          {/* Call to Order */}
          <div>
            <h4 className="text-lg font-bold mb-4">Order Now</h4>
            <a
              href="tel:+8801XXXXXXXXX"
              className="inline-block w-full md:w-auto px-8 py-4 gradient-brand text-white font-bold rounded-lg shadow-lg shadow-brand/50 hover:shadow-brand/70 transition-all hover:scale-105"
            >
              📞 Call to Order
            </a>
            <p className="text-white/40 text-sm mt-4">
              Open Daily: 11 AM - 11 PM
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
          <p>&copy; {currentYear} ফুড-ই (Food-E). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
