import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import Header from "components/Headers/ElementHeader";
import AddUser from "./AddUser"

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};

const Persons = () => {
  const [people, setPeople] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [peoplePerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonWidth, setButtonWidth] = useState('auto');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [personToEdit, setPersonToEdit] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [displayModalOpen, setDisplayModalOpen] = useState(false);

  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;

  const fetchPeople = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/superadmin/admins`);
      setPeople(response.data);
      console.log(people)
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  

  useEffect(() => {
    fetchPeople();
  }, []);

  const refreshPeople = () => {
    fetchPeople();
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };



//   const filteredPeople = people.filter((person) => {
//     const companyName = getCompanyNameById(person.entreprise);
//     return person.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       person.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       person.pays.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       person.telephone.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       person.email.toLowerCase().includes(searchQuery.toLowerCase());
//   });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setButtonWidth('100%');
      } else {
        setButtonWidth('auto');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const indexOfLastPerson = currentPage * peoplePerPage;
  const indexOfFirstPerson = indexOfLastPerson - peoplePerPage;
  const currentPeople = people.slice(indexOfFirstPerson, indexOfLastPerson);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const handleDeleteClick = (id) => {
    setPersonToDelete(id);
    toggleDeleteModal();
  };

//   const confirmDeletePerson = async () => {
//     try {
//       await axios.delete(`${process.env.REACT_APP_API_URL}/api/people/${personToDelete}`);
//       refreshPeople();
//       toggleDeleteModal();
//       toast.success('Personne supprimée avec succès', {
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     } catch (error) {
//       console.error("Erreur lors de la suppression de la personne:", error);
//     }
//   };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditClick = (person) => {
    setSelectedPerson(person);
    setPersonToEdit(person);
    toggleEditModal();
  };

  const toggleDisplayModal = () => {
    setDisplayModalOpen(!displayModalOpen);
  };

  const handleDisplayClick = (person) => {
    setSelectedPerson(person);
    toggleDisplayModal();
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <Container className="mt--7" fluid >
        <Row>
          <div className="col">
            <Card className="shadow" >
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Liste des utilisateurs</h3>
                <div className="d-flex">
                  <Input
                    type="text"
                    placeholder="Recherche"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mr-3"
                  />
                  <Button color="primary" style={{ width: buttonWidth }} onClick={toggleModal}>Ajouter </Button>
                </div>
              </CardHeader>
              <div className="table-wrapper">
                <Table className="align-items-center table-flush" >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nom</th>
                      <th scope="col">Prénom</th>
                      <th scope="col">Email</th>
                      <th scope="col">Etat</th>
                      <th scope="col">Date d'expriration</th>
          

                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPeople.length > 0 ? (
                      currentPeople.map((person) => (
                        <tr key={person._id}>
                          <td>{person.name}</td>

                          <td>{person.surname}</td>
                          <td>{person.email}</td>

                          <td>{person.etat}</td>

                          <td>{person.planExpiration}</td>


                        


                          <td>
                            <Dropdown isOpen={dropdownOpen === person._id} toggle={() => toggleDropdown(person._id)} >
                              <DropdownToggle tag="span" data-toggle="dropdown" style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '1rem' }} />
                              </DropdownToggle>
                              <DropdownMenu right style={{ marginTop: "-25px" }}>
                                <DropdownItem onClick={() => handleDisplayClick(person)}>
                                  <span className="d-flex align-items-center">
                                    <i className="fa-solid fa-eye" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                    Afficher
                                  </span>
                                </DropdownItem>
                                <DropdownItem onClick={() => handleEditClick(person)}>
                                  <span className="d-flex align-items-center">
                                    <i className="fa-solid fa-gear" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                    Modifier
                                  </span>
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => handleDeleteClick(person._id)}>
                                  <span className="d-flex align-items-center">
                                    <i className="fa-solid fa-trash text-danger" style={{ fontSize: '1rem', marginRight: '10px' }}></i>
                                    Supprimer
                                  </span>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>

                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div style={{ textAlign: 'center' }}>
                            <i className="fa-solid fa-ban" style={{ display: 'block', marginBottom: '10px', fontSize: '50px', opacity: '0.5' }}></i>
                            <span className="text-danger">Aucun enregistrement correspondant trouvé</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>


              <CardFooter className="py-4">
                <nav aria-label="Page navigation example">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        onClick={() => paginate(currentPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(people.length / peoplePerPage) }, (_, index) => (
                      <PaginationItem key={index + 1} active={index + 1 === currentPage}>
                        <PaginationLink onClick={() => paginate(index + 1)}>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === Math.ceil(people.length / peoplePerPage)}>
                      <PaginationLink
                        onClick={() => paginate(currentPage + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
      <AddUser
        isOpen={modalOpen}
        toggle={toggleModal}
        refreshPeople={refreshPeople}
      />
      {/* {selectedPerson && (
        <EditPersonModal
          isOpen={editModalOpen}
          toggle={toggleEditModal}
          person={selectedPerson}
          refreshPeople={fetchPeople}
          refreshCompanies={refreshCompanies}
          userId={currentUserId}
        />
      )}
      {selectedPerson && (
        <DisplayPerson
          isOpen={displayModalOpen}
          toggle={toggleDisplayModal}
          person={selectedPerson}
          companies={companies}
        />
      )}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        toggle={toggleDeleteModal}
        onConfirm={confirmDeletePerson}
      /> */}
    </>
  );
};

export default Persons;
