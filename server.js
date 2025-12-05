const express = require("express");
const { sequelize } = require("./models");
const ProductRoutes = require('./routes/ProductRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');
const errorMiddleware = require('./middlewares/ErrorMiddleware');

const PORT = 8080;
const server = express(); // 1. On crée l'app en premier

// 2. Middlewares globaux (AVANT les routes)
server.use(express.json()); // Pour lire le JSON (application/json)
server.use(express.urlencoded({ extended: true })); // Pour lire les formulaires (x-www-form-urlencoded)
server.set('query parser', 'extended');
// 3. Routes
server.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenue sur mon api !" });
});

server.use("/api/products", ProductRoutes);
server.use("/api/users", UserRoutes);
server.use("/api/auth", AuthRoutes);

// 4. Middleware d'erreur (toujours à la fin)
server.use(errorMiddleware);

// 5. Connexion DB puis lancement du serveur
console.log("Tentative de connexion à la DB...");
sequelize.authenticate()
  .then(() => {
    console.log("✅ Connexion Sequelize OK");
    server.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Erreur Sequelize :", err);
    // On ne quitte pas forcément le processus ici si on veut que le serveur tourne quand même, 
    // mais pour une API critique DB, c'est mieux de quitter.
    process.exit(1); 
  });