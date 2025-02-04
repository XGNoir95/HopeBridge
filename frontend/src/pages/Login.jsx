import React from "react";
import Form from "../components/Form";

function Login() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">

      <div className="w-full flex items-center justify-center p-6 lg:w-1/2">
        <Form />
      </div>

      <div
        className="hidden lg:flex h-full w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/login.png')" }}
      ></div>
    </div>
  );
}

export default Login;
