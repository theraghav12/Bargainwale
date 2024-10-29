import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import StatCard from "@/components/common/Statecard";
import DailyBookings from "@/components/bookings/DailyBookings";
import BookingDistribution from "@/components/bookings/BookingDistribution";
import BookingTable from "@/components/bookings/BookingTable";

const bookingStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const BookingAnalytics = () => {
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Bookings' icon={ShoppingBag} value={bookingStats.totalOrders} color='#6366F1' />
					<StatCard name='Pending Bookings' icon={Clock} value={bookingStats.pendingOrders} color='#F59E0B' />
					<StatCard
						name='Completed Bookings'
						icon={CheckCircle}
						value={bookingStats.completedOrders}
						color='#10B981'
					/>
					<StatCard name='Total Revenue' icon={DollarSign} value={bookingStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<DailyBookings />
					<BookingDistribution />
				</div>

				<BookingTable />
			</main>
		</div>
	);
};
export default BookingAnalytics;