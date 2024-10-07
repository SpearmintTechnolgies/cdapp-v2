// src/components/CandlestickChart.js
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { color } from 'highcharts';
import { light } from '@mui/material/styles/createPalette';

const CandlestickChart = ({ chartData }) => {
  const [isdark, setDark] = useState("light")



  const chartContainerRef = useRef(null);
  function getDateFormat() {
    return new Date().getFullYear() + "-" + (new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth()) + "-" + (new Date().getDate() < 10 ? "0" + (new Date().getDate()) : new Date().getDate())
  }

  // const checkMode = () => {
  //   if (typeof window !== 'undefined') {
  //     const bodyStyle = window.getComputedStyle(document.body);
  //     const bgColor = bodyStyle.getPropertyValue('background-color');
  //     if (bgColor === 'rgb(0, 0, 0)' || bgColor === '#000000') {
  //       // console.warn(bgColor)
  //       setDark(true);  // Set dark mode if background is dark
  //     } else {
  //       setDark(false); // Otherwise, set light mode
  //     }
  //   }
  // };

  const checkMode = () => {
    const localVal = localStorage.getItem("theme_mode");
    if(localVal !== isdark){
      setDark(localVal)
    }

    setTimeout(() =>{
      checkMode()
    }, 2000)
  }

  let flag = true;

  useEffect(() => {
    if (flag) {
      checkMode()
      flag = false;
    }

  }, [isdark])


  useEffect(() => {

    const chart = createChart(chartContainerRef.current, {
      height: 400,
      layout: {
        background: { color: isdark === "dark" ? "#222" : '#fff', },
        textColor: "#C3BCDB",
      },
      grid: {
        vertLines: { color: "#444", visible: true },
        horzLines: { color: "#444" },
      },
      timeScale: {
        timeVisible: true,
        barSpacing: 20,
        minBarSpacing: 20,
        rightOffset: 10,
        ticksVisible: true,
        uniformDistribution: true,

      }

    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: 'rgb(143,188,143)',
      downColor: 'rgb(255,0,0)',
      borderDownColor: 'rgb(255,0,0)',
      borderUpColor: 'rgb(143,188,143)',
      wickDownColor: 'rgb(255,0,0)',
      wickUpColor: 'rgb(143,188,143)',
    });
    if (chartData?.length > 0) {
      console.log(chartData);

      const parsedChartData = chartData.map(data => ({
        time: data.time,  // Assuming 'time' is already in the correct format
        open: parseFloat(data.open),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        close: parseFloat(data.close),
      }));

      console.log(parsedChartData); // Check if data is correctly parsed
      candlestickSeries.setData(parsedChartData);
    }



    candlestickSeries.applyOptions({
      priceFormat: {
        type: 'price',
        precision: 8,
        minMove: 0.000000001,
      },


    });

    return () => {
      chart.remove();
    };
  }, [chartData, isdark]);



  return (
    <div style={{ "width": "100%" }} ref={chartContainerRef} />
  );
};

export default CandlestickChart;
