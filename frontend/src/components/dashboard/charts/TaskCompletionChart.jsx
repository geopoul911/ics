import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiGet } from '../../../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskCompletionChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaskCompletionData();
  }, []);

  const loadTaskCompletionData = async () => {
    try {
      const response = await apiGet('/api/dashboard/task-completion/');
      if (response.success) {
        const data = response.data;
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Completed',
              data: data.completed,
              backgroundColor: 'rgba(40, 167, 69, 0.8)',
              borderColor: 'rgb(40, 167, 69)',
              borderWidth: 1,
            },
            {
              label: 'In Progress',
              data: data.inProgress,
              backgroundColor: 'rgba(23, 162, 184, 0.8)',
              borderColor: 'rgb(23, 162, 184)',
              borderWidth: 1,
            },
            {
              label: 'Overdue',
              data: data.overdue,
              backgroundColor: 'rgba(220, 53, 69, 0.8)',
              borderColor: 'rgb(220, 53, 69)',
              borderWidth: 1,
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error loading task completion data:', error);
      // Fallback data
      setChartData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Completed',
            data: [15, 22, 18, 25],
            backgroundColor: 'rgba(40, 167, 69, 0.8)',
            borderColor: 'rgb(40, 167, 69)',
            borderWidth: 1,
          },
          {
            label: 'In Progress',
            data: [8, 12, 10, 15],
            backgroundColor: 'rgba(23, 162, 184, 0.8)',
            borderColor: 'rgb(23, 162, 184)',
            borderWidth: 1,
          },
          {
            label: 'Overdue',
            data: [3, 5, 2, 4],
            backgroundColor: 'rgba(220, 53, 69, 0.8)',
            borderColor: 'rgb(220, 53, 69)',
            borderWidth: 1,
          }
        ]
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
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading chart...</div>;
  }

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TaskCompletionChart;
