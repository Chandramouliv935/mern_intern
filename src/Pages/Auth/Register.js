// SignupPage.js
import { useState, useCallback, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./auth.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerAPI } from "../../utils/ApiRequest";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = values;
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields", toastOptions);
      return false;
    }

    if (username.length < 3) {
      toast.error("Username should be at least 3 characters", toastOptions);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", toastOptions);
      return false;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters", toastOptions);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { username, email, password } = values;
    setLoading(true);

    try {
      const response = await axios.post(registerAPI, {
        username,
        email,
        password,
      });

      console.log("Registration response:", response.data);

      if (response.data) {
        toast.success("Registration successful! Please login.", toastOptions);
        
        setValues({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Registration failed. Please try again.";
      toast.error(errorMessage, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#1a1a2e",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#4ecca3",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.3,
              random: true,
            },
            size: {
              value: 2,
              random: { enable: true, minimumValue: 1 },
            },
            links: {
              enable: true,
              distance: 150,
              color: "#4ecca3",
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "bounce",
              },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <Container className="mt-5" style={{ position: "relative", zIndex: "2" }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="login-container">
              <div className="text-center">
                <AccountBalanceWalletIcon
                  sx={{ fontSize: 50, color: "#4ecca3" }}
                  className="mb-3"
                />
                <h2 className="login-title">Create Account</h2>
                <p className="text-white-50 mb-4">
                  Please fill in the details to register
                </p>
              </div>

              <Form>
                <Form.Group controlId="formBasicUsername" className="mt-3">
                  <Form.Label className="text-white">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    onChange={handleChange}
                    value={values.username}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label className="text-white">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label className="text-white">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword" className="mt-3">
                  <Form.Label className="text-white">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    onChange={handleChange}
                    value={values.confirmPassword}
                  />
                </Form.Group>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                  className="mt-4"
                >
                  <Button
                    type="submit"
                    className="text-center mt-3 btnStyle"
                    onClick={!loading ? handleSubmit : null}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-white-50">
                      Already have an account?{" "}
                      <Link to="/login" className="lnk">
                        Login here
                      </Link>
                    </p>
                  </div>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Register;