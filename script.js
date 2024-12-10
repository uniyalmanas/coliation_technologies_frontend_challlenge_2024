// API credentials
const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';
const username = 'coalition';
const password = 'skills-test';

// Fetch data from the API
async function fetchData() {
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: 'Basic ' + btoa(`${username}:${password}`)
    }
  });
  const data = await response.json();
  return data;
}

// Render the chart inside the canvas
async function renderChart() {
  const data = await fetchData();

  if (!Array.isArray(data) || data.length === 0) {
    alert('No data available to display the graph.');
    return;
  }

  // Extract diagnosis history for the first patient
  const diagnosisHistory = data[0].diagnosis_history;

  // Prepare data for the graph
  const months = diagnosisHistory.map(entry => `${entry.month} ${entry.year}`);
  const systolic = diagnosisHistory.map(entry => entry.blood_pressure.systolic.value);
  const diastolic = diagnosisHistory.map(entry => entry.blood_pressure.diastolic.value);

  // Get the canvas context
  const ctx = document.getElementById('bpChart').getContext('2d');

  // Create and render the chart using Chart.js
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Systolic',
          data: systolic,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.4,
          fill: false,
          pointStyle: 'circle',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Diastolic',
          data: diastolic,
          borderColor: 'blue',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.4,
          fill: false,
          pointStyle: 'circle',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true
        },
        // Custom plugin to set background color
        backgroundColorPlugin: {
          id: 'backgroundColorPlugin',
          beforeDraw(chart) {
            const { width, height } = chart.canvas;
            const ctx = chart.ctx;
            ctx.fillStyle = '#F4F0FE'; // Set background color
            ctx.fillRect(0, 0, width, height);
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Blood Pressure (mmHg)'
          },
          beginAtZero: false
        }
      }
    },
    plugins: [
      {
        id: 'backgroundColorPlugin',
        beforeDraw(chart) {
          const { width, height } = chart.canvas;
          const ctx = chart.ctx;
          ctx.fillStyle = '#F4F0FE'; // Background color
          ctx.fillRect(0, 0, width, height);
        }
      }
    ]
  });
}

// Fetch data and render the chart
renderChart();
