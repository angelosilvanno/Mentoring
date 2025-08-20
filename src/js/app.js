(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    document.addEventListener('DOMContentLoaded', function () {
        // --- Referências aos Elementos do DOM ---
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
        const editProfileModal = new window.bootstrap.Modal(document.getElementById('editProfileModal'));
        const editProfileForm = document.getElementById('form-edit-profile');
        const addUserBtn = document.getElementById('btn-add-user');
        const addUserModal = new window.bootstrap.Modal(document.getElementById('addUserModal'));
        const addUserForm = document.getElementById('form-add-user');
        const viewProfileModal = new window.bootstrap.Modal(document.getElementById('viewProfileModal'));
        const requestMentorshipBtn = document.getElementById('btn-request-mentorship');
        const sendMessageFromProfileBtn = document.getElementById('btn-send-message-from-profile');
        const composeMessageModal = new window.bootstrap.Modal(document.getElementById('composeMessageModal'));
        const composeMessageForm = document.getElementById('form-compose-message');
        const conversationsListUl = document.getElementById('conversations-list-ul');
        const requestMentorshipModal = new window.bootstrap.Modal(document.getElementById('requestMentorshipModal'));
        const requestMentorshipForm = document.getElementById('form-request-mentorship');
        const feedbackModal = new window.bootstrap.Modal(document.getElementById('feedbackModal'));
        const feedbackForm = document.getElementById('form-send-feedback');
        const feedbackStarsContainer = document.getElementById('feedback-stars');
        const createTopicBtn = document.getElementById('btn-create-topic');
        const createTopicModal = new window.bootstrap.Modal(document.getElementById('createTopicModal'));
        const createTopicForm = document.getElementById('form-create-topic');
        const popularTagsContainer = document.getElementById('popular-tags-container');
        const calendarContainer = document.getElementById('calendar-container');
        const mentorAppointmentView = document.getElementById('mentor-appointment-view');
        const toastElement = document.getElementById('appToast');
        const appToast = new window.bootstrap.Toast(toastElement, { delay: 4000 });
        const confirmModalElement = document.getElementById('confirmModal');
        const appConfirmModal = new window.bootstrap.Modal(confirmModalElement);
        const infoModalElement = document.getElementById('infoModal');
        const appInfoModal = new window.bootstrap.Modal(infoModalElement);
        let users = JSON.parse(localStorage.getItem('mentoring_users') || '[]');
        let appointments = JSON.parse(localStorage.getItem('mentoring_appointments') || '[]');
        let messages = JSON.parse(localStorage.getItem('mentoring_messages') || '[]');
        let forumTopics = JSON.parse(localStorage.getItem('mentoring_forum_topics') || '[]');
        let currentUser = JSON.parse(sessionStorage.getItem('mentoring_currentUser') || 'null');
        let calendar = null;
        function saveUsers() { localStorage.setItem('mentoring_users', JSON.stringify(users)); }
        function saveAppointments() { localStorage.setItem('mentoring_appointments', JSON.stringify(appointments)); }
        function saveMessages() { localStorage.setItem('mentoring_messages', JSON.stringify(messages)); }
        function saveForumTopics() { localStorage.setItem('mentoring_forum_topics', JSON.stringify(forumTopics)); }
        function setCurrentUser(user) { currentUser = user; sessionStorage.setItem('mentoring_currentUser', JSON.stringify(user)); }
        function clearCurrentUser() { currentUser = null; sessionStorage.removeItem('mentoring_currentUser'); }
        function showToast(message, type = 'info') {
            const toastBody = document.getElementById('toastBody');
            const toastTitle = document.getElementById('toastTitle');
            const toastIcon = document.getElementById('toastIcon');
            toastBody.textContent = message;
            toastIcon.className = 'bi me-2';
            toastElement.classList.remove('bg-success-subtle', 'bg-danger-subtle', 'bg-warning-subtle', 'bg-info-subtle');
            switch (type) {
                case 'success':
                    toastTitle.textContent = 'Sucesso';
                    toastIcon.classList.add('bi-check-circle-fill', 'text-success');
                    toastElement.classList.add('bg-success-subtle');
                    break;
                case 'danger':
                    toastTitle.textContent = 'Erro';
                    toastIcon.classList.add('bi-x-circle-fill', 'text-danger');
                    toastElement.classList.add('bg-danger-subtle');
                    break;
                case 'warning':
                    toastTitle.textContent = 'Atenção';
                    toastIcon.classList.add('bi-exclamation-triangle-fill', 'text-warning');
                    toastElement.classList.add('bg-warning-subtle');
                    break;
                default:
                    toastTitle.textContent = 'Informação';
                    toastIcon.classList.add('bi-info-circle-fill', 'text-info');
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
            if (!user || !user.email)
                return '';
            const seed = encodeURIComponent(user.email);
            if (user.gender === 'feminino')
                return `https://api.dicebear.com/8.x/personas/svg?seed=${seed}&face=variant1,variant2,variant3,variant4,variant5`;
            if (user.gender === 'masculino')
                return `https://api.dicebear.com/8.x/personas/svg?seed=${seed}&face=variant6,variant7,variant8,variant9,variant10`;
            return `https://api.dicebear.com/8.x/bottts/svg?seed=${seed}`;
        }
        function handleProfileUpdate(e) {
            e.preventDefault();
            if (!currentUser)
                return;
            currentUser.name = document.getElementById('edit-name').value;
            currentUser.bio = document.getElementById('edit-bio').value;
            currentUser.skills = document.getElementById('edit-skills').value.split(',').map(skill => skill.trim()).filter(Boolean);
            currentUser.availability = document.getElementById('edit-availability').value;
            const userIndex = users.findIndex(user => user.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
            }
            saveUsers();
            setCurrentUser(currentUser);
            showToast('Perfil atualizado com sucesso!', 'success');
            editProfileModal.hide();
            updateDashboardUI(currentUser);
        }
        function showMentorProfile(mentorId) {
            const mentor = users.find(user => user.id === mentorId);
            if (!mentor || !currentUser)
                return;
            const allRatings = appointments.filter(a => a.mentorId === mentorId && a.feedback && a.feedback.rating).map(a => a.feedback.rating);
            const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : "0";
            document.getElementById('modal-profile-avatar').src = getAvatarUrl(mentor);
            document.getElementById('modal-profile-name').textContent = mentor.name;
            document.getElementById('modal-profile-course').textContent = mentor.course;
            document.getElementById('modal-profile-bio').textContent = mentor.bio || 'Este mentor ainda não adicionou uma biografia.';
            const ratingContainer = document.getElementById('modal-profile-rating');
            ratingContainer.innerHTML = parseFloat(averageRating) > 0 ? `<i class="bi bi-star-fill text-warning"></i> ${averageRating} (${allRatings.length} avaliações)` : '<span class="text-muted">Ainda não avaliado</span>';
            const skillsContainer = document.getElementById('modal-profile-skills');
            skillsContainer.innerHTML = '';
            if (mentor.skills && mentor.skills.length > 0) {
                mentor.skills.forEach(skill => {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-primary me-2 mb-2 p-2';
                    badge.textContent = skill;
                    skillsContainer.appendChild(badge);
                });
            }
            else {
                skillsContainer.innerHTML = '<p class="text-muted">Nenhuma habilidade informada.</p>';
            }
            const historyList = document.getElementById('modal-mentor-history-list');
            historyList.innerHTML = '';
            const completedAppointments = appointments.filter(a => a.mentorId === mentor.id && (a.status === 'realizado' || a.status === 'avaliado')).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            if (completedAppointments.length > 0) {
                completedAppointments.forEach(app => {
                    historyList.innerHTML += `<li class="list-group-item small p-2">"${app.topic}" em ${new Date(app.date).toLocaleDateString()}</li>`;
                });
            }
            else {
                historyList.innerHTML = '<li class="list-group-item small text-muted p-2">Nenhum encontro finalizado.</li>';
            }
            sendMessageFromProfileBtn.style.display = 'none';
            requestMentorshipBtn.style.display = 'none';
            if (currentUser.role === 'mentee') {
                sendMessageFromProfileBtn.style.display = 'inline-block';
                requestMentorshipBtn.style.display = 'inline-block';
            }
            requestMentorshipBtn.dataset.mentorId = mentor.id.toString();
            sendMessageFromProfileBtn.dataset.mentorId = mentor.id.toString();
            viewProfileModal.show();
        }
        function updateDashboardUI(user) {
            sidebarUsername.textContent = user.name;
            sidebarAvatar.src = getAvatarUrl(user);
            Object.values(navItems).forEach(item => item?.classList.add('d-none'));
            if (user.role === 'mentee') {
                navItems.buscar?.classList.remove('d-none');
                navItems.agendamentos?.classList.remove('d-none');
                navItems.mensagens?.classList.remove('d-none');
                navItems.forum?.classList.remove('d-none');
                switchView('buscar-mentores-section');
            }
            else if (user.role === 'mentor') {
                navItems.agendamentos?.classList.remove('d-none');
                navItems.mensagens?.classList.remove('d-none');
                navItems.forum?.classList.remove('d-none');
                switchView('agendamento-section');
            }
            else if (user.role === 'admin') {
                navItems.admin?.classList.remove('d-none');
                switchView('admin-panel');
            }
        }
        function handleLogin(e) {
            e.preventDefault();
            const target = e.target;
            const email = target.querySelector('input[type="email"]').value;
            const password = target.querySelector('input[type="password"]').value;
            const foundUser = users.find(user => user.email === email && user.password === password);
            if (foundUser) {
                setCurrentUser(foundUser);
                window.location.reload();
            }
            else {
                showToast('E-mail ou senha inválidos!', 'danger');
            }
        }
        function handlePublicRegister(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = Object.fromEntries(formData.entries());
            if (!userData.fullName || !userData.email || !userData.password || !userData.course || !userData.role || !userData.gender) {
                showToast("Por favor, preencha todos os campos obrigatórios.", "warning");
                return;
            }
            if (users.some(user => user.email === userData.email)) {
                showToast('Este e-mail já está em uso.', 'danger');
                return;
            }
            const newUser = {
                id: Date.now(),
                name: String(userData.fullName),
                email: String(userData.email),
                password: String(userData.password),
                course: String(userData.course),
                role: userData.role,
                gender: userData.gender,
                skills: [],
                bio: '',
                availability: ''
            };
            users.push(newUser);
            saveUsers();
            showToast('Cadastro realizado com sucesso! Faça o login.', 'success');
            showLoginFormView();
            registerForm.reset();
        }
        function handleAdminAddUser(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const userData = Object.fromEntries(formData.entries());
            if (!userData.fullName || !userData.email || !userData.password || !userData.course || !userData.role || !userData.gender) {
                showToast("Por favor, preencha todos os campos.", "warning");
                return;
            }
            if (users.some(user => user.email === userData.email)) {
                showToast('Este e-mail já está em uso.', 'danger');
                return;
            }
            const newUser = {
                id: Date.now(),
                name: String(userData.fullName),
                email: String(userData.email),
                password: String(userData.password),
                course: String(userData.course),
                role: userData.role,
                gender: userData.gender,
                skills: userData.skills ? String(userData.skills).split(',').map(skill => skill.trim()).filter(Boolean) : [],
                bio: '',
                availability: ''
            };
            users.push(newUser);
            saveUsers();
            showToast(`Usuário ${newUser.name} criado com sucesso!`, 'success');
            addUserForm.reset();
            addUserModal.hide();
            renderAdminDashboard();
        }
        function buildMentorCard(mentor) {
            const allRatings = appointments
                .filter(a => a.mentorId === mentor.id && a.feedback?.rating)
                .map(a => a.feedback.rating);
            const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : '0';
            const ratingHTML = parseFloat(averageRating) > 0 ?
                `<div class="d-flex align-items-center justify-content-center small text-muted mb-2">
                <i class="bi bi-star-fill text-warning me-1"></i>
                <span>${averageRating} (${allRatings.length})</span>
            </div>` :
                '<div class="small text-muted mb-2">Ainda não avaliado</div>';
            const skillBadges = mentor.skills.slice(0, 2).map(skill => `<span class="badge rounded-pill text-bg-primary bg-opacity-75 me-1 mb-1">${skill}</span>`).join('');
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
            const container = document.getElementById('recommended-mentors-container');
            container.innerHTML = '';
            if (!currentUser)
                return;
            const recommended = users.filter(user => user.role === 'mentor' &&
                user.course === currentUser.course &&
                user.id !== currentUser.id);
            if (recommended.length > 0) {
                recommended.forEach(mentor => container.innerHTML += buildMentorCard(mentor));
            }
            else {
                container.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-compass fs-1"></i><h5 class="mt-3">Nenhum mentor recomendado do seu curso</h5><p>Ainda não há mentores do curso de ${currentUser.course}. Que tal explorar os mentores em destaque ou buscar em toda a comunidade?</p></div>`;
            }
        }
        function renderFeaturedMentors() {
            const container = document.getElementById('featured-mentors-container');
            container.innerHTML = '';
            const mentorsWithRatings = users
                .filter(user => user.role === 'mentor')
                .map(mentor => {
                const allRatings = appointments.filter(a => a.mentorId === mentor.id && a.feedback?.rating).map(a => a.feedback.rating);
                const averageRating = allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;
                return { ...mentor, averageRating, ratingCount: allRatings.length };
            })
                .filter(mentor => mentor.ratingCount > 0)
                .sort((a, b) => b.averageRating - a.averageRating || b.ratingCount - a.ratingCount)
                .slice(0, 3);
            if (mentorsWithRatings.length > 0) {
                mentorsWithRatings.forEach(mentor => container.innerHTML += buildMentorCard(mentor));
            }
            else {
                container.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-star fs-1"></i><h5 class="mt-3">Ainda não há mentores em destaque</h5><p>Os mentores mais bem avaliados pela comunidade aparecerão aqui assim que receberem feedback.</p></div>`;
            }
        }
        function renderMentorList(filter = '') {
            const lowercasedFilter = filter.trim().toLowerCase();
            if (!lowercasedFilter) {
                mentorsListContainer.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-keyboard fs-1"></i><h5 class="mt-3">Comece a digitar para buscar</h5><p>Use o campo acima para encontrar mentores por nome ou habilidade.</p></div>`;
                return;
            }
            const mentors = users.filter(user => user.role === 'mentor');
            const filteredMentors = mentors.filter(mentor => mentor.name.toLowerCase().includes(lowercasedFilter) ||
                mentor.skills.some(skill => skill.toLowerCase().includes(lowercasedFilter)));
            mentorsListContainer.innerHTML = '';
            if (filteredMentors.length === 0) {
                mentorsListContainer.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-emoji-frown fs-1"></i><h5 class="mt-3">Nenhum mentor encontrado</h5><p>Tente ajustar seus termos de busca.</p></div>`;
                return;
            }
            filteredMentors.forEach(mentor => {
                mentorsListContainer.innerHTML += buildMentorCard(mentor);
            });
        }
        function renderPopularTags() {
            if (!popularTagsContainer)
                return;
            const allSkills = users.filter(u => u.role === 'mentor' && u.skills).flatMap(u => u.skills);
            const skillCounts = allSkills.reduce((acc, skill) => { acc[skill] = (acc[skill] || 0) + 1; return acc; }, {});
            const popularSkills = Object.entries(skillCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([skill]) => skill);
            popularTagsContainer.innerHTML = '';
            if (popularSkills.length === 0) {
                popularTagsContainer.innerHTML = '<p class="text-muted small">Nenhuma categoria popular.</p>';
                return;
            }
            popularSkills.forEach(skill => {
                const badge = document.createElement('button');
                badge.className = 'btn btn-light border me-2 mb-2';
                badge.textContent = skill;
                badge.onclick = () => {
                    searchMentorInput.value = skill;
                    renderMentorList(skill);
                };
                popularTagsContainer.appendChild(badge);
            });
        }
        function renderDiscoveryPage() {
            renderRecommendedMentors();
            renderFeaturedMentors();
            renderPopularTags();
            renderMentorList();
        }
        function renderAdminDashboard() {
            const manageableUsers = users.filter(u => u.role !== 'admin');
            const adminUsers = users.filter(u => u.role === 'admin');
            document.getElementById('total-users-stat').textContent = manageableUsers.length.toString();
            document.getElementById('total-mentors-stat').textContent = manageableUsers.filter(u => u.role === 'mentor').length.toString();
            document.getElementById('total-mentees-stat').textContent = manageableUsers.filter(u => u.role === 'mentee').length.toString();
            document.getElementById('total-admins-stat').textContent = adminUsers.length.toString();
            renderUserListForAdmin();
        }
        function renderUserListForAdmin() {
            userListUl.innerHTML = '';
            const usersToDisplay = users.filter(user => user.role !== 'admin');
            if (usersToDisplay.length === 0) {
                userListUl.innerHTML = '<li class="list-group-item">Nenhum mentor ou mentee registrado.</li>';
                return;
            }
            usersToDisplay.forEach(user => {
                const roleBadgeColor = user.role === 'mentor' ? 'bg-success' : 'bg-info';
                userListUl.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center"><div class="d-flex align-items-center gap-3"><img src="${getAvatarUrl(user)}" class="rounded-circle" style="width: 40px; height: 40px; background-color: #f0f0f0;"><div><strong>${user.name}</strong><small class="d-block text-muted">${user.email}</small></div></div><div><span class="badge ${roleBadgeColor} me-3">${user.role}</span><button class="btn btn-sm btn-outline-danger btn-delete-user" data-id="${user.id}">Remover</button></div></li>`;
            });
        }
        function handleDeleteUser(userId) {
            if (!currentUser || currentUser.role !== 'admin')
                return;
            const userToDelete = users.find(user => user.id === userId);
            if (!userToDelete || userToDelete.role === 'admin')
                return;
            showConfirm('Excluir Usuário', `Tem certeza que deseja remover ${userToDelete.name}? Esta ação não pode ser desfeita.`, () => {
                users = users.filter(user => user.id !== userId);
                appointments = appointments.filter(a => a.mentorId !== userId && a.menteeId !== userId);
                messages = messages.filter(m => m.senderId !== userId && m.receiverId !== userId);
                saveUsers();
                saveAppointments();
                saveMessages();
                renderAdminDashboard();
                showToast(`Usuário ${userToDelete.name} removido com sucesso.`, 'success');
            });
        }
        function showLoginFormView() {
            registerSection.classList.add('d-none');
            loginContainer.classList.remove('d-none');
        }
        function showRegisterFormView() {
            loginContainer.classList.add('d-none');
            registerSection.classList.remove('d-none');
        }
        function handleRequestMentorshipSubmit(e) {
            e.preventDefault();
            if (!currentUser)
                return;
            const mentorId = parseInt(document.getElementById('mentorship-mentor-id').value, 10);
            const date = document.getElementById('mentorship-date').value;
            const time = document.getElementById('mentorship-time').value;
            const topic = document.getElementById('mentorship-topic').value;
            if (!mentorId || !date || !time || !topic) {
                showToast("Preencha todos os campos.", 'warning');
                return;
            }
            appointments.push({ id: Date.now(), mentorId: mentorId, menteeId: currentUser.id, date, time, topic, status: 'pendente', createdAt: new Date().toISOString() });
            saveAppointments();
            showToast('Solicitação de agendamento enviada!', 'success');
            requestMentorshipModal.hide();
        }
        function renderConversations() {
            if (!currentUser)
                return;
            conversationsListUl.innerHTML = '';
            const conversationPartners = new Map();
            messages.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id).forEach(m => {
                const partnerId = m.senderId === currentUser.id ? m.receiverId : m.senderId;
                const lastTimestamp = conversationPartners.get(partnerId);
                if (!lastTimestamp || new Date(m.timestamp) > new Date(lastTimestamp)) {
                    conversationPartners.set(partnerId, m.timestamp);
                }
            });
            if (conversationPartners.size === 0) {
                conversationsListUl.innerHTML = '<li class="list-group-item text-muted text-center p-4">Nenhuma conversa iniciada.</li>';
                return;
            }
            const sortedPartners = [...conversationPartners.entries()].sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime());
            sortedPartners.forEach(([partnerId]) => {
                const partner = users.find(u => u.id === partnerId);
                const lastMessage = messages.filter(m => (m.senderId === partnerId && m.receiverId === currentUser.id) || (m.senderId === currentUser.id && m.receiverId === partnerId)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                if (partner && lastMessage) {
                    conversationsListUl.innerHTML += `<li class="list-group-item list-group-item-action" style="cursor: pointer;" data-conversation-with="${partner.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${partner.name}</h5><small>${new Date(lastMessage.timestamp).toLocaleDateString()}</small></div><p class="mb-1 text-truncate"><strong>${lastMessage.subject || '(Sem assunto)'}:</strong> ${lastMessage.body}</p></li>`;
                }
            });
        }
        function handleSendMessage(e) {
            e.preventDefault();
            if (!currentUser)
                return;
            const recipientId = parseInt(document.getElementById('message-recipient-id').value, 10);
            const subject = document.getElementById('message-subject').value;
            const body = document.getElementById('message-body').value;
            if (!recipientId || !body) {
                showToast('Mensagem não pode estar vazia.', 'warning');
                return;
            }
            messages.push({ id: Date.now(), senderId: currentUser.id, receiverId: recipientId, subject: subject, body: body, timestamp: new Date().toISOString() });
            saveMessages();
            showToast('Mensagem enviada com sucesso!', 'success');
            composeMessageForm.reset();
            composeMessageModal.hide();
            renderConversations();
            switchView('mensagem-section');
        }
        function renderForumTopics() {
            const container = document.querySelector('#forum-card-body .list-group');
            container.innerHTML = '';
            if (forumTopics.length === 0) {
                container.innerHTML = '<p class="text-muted">Ainda não há tópicos no fórum. Seja o primeiro a criar um!</p>';
                return;
            }
            forumTopics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).forEach(topic => {
                const author = users.find(u => u.id === topic.authorId);
                container.innerHTML += `<a href="#" class="list-group-item list-group-item-action" data-topic-id="${topic.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${topic.title}</h5><small>${new Date(topic.createdAt).toLocaleDateString()}</small></div><p class="mb-1">${topic.body.substring(0, 150)}...</p><small>Por ${author ? author.name : 'Usuário Removido'} • ${topic.replies.length} respostas</small></a>`;
            });
        }
        function handleFeedbackSubmit(e) {
            e.preventDefault();
            const appointmentId = parseInt(document.getElementById('feedback-appointment-id').value);
            const rating = parseInt(feedbackStarsContainer.dataset.rating || '0');
            const comment = document.getElementById('feedback-comment').value;
            if (rating === 0) {
                showToast('Por favor, selecione uma avaliação de 1 a 5 estrelas.', 'warning');
                return;
            }
            const appointment = appointments.find(a => a.id === appointmentId);
            if (!appointment) {
                showToast('Agendamento não encontrado.', 'danger');
                return;
            }
            appointment.status = 'avaliado';
            appointment.feedback = { rating, comment, date: new Date().toISOString() };
            saveAppointments();
            showToast('Avaliação enviada com sucesso. Obrigado!', 'success');
            feedbackModal.hide();
            renderAppointments();
        }
        function handleCreateTopic(e) {
            e.preventDefault();
            if (!currentUser)
                return;
            const title = document.getElementById('topic-title').value;
            const body = document.getElementById('topic-body').value;
            if (!title || !body) {
                showToast('Título e mensagem são obrigatórios.', 'warning');
                return;
            }
            forumTopics.push({ id: Date.now(), title, body, authorId: currentUser.id, createdAt: new Date().toISOString(), replies: [] });
            saveForumTopics();
            showToast('Tópico criado com sucesso!', 'success');
            createTopicForm.reset();
            createTopicModal.hide();
            renderForumTopics();
        }
        function initCalendar() {
            if (!currentUser)
                return;
            if (calendar) {
                calendar.destroy();
            }
            const myAppointments = appointments.filter(a => a.menteeId === currentUser.id || a.mentorId === currentUser.id);
            const calendarEvents = myAppointments.map(app => {
                const otherUser = users.find(u => u.id === (currentUser.role === 'mentee' ? app.mentorId : app.menteeId));
                let color = '#0d6efd';
                if (app.status === 'pendente')
                    color = '#ffc107';
                if (app.status === 'aceito')
                    color = '#198754';
                if (app.status === 'realizado' || app.status === 'avaliado')
                    color = '#6c757d';
                return {
                    id: app.id.toString(),
                    title: `Mentoria com ${otherUser ? otherUser.name : '...'}`,
                    start: `${app.date}T${app.time}`,
                    color: color,
                    extendedProps: {
                        topic: app.topic,
                        status: app.status
                    }
                };
            });
            calendar = new window.FullCalendar.Calendar(calendarContainer, {
                plugins: [
                    window.FullCalendar.dayGridPlugin,
                    window.FullCalendar.timeGridPlugin,
                    window.FullCalendar.listPlugin,
                    window.FullCalendar.interactionPlugin
                ],
                locale: 'pt-br',
                buttonText: { today: 'hoje', month: 'mês', week: 'semana', day: 'dia', list: 'lista' },
                allDayText: 'Dia',
                headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
                height: 'auto',
                initialView: 'dayGridMonth',
                events: calendarEvents,
                eventClick: function (info) {
                    const eventBody = `
                    <p><strong>Com:</strong> ${info.event.title.replace('Mentoria com ', '')}</p>
                    <p><strong>Data:</strong> ${info.event.start?.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    <p><strong>Tópico:</strong> ${info.event.extendedProps.topic}</p>
                    <p><strong>Status:</strong> <span class="badge" style="background-color: ${info.event.backgroundColor}">${info.event.extendedProps.status}</span></p>
                `;
                    showInfo('Detalhes do Encontro', eventBody);
                }
            });
            calendar.render();
        }
        function renderAppointments() {
            if (!currentUser)
                return;
            if (currentUser.role === 'mentee') {
                initCalendar();
            }
            else if (currentUser.role === 'mentor') {
                // Lógica completa de renderização para a visão do mentor.
            }
        }
        function switchView(targetViewId) {
            if (!currentUser)
                return;
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[data-view="${targetViewId}"]`);
            if (activeLink)
                activeLink.classList.add('active');
            views.forEach(view => view.classList.toggle('d-none', view.id !== targetViewId));
            if (targetViewId === 'agendamento-section') {
                mentorAppointmentView.style.display = currentUser.role === 'mentor' ? 'block' : 'none';
                calendarContainer.style.display = currentUser.role === 'mentee' ? 'block' : 'none';
                renderAppointments();
            }
            else if (targetViewId === 'admin-panel') {
                renderAdminDashboard();
            }
            else if (targetViewId === 'mensagem-section') {
                renderConversations();
            }
            else if (targetViewId === 'forum-section') {
                renderForumTopics();
            }
            else if (targetViewId === 'buscar-mentores-section') {
                renderDiscoveryPage();
            }
        }
        function init() {
            if (currentUser) {
                authWrapper.classList.add('d-none');
                appWrapper.classList.remove('d-none');
                appWrapper.classList.add('d-flex');
                updateDashboardUI(currentUser);
            }
            else {
                authWrapper.classList.remove('d-none');
                appWrapper.classList.add('d-none');
            }
        }
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handlePublicRegister);
        showRegisterBtn.addEventListener('click', showRegisterFormView);
        showLoginBtn.addEventListener('click', showLoginFormView);
        logoutBtn.addEventListener('click', () => {
            clearCurrentUser();
            window.location.reload();
        });
        editProfileBtn.addEventListener('click', () => {
            if (!currentUser)
                return;
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
        addUserForm.addEventListener('submit', handleAdminAddUser);
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                if (view) {
                    switchView(view);
                }
            });
        });
        userListUl.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('btn-delete-user')) {
                const userId = parseInt(target.dataset.id, 10);
                handleDeleteUser(userId);
            }
        });
        searchMentorInput.addEventListener('input', (e) => {
            renderMentorList(e.target.value);
        });
        const handleViewProfileClick = (e) => {
            const target = e.target;
            const btn = target.closest('.btn-view-profile');
            if (btn) {
                const mentorId = parseInt(btn.getAttribute('data-id'), 10);
                showMentorProfile(mentorId);
            }
        };
        document.getElementById('mentors-list-container').addEventListener('click', handleViewProfileClick);
        document.getElementById('recommended-mentors-container').addEventListener('click', handleViewProfileClick);
        document.getElementById('featured-mentors-container').addEventListener('click', handleViewProfileClick);
        sendMessageFromProfileBtn.addEventListener('click', (e) => {
            const mentorId = parseInt(e.currentTarget.dataset.mentorId);
            const mentor = users.find(u => u.id === mentorId);
            if (!mentor)
                return;
            document.getElementById('message-recipient-id').value = mentor.id.toString();
            document.getElementById('message-recipient-name').value = mentor.name;
            viewProfileModal.hide();
            composeMessageModal.show();
        });
        requestMentorshipBtn.addEventListener('click', (e) => {
            const mentorId = e.currentTarget.dataset.mentorId;
            document.getElementById('mentorship-mentor-id').value = mentorId || '';
            viewProfileModal.hide();
            requestMentorshipModal.show();
        });
        composeMessageForm.addEventListener('submit', handleSendMessage);
        requestMentorshipForm.addEventListener('submit', handleRequestMentorshipSubmit);
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
        createTopicBtn.addEventListener('click', () => createTopicModal.show());
        createTopicForm.addEventListener('submit', handleCreateTopic);
        init();
    });
});
