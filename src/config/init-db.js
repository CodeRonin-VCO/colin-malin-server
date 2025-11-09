import db from "./../models/index.js";

try {
    await db.sequelize.authenticate();
    await db.sequelize.sync({
        alter: { drop: false }
    });

    console.log("--- Base de données initialisée avec succès. ---");
    process.exit(0);

} catch (error) {
    console.log(`L'initialisation a échoué`, error);
    process.exit(1);
}
