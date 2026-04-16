import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Wifi } from 'lucide-react';

const QRShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Build the local network URL dynamically
  const networkUrl = `http://${window.location.hostname}:${window.location.port}`;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:shadow-[0_0_35px_rgba(37,99,235,0.7)] hover:scale-110 transition-all duration-300"
        aria-label="Share via QR Code"
        title="Share this store"
      >
        <QrCode size={24} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 max-w-sm w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* WiFi Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40">
                <Wifi size={28} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Scan to Visit Store
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Make sure you're on the same WiFi network
            </p>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-inner">
                <QRCodeSVG
                  value={networkUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* URL Display */}
            <div className="bg-gray-100 dark:bg-slate-800 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Network URL</p>
              <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 break-all">
                {networkUrl}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRShareButton;
