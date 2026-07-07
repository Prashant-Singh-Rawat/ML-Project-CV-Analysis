import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Dashboard from '../components/Dashboard';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);

  // Support both key names: analysisData (new) and result (legacy)
  const result = location.state?.analysisData || location.state?.result || null;

  useEffect(() => {
    if (!result) {
      navigate('/analyze', { replace: true });
    }
  }, [result, navigate]);

  useEffect(() => {
    api.get(`/metrics`)
      .then(res => { if (res.data) setMetrics(res.data); })
      .catch(() => {});
  }, []);

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <Dashboard result={result} metrics={metrics} onBack={() => navigate('/analyze')} />
      </div>
    </motion.div>
  );
}
