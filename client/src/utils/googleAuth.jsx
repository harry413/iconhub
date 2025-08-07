
export const initializeGoogleAuth = (onSuccess, onFailure) => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await handleGoogleLogin(response.credential);
          onSuccess(res);
        } catch (error) {
          onFailure(error);
        }
      },
      
    });
  }
};

export const renderGoogleButton = (elementId) => {
  if (window.google) {
    window.google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: "outline",
      size: "large",
      width: "300px",
    });
  }
};

const handleGoogleLogin = async (credential) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential }),
    }
  );

  if (!response.ok) {
    throw new Error("Google authentication failed");
  }
  return response.json();
};
