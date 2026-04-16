import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Share2, Camera, Mail, Phone, MapPin } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const Footer = () => {
  const { storeSettings, categories } = useStoreData();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">{storeSettings.shopName}</h3>
            <p className="text-gray-300 mb-4">
              {storeSettings.shopTagline || 'Your trusted destination for cutting-edge electronics and technology products.'}
            </p>
            <div className="flex space-x-4">
              <a href={storeSettings.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href={storeSettings.twitterUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Share2 size={20} />
              </a>
              <a href={storeSettings.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Camera size={20} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link to="/press" className="text-gray-300 hover:text-white">Press</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-300 hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/warranty" className="text-gray-300 hover:text-white">Warranty</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white">Returns</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map(category => (
                <li key={category.id}>
                  <Link to={`/category/${encodeURIComponent(category.name)}`} className="text-gray-300 hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{storeSettings.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{storeSettings.shopPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>{storeSettings.shopAddress}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-gray-400 text-sm">
              © {new Date().getFullYear()} {storeSettings.shopName}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
