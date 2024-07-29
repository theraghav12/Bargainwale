const Orders = () => {
  return (
    <div className="relative top-[70px] left-[7%] p-10">
      <h1 className="text-start">Orders</h1>
      <div className="w-full flex flex-row gap-10">
        <div className="w-[280px] flex flex-col justify-between p-6 rounded-lg shadow-md">
          <div>
            <h2 className="text-xl font-semibold mb-4">Place Your Order</h2>
            <p className="mb-6">Get started with a new order</p>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-black/80"
          >
            Create An Order
          </button>
        </div>
        <div className="w-[280px] flex flex-col justify-between p-6 rounded-lg shadow-md">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get Order History</h2>
            <p className="mb-6">Get History about the orders in past</p>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-black/80"
          >
            Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
