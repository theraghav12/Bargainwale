import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DailyOrders = ({ data }) => {
  return (
    <motion.div
      style={{ backgroundColor: "#173dbd" }}
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Daily Orders</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" />
            <XAxis dataKey="date" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FED766",
                borderColor: "#ffffff",
              }}
              itemStyle={{ color: "#ffffff" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
