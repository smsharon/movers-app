import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
        const userData = await response.json();
        const { access_token } = userData;

        // Store the access token securely (in localStorage)
        localStorage.setItem('access_token', access_token);
        // Check if the user's profile is completed
      if (userData.profile_completed) {
        // Profile is completed, redirect to the dashboard 
        navigate('/');
      } else {
        // Profile is not completed, redirect to the profile completion page
        if (userData.role === 'customer') {
          navigate('/complete_customer_profile');
        } else if (userData.role === 'moving_company') {
          navigate('/complete_moving_company_profile');
        }
      }

        // Display success message
        setSuccessMessage('Login successful!');
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
    <div className='login'>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" name="email" value={loginData.email} onChange={handleInputChange} />
      <label>Password:</label>
      <input type="password" name="password" value={loginData.password} onChange={handleInputChange} />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging In...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <p>
        No account? <Link to="/signup">Create account</Link>
      </p>
    </div>
  );
};

export default Login;
