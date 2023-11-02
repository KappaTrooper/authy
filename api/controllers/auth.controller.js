import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User Created Successful" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
   const { email, password } = req.body;

   try {
      const validUser = await User.findOne({ email });
      if (!validUser) return next(errorhandler(401, "User not found"));
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorhandler(401, "Wrong credentials"));
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const {password: hashedPassword, ...rest} = validUser._doc
      const expiryDate = new Date(Date.now() + 360000); // 1 day
      res
         .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
         .status(200)
         .json(rest);
   } catch (error) {
      next(error);
   }
};
