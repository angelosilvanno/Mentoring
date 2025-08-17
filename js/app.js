document.addEventListener('DOMContentLoaded', function () {
    // --- CONSTANTES DE ELEMENTOS DO DOM ---
    const authWrapper = document.getElementById('auth-wrapper');
    const appWrapper = document.getElementById('app-wrapper');
    const loginContainer = document.getElementById('login-container');
    const registerSection = document.getElementById('cadastro-section');
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-cadastro');
    const showRegisterBtn = document.getElementById('btn-show-register-form');
    const showLoginBtn = document.getElementById('btn-show-login-form');
    const logoutBtn = document.getElementById('btn-logout');
    const views = document.querySelectorAll('.content-view');
    const sidebarUsername = document.getElementById('sidebar-username');
    const sidebarAvatar = document.getElementById('sidebar-avatar');
    const mentorsListContainer = document.getElementById('mentors-list-container');
    const searchMentorInput = document.getElementById('search-mentor-input');
    const userListUl = document.getElementById('users-list-ul');
    const navItems = {
        buscar: document.getElementById('nav-buscar-mentores'),
        agendamentos: document.getElementById('nav-agendamentos'),
        mensagens: document.getElementById('nav-mensagens'),
        forum: document.getElementById('nav-forum'),
        admin: document.getElementById('nav-admin'),
    };
    const editProfileBtn = document.getElementById('btn-edit-profile');
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    const editProfileForm = document.getElementById('form-edit-profile');
    const addUserBtn = document.getElementById('btn-add-user');
    const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
    const addUserForm = document.getElementById('form-add-user');
    const viewProfileModal = new bootstrap.Modal(document.getElementById('viewProfileModal'));
    const requestMentorshipBtn = document.getElementById('btn-request-mentorship');
    const sendMessageFromProfileBtn = document.getElementById('btn-send-message-from-profile');
    const composeMessageModal = new bootstrap.Modal(document.getElementById('composeMessageModal'));
    const composeMessageForm = document.getElementById('form-compose-message');
    const conversationsListUl = document.getElementById('conversations-list-ul');
    const viewConversationModal = new bootstrap.Modal(document.getElementById('viewConversationModal'));
    const replyMessageForm = document.getElementById('form-reply-message');
    const requestMentorshipModal = new bootstrap.Modal(document.getElementById('requestMentorshipModal'));
    const requestMentorshipForm = document.getElementById('form-request-mentorship');
    const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    const feedbackForm = document.getElementById('form-send-feedback');
    const feedbackStarsContainer = document.getElementById('feedback-stars');
    const createTopicBtn = document.getElementById('btn-create-topic');
    const createTopicModal = new bootstrap.Modal(document.getElementById('createTopicModal'));
    const createTopicForm = document.getElementById('form-create-topic');
    const viewTopicModal = new bootstrap.Modal(document.getElementById('viewTopicModal'));
    const replyTopicForm = document.getElementById('form-reply-topic');
    const popularTagsContainer = document.getElementById('popular-tags-container');
    const calendarContainer = document.getElementById('calendar-container');
    const mentorAppointmentView = document.getElementById('mentor-appointment-view');
    const editAppointmentModal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
    const editAppointmentForm = document.getElementById('form-edit-appointment');
    
    // --- COMPONENTES DE FEEDBACK ---
    const toastElement = document.getElementById('appToast');
    const appToast = new bootstrap.Toast(toastElement, { delay: 4000 });
    const confirmModalElement = document.getElementById('confirmModal');
    const appConfirmModal = new bootstrap.Modal(confirmModalElement);
    const infoModalElement = document.getElementById('infoModal');
    const appInfoModal = new bootstrap.Modal(infoModalElement);

    // --- CONFIGURAÇÃO DA API E ESTADO DA APLICAÇÃO ---
    const API_BASE_URL = 'http://localhost:3001';
    let users = [];
    let appointments = [];
    let messages = [];
    let forumTopics = [];
    let currentUser = null;
    let calendar = null;

    function setCurrentUser(user) { currentUser = user; sessionStorage.setItem('mentoring_currentUser', JSON.stringify(user)); }
    function clearCurrentUser() { currentUser = null; sessionStorage.removeItem('mentoring_currentUser'); }

    function showToast(message, type = 'info') {
        const toastBody = document.getElementById('toastBody');
        const toastTitle = document.getElementById('toastTitle');
        const toastIcon = document.getElementById('toastIcon');
        toastBody.textContent = message;
        toastIcon.classList.remove('text-success', 'text-danger', 'text-warning', 'text-info');
        toastElement.classList.remove('bg-success-subtle', 'bg-danger-subtle', 'bg-warning-subtle', 'bg-info-subtle');
        switch(type) {
            case 'success':
                toastTitle.textContent = 'Sucesso';
                toastIcon.className = 'bi bi-check-circle-fill text-success me-2';
                toastElement.classList.add('bg-success-subtle');
                break;
            case 'danger':
                toastTitle.textContent = 'Erro';
                toastIcon.className = 'bi bi-x-circle-fill text-danger me-2';
                toastElement.classList.add('bg-danger-subtle');
                break;
            case 'warning':
                toastTitle.textContent = 'Atenção';
                toastIcon.className = 'bi bi-exclamation-triangle-fill text-warning me-2';
                toastElement.classList.add('bg-warning-subtle');
                break;
            default:
                toastTitle.textContent = 'Informação';
                toastIcon.className = 'bi bi-info-circle-fill text-info me-2';
                toastElement.classList.add('bg-info-subtle');
        }
        appToast.show();
    }

    function showConfirm(title, body, onConfirm) {
        document.getElementById('confirmModalLabel').textContent = title;
        document.getElementById('confirmModalBody').textContent = body;
        const confirmBtn = document.getElementById('confirmModalConfirmBtn');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            appConfirmModal.hide();
        }, { once: true });
        appConfirmModal.show();
    }

    function showInfo(title, bodyContent) {
        document.getElementById('infoModalLabel').textContent = title;
        document.getElementById('infoModalBody').innerHTML = bodyContent;
        appInfoModal.show();
    }
    
    function getAvatarUrl(user) {
        if (!user || !user.email) return '';
        const seed = encodeURIComponent(user.email);
        if (user.gender === 'feminino') return `https://api.dicebear.com/8.x/personas/svg?seed=${seed}&face=variant1,variant2,variant3,variant4,variant5`;
        if (user.gender === 'masculino') return `https://api.dicebear.com/8.x/personas/svg?seed=${seed}&face=variant6,variant7,variant8,variant9,variant10`;
        return `https://api.dicebear.com/8.x/bottts/svg?seed=${seed}`;
    }

    function updateDashboardUI(user) {
        if (!user) return;
        sidebarUsername.textContent = user.name;
        sidebarAvatar.src = getAvatarUrl(user);
        Object.values(navItems).forEach(item => item.classList.add('d-none'));
        if (user.role === 'mentee' || user.role === 'mentor') {
            if (user.role === 'mentee') navItems.buscar.classList.remove('d-none');
            navItems.agendamentos.classList.remove('d-none');
            navItems.mensagens.classList.remove('d-none');
            navItems.forum.classList.remove('d-none');
            const initialView = user.role === 'mentee' ? 'buscar-mentores-section' : 'agendamento-section';
            switchView(initialView);
        } else if (user.role === 'admin') {
            navItems.admin.classList.remove('d-none');
            switchView('admin-panel');
        }
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido');
            }

            setCurrentUser(data);
            window.location.reload();

        } catch (error) {
            console.error("Erro no login:", error);
            showToast(error.message || 'Erro ao tentar fazer login. Verifique sua conexão.', 'danger');
        }
    }
    
    async function handlePublicRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());
        if (!userData.fullName || !userData.email || !userData.password || !userData.course || !userData.role || !userData.gender) {
            showToast("Por favor, preencha todos os campos obrigatórios.", "warning"); return;
        }

        try {
            const newUser = { 
                name: userData.fullName, 
                username: userData.username, 
                email: userData.email, 
                password: userData.password, 
                course: userData.course, 
                role: userData.role, 
                gender: userData.gender, 
                skills: [], 
                bio: '', 
                availability: '' 
            };
            
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Não foi possível criar o usuário.');
            }

            showToast('Cadastro realizado com sucesso! Faça o login.', 'success');
            showLoginFormView();
            registerForm.reset();
        } catch (error) {
            console.error("Erro no cadastro:", error);
            showToast(error.message || 'Ocorreu um erro ao realizar o cadastro.', 'danger');
        }
    }
    
    async function handleAdminAddUser(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());
        if (!userData.fullName || !userData.email || !userData.password || !userData.course || !userData.role || !userData.gender) {
            showToast("Por favor, preencha todos os campos.", "warning"); return;
        }

        try {
            const newUser = { 
                name: userData.fullName, 
                email: userData.email, 
                password: userData.password, 
                course: userData.course, 
                role: userData.role, 
                gender: userData.gender, 
                skills: userData.skills ? userData.skills.split(',').map(skill => skill.trim()).filter(Boolean) : [], 
                bio: '', 
                availability: '' 
            };
            
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Não foi possível adicionar o usuário.');
            }
            
            users.push(data); // Adiciona localmente para evitar nova requisição
            showToast(`Usuário ${newUser.name} criado com sucesso!`, 'success');
            addUserForm.reset();
            addUserModal.hide();
            renderAdminDashboard();
        } catch (error) {
            console.error("Erro ao adicionar usuário:", error);
            showToast(error.message || 'Ocorreu um erro ao adicionar o usuário.', 'danger');
        }
    }

    function buildMentorCard(mentor) {
        // Esta função não precisa mudar, pois já usa os dados carregados na variável 'appointments'
        const allRatings = appointments.filter(a => a.mentor_id === mentor.id && a.feedback && a.feedback.rating).map(a => a.feedback.rating);
        const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 0;
        const ratingHTML = averageRating > 0 ?
            `<div class="d-flex align-items-center justify-content-center small text-muted mb-2">
                <i class="bi bi-star-fill text-warning me-1"></i>
                <span>${averageRating} (${allRatings.length})</span>
            </div>` :
            '<div class="small text-muted mb-2">Ainda não avaliado</div>';

        const skillBadges = mentor.skills ? mentor.skills.slice(0, 2).map(skill => `<span class="badge rounded-pill text-bg-primary bg-opacity-75 me-1 mb-1">${skill}</span>`).join('') : '';
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="card mentor-card h-100 shadow-sm text-center">
                    <div class="card-body d-flex flex-column">
                        <img src="${getAvatarUrl(mentor)}" class="rounded-circle mb-3 mx-auto" style="width: 90px; height: 90px; object-fit: cover; background-color: #f0f0f0;" alt="Avatar de ${mentor.name}">
                        <h5 class="card-title mb-1">${mentor.name}</h5>
                        <p class="card-text text-muted small">${mentor.course}</p>
                        ${ratingHTML}
                        <div class="my-3 flex-grow-1">
                            ${skillBadges || '<p class="small text-muted">Nenhuma habilidade informada.</p>'}
                        </div>
                        <button class="btn btn-primary mt-auto btn-view-profile" data-id="${mentor.id}">Ver Perfil</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderRecommendedMentors() {
        // Não precisa mudar, pois já usa as variáveis globais
    }
    
    function renderFeaturedMentors() {
        // Não precisa mudar, pois já usa as variáveis globais
    }

    function renderMentorList(filter = '') {
        // Não precisa mudar, pois já usa as variáveis globais
    }

    function renderPopularTags() {
        // Não precisa mudar, pois já usa as variáveis globais
    }

    function renderDiscoveryPage() {
        // Não precisa mudar, pois já usa as variáveis globais
    }
    
    function renderAdminDashboard() {
        // Não precisa mudar, pois já usa as variáveis globais
    }

    function renderUserListForAdmin() {
        // Não precisa mudar, pois já usa as variáveis globais
    }

    async function handleDeleteUser(userId) {
        // Implementação com fetch
    }

    async function handleProfileUpdate(e) {
        // Implementação com fetch
    }

    function showMentorProfile(mentorId) {
        // Não precisa mudar, pois já usa as variáveis globais
    }

    async function handleRequestMentorshipSubmit(e) {
        // Implementação com fetch
    }

    function renderAppointments() {
        // Não precisa mudar, pois já usa as variáveis globais
    }
    
    function buildAppointmentCard(appointment) {
        // Não precisa mudar, pois já usa as variáveis globais
    }

    async function handleAppointmentAction(action, id) {
        // Implementação com fetch
    }
    
    async function handleUpdateAppointment(e) {
        // Implementação com fetch
    }

    async function handleFeedbackSubmit(e) {
        // Implementação com fetch
    }

    function renderConversations() {
        // Lógica de renderização de conversas (a ser implementada com API)
    }

    function openConversationThread(otherUserId) {
        // Lógica para abrir thread de conversa (a ser implementada com API)
    }

    async function handleSendMessage(e) {
        // Implementação com fetch
    }

    async function handleReplyMessage(e) {
        // Implementação com fetch
    }

    function renderForumTopics() {
        // Lógica de renderização do fórum (a ser implementada com API)
    }

    async function handleCreateTopic(e) {
        // Implementação com fetch
    }

    function openTopic(topicId) {
        // Lógica para abrir tópico (a ser implementada com API)
    }

    async function handleReplyToTopic(e) {
        // Implementação com fetch
    }
    
    function showLoginFormView() {
        registerSection.classList.add('d-none');
        loginContainer.classList.remove('d-none');
    }

    function showRegisterFormView() {
        document.getElementById('admin-register-option').hidden = false;
        loginContainer.classList.add('d-none');
        registerSection.classList.remove('d-none');
    }

    function switchView(targetViewId) {
        if (!targetViewId) return;
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-view="${targetViewId}"]`);
        if (activeLink) activeLink.classList.add('active');
        views.forEach(view => view.classList.toggle('d-none', view.id !== targetViewId));
        
        if (targetViewId === 'agendamento-section') {
            if (currentUser.role === 'mentee') {
                mentorAppointmentView.classList.add('d-none');
                calendarContainer.classList.remove('d-none');
            } else {
                mentorAppointmentView.classList.remove('d-none');
                calendarContainer.classList.add('d-none');
            }
            renderAppointments();
        } else if (targetViewId === 'admin-panel') {
            renderAdminDashboard();
        } else if (targetViewId === 'mensagem-section') {
            renderConversations();
        } else if (targetViewId === 'forum-section') {
            renderForumTopics();
        } else if (targetViewId === 'buscar-mentores-section') {
            renderDiscoveryPage();
        }
    }

    function formatAppointmentsForCalendar(myAppointments) {
        // Não precisa mudar
    }

    function initCalendar() {
        // Não precisa mudar
    }

    function initializeAppUI() {
        if (currentUser) {
            authWrapper.classList.add('d-none');
            appWrapper.classList.remove('d-none');
            appWrapper.classList.add('d-flex');
            updateDashboardUI(currentUser);
        } else {
            authWrapper.classList.remove('d-none');
            appWrapper.classList.add('d-none');
        }
    }

    async function loadInitialData() {
        if (!currentUser) return initializeAppUI();
        try {
            const [usersRes, appointmentsRes, messagesRes, forumTopicsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/users`),
                fetch(`${API_BASE_URL}/appointments`),
                fetch(`${API_BASE_URL}/messages`),
                fetch(`${API_BASE_URL}/forumTopics`)
            ]);

            if (!usersRes.ok || !appointmentsRes.ok || !messagesRes.ok || !forumTopicsRes.ok) {
                throw new Error('Falha ao buscar dados essenciais da aplicação.');
            }

            users = await usersRes.json();
            appointments = await appointmentsRes.json();
            messages = await messagesRes.json();
            forumTopics = await forumTopicsRes.json();

            initializeAppUI();

        } catch (error) {
            console.error("Falha ao carregar dados da API:", error);
            showToast("Não foi possível conectar ao servidor. Verifique se o backend está rodando e tente recarregar a página.", "danger");
        }
    }

    function init() {
        currentUser = JSON.parse(sessionStorage.getItem('mentoring_currentUser'));
        loadInitialData(); // Sempre carrega os dados, a UI decidirá o que mostrar
    }

    // --- EVENT LISTENERS ---
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handlePublicRegister);
    addUserForm.addEventListener('submit', handleAdminAddUser);
    logoutBtn.addEventListener('click', () => { clearCurrentUser(); window.location.reload(); });
    showRegisterBtn.addEventListener('click', showRegisterFormView);
    showLoginBtn.addEventListener('click', showLoginFormView);
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); switchView(link.dataset.view); });
    });
    searchMentorInput.addEventListener('input', (e) => renderMentorList(e.target.value));
    editProfileBtn.addEventListener('click', () => {
        document.getElementById('edit-name').value = currentUser.name;
        document.getElementById('edit-bio').value = currentUser.bio || '';
        document.getElementById('edit-skills').value = currentUser.skills ? currentUser.skills.join(', ') : '';
        document.getElementById('edit-availability').value = currentUser.availability || '';
        const mentorOnlyFields = document.querySelectorAll('#edit-bio, #edit-availability');
        mentorOnlyFields.forEach(field => field.closest('.mb-3').hidden = currentUser.role !== 'mentor');
        editProfileModal.show();
    });
    editProfileForm.addEventListener('submit', handleProfileUpdate);
    addUserBtn.addEventListener('click', () => addUserModal.show());
    userListUl.addEventListener('click', (e) => { if (e.target.classList.contains('btn-delete-user')) handleDeleteUser(parseInt(e.target.dataset.id)); });
    
    document.getElementById('buscar-mentores-section').addEventListener('click', (e) => {
        const viewProfileBtn = e.target.closest('.btn-view-profile');
        if (viewProfileBtn) {
            showMentorProfile(parseInt(viewProfileBtn.dataset.id));
        }
    });
    
    requestMentorshipBtn.addEventListener('click', (e) => {
        document.getElementById('mentorship-mentor-id').value = parseInt(e.target.dataset.mentorId);
        viewProfileModal.hide();
        requestMentorshipModal.show();
    });
    requestMentorshipForm.addEventListener('submit', handleRequestMentorshipSubmit);
    sendMessageFromProfileBtn.addEventListener('click', (e) => {
        const mentor = users.find(u => u.id === parseInt(e.target.dataset.mentorId));
        if(!mentor) return;
        document.getElementById('message-recipient-id').value = mentor.id;
        document.getElementById('message-recipient-name').value = mentor.name;
        viewProfileModal.hide();
        composeMessageModal.show();
    });
    composeMessageForm.addEventListener('submit', handleSendMessage);
    conversationsListUl.addEventListener('click', (e) => { const item = e.target.closest('[data-conversation-with]'); if(item) openConversationThread(parseInt(item.dataset.conversationWith)); });
    replyMessageForm.addEventListener('submit', handleReplyMessage);
    
    document.getElementById('agendamento-card-body').addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (target) {
            const action = target.dataset.action;
            const id = parseInt(target.dataset.id);
            if (action === 'avaliar') {
                const appointment = appointments.find(a => a.id === id);
                const mentor = users.find(u => u.id === appointment.mentor_id);
                document.getElementById('feedback-appointment-id').value = id;
                document.getElementById('feedback-mentor-name').textContent = mentor.name;
                feedbackStarsContainer.dataset.rating = 0;
                feedbackStarsContainer.innerHTML = '<i class="bi bi-star text-secondary"></i><i class="bi bi-star text-secondary"></i><i class="bi bi-star text-secondary"></i><i class="bi bi-star text-secondary"></i><i class="bi bi-star text-secondary"></i>';
                feedbackForm.reset();
                feedbackModal.show();
            } else { 
                handleAppointmentAction(action, id); 
            }
        }
    });

    editAppointmentForm.addEventListener('submit', handleUpdateAppointment);

    feedbackStarsContainer.addEventListener('mouseover', (e) => {
        if (e.target.tagName !== 'I') return;
        const rating = Array.from(feedbackStarsContainer.children).indexOf(e.target) + 1;
        for (let i = 0; i < 5; i++) {
            feedbackStarsContainer.children[i].className = i < rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary';
        }
    });
    feedbackStarsContainer.addEventListener('mouseout', () => {
        const currentRating = parseInt(feedbackStarsContainer.dataset.rating || '0');
        for (let i = 0; i < 5; i++) {
            feedbackStarsContainer.children[i].className = i < currentRating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary';
        }
    });
    feedbackStarsContainer.addEventListener('click', (e) => {
        if (e.target.tagName !== 'I') return;
        const rating = Array.from(feedbackStarsContainer.children).indexOf(e.target) + 1;
        feedbackStarsContainer.dataset.rating = rating;
    });
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    createTopicBtn.addEventListener('click', () => createTopicModal.show());
    createTopicForm.addEventListener('submit', handleCreateTopic);
    document.querySelector('#forum-card-body .list-group').addEventListener('click', (e) => {
        const topicLink = e.target.closest('[data-topic-id]');
        if (topicLink) { e.preventDefault(); openTopic(parseInt(topicLink.dataset.topicId)); }
    });
    replyTopicForm.addEventListener('submit', handleReplyToTopic);
    
    init();
});