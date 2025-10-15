import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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

const STATUS_COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

const SuccessRateLabel = (props) => {
  const { x, y, width, value, index, successRates } = props;
  if (value === 0) return null;
  const percent = successRates?.[index]?.successRate ?? 0;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#333"
      textAnchor="middle"
      fontSize={12}
      fontWeight="bold"
      pointerEvents="none"
    >
      {percent}%
    </text>
  );
};

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

  // Applications Over Time (grouped by month)
  const applicationsOverTime = applications.reduce((acc, app) => {
    const month = format(parseISO(app.date), "MMM yyyy");
    const existing = acc.find((item) => item.month === month);
    if (existing) existing.applications += 1;
    else acc.push({ month, applications: 1 });
    return acc;
  }, []);

  // Success Rate per Platform
  const platformMap = {};
  applications.forEach((app) => {
    const src = app.source || "Other";
    if (!platformMap[src]) platformMap[src] = { total: 0, offers: 0 };
    platformMap[src].total += 1;
    if (app.status === "Offer") platformMap[src].offers += 1;
  });
  const successRatePerPlatform = Object.entries(platformMap).map(
    ([source, data]) => ({
      source,
      total: data.total,
      offers: data.offers,
      successRate: data.total
        ? Math.round((data.offers / data.total) * 100)
        : 0,
    })
  );

  // Application Status Breakdown Pie Chart
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(
    ([status, value], i) => ({
      status,
      value,
      color: STATUS_COLORS[i % STATUS_COLORS.length],
    })
  );

  // Timeline (sorted by date)
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

  // CSV Export (Summary: by month)
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

  // CSV Export (Detailed: all fields)
  const handleExportDetailedCSV = () => {
    const fields = [
      "company",
      "position",
      "source",
      "date",
      "status",
      "salary",
      "location",
      "notes",
    ];
    const header = fields.join(",");
    const rows = applications.map((app) =>
      fields
        .map((f) => `"${(app[f] || "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "all_applications.csv");
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
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
          >
            <FileDown size={18} />
            Export Month Summary
          </button>
          <button
            onClick={handleExportDetailedCSV}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition w-full sm:w-auto"
          >
            <FileDown size={18} />
            Export All Data
          </button>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-3 gap-8"
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
          <div className="w-full h-[250px] sm:h-[220px]">
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
                  label={
                    (props) => (
                      <SuccessRateLabel {...props} successRates={successRatePerPlatform} />
                    )
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Enhanced Platform Offer Rate Table */}
          <div className="mt-4">
            <h3 className="text-gray-600 font-semibold mb-2 text-lg flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Platform Offer Rate
            </h3>
            <div className="rounded-xl overflow-hidden shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-blue-800">Platform</th>
                    <th className="py-3 px-4 text-left font-semibold text-blue-800">Total Apps</th>
                    <th className="py-3 px-4 text-left font-semibold text-blue-800">Offers</th>
                    <th className="py-3 px-4 text-left font-semibold text-blue-800">Success %</th>
                  </tr>
                </thead>
                <tbody>
                  {successRatePerPlatform.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-gray-400">No data available</td>
                    </tr>
                  ) : (
                    successRatePerPlatform
                      .sort((a, b) => b.successRate - a.successRate)
                      .map((row, idx) => (
                        <tr
                          key={row.source}
                          className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="py-3 px-4 font-medium text-gray-800">{row.source}</td>
                          <td className="py-3 px-4">{row.total}</td>
                          <td className="py-3 px-4">{row.offers}</td>
                          <td className="py-3 px-4">
                            <span
                              className={
                                `inline-block px-2 py-1 rounded-full text-xs font-bold shadow-sm ` +
                                (row.successRate >= 50
                                  ? "bg-green-100 text-green-700"
                                  : row.successRate > 0
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-500")
                              }
                            >
                              {row.successRate}%
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Big, Centered Status Pie Chart */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            🥧 Application Status Breakdown
          </h2>
          <div className="w-full flex justify-center items-center py-8">
            <ResponsiveContainer width={320} height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${Math.round(percent * 100)}%`
                  }
                  outerRadius={110}
                  dataKey="value"
                  nameKey="status"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: '1rem',
                    borderRadius: '8px',
                    background: '#fff',
                    color: '#222',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  height={36}
                  wrapperStyle={{
                    marginTop: '12px',
                    fontSize: '1rem',
                    color: '#555',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Breakdown of all application statuses (Applied, Interview, Offer, Rejected).
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
