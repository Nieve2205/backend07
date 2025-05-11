import Sequelize from "sequelize";
import dbConfig from "../config/db.config.js";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";

let sequelize;

if (dbConfig.url) {
  sequelize = new Sequelize(dbConfig.url, {
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    protocol: 'postgres', // útil para PostgreSQL en algunos entornos
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // importante en Render
      },
    },
  });
} else {
  sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      pool: dbConfig.pool,
      port: dbConfig.PORT,
    }
  );
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles",
});

db.ROLES = ["user", "admin", "moderator"];

export default db;
