import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import InputForm from '../components/InputForm';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('172.') || window.location.hostname.startsWith('10.');
const API_BASE_URL = isLocal ? `http://${window.location.hostname}:8000` : 'https://tonycv-backend.onrender.com';

const FALLBACK_COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple",
  "Netflix", "Infosys", "TCS", "Oracle", "IBM", "Adobe"
];

export default function Analyze() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState(FALLBACK_COMPANIES);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/companies`)
      .then(res => {
        if (res.data.companies && res.data.companies.length > 0) {
          setCompanies(res.data.companies);
        }
      })
      .catch(() => console.warn('Could not fetch companies from API, using fallback list.'));
  }, []);

  const handleAnalyze = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('cv_file', data.cv_file);
      formData.append('cgpa', data.cgpa);
      formData.append('target_company', data.target_company);
      if (data.github_url) {
        formData.append('github_url', data.github_url);
      }
      formData.append('experience_level', data.experience_level || 'fresher');

      const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Navigate to dashboard and pass the result data
      navigate('/dashboard', { state: { result: response.data } });
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while connecting to the AI model.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Run Your Analysis</h1>
          <p className="text-gray-400">Upload your PDF and fill in the details below to generate your report.</p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div className="text-red-400 text-lg">⚠</div>
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} companies={companies} />
        </motion.div>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 mt-12"
          >
            <div className="spinner" />
            <p className="text-violet-400 font-semibold tracking-widest uppercase text-xs">Processing NLP Vectors...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
