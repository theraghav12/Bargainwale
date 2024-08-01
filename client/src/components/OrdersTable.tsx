import axios from "axios";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { API } from "../utils/API";

export interface Order {
  id: number;
  companyBargainNo: string;
  companyBargainDate: string;
  staticPrice: number;
  quantity: number;
  weightInMetrics: number;
  status: string;
}

const orders = [
  {
    id: 1,
    companyBargainNo: "500",
    companyBargainDate: "2024",
    staticPrice: 500,
    quantity: 50,
    weightInMetrics: 20,
    status: "created",
  },
];

const OrdersTable = () => {
  const [productList, setProductList] = useState<Order[]>([]);
  const [rowsLimit, setRowsLimit] = useState<number>(5);
  const [rowsToShow, setRowsToShow] = useState<Order[]>(
    productList.slice(0, rowsLimit)
  );
  const [customPagination, setCustomPagination] = useState<number[]>([]);
  const [totalPage, setTotalPage] = useState<number>(
    Math.ceil(productList?.length / rowsLimit)
  );
  const [currentPage, setCurrentPage] = useState<number>(0);

  const nextPage = () => {
    const startIndex = rowsLimit * (currentPage + 1);
    const endIndex = startIndex + rowsLimit;
    const newArray = orders.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage + 1);
  };

  const changePage = (value: number) => {
    const startIndex = value * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = orders.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(value);
  };

  const previousPage = () => {
    const startIndex = (currentPage - 1) * rowsLimit;
    const endIndex = startIndex + rowsLimit;
    const newArray = orders.slice(startIndex, endIndex);
    setRowsToShow(newArray);
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 0);
  };

  const handleRowsLimitChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newRowsLimit = parseInt(e.target.value);
    setRowsLimit(newRowsLimit);
    setRowsToShow(productList.slice(0, newRowsLimit));
    setTotalPage(Math.ceil(productList.length / newRowsLimit));
    setCustomPagination(
      Array(Math.ceil(productList.length / newRowsLimit)).fill(null)
    );
    setCurrentPage(0);
  };

  useMemo(() => {
    setCustomPagination(
      Array(Math.ceil(productList?.length / rowsLimit)).fill(null)
    );
  }, [rowsLimit]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API}/order/66a756651625f0a41547a9db`,
    };
    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setProductList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (productList.length > 0) {
      setRowsToShow(productList.slice(0, rowsLimit));
      setTotalPage(Math.ceil(productList.length / rowsLimit));
    }
  }, [productList, rowsLimit]);

  return (
    <>
      <div className="w-full h-fit flex items-center justify-center pb-14">
        <div className="w-full bg-white py-4">
          <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none mt-2">
            <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter">
              <thead className=" text-base text-white font-semibold w-full">
                <tr className="  bg-[#F7F9FC]">
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Bargain No.
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Bargain Date
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Price
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Weight
                  </th>
                  <th className="py-5 px-8 text-[#64748B] sm:text-base font-bold whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {rowsToShow?.map((data, index) => (
                  <tr key={index}>
                    <td
                      className={`py-4 px-3 gap-2 font-semibold text-base whitespace-nowrap`}
                    >
                      {data?.companyBargainNo}
                    </td>
                    <td
                      className={`py-4 px-8 font-semibold text-base whitespace-nowrap`}
                    >
                      {data?.companyBargainDate}
                    </td>
                    <td
                      className={`py-4 px-8 font-semibold text-base whitespace-nowrap`}
                    >
                      {data?.staticPrice}
                    </td>
                    <td
                      className={`py-4 px-8 font-semibold text-base whitespace-nowrap`}
                    >
                      {data?.quantity}
                    </td>
                    <td
                      className={`py-4 px-8 font-semibold text-base whitespace-nowrap`}
                    >
                      {data?.weightInMetrics}
                    </td>
                    <td
                      className={`${
                        data.status === "created"
                          ? "text-blue-700"
                          : data.status === "billed"
                          ? "text-purple-700"
                          : data.status === "payment pending"
                          ? "text-red-700"
                          : "text-green-700"
                      } py-4 px-8 font-semibold text-base whitespace-nowrap`}
                    >
                      {data?.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full flex justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-1.5 px-1 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-md font-semibold">
                Show Rows:
              </label>
              <select
                id="rowsPerPage"
                value={rowsLimit}
                onChange={handleRowsLimitChange}
                className="border rounded px-4 ml-4 rounded-xl py-2 border-[#E2E8F0]"
              >
                <option value={5}>5 items</option>
                <option value={10}>10 items</option>
                <option value={15}>15 items</option>
                <option value={20}>20 items</option>
              </select>
            </div>
            <div className="flex">
              <ul
                className="flex justify-center items-center gap-x-[10px] z-30"
                role="navigation"
                aria-label="Pagination"
              >
                <li
                  className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E2E8F0] ${
                    currentPage === 0
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                  }`}
                  onClick={previousPage}
                >
                  <GrPrevious className="text-[#94A3B8]" />
                </li>
                {customPagination?.map((index) => (
                  <li
                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-[1px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer ${
                      currentPage === index
                        ? "text-[#004AAD]  border-[#E2E8F0]"
                        : "border-[#E4E4EB]"
                    }`}
                    onClick={() => changePage(index)}
                    key={index}
                  >
                    {index + 1}
                  </li>
                ))}
                <li
                  className={`flex sm:mr-4 lg:mr-10 items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                    currentPage === totalPage - 1
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                  }`}
                  onClick={nextPage}
                >
                  <GrNext className="text-[#94A3B8]" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
