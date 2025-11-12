# Projeto Doe 1 Real

---

Este é um projeto full-stack de um site de doações chamado **Doe 1 Real**. Ele permite que usuários se cadastrem, façam login, doem quantias (começando em **R$ 1,00**) via uma simulação de PIX, e vejam um *leaderboard* dos maiores doadores.

O projeto inclui um painel de administração básico para visualizar todos os usuários cadastrados.

---

## Visão Geral da Arquitetura

O projeto é dividido em três partes principais:

1. **Frontend**  
   Uma aplicação de página única (SPA) construída com HTML, CSS (TailwindCSS) e JavaScript puro. Responsável pela interface que o usuário vê e interage.

2. **Backend**  
   API RESTful construída com Node.js e Express. Gerencia a lógica de negócios, autenticação (simples) e comunicação com o banco de dados.

3. **Banco de Dados**  
   Banco de dados SQL (SQLite) usado para persistir os dados de usuários e doações.

---

## Tecnologias Utilizadas

- **Frontend**
  - HTML5
  - Tailwind CSS (via CDN)
  - JavaScript (ES6+)
  - Feather Icons

- **Backend**
  - Node.js
  - Express.js
  - `cors` (para permitir a comunicação entre frontend e backend)

- **Banco de Dados**
  - SQLite 3
  - `sqlite3` (driver Node.js)

---

## Funcionalidades

- Cadastro e Login de usuários.
- Login de Administrador (usuário: `admin`, senha: `12345678`).
- Página de Doação com incremento (mínimo R$ 1,00).
- Simulação de geração de QR Code PIX (via backend).
- Leaderboard dos 10 maiores doadores (agregado por usuário).
- Painel de Admin para visualização de usuários cadastrados.

---

## Como Executar Localmente

> Para rodar este projeto, você precisará ter o [Node.js](https://nodejs.org/) (que inclui o npm) instalado em sua máquina.

### 1. Clone ou salve os arquivos
Baixe ou salve todos os arquivos do projeto (`index.html`, `style.css`, `script.js`, `server.js`, `database.js`, `package.json`) na mesma pasta.

### 2. Abra o terminal
Abra seu terminal (Prompt de Comando, PowerShell, Git Bash, etc.) e navegue até a pasta do projeto:

```bash
cd caminho/para/seu/projeto
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicialize o banco de dados

O `server.js` chama o `database.js` automaticamente, que cria o arquivo `doe1real.db` e as tabelas (se não existirem) na primeira vez que o servidor é iniciado.

> Opcional: se você quiser apenas criar o banco de dados sem iniciar o servidor, use o script definido no `package.json`:

```bash
npm run initdb
```

### 5. Inicie o servidor

```bash
npm start
```

Ou para desenvolvimento com reinício automático (se estiver configurado):

```bash
npm run dev
```

Você deverá ver mensagens parecidas com:

```
Servidor rodando em http://localhost:3000
Banco de dados inicializado.
Conectado ao banco de dados SQLite.
```

### 6. Acesse a aplicação

Abra o navegador e acesse:

```
http://localhost:3000
```

O `server.js` servirá o `index.html` e a aplicação estará pronta para uso.

---

## Aviso de Segurança

**AVISO DE SEGURANÇA:** Este projeto é um **protótipo para fins educacionais**. Ele armazena senhas em **texto puro** no banco de dados, o que é uma prática de segurança **extremamente ruim**. Em um ambiente de produção, senhas devem **sempre** ser armazenadas com hash usando um algoritmo forte como `bcrypt`.

---

## Estrutura de Arquivos (exemplo)

```
/doe1real
├─ index.html
├─ style.css
├─ script.js
├─ server.js
├─ database.js
├─ package.json
└─ README.md
```
