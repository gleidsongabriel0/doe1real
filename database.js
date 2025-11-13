const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// --- ESTA É A MUDANÇA IMPORTANTE ---
// Define o caminho para uma pasta 'data'
const DATA_DIR = path.join(__dirname, 'data');
// Define que o arquivo do banco estará DENTRO dessa pasta
const DB_SOURCE = path.join(DATA_DIR, 'doe1real.db');

// Se a pasta 'data' não existir, crie-a.
// Isso é crucial para o Railway.
if (!fs.existsSync(DATA_DIR)){
    console.log("Criando diretório para o banco de dados:", DATA_DIR);
    fs.mkdirSync(DATA_DIR, { recursive: true });
} else {
    console.log("Diretório de dados já existe:", DATA_DIR);
}

// Conecta ao banco (ou cria se não existir)
const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error("Erro ao abrir banco:", err.message);
        console.error("Caminho do DB:", DB_SOURCE);
        throw err;
    } else {
        console.log(`Conectado ao banco de dados SQLite em: ${DB_SOURCE}`);
        
        db.serialize(() => {
            
            // ---- 1. Criar Tabela de Usuários ----
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE,
                    email TEXT UNIQUE,
                    password TEXT
                )
            `;
            
            db.run(createUsersTable, (err) => {
                if (err) {
                    console.error("Erro ao criar tabela 'users':", err.message);
                } else {
                    // ---- 2. Inserir Usuário Admin ----
                    const adminUser = {
                        username: 'admin',
                        email: 'admin@doe1real.com',
                        password: '12345678' // Lembre-se: Em produção, use hash!
                    };
                    
                    const insertAdmin = `INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)`;
                    
                    db.run(insertAdmin, [adminUser.username, adminUser.email, adminUser.password], function(err) {
                        if (err) {
                            console.error("Erro ao inserir usuário 'admin':", err.message);
                        } else if (this.changes > 0) {
                            console.log("Usuário 'admin' criado com sucesso.");
                        } else {
                            console.log("Usuário 'admin' já existia.");
                        }
                    });
                }
            });

            // ---- 3. Criar Tabela de Doações ----
            const createDonationsTable = `
                CREATE TABLE IF NOT EXISTS donations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    amount REAL,
                    date TEXT
                )
            `;
            db.run(createDonationsTable, (err) => {
                 if (err) {
                    console.error("Erro ao criar tabela 'donations':", err.message);
                } else {
                    console.log("Tabela 'donations' verificada/criada.");
                }
            });
        });
    }
});

// Exportamos o 'db' para que o server.js possa usá-lo
module.exports = db;
