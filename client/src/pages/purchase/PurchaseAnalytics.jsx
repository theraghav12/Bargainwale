import { motion } from "framer-motion";

import StatCard from "@/components/common/Statecard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import PurchaseOverviewChart from "@/components/purchase/PurchaseOverviewChart";
import PurchaseByCategoryChart from "@/components/purchase/PurchasesByCategory";
import DailyPurchaseTrend from "@/components/purchase/DailyPurchaseTrend";

const purchaseStats = {
	totalRevenue: "$1,234,567",
	averageOrderValue: "$78.90",
	conversionRate: "3.45%",
	salesGrowth: "12.3%",
};

const PurchaseAnalytics = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* SALES STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Amount' icon={DollarSign} value={purchaseStats.totalRevenue} color='#6366F1' />
					<StatCard
						name='Avg. Purchase Value'
						icon={ShoppingCart}
						value={purchaseStats.averageOrderValue}
						color='#10B981'
					/>
					<StatCard
						name='Purchase Rate'
						icon={TrendingUp}
						value={purchaseStats.conversionRate}
						color='#F59E0B'
					/>
					<StatCard name='Purchase Growth' icon={CreditCard} value={purchaseStats.salesGrowth} color='#EF4444' />
				</motion.div>

				<PurchaseOverviewChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<PurchaseByCategoryChart />
					<DailyPurchaseTrend />
				</div>
			</main>
		</div>
	);
};
export default PurchaseAnalytics;