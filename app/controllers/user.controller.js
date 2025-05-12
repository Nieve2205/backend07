import db from '../models/index.js';
const { user: User, role: Role } = db;

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
    const { userId, roleName } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) return res.status(404).json({ message: "Rol no encontrado" });

        await user.setRoles([role.id]);

        return res.status(200).json({ message: "Rol actualizado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar el rol" });
    }
};

