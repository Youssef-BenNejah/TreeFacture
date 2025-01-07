/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const decodeToken = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(atob(base64));
  return payload;
};

const Header = () => {
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

  const [activeCount, setActiveCount] = useState(0);
  const [suspendedCount, setSuspendedCount] = useState(0);
  const [notActiveCount, setNotActiveCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;
  const fetchPeople = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/superadmin/admins`
      );

      let active = 0;
      let suspended = 0;
      let notActive = 0;
      let expired = 0;

      const updatedPeople = response.data.map((person) => {
        const expirationDate = new Date(person.planExpiration);
        const currentDate = new Date();

        // Check and update the status if necessary
        if (expirationDate < currentDate && person.etat !== "suspended") {
          axios.put(
            `${process.env.REACT_APP_API_URL}/superadmin/admins/${person._id}`,
            { etat: "suspended" }
          );
          person.etat = "suspended"; // Update state directly here for dynamic update
        }
        
        const isExpired = expirationDate < currentDate;

        // Count based on the person's status
        if (person.etat === "active") {
          active++;
        } else if (person.etat === "suspended") {
          suspended++;
        } else if (person.etat === "notActive") {
          notActive++;
        } else if (person.etat === "expired") {
          expired++; // If the status is not in the predefined set, count it as expired
        }

        return person;
      });

      // Update state variables
      setPeople(updatedPeople);
      setActiveCount(active);
      setSuspendedCount(suspended);
      setNotActiveCount(notActive);
      setExpiredCount(expired);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Utilisateur actif
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {activeCount}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Utilisateur Désactivé
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{notActiveCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                   
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Utilisateur suspendue
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{suspendedCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                        Utilisateur expiré

                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{expiredCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                   
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
