// Import des modules nécessaires
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import des routes
import participantsRoutes from "./routes/participantsRoutes";
import sessionRoutes from "./routes/sessionRoutes";


const apiBaseUrl = process.env.NODE_ENV === 'production' 
  ? process.env.NUXT_PUBLIC_API_BASE_URL 
  : 'http://localhost:4000/';

  
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
    console.log(`${apiBaseUrl}`);
});

export default app;