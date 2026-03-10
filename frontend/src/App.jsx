import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      <div className="text-center z-10 relative px-4">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 tracking-tight">ShortLink</h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate URL shortener. Fast redirects, custom aliases, and powerful real-time analytics for your links.
        </p>
        <div className="space-x-6 flex justify-center">
          <Link to="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105">Login to Dashboard</Link>
          <Link to="/register" className="px-8 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-lg font-semibold shadow-lg transition-all">Create Account</Link>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
