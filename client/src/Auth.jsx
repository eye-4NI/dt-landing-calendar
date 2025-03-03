// Replace direct Google OAuth calls with backend endpoint
const handleGoogleLogin = () => {
  window.location.href = 'https://your-backend-url/auth/google';
};
