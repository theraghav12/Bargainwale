const Inventory = () => {
  return (
    <div className="relative top-[70px] lg:ml-[7%] p-10">
      <h1 className="text-start text-[2rem] font-semibold">Inventory</h1>
      <div className="flex flex-row flex-wrap gap-x-4 gap-y-4 mt-2">
        <div className="w-[280px] flex flex-col justify-between p-6 rounded-lg shadow-md">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Item Name</h2>
            <div className="flex flex-row flex-wrap gap-x-5 gap-y-4 mt-2">
              <p>Quantity: 50</p>
              <p>Type: Oil</p>
              <p>Oil Type: Palm</p>
              <p>wieght: 50 kg</p>
              <p>Category: Box</p>
            </div>
          </div>
          <button
            // onClick={() => setIsOpen(true)}
            type="submit"
            className="w-[25%] bg-black text-white p-2 rounded-lg hover:bg-black/80 mt-5"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
