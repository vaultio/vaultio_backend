import { compare, genSalt, hash } from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const comparePassword = async (
  plainPassword: string,
  password: string
) => {
  return await compare(plainPassword, password);
};
