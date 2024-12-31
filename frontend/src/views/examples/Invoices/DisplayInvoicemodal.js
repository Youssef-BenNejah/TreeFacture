import React, { useState } from "react";
import { Modal, ModalBody, Button, Badge, Table, Spinner } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const DisplayInvoiceModal = ({ isOpen, toggle, invoice, refreshInvoices }) => {
  console.log(invoice);
  console.log(invoice.tax);
  const [loading, setLoading] = useState(false);
  const getBadgeColor = (status) => {
    switch (status) {
      case "Envoyé":
        return "success";

      case "Brouillon":
        return "light";
      case "Annulé":
        return "danger";

      default:
        return "light";
    }
  };

  const getPaymentBadgeColor = (status) => {
    switch (status) {
      case "Payé":
        return "success";
      case "Partiellement payé":
        return "info";
      case "impayé":
        return "danger";
      default:
        return "light";
    }
  };

  const handleDownloadPDF = async () => {
    console.log("Downloading PDF for invoice:", invoice);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/invoices/export-pdf/${invoice._id}/${invoice.createdBy}`,
        { responseType: "blob" }
      );

      if (response.status === 200) {
        // Determine custom file name based on client details
        let customFileName = `facture-${invoice.number}.pdf`;

        if (invoice.client.person != null) {
          customFileName = `facture-${invoice.client.person.nom}-${invoice.client.person.prenom}-${invoice.number}.pdf`;
        } else if (invoice.client.entreprise != null) {
          customFileName = `facture-${invoice.client.entreprise.nom}-${invoice.number}.pdf`;
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", customFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Failed to download PDF. Status:", response.status);
        toast.error("Failed to download PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Error downloading PDF. Please try again.");
    }
  };

  const handleSendEmail = async () => {
    setLoading(true);
    console.log("Sending invoice via email...");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/invoices/export-pdf/send-email/${invoice._id}/${invoice.createdBy}`
      );

      if (response.status === 200) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/invoices/invoices/${invoice._id}`,
          {
            status: "Envoyé",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success("Invoice sent via email successfully.");
        refreshInvoices();
      } else {
        toast.error("Failed to send the invoice. Please try again.");
      }
    } catch (error) {
      console.error("Error sending invoice via email:", error);
      toast.error("Error sending invoice via email. Please try again.");
    } finally {
      setLoading(false); // Ensure loading state is reset in finally block
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalBody>
        <div className="invoice-header">
          <h4>
            Facture # {invoice.number}/{invoice.year}
          </h4>
          <div className="status-badges">
            <Badge color={getBadgeColor(invoice.status)}>
              {invoice.status}
            </Badge>
            <Badge color={getPaymentBadgeColor(invoice.paymentStatus)}>
              {invoice.paymentStatus}
            </Badge>
          </div>
          <div className="amounts-summary">
            <div>Status: {invoice.status}</div>
            <div>
            Total HT:{" "}
              {(
                invoice.subtotal -
                invoice.items.reduce((totalTax, item) => {
                  const itemTaxTotal = item.taxes.reduce(
                    (sum, tax) => sum + tax.taxAmount,
                    0
                  );
                  return totalTax + itemTaxTotal;
                }, 0) -
                (parseFloat(invoice.timbre) || 0)
              )}
            </div>

            <div>Total: {invoice.subtotal}</div>
          </div>
        </div>

        <div className="client-info">
          <p>
            <strong>Client:</strong>{" "}
            {invoice.client.type === "Person"
              ? `${invoice.client.person.nom} ${invoice.client.person.prenom}`
              : `${invoice.client.entreprise.nom}`}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {invoice.client.type === "Person"
              ? `${invoice.client.person.email} `
              : `${invoice.client.entreprise.email}`}
          </p>
          <p>
            <strong>Téléphone:</strong>
            {invoice.client.type === "Person"
              ? `${invoice.client.person.telephone} `
              : `${invoice.client.entreprise.telephone}`}
          </p>
        </div>

        <Table>
          <thead>
            <tr>
              <th>Réf</th>

              <th>Produit</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Total</th>
              <th>taxe</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.ref}</td>

                <td>{item.article}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.total}</td>
                <td>
                  {item.taxes.map((tax, idx) => (
                    <div key={idx}>
                      {`Taxe: ${tax.taxRate}% - Montant: ${tax.taxAmount}`}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="totals-section">
          <p>
              Total HT:{" "}
              {(
                invoice.subtotal -
                invoice.items.reduce((totalTax, item) => {
                  const itemTaxTotal = item.taxes.reduce(
                    (sum, tax) => sum + tax.taxAmount,
                    0
                  );
                  return totalTax + itemTaxTotal;
                }, 0) -
                (parseFloat(invoice.timbre) || 0)
              )}
          </p>
          <p>
            Tax :{" "}
            {invoice.items.reduce((totalTax, item) => {
              const itemTaxTotal = item.taxes.reduce(
                (sum, tax) => sum + tax.taxAmount,
                0
              );
              return totalTax + itemTaxTotal;
            }, 0) + (parseFloat(invoice.timbre) || 0)}
          </p>
          <p>Timbre fiscal:{invoice.timbre}</p>
          <p>
            <strong>Total TTC:</strong> {invoice.subtotal}
          </p>
        </div>

        <div className="action-buttons">
          <Button color="secondary" onClick={toggle}>
            Fermer
          </Button>
          <Button color="info" onClick={handleDownloadPDF}>
            Télécharger PDF
          </Button>
          <Button color="primary" onClick={handleSendEmail} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> Envoi en cours...
              </>
            ) : (
              "Envoyer par email"
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DisplayInvoiceModal;
