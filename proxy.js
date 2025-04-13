import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
try {
const response = await axios.get(
`https://api.passcreator.com/api/clients/${process.env.PROJECT_ID}`,
{
headers: {
Authorization: `Bearer ${process.env.API_KEY}`
}
}
);

const clients = response.data.map(pass => ({
userID: pass.userId,
fields: pass.fields
}));

res.json(clients);
} catch (error) {
console.error("Erreur proxy :", error.message);
res.status(500).json({ error: "Erreur côté Replit" });
}
});

app.listen(port, () => {
console.log(`Proxy Passcreator en ligne sur http://localhost:${port}`);
});
