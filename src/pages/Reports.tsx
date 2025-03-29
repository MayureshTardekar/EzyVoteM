import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Button from '../components/Button';
import { Download } from 'lucide-react';
import Card from '../components/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import LoadingSpinner from '../components/LoadingSpinner'; // Add a loading spinner component

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate an API call
        const data = await new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              overview: {
                totalVoters: 1200,
                totalVotes: 1150,
                voterTurnout: 95,
              },
              eventStats: {
                event1: {
                  votes: 350,
                  turnout: 90,
                },
                event2: {
                  votes: 500,
                  turnout: 92,
                },
              },
              chartData: {
                labels: ['Event 1', 'Event 2'],
                datasets: [
                  {
                    label: 'Votes',
                    data: [350, 500],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                  {
                    label: 'Voter Turnout',
                    data: [90, 92],
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                  },
                ],
              },
            });
          }, 1000)
        );
        setReportData(data);
      } catch (err) {
        setError('Failed to fetch report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleDownload = (format: string) => {
    const element = document.createElement('a');
    const file = new Blob([`Sample report in ${format}`], {
      type: format === 'csv' ? 'text/csv' : 'application/pdf',
    });
    element.href = URL.createObjectURL(file);
    element.download = `report.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Page Content */}
      <div className="p-4 sm:p-6">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
          Reports
        </h1>

        {/* Overview Section */}
        <Card className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm sm:text-lg text-gray-600">Total Voters</h3>
              <p className="text-xl sm:text-3xl font-bold text-blue-600">
                {reportData?.overview.totalVoters}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm sm:text-lg text-gray-600">Total Votes</h3>
              <p className="text-xl sm:text-3xl font-bold text-green-600">
                {reportData?.overview.totalVotes}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm sm:text-lg text-gray-600">Voter Turnout</h3>
              <p className="text-xl sm:text-3xl font-bold text-purple-600">
                {reportData?.overview.voterTurnout}%
              </p>
            </div>
          </div>
        </Card>

        {/* Voting Results Section */}
        <Card className="mb-6 sm:mb-8 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Voting Results
          </h2>
          <div className="flex flex-col gap-6">
            <div className="w-full h-64 sm:h-80">
              <Bar
                data={reportData?.chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
            <div className="w-full h-64 sm:h-80">
              <Pie
                data={reportData?.chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </Card>

        {/* Download Section */}
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Download Report
          </h2>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
            <Button
              variant="secondary"
              icon={<Download className="h-4 w-4 sm:h-5 sm:w-5" />}
              onClick={() => handleDownload('csv')}
              className="text-sm sm:text-base hover:bg-blue-100"
            >
              CSV
            </Button>
            <Button
              variant="secondary"
              icon={<Download className="h-4 w-4 sm:h-5 sm:w-5" />}
              onClick={() => handleDownload('pdf')}
              className="text-sm sm:text-base hover:bg-red-100"
            >
              PDF
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;