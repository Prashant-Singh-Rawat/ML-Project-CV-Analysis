import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Dashboard from '../components/Dashboard';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('172.') || window.location.hostname.startsWith('10.');
const API_BASE_URL = isLocal ? `http://${window.location.hostname}:8000` : 'https://tonycv-backend.onrender.com';

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);

  // If someone tries to navigate to /dashboard directly without data, kick them to /analyze
  useEffect(() => {
    if (!location.state || !location.state.result) {
      navigate('/analyze', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/metrics`)
      .then(res => {
        if (res.data) setMetrics(res.data);
      })
      .catch(err => console.error('Error fetching metrics', err));
  }, []);

  if (!location.state || !location.state.result) {
    return null;
  }

  const handleBack = () => {
    navigate('/analyze');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <Dashboard result={location.state.result} metrics={metrics} onBack={handleBack} />
      </div>
    </motion.div>
  );
}
