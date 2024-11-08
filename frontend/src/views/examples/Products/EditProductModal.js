import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faList, faDollarSign, faMoneyBill, faFileAlt, faBarcode } from '@fortawesome/free-solid-svg-icons';
const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return payload;
};
const EditProduct = ({ isOpen, toggle, refreshProducts, product, userId }) => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnPaid, setTotalUnPaid] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [invoices, setInvoices] = useState([]);


  
  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : {};
  const currentUserId = decodedToken.AdminID;
  const username = decodedToken.name;
  const userlastname = decodedToken.surname;
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/currency`, { params: { createdBy: userId } });
      setCurrencies(response.data);
      console.log(currencies)
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();

    if (product) {
      setName(product.name);
      setCurrency(product.currency);
      setPrice(product.price);
      setDescription(product.description);
      setReference(product.reference);
    }
  }, [product, userId]);

  const handleEditProduct = async () => {
    try {
      const updatedProduct = {
        name,
        currency,
        price,
        description,
        reference,
        createdBy: userId
      };

      await axios.put(`${process.env.REACT_APP_API_URL}/api/product/${product._id}`, updatedProduct);
      refreshProducts();
      toggle();
      toast.success('Service mis à jour avec succès');
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error('Erreur lors de la mise à jour du produit. Veuillez réessayer.');
    }
  };
  const fetchInvoices = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/invoices/${currentUserId}`, {
            params: {
                type: selectedType || undefined,
                status: selectedStatus || undefined,
            }
        });

        const filteredInvoices = response.data.filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            const start = new Date(startDate);
            const end = new Date(endDate);

            const currencyMatches = invoice?.currency?._id === selectedCurrency?._id;
            const dateInRange =
                (!startDate && !endDate) || // If no dates are selected, include all invoices
                (invoiceDate >= start && invoiceDate <= end); // Date range check

            return currencyMatches && dateInRange;
        });

        // Set the state with the filtered invoices
        setInvoices(filteredInvoices);
        

        console.log(filteredInvoices);
    } catch (error) {
        console.error("Error fetching invoices:", error);
    }
};



const refreshInvoices = () => {
    fetchInvoices();
};
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-right">
      <ModalHeader toggle={toggle}>Modifier service</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="productName">Nom</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faTag} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="productName"
                value={name}
                placeholder="Entrer nom"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
         
          <FormGroup>
            <Label for="productCurrency">Devise</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faDollarSign} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="select"
                id="productCurrency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="" disabled>Sélectionnez une devise </option>
                {currencies
                  .map((currency) => (
                    <option key={currency._id} value={currency._id}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
              </Input>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="productPrice">Prix</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faMoneyBill} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                id="productPrice"
                value={price}
                placeholder="Entrer prix"
                onChange={(e) => setPrice(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="productDescription">Déscription</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faFileAlt} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="textarea"
                id="productDescription"
                value={description}
                placeholder="Entrer description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="productReference">Référence</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <FontAwesomeIcon icon={faBarcode} />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="text"
                id="productReference"
                value={reference}
                placeholder="Entrer Référence "
                onChange={(e) => setReference(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleEditProduct}>Modifier</Button>{' '}
        <Button color="secondary" onClick={toggle}>Annuler</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditProduct;
