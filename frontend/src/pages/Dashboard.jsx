import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Copy, Trash2, Activity, Plus, LogOut, Check } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [user, setUser] = useState(null);
  
  // Create URL form
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState('');
  
  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAndUrls();
  }, []);

  const fetchUserAndUrls = async () => {
    try {
      const userRes = await api.get('/auth/me');
      setUser(userRes.data.data.user);
      
      const urlRes = await api.get('/url/list');
      setUrls(urlRes.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleCreateUrl = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/url/create', { originalUrl, customCode: customCode || undefined });
      setOriginalUrl('');
      setCustomCode('');
      fetchUserAndUrls();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating URL');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/url/${id}`);
      fetchUserAndUrls();
      if (analyticsData?.id === id) setShowAnalytics(false);
    } catch (err) {
      alert('Error deleting URL');
    }
  };

  const handleCopy = (shortCode, id) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewAnalytics = async (id) => {
    try {
      const res = await api.get(`/analytics/${id}`);
      setAnalyticsData(res.data.data);
      setShowAnalytics(true);
    } catch (err) {
      alert('Error fetching analytics');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const chartData = {
    labels: analyticsData?.clicks.map(c => new Date(c.createdAt).toLocaleDateString()).reverse() || [],
    datasets: [
      {
        label: 'Clicks over time',
        data: analyticsData?.clicks.map((c, i) => i + 1) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">ShortLink</h1>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">{user?.email}</span>
          <button onClick={logout} className="flex items-center text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} className="mr-1" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create Form & List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create URL Form */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Create New Link</h2>
            {error && <div className="text-red-500 mb-4 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
            <form onSubmit={handleCreateUrl} className="flex gap-4">
              <input
                type="url"
                required
                placeholder="https://very-long-url.com"
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-4 py-2 focus:border-blue-500 outline-none transition-colors"
                value={originalUrl}
                onChange={e => setOriginalUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Custom alias (opt)"
                className="w-40 bg-slate-900 border border-slate-700 rounded px-4 py-2 focus:border-blue-500 outline-none transition-colors"
                value={customCode}
                onChange={e => setCustomCode(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium flex items-center transition-colors">
                <Plus size={18} className="mr-1" /> Create
              </button>
            </form>
          </div>

          {/* URLs List */}
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Your Links</h2>
            </div>
            <div className="divide-y divide-slate-700">
              {urls.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No links created yet.</div>
              ) : urls.map(url => (
                <div key={url.id} className="p-6 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                  <div className="overflow-hidden pr-4">
                    <div className="font-medium text-blue-400 mb-1 truncate">
                      {window.location.origin}/{url.shortCode}
                    </div>
                    <div className="text-sm text-slate-500 truncate max-w-md">
                      {url.originalUrl}
                    </div>
                    <div className="text-xs text-slate-600 mt-2">
                      {new Date(url.createdAt).toLocaleDateString()} • {url.analytics?.totalClicks || 0} visits
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(url.shortCode, url.id)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
                      title="Copy short link"
                    >
                      {copiedId === url.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                    <button
                      onClick={() => handleViewAnalytics(url.id)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition"
                      title="View Analytics"
                    >
                      <Activity size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(url.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded transition"
                      title="Delete link"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Analytics Sidebar */}
        <div className="lg:col-span-1">
          {showAnalytics && analyticsData ? (
            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Analytics for /{analyticsData.shortCode}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-slate-500 text-sm mb-1">Total Clicks</div>
                  <div className="text-3xl font-bold text-white">{analyticsData.analytics?.totalClicks || 0}</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-slate-500 text-sm mb-1">Unique Clicks</div>
                  <div className="text-3xl font-bold text-white">{analyticsData.analytics?.uniqueClicks || 0}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Click Timeline</h3>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-700">
                  <Line data={chartData} options={{ responsive: true, color: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Visitors</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {analyticsData.clicks.slice(0, 10).map(click => (
                    <div key={click.id} className="text-xs bg-slate-900 p-3 rounded border border-slate-700">
                      <div className="flex justify-between mb-1">
                        <span className="text-white">{click.location}</span>
                        <span className="text-slate-500">{new Date(click.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-400">
                        {click.browser} on {click.os}
                      </div>
                    </div>
                  ))}
                  {analyticsData.clicks.length === 0 && (
                    <div className="text-sm text-slate-500 text-center py-4">No clicks recorded yet</div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 flex flex-col items-center justify-center text-center h-64 sticky top-8 text-slate-500">
              <Activity size={48} className="mb-4 opacity-50" />
              <p>Select a link to view its analytics</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
