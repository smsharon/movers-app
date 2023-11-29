import React, { useState } from 'react';

const SignupForm = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <br />
      <label>
        Role:
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="moving_company">Moving Company</option>
        </select>
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default SignupForm;
