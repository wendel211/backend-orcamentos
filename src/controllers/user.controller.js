import pool from "../db.js";
import bcrypt from "bcryptjs";
// REMOVIDO: import { crypto } from "expo-crypto"; 
// O módulo 'crypto' nativo do Node.js pode ser importado se você precisar de outras funções:
// import crypto from "crypto";

import { v4 as uuidv4 } from "uuid";

export const register = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    try {
        // Verifica se o usuário já existe
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Este e-mail já está em uso" });
        }

        // Criptografia da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Gera o ID único (UUID v4)
        const id = uuidv4();

        const newUser = await pool.query(
            "INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4) RETURNING id, email, name",
            [id, email, hashedPassword, name]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: "Erro interno do servidor ao cadastrar" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        res.json({
            id: user.rows[0].id,
            email: user.rows[0].email,
            name: user.rows[0].name
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno do servidor ao fazer login" });
    }
};