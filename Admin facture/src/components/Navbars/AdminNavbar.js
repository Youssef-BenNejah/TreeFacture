import axios from "axios";
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



// Function to decode JWT token
const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};
// Logout function
const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/auth/login";
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const AdminNavbar = (props) => {
  const token = localStorage.getItem("token");
  const user = token ? decodeToken(token) : null;
  const [previewImage, setPreviewImage] = useState(null);
  const [avatarColor, setAvatarColor] = useState(getRandomColor());
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const decoToekn = token ? decodeToken(token) : {};
const AdminEmail = decoToekn.email

  const toggleModal = () => setModalOpen(!modalOpen);


  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      const storedImage = localStorage.getItem(`profileImage_${decodedToken.AdminID}`);
      if (storedImage) {
        setPreviewImage(storedImage);
      } else if (decodedToken.photo) {
        const imageUrl = decodedToken.photo.startsWith('http')
          ? decodedToken.photo
          : `${process.env.REACT_APP_API_URL}/${decodedToken.photo}`;
        setPreviewImage(imageUrl);
        localStorage.setItem(`profileImage_${decodedToken.AdminID}`, imageUrl);
      }
    }
  }, []);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async () => {
    const { newPassword, confirmPassword } = passwords;
  
    // Validation des champs
    if (!newPassword || !confirmPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
  
    try {
      // Envoi de la requête API avec uniquement email et newpassword
      const response = await axios.post("http://localhost:5000/superadmin/reset-password", {
        email: AdminEmail,  // Assure-toi que l'email est bien passé en prop
        newpassword: newPassword, // Envoi uniquement du nouveau mot de passe
      });
  
      // Message de succès
      alert("Mot de passe réinitialisé avec succès !");
      toggleModal(); // Fermer le modal après succès
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error.response?.data || error.message);
      alert(error.response?.data?.message || "Une erreur est survenue.");
    }
  };
  

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
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {<i className="ni ni-user-run" />}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem href="#pablo" onClick={toggleModal}>
                  <i className="ni ni-lock-circle-open" />
                  <span>Changer mot de passe</span>
                </DropdownItem>
                <DropdownItem href="#pablo" onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Se déconnecter</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>

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
