// Import des modules nécessaires
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import des routes
import participantsRoutes from "./routes/participantsRoutes";
import sessionRoutes from "./routes/sessionRoutes";


// Initialisation de l'application
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Utilisation des routes d'authentification
app.use("/participants", participantsRoutes);
app.use("/session", sessionRoutes);


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
