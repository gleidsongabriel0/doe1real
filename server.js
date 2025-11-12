// --- IMPORTAÇÕES ---
const express = require('express');
const cors = require('cors'); // Para permitir que o frontend acesse o backend
const path = require('path');
const db = require('./database.js'); // Nosso script do banco de dados

// --- CONFIGURAÇÃO ---
const app = express();
const PORT = 3000; // Porta que o backend vai rodar

// --- MIDDLEWARES (Executam em todas as requisições) ---
app.use(cors()); // Permite requisições de origens diferentes (ex: localhost:5500 -> localhost:3000)
app.use(express.json()); // Permite que o servidor entenda JSON
app.use(express.static(path.join(__dirname))); // Serve os arquivos estáticos (HTML, CSS, JS)

// --- ROTAS DO FRONTEND ---
// Serve o 'index.html' na rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ROTAS DA API (Backend) ---

/**
 * API: Registro de Usuário
 * (POST) /api/register
 */
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    // AVISO DE SEGURANÇA:
    // NUNCA armazene senhas em texto puro em produção!
    // Use uma biblioteca como 'bcrypt' para criar um "hash" da senha.
    // ex: const hash = await bcrypt.hash(password, 10);
    // E salve o 'hash' no banco, não a 'password'.
    
    const sqlCheck = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.get(sqlCheck, [username, email], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Erro no servidor." });
        }
        if (row) {
            return res.status(400).json({ message: "Usuário ou email já cadastrado." });
        }

        // Insere o novo usuário
        const sqlInsert = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.run(sqlInsert, [username, email, password], function(err) {
            if (err) {
                return res.status(500).json({ message: "Erro ao cadastrar usuário." });
            }
            // Retorna o novo usuário (sem a senha)
            const newUser = { id: this.lastID, username, email, isAdmin: false };
            res.status(201).json({ user: newUser });
        });
    });
});

/**
 * API: Login de Usuário
 * (POST) /api/login
 */
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Check de Admin (Hardcoded)
    if (username.toLowerCase() === 'admin' && password === '12345678') {
        const adminUser = { id: 0, username: 'admin', isAdmin: true };
        return res.status(200).json({ user: adminUser });
    }

    // AVISO DE SEGURANÇA:
    // Aqui você deveria comparar o hash da senha, não o texto puro.
    // ex: const match = await bcrypt.compare(password, user.password_hash);
    
    const sql = "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?";
    db.get(sql, [username, username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Erro no servidor." });
        }
        if (!row) {
            return res.status(400).json({ message: "Usuário ou senha inválidos." });
        }
        
        // Sucesso! Retorna o usuário (sem a senha)
        const user = { id: row.id, username: row.username, email: row.email, isAdmin: false };
        res.status(200).json({ user });
    });
});

/**
 * API: Registrar Doação (Simulação PIX)
 * (POST) /api/donate
 */
app.post('/api/donate', (req, res) => {
    const { username, amount } = req.body;

    if (!username || !amount || amount <= 0) {
        return res.status(400).json({ message: "Dados da doação inválidos." });
    }
    
    // 1. Registra a doação no banco de dados
    const sql = "INSERT INTO donations (username, amount, date) VALUES (?, ?, ?)";
    const date = new Date().toISOString();
    
    db.run(sql, [username, amount, date], function(err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao registrar doação." });
        }
        
        // 2. Simula a geração de um QR Code PIX
        // Em um app real, aqui você chamaria a API do seu provedor de pagamentos.
        const qrCodeData = `SimulacaoPIX_Valor_${amount.toFixed(2)}_Para_${username}`;
        
        // Retorna o QR Code (simulado) para o frontend
        res.status(201).json({ 
            message: "Doação registrada. Aguardando pagamento.",
            donationId: this.lastID,
            qrCodeData: qrCodeData 
        });
    });
});

/**
 * API: Leaderboard
 * (GET) /api/leaderboard
 */
app.get('/api/leaderboard', (req, res) => {
    // Agrupa por usuário, soma o total e ordena do maior para o menor
    const sql = `
        SELECT 
            username, 
            SUM(amount) as total_amount
        FROM donations
        GROUP BY username
        ORDER BY total_amount DESC
        LIMIT 10
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao buscar leaderboard." });
        }
        res.status(200).json(rows);
    });
});

/**
 * API: Admin - Lista de Usuários
 * (GET) /api/admin/users
 */
app.get('/api/admin/users', (req, res) => {
    // AVISO DE SEGURANÇA:
    // Em um app real, você deve validar se o usuário
    // que faz essa requisição é um admin (usando um Token JWT, por exemplo).
    
    const sql = "SELECT id, username, email FROM users";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao buscar usuários." });
        }
        res.status(200).json(rows);
    });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log("Banco de dados inicializado.");
});