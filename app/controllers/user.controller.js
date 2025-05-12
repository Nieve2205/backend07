import db from '../models/index.js';
const roles = await db.role.findAll();
console.log(roles);
for (let roleName of roles) {
  const roleExists = await db.role.findOne({ where: { name: roleName } });
  
  if (!roleExists) {
    await db.role.create({ name: roleName });
    console.log(`Rol ${roleName} creado`);
  } else {
    console.log(`El rol ${roleName} ya existe`);
  }
}
export const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

export const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

export const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

export const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll(); // Recupera todos los usuarios de la base de datos
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los usuarios." });
  }
};

export const assignRole = async (req, res) => {
  const { userId, roleName } = req.body;

  try {
    const user = await db.user.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const role = await db.role.findOne({ where: { name: roleName } });
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    await user.setRoles([role.id]);

    return res.json({ message: "Rol asignado correctamente" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
