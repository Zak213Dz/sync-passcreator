import fs from 'fs';
import { google } from 'googleapis';

// Lire et parser la clé depuis le Secret File de Render
const KEYFILEPATH = '/etc/secrets/credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
keyFile: KEYFILEPATH,
scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

const spreadsheetId = '1pdErLdvkRWsKA3yUk1ABUYw6qm64nqjQtBUi_StEQkU'; // Ton vrai ID de Google Sheets
const sheetName = 'Fiches Clients'; // Nom exact de l’onglet

async function readData() {
try {
const response = await sheets.spreadsheets.values.get({
spreadsheetId,
range: `${sheetName}!A2:E`, // Lit à partir de la ligne 2 (pour sauter les en-têtes)
});

const rows = response.data.values;
if (rows.length) {
console.log('Données récupérées :');
rows.forEach((row) => {
console.log(row);
});
} else {
console.log('Aucune donnée trouvée.');
}
} catch (error) {
console.error('Erreur lors de la lecture des données :', error);
}
}

readData();
