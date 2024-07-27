import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// icons
import { CiMail } from "react-icons/ci";
import { MdLockOutline } from "react-icons/md";
import { PiEyeSlashLight, PiEyeLight } from "react-icons/pi";

// // assets
// import logo from "../../assets/logo.png";

// components
// import Loader from "../../component/outlet/Loader";
// import axios from "axios";
// import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);

  function changeHandler(event: ChangeEvent<HTMLInputElement>) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  // function submitHandler(event: FormEvent) {
  //   event.preventDefault();
  //   setLoading(true);

  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: "https://dolphin-app-fmayj.ondigitalocean.app/api/login",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: formData,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       toast.success("Logged In");
  //       setLoading(false);
  //       localStorage.setItem("token", response.data.token);
  //       localStorage.setItem("id", response.data.newData.details);
  //       navigate("/");
  //     })
  //     .catch((error) => {
  //       if (error.response.status === 400) {
  //         toast.error(error.response.data.message);
  //         setLoading(false);
  //       }
  //       console.log(error);
  //     });
  // }

  return (
    <>
      {/* {videoLoading && <Loader />}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0 md:object-left-bottom"
        src="https://s3groupsnackbae.s3.ap-south-1.amazonaws.com/1721141264218"
        autoPlay
        muted
        loop
        onLoadedData={() => setVideoLoading(false)}
      ></video> */}
      <div
        className={`relative flex items-center justify-center px-[1rem] md:px-[10rem] w-full h-[100vh]`}
      >
        {/* <img
          src={logo}
          className="absolute right-[70%] md:right-[75%] lg:right-[85%] bottom-[85%] w-[150px] h-auto"
        /> */}
        <div className="w-[430px] shadow-lg bg-[#f7f8fa] md:mb-[13rem] lg:mb-0 h-fit flex flex-col px-[2rem] py-[1.5rem] bg-white relative gap-4 justify-center items-center rounded-xl">
          <form
            // onSubmit={submitHandler}
            className="w-full flex flex-col gap-y-3"
          >
            <div className="font-bold text-left text-[24px]">
              Log In to your Dashboard
            </div>
            <p className="text-[#64748B] text-left text-[16px]">
              Welcome back! please enter your detail
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex w-full bg-white h-[3.5rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                <CiMail className="text-[#64748B] size-[25px]" />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                  className="w-full h-full text-[1rem] text-richblack-5 rounded-lg outline-none"
                />
              </div>

              <div className="flex w-full bg-white h-[3.5rem] border rounded-[0.5rem] pl-[12px] items-center gap-3 relative">
                <MdLockOutline className="text-[#64748B] size-[25px]" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  className="w-full h-full text-[1rem] text-richblack-5 rounded-lg outline-none"
                />
                <span
                  className="absolute right-5 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <PiEyeLight fontSize={24} />
                  ) : (
                    <PiEyeSlashLight fontSize={24} />
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between mt-3 items-center ">
              <label className="text-[1rem] font-semibold text-center flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="size-[18px] mr-2"
                />
                Remember me
              </label>
              <div>
                <Link to="/forgot">
                  <p className="text-[1rem] mt-1 text-[#004AAD] font-semibold max-w-max ">
                    Forgot Password?
                  </p>
                </Link>
              </div>
            </div>

            <button className="bg-[#004AAD] h-12 flex items-center justify-center text-[1.1rem] rounded-[8px] text-white font-bold text-richblack-900 px-[12px] py-[1rem] mt-2">
              {loading ? (
                <div className="inline-block  h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              ) : (
                <span>Log In</span>
              )}
            </button>

            <div className="flex gap-2 mt-1 justify-center items-center">
              <p>Don't have an account?</p>
              <Link to="/signup">
                <span className="text-[#004AAD] text-[1rem] font-semibold">
                  Create Now
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
