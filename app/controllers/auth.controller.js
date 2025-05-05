import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Corrección: bycrypt → bcrypt
import authConfig from "../config/auth.config.js";

const { user: User, role: Role } = db;

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);

        // Crear usuario
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Asignar rol por defecto (user)
        const defaultRole = await Role.findOne({ where: { name: "user" } });
        if (defaultRole) {
            await user.setRoles([defaultRole.id]);
        }

        return res.status(201).json({ 
            success: true,
            message: "Usuario registrado exitosamente" 
        });

    } catch (error) {
        console.error("Error en registro:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

export const signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username },
            include: { 
                model: Role,
                as: "roles",
                attributes: ['id', 'name'], // Asegúrate de incluir el nombre
                through: { attributes: [] } // Excluye la tabla intermedia
            },
        });

        if (!user) {
            return res.status(404).json({ message: "¡Usuario no encontrado!" });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ accessToken: null, message: "¡Contraseña inválida!" });
        }

        // Obtener los nombres de los roles en minúscula
        const roleNames = user.roles.map(role => role.name.toLowerCase());

        const token = jwt.sign({ 
            id: user.id,
            username: user.username,
            email: user.email,
            roles: roleNames // Incluye los nombres de los roles en el token
        }, authConfig.secret, {
            expiresIn: 86400,
        });

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: roleNames, // Envía los nombres sin el prefijo ROLE_
            accessToken: token,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};