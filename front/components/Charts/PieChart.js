"use client";

import React from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

const PieChart = ({ series, labels }) => {
  const { t } = useTranslation();

  const chartOptions = {
    series: series,
    colors: [
      "#1C64F2", "#16BDCA", "#9061F9", "#FFC107", "#FF5722",
      "#4CAF50", "#FF9800", "#9C27B0", "#3F51B5", "#E91E63",
      "#00BCD4", "#FFEB3B"
    ],
    chart: {
      type: "pie",
      height: 420,
    },
    stroke: {
      colors: ["black"],
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -25,
        },
      },
    },
    labels: labels,
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
    },
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between items-start w-full">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{t('percentageAstrologicalSigns')}</h5>
      </div>
      <div className="py-6">
        <Chart options={chartOptions} series={chartOptions.series} type="pie" height={420} />
      </div>
    </div>
  );
};

export default PieChart;
