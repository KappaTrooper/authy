import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
   const { username, email, password } = req.body;
   const hashPassword = bcryptjs.hashSync(password, 10);
   const newUser = new User({ username, email, password: hashPassword });
   try {
    await newUser.save()
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
   } catch (error) {
      next(error);
   }

};