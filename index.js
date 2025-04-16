import { google } from "googleapis";
import { readFileSync } from "fs";

// Lecture du fichier de clé JSON depuis Render (secret file)
const credentials = JSON.parse(
readFileSync("/etc/secrets/credentials.json", "utf8")
);

// Authentification avec la clé Google Cloud
const auth = new google.auth.GoogleAuth({
credentials,
scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// ID de la feuille Google Sheets (à mettre dans tes variables d’environnement Render)
const spreadsheetId = process.env.SHEET_ID;

async function accessSheet() {
try {
const client = await auth.getClient();
const sheets = google.sheets({ version: "v4", auth: client });

// Exemple de lecture de la 1re feuille, A1 à C10
const res = await sheets.spreadsheets.values.get({
spreadsheetId,
range: "Feuille1!A1:C10",
});

console.log("Données lues depuis Sheets :");
console.log(res.data.values);
} catch (err) {
console.error("Erreur d’accès à Google Sheets :", err.message);
}
}

accessSheet();
