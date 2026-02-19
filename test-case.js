const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCase() {
    const url = process.env.DATABASE_URL;
    const connection = await mysql.createConnection(url);

    try {
        console.log('Testing lowercase: wallpaper');
        try {
            const [rows1] = await connection.query('SELECT COUNT(*) as count FROM wallpaper');
            console.log('Lowercase works:', rows1);
        } catch (e) {
            console.log('Lowercase fails:', e.message);
        }

        console.log('Testing capitalized: Wallpaper');
        try {
            const [rows2] = await connection.query('SELECT COUNT(*) as count FROM Wallpaper');
            console.log('Capitalized works:', rows2);
        } catch (e) {
            console.log('Capitalized fails:', e.message);
        }

    } finally {
        await connection.end();
    }
}

checkCase();
