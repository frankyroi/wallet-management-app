import React, { useState } from "react";
import { Form, Input, Button, Switch, Modal, message } from "antd";
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

const CreateUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUserData, setNewUserData] = useState<any>(null);
  const [newUserPwd, setNewUserPwd] = useState<any>(null);

  const handleCreateUser = async (values: any) => {
    try {
      const response = await axios.post("https://wallet-app-backend-yv9d.onrender.com/api/auth/signup", values, {
        headers: {
          "x-auth-token": localStorage.getItem("accessToken"),
        },
      });

      setNewUserPwd(values.password);
      
      // Show the modal with new user details
      setIsModalVisible(true);
      setNewUserData(response.data.userData);
      
      // Reset the form after successful creation
      form.resetFields();
    } catch (error) {
        if (isApiResponseError(error)) {
            if (error.response && error.response.data) {
                message.error(`${error.response.data.message}.`);
            } else {
                message.error('Error creating user.');
            }
        } else {
            message.error("Error creating user.");
        }
     
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setNewUserPwd(null);
    window.location.href = "/user-management"; 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full py-8 px-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl text-center mb-6">Create New User</h1>
        <Form form={form} onFinish={handleCreateUser}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the user's name." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the user's email." },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter the user's password." }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Is Admin"
            name="isAdmin"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Modal to show new user details */}
      <Modal
        title="New User Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {newUserData && (
          <div>
            <p>Name: {newUserData.name}</p>
            <p>Email: {newUserData.email}</p>
            <p>Password: {newUserPwd}</p>
            <p>Is Admin: {newUserData.isAdmin ? "Yes" : "No"}</p>
            <p>Invitation Link: {`http://localhost:3000/accept-invitation/${newUserData.invitationToken}`}</p>
            <h1>NOTE: User needs to accept invitation before user can login.</h1>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreateUserPage;
