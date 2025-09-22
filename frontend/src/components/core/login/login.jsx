// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Form, Alert } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Custom made components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// CSS
import "./login.css";

// Global Variables
import { headers, loader, pageHeader } from "../../global_vars";

// Icons - Images
import Logo from "../../../images/core/logos/logo_white.png";
import { AiFillLock } from "react-icons/ai";
import { BiShow, BiHide } from "react-icons/bi";

// Variables
const LOGIN = "https://ultima.icsgr.com/api/user/login/";
const CHECK_IP = "https://ultima.icsgr.com/api/user/check_access_status/";

// url path = '/login'
class Login extends React.Component {
  // Login component contains styling from login.css
  // Authentication uses a user Token which is stored in the browser.
  constructor(props) {
    super(props);
    this.state = {
      error_message: "",
      attemptsRemaining: 5,
      isBlocked: false,
      whiteListed: false,
      showPassword: false,
      is_loaded: false,
    };
    this.showPass = this.showPass.bind(this);
    this.hidePass = this.hidePass.bind(this);
  }

  // on login attempt
  onSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    axios({
      method: "post",
      url: LOGIN,
      headers: headers,
      data: {
        username,
        password,
      },
    })
      // Local Storage is set whenever a user is logged in.
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("userToken", token);
        localStorage.setItem("consultant_id", res?.data?.user?.consultant_id);
        localStorage.setItem("user-token", token); // Also set for new API
        localStorage.setItem("user", username);
        localStorage.setItem("user_id", res?.data?.user?.id);
        localStorage.setItem("user_email", res?.data?.user?.email);

        this.props.setUserToken(token);
        this.props.history.push("/dashboard");
      })
      .catch((e) => {
        // Django axes Custom modification to allow white listed addresses
        if (e.response.data.failed_wl) {
          this.setState({
            error_message:
              "Login attempt Failed. \n Please verify your username and password.",
            attemptsRemaining: this.state.attemptsRemaining - 1,
          });
        } else {
          this.setState({
            error_message:
              "Login attempt Failed. \n Please verify your username and password.",
            whiteListed: true,
          });
        }

        // block the user if they fail 5 times and his IP is not whitelisted
        if (this.state.attemptsRemaining <= 0) {
          this.setState({
            isBlocked: true,
          });
        }
      });
  };

  // When component mounts, we will need to check if IP is not in blacklist
  // and also get attempt num / block status
  componentDidMount() {
    axios
      .get(CHECK_IP, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        this.setState({
          isBlocked: res.data.isBlocked,
          attemptsRemaining: res.data.attempts_remaining,
          is_loaded: true,
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if error_message has changed
    if (
      this.state.error_message !== prevState.error_message &&
      this.state.error_message !== ""
    ) {
      // Set a timeout to clear the error_message after 2 seconds
      setTimeout(() => {
        this.setState({ error_message: "" });
      }, 2000);
    }
  }

  // Show password on click of eye icon
  showPass = () => {
    this.setState({
      showPassword: true,
    });
  };

  // Hide password on click of eye icon
  hidePass = () => {
    this.setState({
      showPassword: false,
    });
  };

  render() {
    // Is the user logged in?
    let isLoggedIn = localStorage.getItem("userToken") ? true : false;

    if (isLoggedIn) {
      // If user is already logged in, redirect to home
      this.props.history.push("/dashboard");
    }

    return (
      <div ref={this.props.containerRef}>
        <NavigationBar />
        <div className="loginContainer">
          {pageHeader("login")}
          {this.state.is_loaded ? (
            <>
              {/* If user is allowed to attempt to log in , the following div will not be visible */}
              {this.state.isBlocked ? (
                <div>
                  <AiFillLock className="lockedIcon" />
                  <p className="login-message">
                    Your account has been blocked after repeated login failures
                  </p>
                </div>
              ) : (
                ""
              )}

              {/* Login form */}
              <div className="centered">
                <Form onSubmit={this.onSubmit}>
                  <img
                    src={Logo}
                    alt="logo"
                    className="logo"
                  />
                  {/* If user has no attempts left, forms and log in button will be disabled */}
                  <Form.Group controlId="username">
                    {/* Username field */}
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      disabled={this.state.isBlocked}
                    />
                    <Form.Text className="text-muted">
                      If you don't have an account, contact ICS's Superusers.
                    </Form.Text>
                  </Form.Group>
                  {/* Password field */}
                  <Form.Group controlId="password">
                    <Form.Label>
                      Password
                      {/* If show password is true */}
                      {this.state.showPassword ? (
                        <BiShow className="eyeShow" onClick={this.hidePass} />
                      ) : (
                        <BiHide className="eyeHide" onClick={this.showPass} />
                      )}
                    </Form.Label>
                    <br />
                    <Form.Control
                      type={this.state.showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      disabled={this.state.isBlocked}
                    />
                  </Form.Group>

                  {this.state.error_message && (
                    <Alert variant="danger">
                      <p className="login-message">
                        {this.state.error_message}
                      </p>
                    </Alert>
                  )}

                  {this.state.isBlocked ? (
                      <p className="login-message">
                        Please contact ICS's Superusers
                      <br />
                      in order to unblock your account
                    </p>
                  ) : (
                    ""
                  )}
                  <p className="login-message">
                    {this.state.whiteListed ? (
                      <>
                        Your IP is White Listed
                        <br />
                        Anti-brutal force script attack mechanism is turned off
                      </>
                    ) : (
                      <>Attempts remaining: {this.state.attemptsRemaining}</>
                    )}
                  </p>

                  <Button
                    className="loginButton"
                    style={{
                      backgroundColor: this.state.isBlocked ? "red" : "#93ab3c",
                      color: "white",
                    }}
                    type="submit"
                    disabled={this.state.isBlocked || this.state.error_message}
                  >
                    Log in
                  </Button>
                </Form>
              </div>
            </>
          ) : (
            <>{loader()}</>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default Login;

