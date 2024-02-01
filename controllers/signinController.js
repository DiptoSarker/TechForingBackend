const User = require("../models/User");

const signinController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // First I used bcrypt but faced some issues in the deploying
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
