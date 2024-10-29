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

const dailyBookingsData = [
  { date: "07/01", bookings: 45 },
  { date: "07/02", bookings: 52 },
  { date: "07/03", bookings: 49 },
  { date: "07/04", bookings: 60 },
  { date: "07/05", bookings: 55 },
  { date: "07/06", bookings: 58 },
  { date: "07/07", bookings: 62 },
];

const DailyBookings = () => {
  return (
    <motion.div
      style={{ backgroundColor: "#173dbd" }}
      className="bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Daily Bookings</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dailyBookingsData}>
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
              dataKey="bookings"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default DailyBookings;
