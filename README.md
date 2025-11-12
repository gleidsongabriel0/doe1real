<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="container">
        <h1>Projeto Doe 1 Real</h1>

        <p>Este é um projeto full-stack de um site de doações chamado "Doe 1 Real". Ele permite que usuários se cadastrem, façam login, doem quantias (começando em R$ 1,00) via uma simulação de PIX, e vejam um leaderboard dos maiores doadores.</p>

        <p>O projeto inclui um painel de administração básico para visualizar todos os usuários cadastrados.</p>

        <h2>Visão Geral da Arquitetura</h2>

        <p>O projeto é dividido em duas partes principais:</p>

        <ol>
            <li><strong>Frontend</strong>: Uma aplicação de página única (SPA) construída com HTML, CSS (TailwindCSS) e JavaScript puro. Ela é responsável por toda a interface que o usuário vê e interage.</li>
            <li><strong>Backend</strong>: Uma API RESTful construída com Node.js e Express. Ela gerencia a lógica de negócios, autenticação (simples) e a comunicação com o banco de dados.</li>
            <li><strong>Banco de Dados</strong>: Um banco de dados SQL (SQLite) usado para persistir os dados de usuários e doações.</li>
        </ol>

        <h2>Tecnologias Utilizadas</h2>

        <ul>
            <li><strong>Frontend</strong>:
                <ul>
                    <li>HTML5</li>
                    <li>Tailwind CSS (via CDN)</li>
                    <li>JavaScript (ES6+)</li>
                    <li>Feather Icons</li>
                </ul>
            </li>
            <li><strong>Backend</strong>:
                <ul>
                    <li>Node.js</li>
                    <li>Express.js</li>
                    <li><code>cors</code> (para permitir a comunicação entre frontend e backend)</li>
                </ul>
            </li>
            <li><strong>Banco de Dados</strong>:
                <ul>
                    <li>SQLite 3</li>
                    <li><code>sqlite3</code> (driver Node.js)</li>
                </ul>
            </li>
        </ul>

        <h2>Funcionalidades</h2>

        <ul>
            <li>Cadastro e Login de usuários.</li>
            <li>Login de Administrador (usuário: <code>admin</code>, senha: <code>12345678</code>).</li>
            <li>Página de Doação com incremento (mínimo R$ 1,00).</li>
            <li>Simulação de geração de QR Code PIX (via backend).</li>
            <li>Leaderboard dos 10 maiores doadores (agregado por usuário).</li>
            <li>Painel de Admin para visualização de usuários cadastrados.</li>
        </ul>

        <h2>Como Executar Localmente</h2>

        <p>Para rodar este projeto, você precisará ter o <a href="https://nodejs.org/">Node.js</a> (que inclui o npm) instalado em sua máquina.</p>

        <h3>1. Clone ou Salve os Arquivos</h3>

        <p>Baixe ou salve todos os arquivos do projeto (<code>index.html</code>, <code>style.css</code>, <code>script.js</code>, <code>server.js</code>, <code>database.js</code>, <code>package.json</code>) na mesma pasta.</p>

        <h3>2. Abra o Terminal</h3>

        <p>Abra seu terminal (Prompt de Comando, PowerShell, Git Bash, etc.) e navegue até a pasta do projeto.</p>

<pre><code>cd caminho/para/seu/projeto
</code></pre>

        <h3>3. Instale as Dependências</h3>

        <p>Execute o comando abaixo para instalar as dependências do backend (Express, CORS e SQLite3) listadas no <code>package.json</code>:</p>

<pre><code>npm install
</code></pre>

        <h3>4. Inicialize o Banco de Dados</h3>

        <p>O <code>server.js</code> chama o <code>database.js</code> automaticamente, que cria o arquivo <code>doe1real.db</code> e as tabelas (se não existirem) na primeira vez que o servidor é iniciado.</p>

        <p><em>Opcional: Se você quiser apenas criar o banco de dados sem iniciar o servidor, pode usar o script definido no <code>package.json</code>:</em></p>

<pre><code>npm run initdb
</code></pre>

        <h3>5. Inicie o Servidor</h3>

        <p>Após a instalação, inicie o servidor de backend:</p>

<pre><code>npm start
</code></pre>

        <p>Ou, se você quiser que o servidor reinicie automaticamente após qualquer alteração nos arquivos do backend (modo de desenvolvimento):</p>

<pre><code>npm run dev
</code></pre>

        <p>Você deverá ver a seguinte mensagem no seu terminal, indicando que o backend está rodando:</p>

<pre><code>Servidor rodando em http://localhost:3000
Banco de dados inicializado.
Conectado ao banco de dados SQLite.
</code></pre>

        <h3>6. Acesse a Aplicação</h3>

        <p>Abra seu navegador de internet (Chrome, Firefox, Edge, etc.) e acesse o seguinte endereço:</p>

        <p><code>http://localhost:3000</code></p>

        <p>O <code>server.js</code> servirá o <code>index.html</code> e a aplicação estará pronta para uso.</p>

        <hr>

        <p><strong>AVISO DE SEGURANÇA:</strong> Este projeto é um protótipo para fins educacionais. Ele armazena senhas em <strong>texto puro</strong> no banco de dados, o que é uma prática de segurança <strong>extremamente ruim</strong>. Em um ambiente de produção, senhas devem <strong>sempre</strong> ser "hasheadas" usando um algoritmo forte como o <code>bcrypt</code>.</p>
    </div>
</body>
</html>
