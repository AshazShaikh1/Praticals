// src/components/AuthForm.jsx

import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(''); // New State for Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email || !password || (isSigningUp && !name)) {
      setMessage('All fields are required.');
      setLoading(false);
      return;
    }

    let result;

    if (isSigningUp) {
      // --- Sign Up Logic (Adding Name/Metadata) ---
      result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Store name in user_metadata
          },
        },
      });

      if (result.error) {
        setMessage(`Sign up failed: ${result.error.message}`);
      } else if (result.data.user) {
        // Clear fields on success for confirmation screen
        setEmail('');
        setPassword('');
        setName('');
        setMessage('Registration successful! Please check your email for a confirmation link.');
      } else {
        setMessage('Registration attempt failed. Check console for details.');
      }

    } else {
      // --- Sign In Logic ---
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (result.error) {
        setMessage(`Sign in failed: ${result.error.message}`);
      } else {
        // If sign-in is successful, navigate back to the home page
        navigate('/'); 
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>{isSigningUp ? 'Sign Up' : 'Sign In'} to Contribute</h2>
      <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>
      
      <form onSubmit={handleAuth}>
        {isSigningUp && (
            <div style={{ marginBottom: '15px' }}>
            <input
                type="text"
                placeholder="Your Name" // New Name Field
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {isSigningUp ? 'Already have an account? ' : "Don't have an account? "}
        <a href="#" onClick={(e) => {e.preventDefault(); setIsSigningUp(!isSigningUp); setMessage('')}}>
          {isSigningUp ? 'Sign In' : 'Sign Up'}
        </a>
      </p>
    </div>
  );
}