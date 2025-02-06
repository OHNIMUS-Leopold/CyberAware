// Import des modules nécessaires
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import de la configuration de la base de données
// import db from "./db/database.js";

// Import des routes
// import authRoutes from "./routes/authRoutes.js";


// Initialisation de l'application
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Utilisation des routes d'authentification
// app.use("/auth", authRoutes);


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
