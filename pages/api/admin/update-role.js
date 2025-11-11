import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { setUserRole } from "../../../lib/userRoles";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  const { userId, newRole } = req.body;

  if (!["admin", "user"].includes(newRole)) {
    return res.status(400).json({ message: "Rol inválido" });
  }

  setUserRole(userId, newRole);

  return res.status(200).json({ success: true });
}
