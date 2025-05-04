import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import axios from "axios";

const AddUser = ({ open, setOpen, userData }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const handleOnSubmit = async (data, e) => {
    e.preventDefault();
    console.log("Submitting data:", data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          ...data,
          isAdmin: false // Set default isAdmin to false for new users
        }
      );

      if (response.status === 201) { // Changed from 200 to 201
        console.log("User successfully added!");
        setPopupMessage("User Added Successfully!");
        setShowConfirmation(true);
        setOpen(false);
        reset();

        setTimeout(() => {
          setShowConfirmation(false);
          setPopupMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setPopupMessage(error.response?.data?.message || "Error adding user. Please try again.");
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setPopupMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />
            <Textbox
              placeholder="Password"
              type="password"
              name="password"
              label="Password"
              className="w-full rounded"
              register={register("password", {
                required: "Password is required!",
              })}
              error={errors.password ? errors.password.message : ""}
            />
            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
          </div>

          <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              label="Submit"
            />
            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </form>
      </ModalWrapper>

      {/* Success/Error Popup */}
      {showConfirmation && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`transform transition-all duration-500 ease-in-out ${
            showConfirmation ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            <div className={`px-6 py-4 rounded-lg shadow-lg ${
              popupMessage.includes("Error") ? 'bg-red-500' : 'bg-green-500'
            } text-white`}>
              <div className="flex items-center">
                {popupMessage.includes("Error") ? (
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
                <span>{popupMessage}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;
