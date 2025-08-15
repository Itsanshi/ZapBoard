'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface SampleData {
  id: number;
  message: string;
  timestamp: string;
}

export default function SampleComponent() {
  const [data, setData] = useState<SampleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSampleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<SampleData>('/sample');
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post<SampleData>('/sample', {
        message: 'New sample message from frontend!'
      });
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampleData();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sample Component</h2>
      
      {loading && (
        <div className="text-blue-600">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-600 mb-4">Error: {error}</div>
      )}
      
      {data && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p><strong>ID:</strong> {data.id}</p>
          <p><strong>Message:</strong> {data.message}</p>
          <p><strong>Time:</strong> {new Date(data.timestamp).toLocaleString()}</p>
        </div>
      )}
      
      <div className="space-x-2">
        <button
          onClick={fetchSampleData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Fetch Data
        </button>
        
        <button
          onClick={createSampleData}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Create Data
        </button>
      </div>
    </div>
  );
}
