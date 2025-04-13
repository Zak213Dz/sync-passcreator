import { GoogleSpreadsheet } from 'google-spreadsheet';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';

dotenv.config();

const creds = JSON.parse(fs.readFileSync('./credible-cosine-456711-u2-8abee3e0bf06.json', 'utf8'));

async function fetchPasscreatorClients() {
try {
const response = await axios.get(`https://api.passcreator.com/api/clients/${process.env.PROJECT_ID}/passes`, {
headers: {
'Authorization': `apikey ${process.env.API_KEY}`,
'Accept': 'application/json'
}
});
return response.data;
} catch (error) {
console.error("Erreur lors de la récupération des clients Passcreator :", error);
return [];
}
}

async function syncClientsToGoogleSheet() {
try {
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

// Authentification correcte
await doc.useServiceAccountAuth({
client_email: creds.client_email,
private_key: creds.private_key.replace(/\\n/g, '\n'),
});

await doc.loadInfo();

const sheet = doc.sheetsByTitle['Fiches Clients'];
await sheet.loadCells('A1:F1000');

const existingData = await sheet.getRows();
const existingIDs = existingData.map(row => row['ID Client']);

const clients = await fetchPasscreatorClients();

for (const pass of clients) {
const id = pass.UserID;
if (!existingIDs.includes(id)) {
await sheet.addRow({
'ID Client': id,
'Nom': pass.fields["Nom de famille"] || "",
'Prénom': pass.fields["Prénom"] || "",
'Téléphone': pass.fields["Téléphone"] || "",
'Total points actuel': 0,
'Montant cumulé': 0
});
}
}

console.log("Import terminé.");
} catch (error) {
console.error("Erreur dans la synchronisation :", error);
}
}

syncClientsToGoogleSheet();