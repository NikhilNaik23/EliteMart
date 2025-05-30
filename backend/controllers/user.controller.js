import generateTokenAndSetCookie from "../lib/util/generateToken.js";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    const payload = { id: user._id, role: user.role };
    const token = generateTokenAndSetCookie(payload, res);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      message: "Successfully Created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const payload = { id: user._id, role: user.role };
    const token=generateTokenAndSetCookie(payload, res);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      message: "Logged in Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};
