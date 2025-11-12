// --- CONFIGURAÇÕES ---

// Endereço do nosso backend. Em um ambiente real, isso seria
// 'https://api.doe1real.com.br', mas para testes locais, usamos o localhost.
const API_URL = 'http://localhost:3000/api';

// --- ESTADO GLOBAL DO FRONTEND ---

let currentUser = null;
let currentDonationAmount = 1;

// --- CONTROLE DE NAVEGAÇÃO ---

/**
 * Esconde todas as seções de página e mostra a página solicitada.
 * @param {string} pageId O ID da seção (página) a ser mostrada.
 */
async function showPage(pageId) {
    // Esconde todas as páginas
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostra a página solicitada
    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = 'block';
    }

    // Ações específicas ao mostrar uma página (carregar dados do backend)
    if (pageId === 'page-leaderboard') {
        await renderLeaderboard();
    }
    if (pageId === 'page-admin') {
        await renderAdminUserList();
    }
    if (pageId === 'page-donate') {
        // Reseta o valor da doação toda vez que a página é aberta
        currentDonationAmount = 1;
        updateDonationAmountUI();
    }

    // Limpa mensagens de erro
    clearErrors();
}

/**
 * Limpa todas as mensagens de erro dos formulários
 */
function clearErrors() {
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

/**
 * Atualiza a barra de navegação com base no estado de login.
 */
function updateNav() {
    const navLogin = document.getElementById('nav-login');
    const navAdmin = document.getElementById('nav-admin');
    const navLogout = document.getElementById('nav-logout');

    if (currentUser) {
        navLogin.style.display = 'none';
        navLogout.style.display = 'inline-block';
        if (currentUser.isAdmin) {
            navAdmin.style.display = 'inline-block';
        } else {
            navAdmin.style.display = 'none';
        }
    } else {
        navLogin.style.display = 'inline-block';
        navLogout.style.display = 'none';
        navAdmin.style.display = 'none';
    }
}
        
/**
 * Mostra um "toast" (notificação) de sucesso.
 * @param {string} message A mensagem a ser exibida.
 */
function showToast(message) {
    const toast = document.getElementById('toast-success');
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('hidden');
    
    // Atualiza os ícones do Feather
    feather.replace();
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000); // Esconde após 3 segundos
}

// --- LÓGICA DE AUTENTICAÇÃO E DADOS (com API) ---

/**
 * Salva o usuário atual na sessionStorage (para persistir F5).
 */
function saveCurrentUserToSession() {
     if (currentUser) {
        sessionStorage.setItem('doe1real_currentUser', JSON.stringify(currentUser));
    } else {
        sessionStorage.removeItem('doe1real_currentUser');
    }
}

/**
 * Carrega o usuário da sessionStorage.
 */
function loadCurrentUserFromSession() {
    const loggedInUser = sessionStorage.getItem('doe1real_currentUser');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
    }
}


/**
 * Manipula o submit do formulário de registro.
 */
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.message || 'Erro ao cadastrar.';
            return;
        }

        // Sucesso! Loga o usuário
        currentUser = data.user;
        saveCurrentUserToSession();
        updateNav();
        showToast('Cadastro realizado com sucesso!');
        showPage('page-home');

    } catch (err) {
        errorEl.textContent = 'Não foi possível conectar ao servidor.';
    }
}
        
/**
 * Manipula o submit do formulário de login.
 */
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.message || 'Erro ao fazer login.';
            return;
        }

        // Sucesso!
        currentUser = data.user;
        saveCurrentUserToSession();
        updateNav();
        
        if (currentUser.isAdmin) {
            showPage('page-admin');
        } else {
            showPage('page-home');
        }

    } catch (err) {
        errorEl.textContent = 'Não foi possível conectar ao servidor.';
    }
}
        
/**
 * Manipula o clique em "Sair".
 */
function handleLogout() {
    currentUser = null;
    saveCurrentUserToSession();
    updateNav();
    showPage('page-home');
}

/**
 * Manipula o clique no botão "Doar".
 * Redireciona para login se não estiver logado.
 */
function handleDonateClick() {
    if (currentUser) {
        showPage('page-donate');
    } else {
        showPage('page-login');
    }
}

// --- LÓGICA DE DOAÇÃO (com API) ---

function updateDonationAmountUI() {
    document.getElementById('donation-amount').textContent = `R$ ${currentDonationAmount.toFixed(2).replace('.', ',')}`;
}
        
function handleIncrementDonation() {
    currentDonationAmount += 1;
    updateDonationAmountUI();
}
        
function handleDecrementDonation() {
    if (currentDonationAmount > 1) {
        currentDonationAmount -= 1;
        updateDonationAmountUI();
    }
}
        
async function handleConfirmDonation() {
    // Atualiza o texto
    document.getElementById('payment-amount-text').textContent = `R$ ${currentDonationAmount.toFixed(2).replace('.', ',')}`;
    
    // Mostra a página de pagamento
    showPage('page-payment');
    
    // Pede ao backend para gerar um QR Code (simulado)
    try {
        const response = await fetch(`${API_URL}/donate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: currentDonationAmount,
                // Envia o usuário para o backend saber quem está doando
                username: currentUser.username 
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.message || 'Erro ao iniciar doação');
            showPage('page-donate');
            return;
        }
        
        // Simula a geração de um QR Code (atualizando o placeholder)
        const qrValue = data.qrCodeData; // O backend envia um texto de simulação
        document.getElementById('qr-code-img').src = `https://placehold.co/250x250/E2E8F0/333?text=${encodeURIComponent(qrValue)}`;

    } catch (err) {
        alert('Não foi possível conectar ao servidor.');
        showPage('page-donate');
    }
}
        
function handlePaymentComplete() {
    // No mundo real, o backend confirmaria o PIX via Webhook.
    // Aqui, apenas simulamos que o pagamento foi feito.
    // A doação já foi registrada no backend quando o QR Code foi gerado.
    
    showToast('Obrigado pela sua doação!');
    showPage('page-leaderboard');
}

// --- RENDERIZAÇÃO DE DADOS (com API) ---

/**
 * Renderiza a lista do leaderboard.
 */
async function renderLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = '<p class="text-center text-gray-500">Carregando...</p>';

    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        const sortedDonors = await response.json();

        if (!response.ok) {
            listEl.innerHTML = '<p class="text-center text-red-500">Não foi possível carregar o leaderboard.</p>';
            return;
        }

        if (sortedDonors.length === 0) {
            listEl.innerHTML = '<p class="text-center text-gray-500">Nenhuma doação registrada ainda.</p>';
            return;
        }

        listEl.innerHTML = ''; // Limpa a lista

        // Renderiza os itens
        sortedDonors.forEach(({ username, total_amount }, index) => {
            const rank = index + 1;
            let icon = '';
            if (rank === 1) icon = '🥇';
            else if (rank === 2) icon = '🥈';
            else if (rank === 3) icon = '🥉';

            const itemEl = document.createElement('div');
            itemEl.className = 'flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm';
            itemEl.innerHTML = `
                <div class="flex items-center">
                    <span class="text-lg font-bold w-8">${rank}.</span>
                    <span class="text-lg font-semibold text-gray-800">${username}</span>
                    <span class="ml-2 text-lg">${icon}</span>
                </div>
                <span class="text-xl font-bold text-blue-600">R$ ${total_amount.toFixed(2).replace('.', ',')}</span>
            `;
            listEl.appendChild(itemEl);
        });

    } catch (err) {
        listEl.innerHTML = '<p class="text-center text-red-500">Não foi possível conectar ao servidor.</p>';
    }
}
        
/**
 * Renderiza a lista de usuários no painel de admin.
 */
async function renderAdminUserList() {
    const tbodyEl = document.getElementById('admin-user-list');
    tbodyEl.innerHTML = ''; // Limpa a tabela

    // Apenas admins logados podem ver
    if (!currentUser || !currentUser.isAdmin) {
        showPage('page-login');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/users`);
        const users = await response.json();

        if (!response.ok) {
            alert(users.message || 'Não foi possível carregar usuários.');
            return;
        }

        users.forEach(user => {
            const rowEl = document.createElement('tr');
            rowEl.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${user.username}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-700">${user.email}</div>
                </td>
            `;
            tbodyEl.appendChild(rowEl);
        });

    } catch (err) {
        alert('Não foi possível conectar ao servidor.');
    }
}


// --- INICIALIZAÇÃO ---

// Roda quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Tenta carregar o usuário da sessão
    loadCurrentUserFromSession();
    
    // Atualiza a navegação com base no usuário logado
    updateNav();

    // Configura ícones
    feather.replace();

    // Adiciona listeners de evento
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Listeners de Doação
    document.getElementById('increment-donation').addEventListener('click', handleIncrementDonation);
    document.getElementById('decrement-donation').addEventListener('click', handleDecrementDonation);
    document.getElementById('confirm-donation').addEventListener('click', handleConfirmDonation);
    document.getElementById('payment-complete').addEventListener('click', handlePaymentComplete);
    
    // Mostra a home por padrão
    showPage('page-home');
});