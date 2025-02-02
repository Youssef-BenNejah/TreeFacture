const mongoose = require('mongoose');

// Schema for individual items in the invoice
const itemSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: false,
  },
  article: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  taxes: [
    {
      taxRate: {
        type: Number,
        required: true,  // Tax rate (e.g., 10 for 10%)
      },
      taxAmount: {
        type: Number,
        required: true,  // Amount of tax calculated based on the tax rate
      },
      taxName: {
        type: String,
        required: true,  
      },
      
    },
  ],
});


const invoiceSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  timbre: {
    type: Number,
    required: false,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  year: {
    type: Number,
    required: true,
  },
  currency: {
    type: mongoose.Schema.ObjectId,
    ref: 'Currency',
    required: true,
    autopopulate: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Facture', 'Devis', 'Bon de livraison'],
    default: 'Facture',
  },
  paymentStatus: {
    type: String,
    required: false,
    enum: ['impayé', 'Partiellement payé', 'Payé', 'Retard'],
    default: 'impayé',
  },
  type: {
    type: String,
    required: true,
    enum: ['Standard', 'Proforma'], // Standard for regular invoices, Proforma for proforma invoices
    default: 'Standard',
  },
  isConverted: {
    type: Boolean,
    default: false, // Tracks whether a proforma invoice has been converted to a regular invoice
  },
  date: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
  },
  note: {
    type: String,
  },
  items: [itemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Tax',
    autopopulate: true,
  }],
  taxAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  factureImage: {
    type: String,
  }
}, { timestamps: true });

invoiceSchema.plugin(require('mongoose-autopopulate'));

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
