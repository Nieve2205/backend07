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