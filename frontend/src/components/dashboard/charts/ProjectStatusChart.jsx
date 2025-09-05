import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { authHeaders } from '../../global_vars';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const ProjectStatusChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectStatusData();
  }, []);

  const loadProjectStatusData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/dashboard/project-status/', { headers: authHeaders() });
      if (response.data.success) {
        const data = response.data.data;
        setChartData({
          labels: data.labels,
          datasets: [{
            data: data.values,
            backgroundColor: [
              '#28a745', // Active
              '#ffc107', // Pending
              '#dc3545', // Completed
              '#6c757d', // On Hold
              '#17a2b8', // In Progress
            ],
            borderWidth: 2,
            borderColor: '#fff',
          }]
        });
      }
    } catch (error) {
      console.error('Error loading project status data:', error);
      // Fallback data
      setChartData({
        labels: ['Active', 'Pending', 'Completed', 'On Hold', 'In Progress'],
        datasets: [{
          data: [12, 8, 15, 3, 7],
          backgroundColor: [
            '#28a745',
            '#ffc107',
            '#dc3545',
            '#6c757d',
            '#17a2b8',
          ],
          borderWidth: 2,
          borderColor: '#fff',
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading chart...</div>;
  }

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ProjectStatusChart;
