import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";

const App: React.FC = () => {
  const [connected, setConnected] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [stressLevel, setStressLevel] = useState("Normal");
  const [stressScore, setStressScore] = useState(8); // Matches image
  const [lastUpdated, setLastUpdated] = useState("");
  const [refreshRate, setRefreshRate] = useState(3);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [monitoring, setMonitoring] = useState(true); // "Stop Monitoring" implies it's active
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState(100); // Matches image
  const [notificationType, setNotificationType] = useState("Sound"); // Matches image

  // Initial values for audio metrics to match screenshot
  const [audioVolume, setAudioVolume] = useState(65);
  const [audioFrequency, setAudioFrequency] = useState(420);
  const [audioCallsPerMin, setAudioCallsPerMin] = useState(12);

  // Initial values for behavior metrics
  const [behaviorPosture, setBehaviorPosture] = useState("Standing");
  const [behaviorMovement, setBehaviorMovement] = useState("Medium");
  const [behaviorClustering, setBehaviorClustering] = useState("Low");

  const audioChartRef = useRef<HTMLDivElement>(null);
  const movementChartRef = useRef<HTMLDivElement>(null);
  const timelineChartRef = useRef<HTMLDivElement>(null);

  // Mock data for logs (as provided)
  const logEntries = [
    {
      id: 1,
      timestamp: "2025-05-22 09:15:23",
      stressLevel: "Normal",
      detectionType: "Audio",
      duration: "45s",
      severity: "Low",
    },
    {
      id: 2,
      timestamp: "2025-05-22 09:30:45",
      stressLevel: "Mild Stress",
      detectionType: "Behavior",
      duration: "2m 15s",
      severity: "Medium",
    },
    {
      id: 3,
      timestamp: "2025-05-22 10:05:12",
      stressLevel: "High Stress",
      detectionType: "Audio",
      duration: "1m 30s",
      severity: "High",
    },
    {
      id: 4,
      timestamp: "2025-05-22 10:45:33",
      stressLevel: "Normal",
      detectionType: "Behavior",
      duration: "3m 10s",
      severity: "Low",
    },
    {
      id: 5,
      timestamp: "2025-05-22 11:20:18",
      stressLevel: "Mild Stress",
      detectionType: "Audio",
      duration: "1m 45s",
      severity: "Medium",
    },
  ];

  // Update current time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format date to "Month Day, Year" like "May 24, 2025"
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
      // Format time to "HH:MM:SS AM/PM" like "01:33:04 AM"
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate stress level updates
  useEffect(() => {
    if (!autoRefresh || !monitoring) return;

    const updateStressData = () => {
      const randomScore = Math.floor(Math.random() * 20); // Keep it low for 'Normal' initially
      setStressScore(randomScore);

      if (randomScore < 30) {
        setStressLevel("Normal");
      } else if (randomScore < 70) {
        setStressLevel("Mild Stress");
      } else {
        setStressLevel("High Stress");
      }

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };

    updateStressData(); // Initial update
    const interval = setInterval(updateStressData, refreshRate * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshRate, monitoring]);

  // Initialize audio chart
  useEffect(() => {
    if (audioChartRef.current) {
      const chart = echarts.init(audioChartRef.current);

      const option = {
        animation: false,
        grid: {
          top: 20, // Adjusted top padding
          right: 10,
          bottom: 20,
          left: 50,
        },
        xAxis: {
          type: "category",
          data: Array.from({ length: 50 }, (_, i) => i),
          axisLabel: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          min: -50, // Adjusted min to -50 as per image
          max: 100, // Adjusted max to 100 as per image
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', // Dotted lines as in the image
              color: '#e5e7eb' // Light gray color
            }
          }
        },
        series: [
          {
            data: Array.from({ length: 50 }, () => Math.random() * 150 - 50), // Data adjusted for -50 to 100 range
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#3b82f6", // Blue
              width: 2,
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(59, 130, 246, 0.5)", // Light blue gradient
                  },
                  {
                    offset: 1,
                    color: "rgba(59, 130, 246, 0.1)",
                  },
                ],
              },
            },
          },
        ],
      };

      chart.setOption(option);

      const resizeHandler = () => {
        chart.resize();
      };

      window.addEventListener("resize", resizeHandler);

      // Simulate real-time updates for audio data and metrics
      const interval = setInterval(() => {
        if (!audioMuted && monitoring) {
          const newData = Array.from(
            { length: 50 },
            () => Math.random() * 150 - 50, // Adjusted data range
          );
          chart.setOption({
            series: [
              {
                data: newData,
              },
            ],
          });
          // Update audio metrics
          setAudioVolume(Math.floor(Math.random() * (90 - 30) + 30));
          setAudioFrequency(Math.floor(Math.random() * (800 - 200) + 200));
          setAudioCallsPerMin(Math.floor(Math.random() * 20));
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", resizeHandler);
        chart.dispose();
      };
    }
  }, [audioMuted, monitoring]);

  // Initialize movement chart (bar chart)
  useEffect(() => {
    if (movementChartRef.current) {
      const chart = echarts.init(movementChartRef.current);

      const option = {
        animation: false,
        grid: {
          top: 10,
          right: 10,
          bottom: 20,
          left: 50,
        },
        xAxis: {
          type: "category",
          data: Array.from({ length: 20 }, (_, i) => i),
          axisLabel: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', // Dotted lines as in the image
              color: '#e5e7eb' // Light gray color
            }
          }
        },
        series: [
          {
            data: Array.from({ length: 20 }, () => Math.random() * 100),
            type: "bar",
            itemStyle: {
              color: "#10b981", // Green
            },
          },
        ],
      };

      chart.setOption(option);

      const resizeHandler = () => {
        chart.resize();
      };

      window.addEventListener("resize", resizeHandler);

      // Simulate real-time updates for movement data and metrics
      const interval = setInterval(() => {
        if (!videoPaused && monitoring) {
          const newData = Array.from({ length: 20 }, () => Math.random() * 100);
          chart.setOption({
            series: [
              {
                data: newData,
              },
            ],
          });
          // Update behavior metrics
          const postures = ["Standing", "Sitting", "Pacing"];
          const movements = ["Low", "Medium", "High"];
          const clusterings = ["Low", "Medium", "High"];
          setBehaviorPosture(postures[Math.floor(Math.random() * postures.length)]);
          setBehaviorMovement(movements[Math.floor(Math.random() * movements.length)]);
          setBehaviorClustering(clusterings[Math.floor(Math.random() * clusterings.length)]);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        window.removeEventListener("resize", resizeHandler);
        chart.dispose();
      };
    }
  }, [videoPaused, monitoring]);

  // Initialize timeline chart (historical data)
  useEffect(() => {
    if (timelineChartRef.current) {
      const chart = echarts.init(timelineChartRef.current);

      const now = new Date();
      const times = Array.from({ length: 24 }, (_, i) => {
        const time = new Date(now);
        time.setHours(now.getHours() - 23 + i); // Go back 23 hours to cover a 24-hour period
        return time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      });

      const option = {
        animation: false,
        grid: {
          top: 30,
          right: 20,
          bottom: 30,
          left: 60,
        },
        legend: {
          data: ["Audio", "Behavior"],
          top: 0,
          textStyle: {
            color: '#374151' // Darker gray for legend text
          }
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: times,
          axisLabel: {
            rotate: 45,
            color: '#6b7280' // Gray for axis labels
          },
          axisLine: {
            lineStyle: {
              color: '#d1d5db' // Light gray axis line
            }
          }
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          name: "Stress Level",
          nameLocation: "middle",
          nameGap: 40,
          axisLabel: {
            color: '#6b7280' // Gray for axis labels
          },
          axisLine: {
            lineStyle: {
              color: '#d1d5db' // Light gray axis line
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', // Dotted lines as in the image
              color: '#e5e7eb' // Light gray color
            }
          }
        },
        series: [
          {
            name: "Audio",
            data: Array.from({ length: 24 }, () =>
              Math.floor(Math.random() * 100),
            ),
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#3b82f6", // Blue
              width: 2,
            },
            symbol: "circle",
            symbolSize: 6,
          },
          {
            name: "Behavior",
            data: Array.from({ length: 24 }, () =>
              Math.floor(Math.random() * 100),
            ),
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#10b981", // Green
              width: 2,
            },
            symbol: "circle",
            symbolSize: 6,
          },
        ],
      };

      chart.setOption(option);

      const resizeHandler = () => {
        chart.resize();
      };

      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
        chart.dispose();
      };
    }
  }, []);

  // Get stress level color (as provided)
  const getStressColor = (level: string) => {
    switch (level) {
      case "Normal":
        return "bg-green-500";
      case "Mild Stress":
        return "bg-yellow-500";
      case "High Stress":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get severity badge color (as provided)
  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-feather-alt text-blue-600 text-2xl mr-3"></i>
            <h1 className="text-xl font-bold text-gray-900">
              Chicken Stress Detection System
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span
                className={`inline-block w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} mr-2`}
              ></span>
              <span className="text-sm text-gray-600">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <div>{currentDate}</div>
              <div className="text-right">{currentTime}</div>
            </div>

            <div className="relative">
              <button className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
                <i className="fas fa-user-circle text-2xl"></i>
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex-grow">
        {/* Main Detection Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center ${getStressColor(stressLevel)} text-white text-center transition-all duration-500`}
              >
                <div>
                  <div className="text-2xl font-bold">{stressLevel}</div>
                  <div className="text-3xl font-bold mt-1">{stressScore}%</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Last updated: {lastUpdated}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setMonitoring(!monitoring)}
                  className={`flex items-center px-4 py-2 rounded-button font-medium ${monitoring ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} mr-4 whitespace-nowrap cursor-pointer`}
                >
                  <i
                    className={`fas ${monitoring ? "fa-stop-circle" : "fa-play-circle"} mr-2`}
                  ></i>
                  {monitoring ? "Stop Monitoring" : "Start Monitoring"}
                </button>

                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-600">
                    Auto-refresh:
                  </span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={autoRefresh}
                      onChange={() => setAutoRefresh(!autoRefresh)}
                    />
                    <div
                      className={`relative w-10 h-5 rounded-full transition-colors ${autoRefresh ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      <div
                        className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${autoRefresh ? "transform translate-x-5" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">
                  Refresh rate:
                </span>
                <select
                  value={refreshRate}
                  onChange={(e) => setRefreshRate(Number(e.target.value))}
                  className="border border-gray-300 rounded-button px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer whitespace-nowrap"
                >
                  <option value={3}>3 seconds</option>
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Alert Threshold
                </div>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(Number(e.target.value))}
                    className="w-32 mr-2 accent-blue-600"
                  />
                  <span className="text-sm text-gray-600">
                    {alertThreshold}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </div>
                <div className="flex space-x-2">
                  {["Visual", "Sound", "Both"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setNotificationType(type)}
                      className={`px-3 py-1 text-xs rounded-button whitespace-nowrap cursor-pointer ${notificationType === type ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Data Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Audio Analysis Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Audio Analysis
              </h2>
              <button
                onClick={() => setAudioMuted(!audioMuted)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i
                  className={`fas ${audioMuted ? "fa-volume-mute" : "fa-volume-up"} text-lg`}
                ></i>
              </button>
            </div>

            <div className="h-64 mb-4" ref={audioChartRef}></div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Volume</div>
                <div className="text-lg font-medium text-blue-700">{audioVolume} dB</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Frequency</div>
                <div className="text-lg font-medium text-blue-700">{audioFrequency} Hz</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Calls/min</div>
                <div className="text-lg font-medium text-blue-700">{audioCallsPerMin}</div>
              </div>
            </div>
          </div>

          {/* Behavior Analysis Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Behavior Analysis
              </h2>
              <button
                onClick={() => setVideoPaused(!videoPaused)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i
                  className={`fas ${videoPaused ? "fa-play" : "fa-pause"} text-lg`}
                ></i>
              </button>
            </div>

            {/* Video Player */}
            <div className="relative h-40 mb-4 bg-gray-100 rounded-lg overflow-hidden">
              {/* This is still a static image. For a real video, you'd use a <video> tag
                  pointing to a live stream URL. This will not animate on its own. */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://readdy.ai/api/search-image?query=A%20high-quality%20photograph%20of%20a%20chicken%20in%20a%20coop%2C%20viewed%20from%20above.%20The%20chicken%20is%20in%20a%20natural%20standing%20posture%2C%20with%20feathers%20clearly%20visible.%20The%20background%20shows%20a%20clean%2C%20well-maintained%20chicken%20coop%20floor%20with%20some%20scattered%20feed.%20The%20lighting%20is%20bright%20and%20even%2C%20creating%20a%20clear%20view%20of%20the%20chicken&width=600&height=300&seq=1&orientation=landscape"
                  alt="Live chicken feed"
                  className="w-full h-full object-cover"
                />

                {videoPaused && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <i className="fas fa-play text-white text-4xl"></i>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  LIVE
                </div>
              </div>
            </div>

            {/* Movement Chart (Bar chart as in image) */}
            <div className="h-36 mb-4" ref={movementChartRef}></div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Posture</div>
                <div className="text-lg font-medium text-green-700">
                  {behaviorPosture}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Movement</div>
                <div className="text-lg font-medium text-green-700">{behaviorMovement}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-500">Clustering</div>
                <div className="text-lg font-medium text-green-700">{behaviorClustering}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Historical Data
            </h2>

            <div className="flex space-x-2">
              {["Last hour", "24 hours", "7 days", "Custom"].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 text-sm rounded-button bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap cursor-pointer"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 mb-4" ref={timelineChartRef}></div>

          <div className="flex justify-end">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-button hover:bg-blue-700 whitespace-nowrap cursor-pointer">
              <i className="fas fa-download mr-2"></i>
              Export Data
            </button>
          </div>
        </div>

        {/* Data Logs Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Data Logs</h2>

            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Timestamp
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stress Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Detection Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.stressLevel === "Normal"
                            ? "bg-green-100 text-green-800"
                            : entry.stressLevel === "Mild Stress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.stressLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <i
                          className={`fas ${entry.detectionType === "Audio" ? "fa-volume-up" : "fa-video"} mr-2 text-gray-400`}
                        ></i>
                        {entry.detectionType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityBadgeColor(entry.severity)}`}
                      >
                        {entry.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">Showing 5 of 24 entries</div>

            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-button text-sm text-gray-500 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-button text-sm hover:bg-blue-700 whitespace-nowrap cursor-pointer">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-button text-sm text-gray-500 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-button text-sm text-gray-500 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-button text-sm text-gray-500 hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm text-gray-600">API: Connected</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-sm text-gray-600">
                  Raspberry Pi: Online
                </span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-microchip text-gray-400 mr-2"></i>
                <span className="text-sm text-gray-600">CPU: 15%</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-memory text-gray-400 mr-2"></i>
                <span className="text-sm text-gray-600">Memory: 420MB</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Help
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                System Status
              </a>
              <span className="text-sm text-gray-400">v1.2.3</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;