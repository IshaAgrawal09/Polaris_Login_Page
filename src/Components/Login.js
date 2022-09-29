import React, { useState } from "react";
import { Spinner } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  FormLayout,
  TextField,
  Heading,
  InlineError,
} from "@shopify/polaris";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [invalid, setInvalid] = useState();
  const [loading, setLoading] = useState(false);

  const formError = {};
  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === "") {
      formError["userError"] = "Username is required";
    }
    if (password === "") {
      formError["passwordError"] = "Password is required";
    }
    setError({ ...formError });

    if (!Object.keys(error).length) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInJvbGUiOiJhcHAiLCJpYXQiOjE1MzkwNTk5NzgsImlzcyI6Imh0dHBzOlwvXC9hcHBzLmNlZGNvbW1lcmNlLmNvbSIsImF1ZCI6ImV4YW1wbGUuY29tIiwibmJmIjoxNTM5MDU5OTc4LCJ0b2tlbl9pZCI6MTUzOTA1OTk3OH0.GRSNBwvFrYe4H7FBkDISVee27fNfd1LiocugSntzxAUq_PIioj4-fDnuKYh-WHsTdIFMHIbtyt-uNI1uStVPJQ4K2oYrR_OmVe5_zW4fetHyFmoOuoulR1htZlX8pDXHeybRMYlkk95nKZZAYQDB0Lpq8gxnTCOSITTDES0Jbs9MENwZWVLfyZk6vkMhMoIAtETDXdElIdWjP6W_Q1kdzhwqatnUyzOBTdjd_pt9ZkbHHYnv6gUWiQV1bifWpMO5BYsSGR-MW3VzLqsH4QetZ-DC_AuF4W2FvdjMRpHrsCgqlDL4I4ZgHJVp-iXGfpug3sJKx_2AJ_2aT1k5sQYOMA",
        },
      };
      setLoading(true);
      fetch(
        `https://fbapi.sellernext.com/user/login?username=${username}&password=${password}`,
        requestOptions
      )
        .then((response) => response.json())

        .then((actualData) => {
          if (actualData.success) {
            // console.log(actualData);
            localStorage.setItem("token", actualData.data.token);

            navigate("/home");
          } else {
            setInvalid("UserName or Password is Invalid");
          }
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div>
      {loading ? (
        <div className="spinner">
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </div>
      ) : (
        <div className="loginForm">
          <Heading element="h1">Login Form</Heading>
          {/* USERNAME PASSWORD IS INVALID ERROR  */}
          {username !== "" && password !== "" && !Object.keys(error).length ? (
            <InlineError message={invalid} />
          ) : null}

          <div className="loginData">
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Username"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e);
                  }}
                  autoComplete="off"
                  requiredIndicator
                />
                {Object.keys(error).length ? (
                  <InlineError message={error.userError} fieldID="username" />
                ) : null}

                <TextField
                  type="password"
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e);
                  }}
                  autoComplete="off"
                  requiredIndicator
                />
                {Object.keys(error).length ? (
                  <InlineError
                    message={error.passwordError}
                    fieldID="password"
                  />
                ) : null}

                <Button submit>Login</Button>
              </FormLayout>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
