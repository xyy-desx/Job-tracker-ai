import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

function Signup() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-10">
      <div className="flex flex-col items-center mb-8">
        <img
          src={logo}
          alt="Job-Tracker AI"
          className="w-24 h-24 mb-3 rounded-full shadow-lg border-4 border-blue-300"
        />
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2">Create Account</h2>
        <span className="text-gray-500 font-medium text-sm text-center px-3">
          "Track the journey, achieve the goal —
          starting today, your progress is <b>AI-powered</b>."
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-blue-200 rounded-lg focus:ring focus:ring-blue-100"
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border border-blue-200 rounded-lg focus:ring focus:ring-blue-100"
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border border-blue-200 rounded-lg focus:ring focus:ring-blue-100"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
        {error && <div className="mt-2 text-red-500 text-sm text-center">{error}</div>}
      </form>
      <div className="mt-8 text-center text-gray-600 text-sm">
        Already have an account?{' '}
        <span
          className="text-blue-500 cursor-pointer underline"
          onClick={() => navigate('/login')}
        >
          Login
        </span>
      </div>
    </div>
  );
}

export default Signup;
