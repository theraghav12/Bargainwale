import { useState } from "react";

const Navbar = () => {
  const [fram, setfram] = useState<boolean>(false);

  const handlefram = () => {
    setfram(!fram);
    if (fram) {
      document.getElementById("frame")!.style.display = "none";
    } else {
      document.getElementById("frame")!.style.display = "block";
    }
  };

  // const { data } = useSelector((state: RootState) => state.resturantdata);

  return (
    <div className=" fixed bg-white z-50 w-full h-[70px] flex justify-between items-center px-[1rem] border-b shadow-xl py-[.5rem] shadow-[#00000026]">
      {/* logo */}
      <img
        src="/vite.svg"
        alt="logo"
        className="h-[100%] ml-[1rem] aspect-auto cursor-pointer"
      />

      <div className="flex items-center justify-evenly w-fit  ">
        <img
          onClick={handlefram}
          src="/vite.svg"
          className="size-[3rem] ml-5 object-cover rounded-full cursor-pointer"
          alt="logo1"
        />
      </div>
    </div>
  );
};

export default Navbar;
