import { Sequelize } from "sequelize";
import usersModel from "./users.model.js";
import questionsModel from "./questions.model.js";
import multiplayerModel from "./multiplayer.model.js";
import gameModel from "./games.model.js";
import gameQuestionModel from "./gameQuestion.model.js";
import scoreModel from "./scores.model.js";

// ==== Obtenir les variables d'environnement ====
const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_SERVER, DB_PORT } = process.env;

// ==== Init sequelize ====
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_SERVER,
    port: DB_PORT,
    dialect: "postgres"
})

const db = {};
export default db;

// ==== Instance sequelize ====
db.sequelize = sequelize;

// ==== Models ====
db.User = usersModel(sequelize);
db.Question = questionsModel(sequelize);
db.Multiplayer = multiplayerModel(sequelize);
db.Game = gameModel(sequelize);
db.GameQuestion = gameQuestionModel(sequelize);
db.Score = scoreModel(sequelize);

// ==== Relations des modèles ====
// Un utilisateur peut avoir plusieurs parties (games)
db.User.hasMany(db.Game, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Game.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Un utilisateur peut participer à plusieurs parties multijoueurs
db.User.hasMany(db.Multiplayer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Multiplayer.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Une partie peut avoir plusieurs entrées multijoueurs
db.Game.hasMany(db.Multiplayer, { foreignKey: 'game_id', onDelete: 'CASCADE' });
db.Multiplayer.belongsTo(db.Game, { foreignKey: 'game_id', onDelete: 'CASCADE' });

// Une partie peut avoir plusieurs questions jouées
db.Game.hasMany(db.GameQuestion, { foreignKey: 'game_id', as: 'questions', onDelete: 'CASCADE' });
db.GameQuestion.belongsTo(db.Game, { foreignKey: 'game_id', onDelete: 'CASCADE' });

// Une question peut apparaître dans plusieurs parties
db.Question.hasMany(db.GameQuestion, { foreignKey: 'question_id', onDelete: 'CASCADE' });
db.GameQuestion.belongsTo(db.Question, { foreignKey: 'question_id', as: 'question', onDelete: 'CASCADE' });

// Une partie a un score (1:1)
db.Game.hasOne(db.Score, { foreignKey: 'game_id', onDelete: 'CASCADE' });
db.Score.belongsTo(db.Game, { foreignKey: 'game_id', onDelete: 'CASCADE' });

// Un utilisateur a plusieurs scores (1:N)
db.User.hasMany(db.Score, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Score.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
