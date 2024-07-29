import { useState } from "react";
import { FaRegCircleUser } from "react-icons/fa6";

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
      <p>Logo</p>

      <div className="flex items-center justify-evenly w-fit  ">
        <FaRegCircleUser
          onClick={handlefram}
          className="text-[2.2rem] hover:cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Navbar;
