const SuperAdmin = require('../models/coreModel/SuperAdmin'); // Import the SuperAdmin model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const admin = require('../models/coreModel/admin');

// Super Admin Register
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a super admin already exists with this email
    const existingSuperAdmin = await SuperAdmin.findOne({ email });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: 'Super admin already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new SuperAdmin
    const newSuperAdmin = new SuperAdmin({
      email,
      password: hashedPassword,
    });

    // Save to the database
    await newSuperAdmin.save();
    res.status(201).json({ message: 'Super admin registered successfully' });
  } catch (error) {
    console.error('Error registering super admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Super Admin Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the super admin exists
    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return res.status(400).json({ message: "Super admin not found" });
    }

    console.log("Stored password hash:", superAdmin.password);
    console.log("Received plain-text password:", password);
    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, superAdmin.password);
    console.log("Password match result:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // Generate a JWT token for the super admin
    const token = jwt.sign(
      { superAdminID: superAdmin.id, email: superAdmin.email },
      process.env.JWT_SECRET,
      { expiresIn: "4h" } // Token expires in 4 hours
    );

    // Send the token to the client
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all admins
exports.getAllAdmins = async (req, res) => {
    try {
      // Fetch all admins from the database
      const admins = await admin.find(); // assuming Admin is your model for the admins collection
      if (admins.length === 0) {
        return res.status(404).json({ message: 'No admins found' });
      }
      res.status(200).json(admins); // Send back the list of admins
    } catch (error) {
      console.error('Error fetching admins:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Update Admin Status or Plan by SuperAdmin
exports.updateAdmin = async (req, res) => {
  const { adminId } = req.params; // ID of the admin to update
  const { etat, planExpiration } = req.body; // etat = 'suspended', 'notActive', 'active', etc. | planDuration in days

  try {
    const Admin = await admin.findById(adminId);

    if (!Admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update the status (etat) if provided
    if (etat) {
      Admin.etat = etat;
    }

    // Update the plan expiration date if provided
    if (planExpiration) {
      const newExpiration = new Date();
      newExpiration.setDate(newExpiration.getDate() + parseInt(planExpiration)); // Extend plan by specified days
      Admin.planExpiration = newExpiration;
    }

    // Save the updated Admin
    await Admin.save();

    res.status(200).json({ message: 'Admin updated successfully', Admin });

  } catch (error) {
    console.error('Error updating Admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all Super Admins
exports.getAllSuperAdmins = async (req, res) => {
  try {
    // Fetch all super admins from the database
    const superAdmins = await SuperAdmin.find();
    res.status(200).json(superAdmins);
    
  } catch (error) {
    console.error('Error fetching super admins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Super Admin Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Get the super admin's ID from the JWT token
    const superAdminId = req.param.superAdminID;  // Assumes JWT token is passed and decoded with superAdminID

    // Fetch the super admin from the database
    const superAdmin = await SuperAdmin.findById(superAdminId);

    if (!superAdmin) {
      return res.status(404).json({ message: 'Super admin not found' });
    }

    // Check if the current password matches the stored one
    const passwordMatch = await bcrypt.compare(currentPassword, superAdmin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    superAdmin.password = hashedNewPassword;

    // Save the super admin with the new password
    await superAdmin.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.resetPassword = async (req, res) => {
  try {
      const { email, newpassword } = req.body;

      // Validate input
      if (!email || !newpassword) {
          return res.status(400).json({ message: "Email and new password are required" });
      }

      const user = await SuperAdmin.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const saltRounds = 10;  // Define salt rounds
      const hashedPassword = await bcrypt.hash(newpassword, saltRounds);

      // Save new hashed password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password has been reset" });

  } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

