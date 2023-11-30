import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Redirect to profile completion based on the user's role
        const userData = await response.json();
        if (userData.role === 'customer') {
          navigate('/complete_customer_profile');
        } else if (userData.role === 'moving_company') {
          navigate('/complete_moving-company_profile');
        } else {
          // Redirect to a default dashboard or home page
          navigate('/dashboard');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" name="email" value={loginData.email} onChange={handleInputChange} />
      <label>Password:</label>
      <input type="password" name="password" value={loginData.password} onChange={handleInputChange} />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging In...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
