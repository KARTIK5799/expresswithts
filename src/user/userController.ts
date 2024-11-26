import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }

    // Check if user already exists
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(400, "User already exists");
      return next(error);
    }

    // Process
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user and await result
    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    //jwt token
    const token = sign(
      {
        sub: newUser._id,
      },
      config.jwtSecret as string,
      { expiresIn: "7d" ,algorithm:'ES256',}
    );

    // Response
    res.status(201).json({ accessToken: token });
  } catch (err) {
    next(err);
  }
};

export { createUser };
