import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Lightbulb } from "lucide-react";

const Dashboard = () => {
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"];

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/api/automations/recent-applications");
      setRecentApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="p-6 text-gray-500 text-center">Loading dashboard...</p>;

  // --- Totals ---
  const totalApplications = recentApplications.length;
  const interviewsScheduled = recentApplications.filter(a => a.status === "Interview").length;
  const offersReceived = recentApplications.filter(a => a.status === "Offer").length;
  const rejected = recentApplications.filter(a => a.status === "Rejected").length;

  // --- Pie Chart Data: Status Breakdown ---
  const statusCounts = recentApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // --- Bar Chart Data: Job Board Usage ---
  const jobBoardCounts = recentApplications.reduce((acc, app) => {
    const key = app.source || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(jobBoardCounts).map(([name, usage]) => ({ name, usage }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gray-50 min-h-screen">
      {/* Title */}
      <motion.h1
        className="text-xl sm:text-2xl font-semibold text-gray-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard Overview
      </motion.h1>

      {/* Tip Card */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center gap-3 bg-blue-50 text-gray-700 p-4 rounded-xl shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white p-2 rounded-full shadow-sm self-start sm:self-center">
          <Lightbulb className="text-blue-500 w-6 h-6" />
        </div>
        <p className="text-sm leading-relaxed">
          You’ve applied to <b>{totalApplications} jobs</b> this week —{" "}
          <b>
            {Math.round(
              ((barData.find(j => j.name === "JobStreet")?.usage || 0) * 100) /
                (barData.reduce((a, b) => a + b.usage, 0) || 1)
            )}
            %
          </b>{" "}
          are from <span className="text-blue-600 font-medium">JobStreet</span>! Keep up the momentum!
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { title: "Total Applications", value: totalApplications, color: "text-blue-600" },
          { title: "Interviews Scheduled", value: interviewsScheduled, color: "text-green-600" },
          { title: "Offers Received", value: offersReceived, color: "text-yellow-500" },
          { title: "Rejected", value: rejected, color: "text-red-500" },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-4 sm:p-5 rounded-xl shadow text-center"
          >
            <h2 className="text-gray-500 text-xs sm:text-sm">{card.title}</h2>
            <p className={`text-2xl sm:text-3xl font-semibold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        {/* Pie Chart */}
        <motion.div className="bg-white p-4 sm:p-6 rounded-xl shadow" whileHover={{ scale: 1.01 }}>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">
            Application Status Breakdown
          </h2>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div className="bg-white p-4 sm:p-6 rounded-xl shadow" whileHover={{ scale: 1.01 }}>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">
            Job Board Usage Tracker
          </h2>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Applications Table */}
      <motion.div
        className="bg-white p-4 sm:p-6 rounded-xl shadow overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-700">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2 px-3 sm:px-4 text-left rounded-l-lg">Company</th>
                <th className="py-2 px-3 sm:px-4 text-left">Position</th>
                <th className="py-2 px-3 sm:px-4 text-left">Source</th>
                <th className="py-2 px-3 sm:px-4 text-left">Date</th>
                <th className="py-2 px-3 sm:px-4 text-left">Status</th>
                <th className="py-2 px-3 sm:px-4 text-left rounded-r-lg">Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app, index) => (
                <tr key={index} className="text-gray-700 border-b hover:bg-gray-50">
                  <td className="py-2 px-3 sm:px-4">{app.company}</td>
                  <td className="py-2 px-3 sm:px-4">{app.position}</td>
                  <td className="py-2 px-3 sm:px-4">{app.source}</td>
                  <td className="py-2 px-3 sm:px-4">{app.date}</td>
                  <td className="py-2 px-3 sm:px-4">{app.status}</td>
                  <td className="py-2 px-3 sm:px-4">{app.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
