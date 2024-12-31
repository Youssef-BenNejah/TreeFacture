import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import axios from "axios";

// Function to decode JWT token
const decodeToken = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(atob(base64));
  return payload;
};

// Logout function
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/auth/login";
};

const AdminNavbar = (props) => {
  const token = localStorage.getItem("token");
  
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;
  const user = token ? decodeToken(token) : null;
  const [previewImage, setPreviewImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/update/${currentUserId}`,
        {
          password: passwords.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Mot de passe mis à jour avec succès !");
      toggleModal();
    } catch (error) {
      alert("Erreur lors de la mise à jour du mot de passe !");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      const storedImage = localStorage.getItem(
        `profileImage_${decodedToken.AdminID}`
      );
      if (storedImage) {
        setPreviewImage(storedImage);
      } else if (decodedToken.photo) {
        const imageUrl = decodedToken.photo.startsWith("http")
          ? decodedToken.photo
          : `${process.env.REACT_APP_API_URL}/${decodedToken.photo}`;
        setPreviewImage(imageUrl);
        localStorage.setItem(`profileImage_${decodedToken.AdminID}`, imageUrl);
      }
    }
  }, []);

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user ? user.name : "User"}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem href="#pablo" onClick={toggleModal}>
                  <i className="ni ni-lock-circle-open" />
                  <span>Changer mot de passe</span>
                </DropdownItem>
                <DropdownItem href="#pablo" onClick={logout}>
                  <i className="ni ni-user-run" />
                  <span>Se déconnecter</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Modal for password change */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Changer mot de passe</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <label>Mot de passe actuel</label>
              <Input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe actuel"
              />
            </FormGroup>
            <FormGroup>
              <label>Nouveau mot de passe</label>
              <Input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="Entrez un nouveau mot de passe"
              />
            </FormGroup>
            <FormGroup>
              <label>Confirmer le nouveau mot de passe</label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handlePasswordChange}>
            Mettre à jour
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Annuler
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminNavbar;
