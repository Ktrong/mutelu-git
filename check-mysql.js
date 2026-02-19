const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
    const url = process.env.DATABASE_URL;
    console.log('Connecting to:', url.replace(/:[^:@]+@/, ':****@'));

    try {
        const connection = await mysql.createConnection(url);
        console.log('✅ Connected to MySQL successfully');

        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in database:');
        console.log(rows);

        if (rows.length > 0) {
            const firstTable = Object.values(rows[0])[0];
            const [data] = await connection.query(`SELECT * FROM \`${firstTable}\` LIMIT 1`);
            console.log(`Data in ${firstTable}:`, data);
        }

        await connection.end();
    } catch (err) {
        console.error('❌ Direct connection failed:', err.message);
    }
}

checkTables();
