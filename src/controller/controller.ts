import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getAlluser,
  getUserById,
  updateUser,
} from "../services/service";

export const createData = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      typeof name !== "string" ||
      !password ||
      typeof password !== "string" ||
      !email ||
      typeof email !== "string" ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    ) {
      return res.status(400).json({ message: "Invalid email" });
    }

    await createUser({ name, email, password });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user-email already exist:", error);
    return res
      .status(500)
      .json({ message: "Error creating user-email already exist", error });
  }
};

export const getData = async (req: Request, res: Response) => {
  try {
    const users = await getAlluser();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getDataById = async (req: Request, res: Response) => {
  try {
    const userid = parseInt(req.params.userid);
    if (isNaN(userid)) {
      return res.status(400).json({ message: "Invalid empid" });
    }

    const user = await getUserById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateData = async (req: Request, res: Response) => {
  try {
    const userid = parseInt(req.params.userid);
    if (isNaN(userid)) {
      return res.status(400).json({ message: "Invalid userid" });
    }

    const { name, email, password } = req.body;

    const updatedUser = await updateUser(userid, name, email, password);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteData = async (req: Request, res: Response) => {
  try {
    const userid = parseInt(req.params.userid);
    if (isNaN(userid)) {
      return res.status(400).json({ message: "Invalid userid" });
    }

    const user = await deleteUser(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Error deleting user", error });
  }
};