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
// @ts-ignore
import GetGithubData from "../../services/githubServices.client";
// @ts-ignore
import useAsanaData from "../../services/asanaClientService";

const RadarChart = () => {
  // TODO: It is better to change GetGithubData to useSWR instead of useEffect so that it is easier to understand when to describe.
  const [githubData, setGithubData] = useState({
    author: {},
    total: 0,
    weeks: [],
  });
  useEffect(() => {
    // GetGithubData() returns a promise, so resolve it by connecting it with "then".
    // @ts-ignore
    GetGithubData().then((githubData) => setGithubData(githubData));
  }, []);

  const githubCommitCount = githubData["total"] ? githubData["total"] : 0;
  const randomNumber2 = 35;
  // Even though I'm using useSWR, if there is no cache, it will be Undefined and cause an error, so I'm doing this.
  const asanaData = useAsanaData();
  const asanaCompletedTaskCount = asanaData ? asanaData : 0;

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
          githubCommitCount,
          randomNumber2,
          asanaCompletedTaskCount,
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
