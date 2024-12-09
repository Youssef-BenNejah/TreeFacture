import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast

// Add react-toastify CSS
import "react-toastify/dist/ReactToastify.css";

const generatePassword = (length = 10) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

const AddUser = ({ isOpen, toggle, refreshPeople }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Initially empty
  const [etat, setEtat] = useState("active"); // Default to 'active'
  const [planExpiration, setPlanExpiration] = useState("");

  // Generate a password when the modal opens
  useEffect(() => {
    setPassword(generatePassword()); // Automatically generate a password
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = { name, surname, email, password, etat, planExpiration };

    try {
      // Send data to the backend API to add a new user
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, newUser);

      if (response.status === 201) {
        refreshPeople(); // Call the refresh function to update the list of users
        toggle(); // Close the modal
        toast.success("User added successfully!"); // Show success toast
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("An error occurred while adding the user."); // Show error toast
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-right">
      <ModalHeader toggle={toggle}>Ajouter un nouveau utilisateur</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="surname">Surname</Label>
            <Input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Generated Password</Label>
            <Input
              type="text"
              id="password"
              value={password}
              readOnly 
            />
          </FormGroup>
          <FormGroup>
            <Label for="etat">State</Label>
            <Input
              type="select"
              id="etat"
              value={etat}
              onChange={(e) => setEtat(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="notActive">Not Active</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="planExpiration">Plan Expiration</Label>
            <Input
              type="date"
              id="planExpiration"
              value={planExpiration}
              onChange={(e) => setPlanExpiration(e.target.value)}
              required
            />
          </FormGroup>
          <Button color="primary" type="submit">
            Add User
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddUser;
