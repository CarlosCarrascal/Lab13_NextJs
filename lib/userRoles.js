import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "users.json");

// Asegurar que el directorio data existe
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Leer datos del archivo
function readData() {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading users data:", error);
  }
  return { userRoles: {}, userDetails: {} };
}

// Guardar datos en el archivo
function saveData(data) {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving users data:", error);
  }
}

export function getUserRole(userId) {
  const data = readData();
  return data.userRoles[userId] || "user";
}

export function setUserRole(userId, role) {
  const data = readData();
  data.userRoles[userId] = role;
  saveData(data);
}

export function setUserDetails(userId, details) {
  const data = readData();
  data.userDetails[userId] = details;
  saveData(data);
}

export function getAllUsers() {
  const data = readData();
  return Object.keys(data.userDetails).map((userId) => ({
    id: userId,
    ...data.userDetails[userId],
    role: data.userRoles[userId] || "user",
  }));
}
