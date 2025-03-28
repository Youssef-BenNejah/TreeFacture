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
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const decodeToken = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(atob(base64));
  return payload;
};

const Persons = () => {
  const [people, setPeople] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [peoplePerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [buttonWidth, setButtonWidth] = useState("auto");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [personToEdit, setPersonToEdit] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;

  const fetchPeople = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/superadmin/admins`
      );
  
      const updatedPeople = response.data.map((person) => {
        const expirationDate = new Date(person.planExpiration);
        const currentDate = new Date();
  
        if (expirationDate < currentDate && person.etat !== "suspended") {
          axios.put(
            `${process.env.REACT_APP_API_URL}/superadmin/admins/${person._id}`,
            { etat: "expiré" }
          );
          person.etat = "expiré"; // Update state directly here for dynamic update
        }
  
        return person;
      });
  
      // Sort by 'created' field in descending order (most recent first)
      const sortedPeople = updatedPeople.sort((a, b) => {
        const dateA = new Date(a.created).getTime(); // Get the precise timestamp
        const dateB = new Date(b.created).getTime(); // Get the precise timestamp
     

        return dateB - dateA; // Descending order based on timestamp
      });
  
      setPeople(sortedPeople); // Update the people state with the sorted list
      console.log(sortedPeople)
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

// Filter logic for search and date range
const filteredPeople = people.filter((person) => {
  const query = searchQuery.toLowerCase();
  const personCreatedDate = new Date(person.created);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Apply search filter
  const matchesSearch =
  person.name?.toLowerCase().startsWith(query) ||
  person.surname?.toLowerCase().startsWith(query) ||
  person.email?.toLowerCase().startsWith(query) ||
  person.etat?.toLowerCase().startsWith(query);

  // Apply date filter
  const withinDateRange =
    (!start || personCreatedDate >= start) &&
    (!end || personCreatedDate <= end);

  return matchesSearch && withinDateRange;
});

// Pagination logic
const indexOfLastPerson = currentPage * peoplePerPage;
const indexOfFirstPerson = indexOfLastPerson - peoplePerPage;
const currentPeople = filteredPeople.slice(indexOfFirstPerson, indexOfLastPerson);

const totalPages = Math.ceil(filteredPeople.length / peoplePerPage);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditClick = (person) => {
    setSelectedPerson(person);
    setPersonToEdit(person);
    toggleEditModal();
  };
  
// Handle search input change
const handleSearchChange = (e) => setSearchQuery(e.target.value);

// Handle date range changes
const handleStartDateChange = (e) => setStartDate(e.target.value);
const handleEndDateChange = (e) => setEndDate(e.target.value);


  return (
    <>
      <ToastContainer />
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
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
                  <Input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="mr-3"
                    placeholder="Start Date"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="mr-3"
                    placeholder="End Date"
                  />
                  <Button
                    color="primary"
                    style={{ width: buttonWidth }}
                    onClick={toggleModal}
                  >
                    Ajouter{" "}
                  </Button>
                </div>
              </CardHeader>
              <div className="table-wrapper">
                <Table className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nom</th>
                      <th scope="col">Prénom</th>
                      <th scope="col">Email</th>
                      <th scope="col">Etat</th>
                      <th scope="col">Date début</th>

                      <th scope="col">Date d'expriration</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPeople.length > 0 ? (
                      currentPeople.map((person) => {
                        // Calculate if the plan is expired
                        const currentDate = new Date();
                        const planExpirationDate = new Date(
                          person.planExpiration
                        );
                        const isExpired = planExpirationDate < currentDate;

                        return (
                          <tr key={person._id}>
                            <td>{person.name}</td>
                            <td>{person.surname}</td>
                            <td>{person.email}</td>

                            <td>
                              {/* Check if expired first */}
                              {person.etat === "expiré" ? (
                                <>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                      color: "gray",
                                      fontSize: "0.7rem",
                                    }}
                                  />
                                  Expiré
                                </>
                              ) : person.etat === "Désactivé" ? ( // Check if notActive (disabled)
                                <>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{ color: "red", fontSize: "0.7rem" }}
                                  />
                                  Désactivé
                                </>
                              ) : person.etat === "Suspendue" ? ( // Check if suspended
                                <>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                      color: "orange",
                                      fontSize: "0.7rem",
                                    }}
                                  />
                                  Suspendue
                                </>
                              ) : person.etat === "Active" ? ( // Check if active
                                <>
                                  <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                      color: "green",
                                      fontSize: "0.7rem",
                                    }}
                                  />
                                  Active
                                </>
                              ) : null}
                            </td>
                            <td>{person.created.split("T")[0]}</td>

                            <td>{person.planExpiration.split("T")[0]}</td>
                            <td>
                              <Dropdown
                                isOpen={dropdownOpen === person._id}
                                toggle={() => toggleDropdown(person._id)}
                              >
                                <DropdownToggle
                                  tag="span"
                                  data-toggle="dropdown"
                                  style={{ cursor: "pointer" }}
                                >
                                  <FontAwesomeIcon
                                    icon={faEllipsisH}
                                    style={{ fontSize: "1rem" }}
                                  />
                                </DropdownToggle>
                                <DropdownMenu
                                  right
                                  style={{ marginTop: "-25px" }}
                                >
                                  <DropdownItem
                                    onClick={() => handleEditClick(person)}
                                  >
                                    <span className="d-flex align-items-center">
                                      <i
                                        className="fa-solid fa-gear"
                                        style={{
                                          fontSize: "1rem",
                                          marginRight: "10px",
                                        }}
                                      ></i>
                                      Modifier
                                    </span>
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div style={{ textAlign: "center" }}>
                            <i
                              className="fa-solid fa-ban"
                              style={{
                                display: "block",
                                marginBottom: "10px",
                                fontSize: "50px",
                                opacity: "0.5",
                              }}
                            ></i>
                            <span className="text-danger">
                              Aucun enregistrement correspondant trouvé
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0">
                    {[
                      ...Array(
                        Math.ceil(filteredPeople.length / peoplePerPage)
                      ).keys(),
                    ].map((pageNumber) => (
                      <PaginationItem
                        key={pageNumber + 1}
                        active={currentPage === pageNumber + 1}
                      >
                        <PaginationLink
                          onClick={() => paginate(pageNumber + 1)}
                        >
                          {pageNumber + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
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
      {selectedPerson && (
        <EditUser
          isOpen={editModalOpen}
          toggle={toggleEditModal}
          person={selectedPerson}
          refreshPeople={fetchPeople}
        />
      )}
    </>
  );
};

export default Persons;
