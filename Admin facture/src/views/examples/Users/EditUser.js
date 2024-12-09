import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const EditUser = ({ isOpen, toggle, person, refreshPeople }) => {
  const [formData, setFormData] = useState({
    etat: person?.etat || "",
    planExpirationDate: "", // Date d'expiration sélectionnée
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.etat) {
      toast.error("Veuillez sélectionner un état.");
      return;
    }

    let planExpiration = null; // Par défaut, aucune mise à jour de la date d'expiration
    if (formData.planExpirationDate) {
      const selectedDate = new Date(formData.planExpirationDate);
      const today = new Date();
      planExpiration = Math.ceil(
        (selectedDate - today) / (1000 * 60 * 60 * 24)
      ); // Calculer les jours
      if (planExpiration < 0) {
        toast.error("La date d'expiration doit être future.");
        return;
      }
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/superadmin/admins/${person._id}`,
        { etat: formData.etat, planExpiration }
      );
      toast.success("Utilisateur modifié avec succès !");
      refreshPeople();
      toggle();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      toast.error("Erreur lors de la modification de l'utilisateur.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Modifier l'utilisateur</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="etat">État</Label>
          <Input
            type="select"
            id="etat"
            name="etat"
            value={formData.etat}
            onChange={handleChange}
          >
            <option value="">-- Sélectionnez un état --</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="notActive">Not Active</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="planExpirationDate">Date d'expiration du plan</Label>
          <Input
            type="date"
            id="planExpirationDate"
            name="planExpirationDate"
            value={formData.planExpirationDate}
            onChange={handleChange}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Enregistrer
        </Button>
        <Button color="secondary" onClick={toggle}>
          Annuler
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditUser;
