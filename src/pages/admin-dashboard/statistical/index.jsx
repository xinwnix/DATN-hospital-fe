import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Statistical = () => {
  const chartRef = useRef(null);
  const [dataToShow, setDataToShow] = useState('week');

  const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  const years = ['Năm 2022', 'Năm 2023'];

  const weekData = [
    [500, 700, 800, 1000],
  ];

  const monthData = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  ];

  const yearData = [
    [5000, 6000],
  ];

  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (!chart) {
      const ctx = chartRef.current.getContext('2d');
      const initialChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: weeks,
          datasets: [
            {
              label: 'Doanh thu',
              data: weekData[0],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      setChart(initialChart);
    } else {
      chart.data.labels = dataToShow === 'week' ? weeks : dataToShow === 'month' ? months : years;
      chart.data.datasets[0].data = dataToShow === 'week' ? weekData[0] : dataToShow === 'month' ? monthData[0] : yearData[0];
      chart.update();
    }
  }, [dataToShow, chart]);

  useEffect(() => {
    if (chart) {
      chart.destroy();
      const ctx = chartRef.current.getContext('2d');
      setChart(
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dataToShow === 'week' ? weeks : dataToShow === 'month' ? months : years,
            datasets: [
              {
                label: 'Doanh thu',
                data: dataToShow === 'week' ? weekData[0] : dataToShow === 'month' ? monthData[0] : yearData[0],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      );
    }
  }, [dataToShow]);

  return (
    <div>
      <h1 style={{marginBottom:"20px"}}>Xem thống kê doanh thu</h1>
      <button onClick={() => setDataToShow('week')}>Tuần</button>
      <button onClick={() => setDataToShow('month')}>Tháng</button>
      <button onClick={() => setDataToShow('year')}>Năm</button>
      <div style={{ width: '85vw', height: '82vh', display: 'flex', justifyContent: 'center' }}>
        <canvas ref={chartRef} width="40" height="30" />
      </div>
    </div>
  );
};

export default Statistical;
