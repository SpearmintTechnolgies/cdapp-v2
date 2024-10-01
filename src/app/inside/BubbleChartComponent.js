"use client";

import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { light } from '@mui/material/styles/createPalette';
// import { color } from 'highcharts';

const BubbleChartComponent = ({ trades }) => {
  useEffect(() => {
    let mode = localStorage.getItem("theme_mode") || "light"
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    const data = trades?.map((trade) => [
      trade?.amount / 1e18, // Converting Wei to Ether for the x-axis
      trade?.tokens / 1e18, // Converting tokens from Wei for the y-axis
      trade?.timestamp,      // This can represent the bubble size
      trade?.amount / 1e18,          // Country or user for tooltip
      trade?.project        // Additional data
    ]);

    const option = {
      backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
        { offset: 0, color: mode==="dark"? '#222' :"#fff"},
        { offset: 1, color: mode==="dark"? '#222' :"#fff" }
      ]),
      title: {
        text: 'Holder Distribution Chart',
        left: 'center',
        top: '3%',
        textStyle:{
          color:mode==="dark"? '#fff' :"#222"
        }
      },
      grid: {
        left: '8%',
        top: '10%'
      },
      xAxis: {
        show: false,
        name: 'Trade Amount (ETH)',
        splitLine: {
          lineStyle: { type: 'dashed' }
        }
      },
      yAxis: {
        show: false,
        name: 'Tokens Traded (ETH)',
        splitLine: {
          lineStyle: { type: 'dashed' }
        },
        scale: true
      },
      series: [
        {
          name: 'Trades',
          data: data,
          type: 'scatter',
          symbolSize: function (data) {
            return Math.sqrt(data[2]) / 1e3; // Make bubbles smaller
          },
          emphasis: {
            focus: 'series',
            label: {
              show: true,
              formatter: (param) => param?.data[3], // Display user or relevant info on hover
              position: 'top', // Keep the label inside the bubble
            }
          },
          labelLayout: {
            hideOverlap: true,  // Hide labels that overlap
            moveOverlap: 'shiftY' // Shift the labels up/down if overlapping
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
              { offset: 0, color: 'rgb(251, 118, 123)' },
              { offset: 1, color: 'rgb(204, 46, 72)' }
            ])
          }
        }
      ]
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, [trades]);

  return (
    <div id="main" style={{ width: '100%', height: '400px' }} />
  );
};

export default BubbleChartComponent;
