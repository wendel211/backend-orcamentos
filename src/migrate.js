import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
    try {
        console.log("Iniciando migração do banco de dados...");

        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Executa o SQL de inicialização
        await pool.query(sql);

        console.log("Banco de dados inicializado com sucesso!");
        process.exit(0);
    } catch (error) {
        console.error("Erro durante a migração:", error);
        process.exit(1);
    }
};

migrate();
