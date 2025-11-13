const express = require('express');
const cors = require('cors');
// Importa o 'db' do nosso database.js (que já se conecta e cria tabelas)
const db = require('./database.js'); 

const app = express();
// O Railway define a variável de ambiente PORTA automaticamente
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

// Rota de Teste da Raiz
app.get('/', (req, res) => {
  res.send('Servidor "Doe 1 Real" está rodando! (SQLite)');
});

// ---- ROTAS DE API (SQLite) ----

// Rota de Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Lógica de Admin "Hard-Coded" (OPCIONAL, pois o admin já está no DB)
  // Mas vamos manter para garantir
  if (username === 'admin' && password === '12345678') {
      console.log('Login de ADMIN (hard-coded) detectado.');
      return res.json({ success: true, token: 'admin-token', isAdmin: true });
  }

  // Lógica do Banco de Dados
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      console.error('Erro na rota /api/login:', err.message);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (row) {
      // Usuário encontrado
      console.log(`Login bem-sucedido para: ${username}`);
      const isAdmin = (row.username === 'admin'); // Checagem de admin do DB
      res.json({ success: true, token: 'fake-jwt-token', isAdmin: isAdmin });
    } else {
      // Usuário não encontrado
      console.log(`Tentativa de login falhou para: ${username}`);
      res.json({ success: false, message: 'Usuário ou senha inválidos' });
    }
  });
});

// Rota de Cadastro
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  const checkSql = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.get(checkSql, [username, email], (err, row) => {
    if (err) {
      console.error('Erro na rota /api/register (check):', err.message);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
    
    if (row) {
      return res.json({ success: false, message: 'Usuário ou e-mail já cadastrado.' });
    }

    // Se não existir, insere
    const insertSql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.run(insertSql, [username, email, password], function(err) {
      if (err) {
        console.error('Erro na rota /api/register (insert):', err.message);
        return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
      }
      
      console.log(`Novo usuário cadastrado: ${username} (ID: ${this.lastID})`);
      res.json({ success: true, token: 'fake-jwt-token' }); // Loga automaticamente
    });
  });
});

// Rota para registrar doação
app.post('/api/donations', (req, res) => {
  const { username, amount } = req.body;
  const donationAmount = parseFloat(amount);
  const donationDate = new Date().toISOString();

  if (isNaN(donationAmount) || donationAmount <= 0) {
    return res.json({ success: false, message: 'Valor da doação é inválido.' });
  }

  const sql = "INSERT INTO donations (username, amount, date) VALUES (?, ?, ?)";
  db.run(sql, [username, donationAmount, donationDate], function(err) {
    if (err) {
      console.error('Erro na rota /api/donations:', err.message);
      return res.status(500).json({ success: false, message: 'Erro ao salvar doação' });
    }
    
    console.log(`Doação de R$ ${donationAmount} registrada para ${username}`);
    res.json({ success: true, message: 'Doação registrada com sucesso!' });
  });
});

// Rota para pegar o Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const sql = `
    SELECT username, SUM(amount) as total_donated
    FROM donations
    GROUP BY username
    ORDER BY total_donated DESC
    LIMIT 10
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro na rota /api/leaderboard:', err.message);
      return res.status(500).json({ success: false, message: 'Erro ao buscar leaderboard' });
    }
    res.json(rows);
  });
});

// Rota de Admin para ver usuários
app.get('/api/admin/users', (req, res) => {
  // ATENÇÃO: Em um app real, valide o token de admin aqui!
  const sql = "SELECT id, username, email FROM users ORDER BY id ASC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro na rota /api/admin/users:', err.message);
      return res.status(500).json({ success: false, message: 'Erro ao buscar usuários' });
    }
    res.json(rows);
  });
});

// ---- Iniciar Servidor ----
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
