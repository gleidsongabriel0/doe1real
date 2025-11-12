const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = 'doe1real.db'; // Nome do arquivo do banco de dados

// Conecta ao banco (ou cria se não existir)
const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        // Não pode abrir o banco
        console.error(err.message);
        throw err;
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        
        // db.serialize() garante que os comandos rodem em ordem
        db.serialize(() => {
            // Cria a tabela de usuários
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                email TEXT UNIQUE,
                password TEXT
            )`, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela 'users':", err.message);
                } else {
                    // Adiciona dados de teste (apenas se a tabela for nova)
                    const sql = "INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)";
                    db.run(sql, ["tester", "tester@example.com", "password123"]);
                }
            });

            // Cria a tabela de doações
            db.run(`CREATE TABLE IF NOT EXISTS donations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                amount REAL,
                date TEXT
            )`, (err) => {
                 if (err) {
                    console.error("Erro ao criar tabela 'donations':", err.message);
                } else {
                    // Adiciona dados de teste (apenas se a tabela for nova)
                    const sql = "INSERT OR IGNORE INTO donations (username, amount, date) VALUES (?, ?, ?)";
                    db.run(sql, ["tester", 5, new Date().toISOString()]);
                    db.run(sql, ["generous-user", 20, new Date().toISOString()]);
                    db.run(sql, ["tester", 2, new Date().toISOString()]);
                }
            });
        });
    }
});

module.exports = db;