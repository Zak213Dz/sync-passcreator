import express from "express";
import axios from "axios";
import fs from "fs";

// Lire et parser la clé depuis le secret file Render
const credentials = JSON.parse(fs.readFileSync('/etc/secrets/credentials.json', 'utf8'));
const API_KEY = credentials.private_key_id; // ou un champ spécifique selon ton usage
const PROJECT_ID = credentials.project_id;

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
try {
const response = await axios.get(
`https://api.passcreator.de/api/clients/${PROJECT_ID}`,
{
headers: {
Authorization: `Bearer ${API_KEY}`,
}
}
);

const clients = response.data.map(pass => ({
userID: pass.userId,
fields: pass.fields
}));

res.json(clients);
} catch (error) {
console.error(error.response ? error.response.data : error.message);
res.status(500).json({ error: "Erreur lors de la récupération des données" });
}
});

app.listen(port, () => {
console.log(`Serveur en écoute sur le port ${port}`);
});

