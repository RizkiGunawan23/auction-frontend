import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Messages } from "primereact/messages";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";

function Login({ setUser }) {
  const initialState = {
    credential: "",
    password: "",
  };

  const [loginData, setLoginData] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUserAvailable, setIsUserAvailable] = useState(true);
  const navigate = useNavigate();
  const msgs = useRef(null);

  useLayoutEffect(() => {
    checkUserAvailable();
  }, []);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const checkUserAvailable = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/check-user",
        { withCredentials: true }
      );

      // Set isVisible berdasarkan nilai response.data atau kondisi lain yang sesuai
      setIsUserAvailable((prev) => !response.data.hasUser); // Jika response.data false, isVisible jadi true (tombol Register muncul)
    } catch (error) {
      console.error("Check user error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (loginData.credential.trim() && loginData.password.trim()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/auth/login",
          {
            credential: loginData.credential,
            password: loginData.password,
          },
          { withCredentials: true }
        );

        const token = response.data.token;
        const user = response.data.user;

        if (token && user) {
          localStorage.setItem("token", token);
          setUser(user);

          if (user.role === "user") {
            navigate("/auction");
          } else if (user.role === "owner") {
            navigate("/owner");
          } else {
            console.error("Invalid role:", user.role);
          }
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
        console.error("Login error:", error);
        msgs.current.show({
          severity: "error",
          summary: "Error",
          detail: "Login failed",
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
        <Card title="Login" className="p-fluid w-25rem">
          <Messages ref={msgs} />
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="credential" className="block">
                Username / Email
              </label>
              <InputText
                id="credential"
                name="credential"
                type="text"
                value={loginData.credential}
                onChange={handleChange}
                className={classNames({
                  "p-invalid": submitted && !loginData.credential.trim(),
                })}
              />
              {submitted && !loginData.credential.trim() && (
                <small className="p-error">Username / Email is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="password" className="block">
                Password
              </label>
              <Password
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                feedback={false}
                className={classNames({
                  "p-invalid": submitted && !loginData.password.trim(),
                })}
              />
              {submitted && !loginData.password.trim() && (
                <small className="p-error">Password is required.</small>
              )}
            </div>
            <Button
              label="Login"
              icon="pi pi-user"
              type="submit"
              className="w-full"
            />
          </form>
          {isUserAvailable ? (
            <>
              <Divider align="center">
                <b>OR</b>
              </Divider>
              <Button
                label="Register"
                icon="pi pi-user-plus"
                className="w-full"
                severity="success"
                onClick={() => navigate("/register")}
              />
            </>
          ) : (
            ""
          )}
        </Card>
      )}
    </div>
  );
}

export default Login;
