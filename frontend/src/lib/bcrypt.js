import bcrypt from "bcryptjs";
export const hashPassword = async (password) => {
  const hpass = await bcrypt.hash(password, 10);
  return hpass;
};
export const comparePassword = async (password, hPassword) => {
  const hpass = await bcrypt.compare(password, hPassword);
  return hpass;
};
