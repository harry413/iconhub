import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { clickSound, errorSound, successSound } from '../utils/Sounds';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_URL;

const GoogleLoginButton = () => {
  const buttonRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    };

    // Initialize Google Auth
    const initializeGoogle = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          ux_mode: 'popup',
          auto_select: false,
        });
          
        // Render button
        window.google.accounts.id.renderButton(
          buttonRef.current,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'circular',
            logo_alignment: 'right',
            width: '250px',
          }
        );

       
      }
    };

    // Handle Google auth response
    const handleCredentialResponse = async (response) => {
      try {
        clickSound.play();
        // Send credential to your backend
        const res = await fetch(`${BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential: response.credential }),
        });
         
        if (!res.ok) throw new Error('Google authentication failed');

        const { token, user } = await res.json();
        // Login user
        login(token, user);
        successSound.play();
        navigate('/');
      } catch (err) {
        errorSound.play();
        console.error('Google login error:', err);
        // Handle error (show toast, etc.)
      }
    };

    loadGoogleScript();

    return () => {
      // Cleanup if needed
      if (window.google && window.google.accounts) {
        window.google.accounts.id.cancel();
      }
    };
  }, [login, navigate]);

  return (
    <div className=" flex justify-center py-2">
      <div 
        ref={buttonRef} 
        className="w-full max-w-[300px]"
        aria-label="Sign in with Google"
      />
    </div>
  );
};

export default GoogleLoginButton;