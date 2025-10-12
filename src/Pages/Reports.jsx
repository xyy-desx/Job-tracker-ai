import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FileDown } from "lucide-react";
import axios from "axios";
import { format, parseISO } from "date-fns";

const Reports = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get("/api/automations/recent-applications");
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading reports...</p>;

  // 🔹 Applications Over Time (grouped by month)
  const applicationsOverTime = applications.reduce((acc, app) => {
    const month = format(parseISO(app.date), "MMM yyyy");
    const existing = acc.find((item) => item.month === month);
    if (existing) existing.applications += 1;
    else acc.push({ month, applications: 1 });
    return acc;
  }, []);

  // 🔹 Success Rate per Platform
  const platformMap = {};
  applications.forEach((app) => {
    if (!platformMap[app.source]) platformMap[app.source] = { total: 0, offers: 0 };
    platformMap[app.source].total += 1;
    if (app.status === "Offer") platformMap[app.source].offers += 1;
  });

  const successRatePerPlatform = Object.entries(platformMap).map(([source, data]) => ({
    source,
    total: data.total,
    offers: data.offers,
  }));

  // 🔹 Timeline (sorted by date)
  const timelineData = [...applications]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((app) => ({
      stage: app.status,
      date: format(parseISO(app.date), "yyyy-MM-dd"),
      color:
        app.status === "Applied"
          ? "bg-blue-500"
          : app.status === "Interview"
          ? "bg-yellow-500"
          : app.status === "Offer"
          ? "bg-green-500"
          : "bg-red-500",
    }));

  // 🔹 CSV Export
  const handleExportCSV = () => {
    const csvContent = [
      ["Month", "Applications"],
      ...applicationsOverTime.map((row) => [row.month, row.applications]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "job_reports.csv");
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Reports Overview
        </h1>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <FileDown size={18} />
          Export Data
        </button>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Applications Over Time */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            📊 Applications Over Time
          </h2>
          <div className="w-full h-[250px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Success Rate per Platform */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            🧭 Success Rate per Platform
          </h2>
          <div className="w-full h-[250px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successRatePerPlatform}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total"
                  fill="#93C5FD"
                  radius={[6, 6, 0, 0]}
                  name="Total Applications"
                />
                <Bar
                  dataKey="offers"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  name="Offers Received"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        className="bg-white p-5 sm:p-6 rounded-xl shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold mb-6 text-gray-700">
          📆 Application Timeline
        </h2>

        <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative -left-[1.1rem]">
                <div
                  className={`w-4 h-4 ${item.color} rounded-full border-2 border-white shadow`}
                ></div>
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold">{item.stage}</h3>
                <p className="text-gray-500 text-sm">{item.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
