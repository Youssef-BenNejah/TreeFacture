import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        formData
      );
  
      const token = response.data.token;
      localStorage.setItem("token", token);
  
      const decodedToken = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
      };
  
      const expirationTime = decodedToken(token).exp * 1000; // Convert to milliseconds
      localStorage.setItem("tokenExpiration", expirationTime);
  
      const timeLeft = expirationTime - Date.now();
      setTimeout(logout, timeLeft); // Set logout timeout
  
   
      navigate("/admin/index");
  
    } catch (error) {
      handleLoginError(error);
    }
  };
  

  const handleLoginError = (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) setError("Admin not found or incorrect credentials.");
      else if (status === 401) setError("Incorrect email or password, or email not confirmed.");
      else if (status === 403) setError("Your account is suspended. Please contact support.");
      else if (status === 406) setError("Your account is not active. Please contact support.");
      else if (status === 409) setError("Your subscription has expired. Please renew your plan.");
      else if (status === 500) setError("Internal server error. Please try again later.");
      else setError("Login failed. Please try again.");
    } else if (error.request) {
      setError("No response from the server. Please check your internet connection.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    console.error("Login error:", error);
  };

  const logout = (reason = "You have been logged out.") => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    toast.info(reason);
    navigate("/auth/login");
  };
  // useEffect(() => {
  //   const interval = setInterval(verifySession, 10 * 1000); // Verify session every 15 minutes
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <ToastContainer />
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <Form role="form" onSubmit={handleSubmit}>
              {error && (
                <div className="text-center text-danger mb-4">
                  <small>{error}</small>
                </div>
              )}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Log In
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <Link className="text-light" to="/password-reset/forgot-password">
              <small>Forgot password?</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
