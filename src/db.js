import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on("connect", () => {
    console.log("Conectado ao PostgreSQL");
});

export default pool;
