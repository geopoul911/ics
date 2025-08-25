// Built-ins
import React from "react";

// Modules / Functions
import { Form, Alert } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { apiPost, apiGet } from "../../../utils/api";

// Custom made components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// CSS
import "./login.css";

// Global Variables
import { loader, pageHeader } from "../../global_vars";

// Icons - Images
import CosmoplanLogo from "../../../images/core/logos/logo_white.png";
import { AiFillLock } from "react-icons/ai";
import { BiShow, BiHide } from "react-icons/bi";

// Variables
const LOGIN = "/api/user/login/";
const CHECK_IP = "/api/user/check_access_status/";

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
  onSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    try {
      const response = await apiPost(LOGIN, {
        username,
        password,
      });
      
      // Local Storage is set whenever a user is logged in.
      const token = response.token;
      localStorage.setItem("userToken", token);
      localStorage.setItem("user-token", token); // Also set for new API
      localStorage.setItem("user", username);
      localStorage.setItem("user_id", response.user.id);
      localStorage.setItem("user_email", response.user.email);

      this.props.setUserToken(token);
      this.props.history.push("/");
    } catch (error) {
      console.error('Login error:', error);
      
      // Django axes Custom modification to allow white listed addresses
      if (error.message.includes('failed_wl')) {
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
    }
  };

  // When component mounts, we will need to check if IP is not in blacklist
  // and also get attempt num / block status
  componentDidMount = async () => {
    try {
      const response = await apiGet(CHECK_IP);
      this.setState({
        isBlocked: response.isBlocked,
        attemptsRemaining: response.attempts_remaining,
        is_loaded: true,
      });
    } catch (error) {
      console.error('Error checking access status:', error);
      this.setState({
        isBlocked: false,
        attemptsRemaining: 5,
        is_loaded: true,
      });
    }
  };

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
      this.props.history.push("/");
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
                    src={CosmoplanLogo}
                    alt="logo"
                    className="cosmoplanLogo"
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
                      If you don't have an account, contact ICS's IT Department.
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
                      Please contact ICS's IT department
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
                      backgroundColor: this.state.isBlocked ? "red" : "#2a9fd9",
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
