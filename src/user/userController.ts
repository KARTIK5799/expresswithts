import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }

    // Check if user already exists
    let user;
    try {
      user = await userModel.findOne({ email: email });
    } catch (error) {
      return next(createHttpError(500, "Error while fetching user"));
    }

    if (user) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }

    // Process
    let newUser: User;
    try {
      const hashPassword = await bcrypt.hash(password, 10);

      newUser = await userModel.create({
        name,
        email,
        password: hashPassword,
      });
    } catch (error) {
      return next(createHttpError(500, "Error while creating user"));
    }

    // JWT token
    try {
      const token = sign(
        { sub: newUser._id },
        config.jwtSecret as string, 
        { expiresIn: "7d", algorithm: "HS256" }
      );

      // Response
      res.status(201).json({ accessToken: token });
    } catch (error) {
      return next(createHttpError(500, "Error while signing JWT"));
    }
  } catch (err) {
    next(err);
  }
};


const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
  
    // Validation
    if (!email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }
  
    try {
      // Check if user exists
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return next(createHttpError(404, "User Not Found"));
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return next(createHttpError(400, "Credentials are incorrect"));
      }
  
      // JWT token generation
      const token = sign(
        { sub: user._id }, 
        config.jwtSecret as string,
        { expiresIn: "7d", algorithm: "HS256" } 
      );
  
      // Return the access token
      res.json({ accessToken: token });
  
    } catch (error) {
      return next(createHttpError(500, "Error while logging in"));
    }
  };

export { createUser ,loginUser};
