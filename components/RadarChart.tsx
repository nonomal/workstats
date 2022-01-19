import React, { useEffect, useState } from "react";
import {
  Chart,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import GetGithubData from "../services/githubService";

const RadarChart = () => {

  // const max = 80;
  // const min = 30;
  // const randomNumber1 = Math.floor(Math.random() * (max - min + 1)) + min;
  // const randomNumber2 = Math.floor(Math.random() * (max - min + 1)) + min;
  // const randomNumber3 = Math.floor(Math.random() * (max - min + 1)) + min;
  // const randomNumber4 = Math.floor(Math.random() * (max - min + 1)) + min;
  // const randomNumber5 = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomNumber1 = 25; // {githubData.count};
  const randomNumber2 = 35;
  const randomNumber3 = 45;
  const randomNumber4 = 75;
  const randomNumber5 = 85;

  const data = {
    labels: [
      "Code (GitHub)",
      "Review (GitHub)",
      "Tasks (Asana)",
      "Communication (Slack)",
      "Activity (Twitter)",
    ],
    datasets: [
      {
        label: "Hiroshi Nishio's Stats",
        data: [
          randomNumber1,
          randomNumber2,
          randomNumber3,
          randomNumber4,
          randomNumber5,
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const fontSize = 18;
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Radar chart of individual KPIs on a deviation basis",
        font: {
          size: fontSize,
        },
      },
      legend: {
        labels: {
          font: {
            size: fontSize,
          },
        },
      },
    },
    scales: {
      r: {
        suggestedMin: 25,
        suggestedMax: 75,
        ticks: {
          font: {
            size: fontSize,
          },
        },
        pointLabels: {
          font: {
            size: fontSize,
          },
        },
      },
    },
  };

  Chart.register(
    Filler,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip
  );

  return <Radar data={data} options={options} />;
  // return <Radar data={data} options={options} width={10} height={10}/>;
};

export default RadarChart;
