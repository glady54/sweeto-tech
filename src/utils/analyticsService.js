/**
 * Simple Analytics Service to track visitor behavior
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const analyticsService = {
  /**
   * Generates or retrieves a session ID to track unique visits in a single session
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
   * Logs a page visit to the backend
   * @param {string} path - The path visited
   */
  logVisit: async (path) => {
    // Only track in production or if needed
    // But since we want to see it work, let's just log it.
    
    // Check if we already logged this path in this session to avoid spamming
    const loggedPaths = JSON.parse(sessionStorage.getItem('logged_paths') || '[]');
    if (loggedPaths.includes(path)) return;

    try {
      const visitData = {
        sessionId: analyticsService.getSessionId(),
        path: path || window.location.pathname,
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        language: navigator.language,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      };

      await fetch(`${API_URL}/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData),
      });

      // Mark as logged in this session
      loggedPaths.push(path);
      sessionStorage.setItem('logged_paths', JSON.stringify(loggedPaths));
    } catch (error) {
      console.error('Failed to log visit:', error);
    }
  }
};

export default analyticsService;
