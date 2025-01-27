const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define the SuperAdmin schema
const superAdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true, // Ensures no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving it to the database
superAdminSchema.pre('save', async function (next) {
  const superAdmin = this;

  // Only hash if the password is new or has been modified and isn't already hashed
  if (superAdmin.isModified('password') && !superAdmin.password.startsWith('$2b$')) {
    console.log("Hashing password:", superAdmin.password);
    superAdmin.password = await bcrypt.hash(superAdmin.password, 10);
    console.log("Password after hashing:", superAdmin.password);
  } else {
    console.log("Password is already hashed, skipping hashing.");
  }

  next();
});



module.exports = mongoose.model('SuperAdmin', superAdminSchema);
