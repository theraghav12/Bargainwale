import React, { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

// icons
import { CiMail } from "react-icons/ci";

// assets

// components

interface FormData {
  name: string;
  email: string;
  type: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "",
  });

  const [isAgree, setIsAgree] = useState<boolean>(false);

  function changeHandler(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // function submitHandler(event: FormEvent) {
  //   event.preventDefault();
  //   setLoading(true);
  //   if (!isAgree) {
  //     setAgreeError("Please Agree to privacy policy!");
  //     return;
  //   } else {
  //     setAgreeError("");
  //   }

  //   let data = JSON.stringify({
  //     email: formData.email,
  //   });

  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: `${baseUrl}/api/sendOTP`,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       toast.success("OTP Sent successfully");
  //       sessionStorage.setItem("email", formData.email);
  //       sessionStorage.setItem("name", formData.name);
  //       sessionStorage.setItem("type", formData.type);
  //       setLoading(false);
  //       navigate("/verify");
  //       setFormData({
  //         name: "",
  //         email: "",
  //         type: "",
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  //   console.log(formData);
  // }

  return (
    <>
      {/* {videoLoading && <Loader />}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
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
        <div className="w-[460px] shadow-lg bg-[#f7f8fa] h-fit flex flex-col px-[2rem] py-[2.5rem] bg-white relative gap-4 justify-center items-center rounded-xl">
          <form
            // onSubmit={submitHandler}
            className="w-full flex flex-col gap-y-3"
          >
            <div className="font-bold text-left text-[24px]">
              Create Account
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex w-full bg-white h-[3.5rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                <CiMail className="text-[#64748B] size-[25px]" />
                <input
                  required
                  type="text"
                  placeholder="Organization Name"
                  name="name"
                  value={formData.name}
                  onChange={changeHandler}
                  className="w-full h-full text-[1rem] text-richblack-5 rounded-lg outline-none"
                />
              </div>

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
            </div>

            <div className="flex justify-between mt-3 items-center">
              <label className="text-[0.95rem] text-[#64748B] font-semibold text-center flex items-center text-nowrap">
                <input
                  type="checkbox"
                  checked={isAgree}
                  onChange={() => setIsAgree(!isAgree)}
                  className="size-[18px] mr-2"
                />
                Agree to our
                <span className="font-bold text-black mx-1">
                  Privacy policy
                </span>{" "}
                &{" "}
                <span className="font-bold text-black mx-1">
                  terms of condition
                </span>
              </label>
            </div>

            <button className="bg-[#004AAD] tracking-wider h-12 flex items-center justify-center text-[1.1rem] rounded-[8px] text-white font-bold text-richblack-900 px-[12px] py-[1rem] mt-2">
              {/* {loading ? (
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              ) : ( */}
              <span className="text-[1.2rem] font-Roboto">Continue</span>
              {/* )} */}
            </button>

            <div className="flex gap-2 mt-2 justify-center items-center">
              <p>Already have an account?</p>
              <Link to="/login">
                <span className="text-[#004AAD] text-[1rem] font-semibold">
                  Login
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
