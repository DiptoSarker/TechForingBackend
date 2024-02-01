const User = require("../models/User");

const signinController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Note: This is not a secure way to compare passwords.
      // In a real-world scenario, use a secure password hashing library like bcrypt.
      if (password === user.password) {
        res.json({ message: "User signed in successfully", user });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error signing in user", error: error.message });
  }
};

module.exports = signinController;
