import db from '../models/index.js';

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

export const setUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const foundRole = await Role.findOne({ where: { name: role } });
    if (!foundRole) return res.status(400).json({ message: "Rol inválido" });

    await user.setRoles([foundRole.id]);

    res.status(200).json({ message: `Rol actualizado a '${role}'` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
