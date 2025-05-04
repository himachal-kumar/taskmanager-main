import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import axios from "axios";

const Login = (props) => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const Admin={
    email:"himachal123@gmail.com",
    password:"himachal1234"
  }

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const submitHandler = async (data) => {
    if(data.email === Admin.email && data.password === Admin.password) {     
      console.log("hello login");
      setPopupMessage("Login successful! Welcome Admin");
      setShowPopup(true);
      
      // Store admin data with more details
      const adminData = {
        email: data.email,
        name: "Admin User",
        isAdmin: true,
        token: 'admin-token'
      };
      localStorage.setItem('user', JSON.stringify(adminData));
      
      setTimeout(() => {
        setShowPopup(false);
        props.name(true);
        navigate('/dashboard');
      }, 2000);
    } else {
      axios.post("http://localhost:5000/api/user/login", data)
        .then((response) => {
          // Store complete user data
          const userData = {
            email: response.data.email,
            name: response.data.name,
            isAdmin: false,
            token: response.data.token,
            _id: response.data._id
          };
          localStorage.setItem('user', JSON.stringify(userData));
          
          setPopupMessage("Login successful!");
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate('/dashboard');
          }, 2000);
        })
        .catch((err) => {
          console.log("Error login time:", err);
          setPopupMessage("Login failed. Please check your credentials.");
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 2000);
        });
    }
  };

  // useEffect(() => {
  //   user && navigate("/dashboard");
  // }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'>
      {/* Add Popup Component */}
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 min-w-[300px] border border-white/20">
            <div className="text-center">
              {popupMessage.includes("successful") ? (
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
              <h2 className={`text-xl font-semibold mb-2 ${popupMessage.includes("successful") ? 'text-green-400' : 'text-red-400'}`}>
                {popupMessage.includes("successful") ? "Success!" : "Error!"}
              </h2>
              <p className="text-white">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay when popup is shown */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 z-40"></div>
      )}

      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border border-white/20 rounded-full text-sm md:text-base bg-white/10 text-white/90 backdrop-blur-sm'>
              Manage all your task in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-white'>
              <span>Your</span>
              <span>Task Manager</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white/10 backdrop-blur-lg px-10 pt-14 pb-14 rounded-2xl border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300'
          >
            <div className=''>
              <p className='text-white text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-white/80'>
                Keep all your credentials safe.
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className='text-sm text-white/70 hover:text-pink-400 hover:underline cursor-pointer transition-colors duration-300'>
                Forget Password?
              </span>

              <Button
                type='submit'
                label='Submit'
                className='w-full h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/30'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
