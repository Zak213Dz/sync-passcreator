import { google } from "googleapis";
import { JWT } from "google-auth-library";
import axios from "axios";
import fs from "fs";

// AUTHENTIFICATION GOOGLE SHEETS
const auth = new JWT({
  email: "sync-passcreator@sync-passcreator.iam.gserviceaccount.com",
  key: fs.readFileSync("/etc/secrets/credentials.json", "utf-8"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// INFOS PERSONNELLES
const spreadsheetId = "1pdErLdvkRWsKA3yUk1ABUYw6qm64nqjQtBUi_StEQkU";
const sheetName = "Fiches Clients";
const passcreatorURL = "https://api.passcreator.de/api/v2/project/664e54b212f27a3a83ba59a/passes?templateId=65e5de0ecf38c7cc36d16142&limit=100";
const apiKey = "api-key bcf2bcdce26443129b3ad2dfb3a9a6c9";

async function importClients() {
  try {
    const response = await axios.get(passcreatorURL, {
      headers: {
        "API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    const clients = response.data;

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A2:A`,
    });

    const existingIDs = existing.data.values
      ? existing.data.values.flat()
      : [];

    const newClients = clients.filter(
      (client) => !existingIDs.includes(client.userID)
    );

    if (newClients.length === 0) {
      console.log("Aucun nouveau client à ajouter.");
      return;
    }

    const rows = newClients.map((client) => [
      client.userID,
      client.firstName,
      client.lastName,
      client.phone,
      0,
      0,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A2`,
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    });

    console.log(`${rows.length} client(s) ajouté(s) à Google Sheets.`);
  } catch (error) {
    console.error("Erreur lors de l'importation :", error.message);
  }
}

importClients();
