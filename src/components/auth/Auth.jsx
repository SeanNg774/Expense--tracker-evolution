import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- START OF MOCK AUTHENTICATION LOGIC ---
    // We use setTimeout to simulate the network delay of talking to a database
    setTimeout(() => {
      if (isLogin) {
        // Simulate a successful login for a specific test account
        if (email === 'test@test.com' && password === 'password123') {
          const mockUser = { id: '123', username: 'TestUser', email: 'test@test.com' };
          localStorage.setItem('token', 'mock_jwt_token_12345');
          onAuthSuccess(mockUser);
        } else {
          setError('Invalid credentials. (Hint: use test@test.com / password123)');
          setLoading(false);
        }
      } else {
        // Simulate a successful registration
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const newUser = { id: Date.now().toString(), username, email };
        localStorage.setItem('token', 'mock_jwt_token_98765');
        onAuthSuccess(newUser);
      }
    }, 1000); // 1-second fake delay
    // --- END OF MOCK AUTHENTICATION LOGIC ---
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Login to Expense Tracker' : 'Create an Account'}</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
      
      <form onSubmit={onSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input type="text" name="username" value={username} onChange={onChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required minLength="6" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <span style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
    </div>
  );
};

export default Auth;