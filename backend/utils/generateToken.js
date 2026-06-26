import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const userId = user?._id || user?.id || user?.email || "env-admin";

  return jwt.sign(
    {
      id: userId,
      role: user.role,
      email: user.email,
      name: user.name || user.ownerName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;