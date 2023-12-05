import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Statistical = () => {
  const chartRef = useRef(null);
  const [dataToShow, setDataToShow] = useState('week'); // Ban đầu chọn hiển thị theo tuần

  useEffect(() => {
    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'];
    const years = ['Năm 2022', 'Năm 2023'];

    const weekData = [
      [500, 700, 800, 1000], // Dữ liệu theo từng tuần trong một tháng nào đó
      [600, 900, 700, 1100],
    ];

    const monthData = [
      [1000, 1500, 1200, 2000], // Dữ liệu theo từng tháng trong một năm nào đó
      [1200, 1800, 1300, 2200],
    ];

    const yearData = [
      [5000, 6000, 5500, 7000], // Dữ liệu theo từng năm
      [6000, 7000, 6500, 8000],
    ];

    const data = dataToShow === 'week' ? weekData : dataToShow === 'month' ? monthData : yearData;

    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dataToShow === 'week' ? weeks : dataToShow === 'month' ? months : years,
          datasets: [
            {
              label: 'Doanh thu',
              data: data[0], // Hiển thị dữ liệu ban đầu theo tuần, tháng hoặc năm
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
    }
  }, [dataToShow]);

  const handleToggle = (option) => {
    setDataToShow(option);
  };

  return (
    <div>
      <canvas ref={chartRef} width="400" height="300" />
      <button onClick={() => handleToggle('week')}>Tuần</button>
      <button onClick={() => handleToggle('month')}>Tháng</button>
      <button onClick={() => handleToggle('year')}>Năm</button>
    </div>
  );
};

export default Statistical;
