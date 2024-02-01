const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createtoken = (id) => {
  return jwt.sign({ id }, "pritam sarker dipto for techforing", {
    expiresIn: maxAge,
  });
};

const signupController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email address already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const token = createtoken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json({ message: "User signed up successfully", user: newUser._id });
  } catch (error) {
    console.error("Error in signupController:", error);
    res
      .status(500)
      .json({ message: "Error signing up user", error: error.message });
  }
};

module.exports = signupController;
