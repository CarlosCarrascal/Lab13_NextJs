import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getAllUsers } from "../../../lib/userRoles";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  const users = getAllUsers();

  return res.status(200).json({ users });
}
