/**
 * Analytics Service — writes visits directly to Firebase Firestore
 * so they persist in the cloud even when the computer is off.
 */

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const analyticsService = {
  /**
   * Generates or retrieves a session ID for unique-session tracking (no PII stored)
   */
  getSessionId: () => {
    let sessionId = sessionStorage.getItem('sweeto_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('sweeto_session_id', sessionId);
    }
    return sessionId;
  },

  /**
   * Derives the referrer source/channel from document.referrer
   */
  getReferrerSource: () => {
    const ref = document.referrer;
    if (!ref || ref === '') return 'Direct';
    if (ref.includes('google')) return 'Google';
    if (ref.includes('facebook') || ref.includes('fb.com')) return 'Facebook';
    if (ref.includes('instagram')) return 'Instagram';
    if (ref.includes('twitter') || ref.includes('x.com')) return 'Twitter/X';
    if (ref.includes('whatsapp')) return 'WhatsApp';
    if (ref.includes('tiktok')) return 'TikTok';
    return 'Other';
  },

  /**
   * Derives the device type from the user agent string
   */
  getDeviceType: () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) return 'Mobile';
    return 'Desktop';
  },

  /**
   * Logs a page visit to Firestore. De-duplicated per session per path.
   * @param {string} path - The page path visited
   */
  logVisit: async (path) => {
    const loggedPaths = JSON.parse(sessionStorage.getItem('logged_paths') || '[]');
    if (loggedPaths.includes(path)) return; // Already logged this path in session

    try {
      const visitData = {
        sessionId: analyticsService.getSessionId(),
        path: path || window.location.pathname,
        referrer: document.referrer || '',
        referrerSource: analyticsService.getReferrerSource(),
        device: analyticsService.getDeviceType(),
        language: navigator.language,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'visits'), visitData);

      loggedPaths.push(path);
      sessionStorage.setItem('logged_paths', JSON.stringify(loggedPaths));
    } catch (error) {
      // Fail silently — analytics should never break the app
      console.error('Analytics: failed to log visit:', error);
    }
  }
};

export default analyticsService;
