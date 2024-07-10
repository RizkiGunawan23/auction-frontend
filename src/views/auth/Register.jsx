import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";

function Register({ setUser }) {
  const initialState = {
    name: "",
    username: "",
    email: "",
    password: "",
  };

  const [registerData, setRegisterData] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const msgs = useRef(null);

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (
      registerData.name.trim() &&
      registerData.username.trim() &&
      registerData.email.trim() &&
      registerData.password.trim()
    ) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/auth/register",
          {
            name: registerData.name,
            username: registerData.username,
            email: registerData.email,
            password: registerData.password,
          },
          { withCredentials: true }
        );

        const token = response.data.token;
        const user = response.data.user;

        if (token && user) {
          localStorage.setItem("token", token);
          setUser(user);
          navigate("/owner");
        } else {
          console.error("Invalid user data in response:", user);
          msgs.current.show({
            severity: "error",
            summary: "Error",
            detail: "Invalid user data in response",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        msgs.current.show({
          severity: "error",
          summary: "Error",
          detail: "Registration failed",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="flex justify-content-center align-items-center mt-8"
      style={{ height: "70vh" }}
    >
      {loading ? (
        <div className="flex justify-content-center align-items-center">
          <ProgressSpinner />
        </div>
      ) : (
        <Card title="Register" className="p-fluid w-25rem">
          <Messages ref={msgs} />
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name" className="block">
                Name
              </label>
              <InputText
                id="name"
                name="name"
                type="text"
                value={registerData.name}
                onChange={handleChange}
                className={classNames({
                  "p-invalid": submitted && !registerData.name.trim(),
                })}
              />
              {submitted && !registerData.name.trim() && (
                <small className="p-error">Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="username" className="block">
                Username
              </label>
              <InputText
                id="username"
                name="username"
                type="text"
                value={registerData.username}
                onChange={handleChange}
                className={classNames({
                  "p-invalid": submitted && !registerData.username.trim(),
                })}
              />
              {submitted && !registerData.username.trim() && (
                <small className="p-error">Username is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="email" className="block">
                Email
              </label>
              <InputText
                id="email"
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleChange}
                className={classNames({
                  "p-invalid": submitted && !registerData.email.trim(),
                })}
              />
              {submitted && !registerData.email.trim() && (
                <small className="p-error">Email is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="password" className="block">
                Password
              </label>
              <Password
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleChange}
                feedback={false}
                className={classNames({
                  "p-invalid": submitted && !registerData.password.trim(),
                })}
              />
              {submitted && !registerData.password.trim() && (
                <small className="p-error">Password is required.</small>
              )}
            </div>
            <Button
              label="Register"
              icon="pi pi-user-plus"
              type="submit"
              className="mt-2"
            />
          </form>
        </Card>
      )}
    </div>
  );
}

export default Register;
