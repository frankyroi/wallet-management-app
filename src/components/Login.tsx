import React, { useState } from "react";
import { Form, message } from "antd";
import "./login.css"; // Import the custom CSS file
import axios from "axios";

interface ApiResponseError {
  response: {
    data: {
      message: string;
    };
  };
}

// Type guard to check if the object is of type ApiResponseError
const isApiResponseError = (error: any): error is ApiResponseError => {
  return error && error.response && typeof error.response.data.message === 'string';
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    // Handle form submission logic here
    try {
      const response = await axios.post("https://wallet-app-backend-yv9d.onrender.com/api/auth/login", { email, password });
      const { accessToken } = response.data;
      console.log(response.data);
      // Save the token to local storage or session storage for user sessions
      localStorage.setItem("accessToken", accessToken);
      message.success("Login successful.");
      // Redirect to the dashboard or another page on successful login
      window.location.href = "/wallet"; 
    } catch (error) {
      if (isApiResponseError(error)) {
        if (error.response && error.response.data) {
          message.error(`${error.response.data.message}.`);
        } else {
          message.error('Transfer failed.');
        }
      } else {
        message.error('Login failed. Invalid email or password.');
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <Form onFinish={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#forgot-password">
              Forgot Password?
            </a>
          </div>
        </Form>
      </div>
    </div>



    // <div className="login-form"> {/* Apply the custom CSS class here */}
    //   <Form onFinish={handleSubmit}>
    //     <Form.Item label="Email">
    //       <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    //     </Form.Item>
    //     <Form.Item label="Password">
    //       <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
    //     </Form.Item>
    //     <Form.Item className="">
    //       <Button type="primary" htmlType="submit" className="justify-center w-40 md:w-64 bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700">
    //         Login
    //       </Button>
    //     </Form.Item>
    //   </Form>
    // </div>
  );
};

export default Login;
