import fs from 'fs';
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
keyFile: '/etc/secrets/credentials.json',
scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function readSheet() {
try {
const response = await sheets.spreadsheets.values.get({
spreadsheetId: 'TON_ID_SHEET',
range: 'Fiches Clients!A1:F',
});
console.log(response.data.values);
} catch (error) {
console.error('Erreur Google Sheets :', error);
}
}

readSheet();
