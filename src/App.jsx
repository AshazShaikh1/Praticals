// src/App.jsx (CORRECTED VERSION)

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { supabase } from "./supabase";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const SubjectPage = lazy(() => import("./pages/SubjectPage"));
const AuthForm = lazy(() => import("./components/AuthForm"));

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return <div className="content" style={{ textAlign: 'center', padding: '50px' }}>Loading authentication status...</div>;
  }
  
  return (
    <div className="app">
      <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
        <div className="logo"><Link to="/">Notes</Link></div>
        <div className="auth-status">
          {session ? (
            <>
              <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '10px' }}>Hi, {session.user.user_metadata?.name || session.user.email}</span>
              <button onClick={handleSignOut} style={{ padding: '6px 12px', background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}>
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <Link to="/auth">Sign In / Sign Up</Link>
            </div>
          )}
        </div>
      </header>
      <main className="content">
        <Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subject/:slug/*" element={<SubjectPage />} />
            <Route path="/auth" element={<AuthForm />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}