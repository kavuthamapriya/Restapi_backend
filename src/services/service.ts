import bcrypt from "bcryptjs";
import { AppDataSource } from "../dbconfig";
import { User } from "../models/user";

interface CreateUserDb {
  name: string;
  email: string;
  password: string;
}

export const createUser = async ({ name, email, password }: CreateUserDb) => {
  const userRepository = AppDataSource.getRepository(User);

  const existingUser = await userRepository.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  return userRepository.save(user);
};

export const getAlluser = async () => {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.find();
};

export const getUserById = async (userid: number) => {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOneBy({ userid });
};

export const updateUser = async (
  userid: number,
  name?: string,
  email?: string,
  password?: string
) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ userid });

  if (!user) {
    return null;
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);

  await userRepository.save(user);

  return user;
};

export const deleteUser = async (userid: number) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ userid });

  if (!user) {
    return false;
  }

  await userRepository.remove(user);

  return true;
};
