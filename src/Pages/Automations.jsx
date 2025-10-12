import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCcw, Mail, Linkedin, FileSpreadsheet, Workflow } from "lucide-react";

const COLORS = ["#22C55E", "#EF4444"]; // success, failed

// --- Automation Summary (Pie Chart) ---
const AutomationSummary = ({ logs }) => {
  const total = logs.length;
  const success = logs.filter((d) => d.status === "Success").length;
  const failed = total - success;

  const summaryData = [
    { name: "Success", value: success },
    { name: "Failed", value: failed },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 w-full shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center md:text-left">
        Automation Summary
      </h2>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summaryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={50}
              paddingAngle={4}
              label={({ name, value }) =>
                `${name} ${(value / total * 100 || 0).toFixed(0)}%`
              }
            >
              {summaryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Integration Info ---
const IntegrationInfo = () => {
  const [integrations, setIntegrations] = useState([]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const res = await axios.get("/api/automations/integrations");
        setIntegrations(res.data);
      } catch (err) {
        console.error("Failed to fetch integrations:", err);
      }
    };
    fetchIntegrations();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getIcon = (from) => {
    switch (from) {
      case "Gmail": return <Mail size={18} />;
      case "LinkedIn": return <Linkedin size={18} />;
      case "Google Sheets": return <FileSpreadsheet size={18} />;
      case "Notion": return <Workflow size={18} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 w-full shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center md:text-left">
        Integration Info
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border rounded-lg p-3 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">{getIcon(item.from_app)}</div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {item.from_app} → {item.to_app}
                </p>
                <p className="text-xs text-gray-500">Auto-sync enabled</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Log Table ---
const LogTable = ({ logs, onRefresh }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm w-full overflow-hidden">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
      <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">
        Automation Logs
      </h2>
      <button
        onClick={onRefresh}
        className="flex items-center justify-center gap-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition w-full sm:w-auto"
      >
        <RefreshCcw size={16} /> Refresh
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50 border-b text-gray-700">
          <tr>
            <th className="py-2 px-3">Date</th>
            <th className="px-3">Source</th>
            <th className="px-3">Action</th>
            <th className="px-3 text-center">Status</th>
            <th className="px-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              <td className="py-2 px-3 text-gray-700">{log.date}</td>
              <td className="px-3 text-gray-700">{log.source}</td>
              <td className="px-3 text-gray-700">{log.action}</td>
              <td className="px-3 text-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    log.status === "Success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td className="px-3 text-gray-600">{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main Automations Page ---
const Automations = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/automations/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
        Automation Logs
      </h1>

      {/* Summary + Integration Info */}
      <div className="flex flex-col lg:flex-row gap-6">
        <AutomationSummary logs={logs} />
        <IntegrationInfo />
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-4">Loading logs...</p>
      ) : (
        <LogTable logs={logs} onRefresh={fetchLogs} />
      )}
    </div>
  );
};

export default Automations;
