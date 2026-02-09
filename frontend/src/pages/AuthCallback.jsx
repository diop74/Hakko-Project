import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use ref to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL hash fragment
        const hash = window.location.hash;
        const sessionId = hash.split('session_id=')[1]?.split('&')[0];

        if (!sessionId) {
          console.error('No session_id found in URL');
          navigate('/login', { replace: true });
          return;
        }

        // Exchange session_id for session_token
        const response = await authAPI.exchangeSession(sessionId);
        const user = response.data.user;

        // Navigate to admin dashboard with user data
        navigate('/admin', { 
          replace: true,
          state: { user }
        });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-haako-900 mx-auto mb-4" />
        <p className="text-slate-600 font-dm-sans">Connexion en cours...</p>
      </div>
    </div>
  );
}
