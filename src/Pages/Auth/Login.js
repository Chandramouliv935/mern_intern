// LoginPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";
import './auth.css';

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }

    // Pre-fill email if remembered
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setValues(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;

    // Add validation
    if (!email || !password) {
      toast.error("Please fill in all fields", toastOptions);
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(loginAPI, {
        email,
        password,
      });

      // Log the response to see what we're getting
      console.log("Login response:", data);

      // Check if data exists
      if (data) {
        // Store user data - store the entire data object if user property doesn't exist
        localStorage.setItem("user", JSON.stringify(data.user || data));
        
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        }

        toast.success("Login successful!", toastOptions);

        // Navigate to home page
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Invalid credentials", toastOptions);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Login failed. Please try again.";
      toast.error(errorMessage, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  const [rememberMe, setRememberMe] = useState(false);

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
                <h2 className="login-title">Welcome Back</h2>
                <p className="text-white-50 mb-4">
                  Please sign in to continue to Finance Manager
                </p>
              </div>
              
              <Form>
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
                  <div className="position-relative">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password}
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => {
                        // Implement password visibility toggle logic here
                      }}
                      style={{ color: "white" }}
                    >
                      {/* Add password visibility toggle icon here */}
                    </Button>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    className="text-white"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
                  <Link to="/forgotPassword" className="text-white lnk">
                    Forgot Password?
                  </Link>

                  <Button
                    type="submit"
                    className="text-center mt-3 btnStyle"
                    onClick={!loading ? handleSubmit : null}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-white-50">
                      Don't have an account?{" "}
                      <Link to="/register" className="lnk">
                        Create Account
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

export default Login;
