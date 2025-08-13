document.addEventListener('DOMContentLoaded', function () {
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
    
    const toastElement = document.getElementById('appToast');
    const appToast = new bootstrap.Toast(toastElement, { delay: 4000 });
    const confirmModalElement = document.getElementById('confirmModal');
    const appConfirmModal = new bootstrap.Modal(confirmModalElement);
    const infoModalElement = document.getElementById('infoModal');
    const appInfoModal = new bootstrap.Modal(infoModalElement);

    let users = JSON.parse(localStorage.getItem('mentoring_users')) || [];
    let appointments = JSON.parse(localStorage.getItem('mentoring_appointments')) || [];
    let messages = JSON.parse(localStorage.getItem('mentoring_messages')) || [];
    let forumTopics = JSON.parse(localStorage.getItem('mentoring_forum_topics')) || [];
    let currentUser = JSON.parse(sessionStorage.getItem('mentoring_currentUser'));
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
    
    function handleLogin(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const foundUser = users.find(user => user.email === email && user.password === password);
        if (foundUser) {
            setCurrentUser(foundUser);
            window.location.reload();
        } else {
            showToast('E-mail ou senha inválidos!', 'danger');
        }
    }
    
    function handlePublicRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());
        if (!userData.fullName || !userData.email || !userData.password || !userData.course || !userData.role || !userData.gender) {
            showToast("Por favor, preencha todos os campos obrigatórios.", "warning"); return;
        }
        if (users.some(user => user.email === userData.email)) {
            showToast('Este e-mail já está em uso.', 'danger'); return;
        }
        const newUser = { id: Date.now(), name: userData.fullName, username: userData.username, email: userData.email, password: userData.password, course: userData.course, role: userData.role, gender: userData.gender, skills: [], bio: '', availability: '' };
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
            showToast("Por favor, preencha todos os campos.", "warning"); return;
        }
        if (users.some(user => user.email === userData.email)) {
            showToast('Este e-mail já está em uso.', 'danger'); return;
        }
        const newUser = { id: Date.now(), name: userData.fullName, email: userData.email, password: userData.password, course: userData.course, role: userData.role, gender: userData.gender, skills: userData.skills ? userData.skills.split(',').map(skill => skill.trim()).filter(Boolean) : [], bio: '', availability: '' };
        users.push(newUser);
        saveUsers();
        showToast(`Usuário ${newUser.name} criado com sucesso!`, 'success');
        addUserForm.reset();
        addUserModal.hide();
        renderAdminDashboard();
    }

    function buildMentorCard(mentor) {
        const allRatings = appointments.filter(a => a.mentorId === mentor.id && a.feedback && a.feedback.rating).map(a => a.feedback.rating);
        const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 0;
        const ratingHTML = averageRating > 0 ?
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
        const recommended = users.filter(user => 
            user.role === 'mentor' && 
            user.course === currentUser.course && 
            user.id !== currentUser.id
        );

        if (recommended.length > 0) {
            recommended.forEach(mentor => container.innerHTML += buildMentorCard(mentor));
        } else {
            container.innerHTML = `
                <div class="col-12 text-center p-5 text-muted">
                    <i class="bi bi-compass fs-1"></i>
                    <h5 class="mt-3">Nenhum mentor recomendado do seu curso</h5>
                    <p>Ainda não há mentores do curso de ${currentUser.course}. Que tal explorar os mentores em destaque ou buscar em toda a comunidade?</p>
                </div>
            `;
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
        } else {
            container.innerHTML = `
                <div class="col-12 text-center p-5 text-muted">
                    <i class="bi bi-star fs-1"></i>
                    <h5 class="mt-3">Ainda não há mentores em destaque</h5>
                    <p>Os mentores mais bem avaliados pela comunidade aparecerão aqui assim que receberem feedback.</p>
                </div>
            `;
        }
    }

    function renderMentorList(filter = '') {
        const lowercasedFilter = filter.trim().toLowerCase();

        if (!lowercasedFilter) {
            mentorsListContainer.innerHTML = `<div class="col-12 text-center p-5 text-muted">
                <i class="bi bi-keyboard fs-1"></i>
                <h5 class="mt-3">Comece a digitar para buscar</h5>
                <p>Use o campo acima para encontrar mentores por nome ou habilidade.</p>
            </div>`;
            return;
        }

        const mentors = users.filter(user => user.role === 'mentor');
        const filteredMentors = mentors.filter(mentor =>
            mentor.name.toLowerCase().includes(lowercasedFilter) ||
            mentor.skills.some(skill => skill.toLowerCase().includes(lowercasedFilter))
        );

        mentorsListContainer.innerHTML = '';

        if (filteredMentors.length === 0) {
            mentorsListContainer.innerHTML = `<div class="col-12 text-center p-5 text-muted">
                <i class="bi bi-emoji-frown fs-1"></i>
                <h5 class="mt-3">Nenhum mentor encontrado</h5>
                <p>Tente ajustar seus termos de busca.</p>
            </div>`;
            return;
        }

        filteredMentors.forEach(mentor => {
            mentorsListContainer.innerHTML += buildMentorCard(mentor);
        });
    }

    function renderPopularTags() {
        if (!popularTagsContainer) return;
        const allSkills = users.filter(u => u.role === 'mentor' && u.skills).flatMap(u => u.skills);
        const skillCounts = allSkills.reduce((acc, skill) => { acc[skill] = (acc[skill] || 0) + 1; return acc; }, {});
        const popularSkills = Object.entries(skillCounts).sort(([,a],[,b]) => b - a).slice(0, 5).map(([skill]) => skill);
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
    
        document.getElementById('total-users-stat').textContent = manageableUsers.length;
        document.getElementById('total-mentors-stat').textContent = manageableUsers.filter(u => u.role === 'mentor').length;
        document.getElementById('total-mentees-stat').textContent = manageableUsers.filter(u => u.role === 'mentee').length;
        document.getElementById('total-admins-stat').textContent = adminUsers.length;
        
        renderUserListForAdmin();
    }

    function renderUserListForAdmin() {
        userListUl.innerHTML = '';
        const usersToDisplay = users.filter(user => user.role !== 'admin');
        if (usersToDisplay.length === 0) {
            userListUl.innerHTML = '<li class="list-group-item">Nenhum mentor ou mentee registrado.</li>'; return;
        }
        usersToDisplay.forEach(user => {
            const roleBadgeColor = user.role === 'mentor' ? 'bg-success' : 'bg-info';
            userListUl.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center"><div class="d-flex align-items-center gap-3"><img src="${getAvatarUrl(user)}" class="rounded-circle" style="width: 40px; height: 40px; background-color: #f0f0f0;"><div><strong>${user.name}</strong><small class="d-block text-muted">${user.email}</small></div></div><div><span class="badge ${roleBadgeColor} me-3">${user.role}</span><button class="btn btn-sm btn-outline-danger btn-delete-user" data-id="${user.id}">Remover</button></div></li>`;
        });
    }

    function handleDeleteUser(userId) {
        if (!currentUser || currentUser.role !== 'admin') return;
        const userToDelete = users.find(user => user.id === userId);
        if (userToDelete && userToDelete.role === 'admin') return;

        showConfirm(
            'Excluir Usuário', 
            `Tem certeza que deseja remover ${userToDelete.name}? Esta ação não pode ser desfeita.`, 
            () => {
                users = users.filter(user => user.id !== userId);
                appointments = appointments.filter(a => a.mentorId !== userId && a.menteeId !== userId);
                messages = messages.filter(m => m.senderId !== userId && m.receiverId !== userId);
                saveUsers();
                saveAppointments();
                saveMessages();
                renderAdminDashboard();
                showToast(`Usuário ${userToDelete.name} removido com sucesso.`, 'success');
            }
        );
    }

    function handleProfileUpdate(e) {
        e.preventDefault();
        currentUser.name = document.getElementById('edit-name').value;
        currentUser.bio = document.getElementById('edit-bio').value;
        currentUser.skills = document.getElementById('edit-skills').value.split(',').map(skill => skill.trim()).filter(Boolean);
        currentUser.availability = document.getElementById('edit-availability').value;
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        if (userIndex !== -1) users[userIndex] = currentUser;
        saveUsers();
        setCurrentUser(currentUser);
        showToast('Perfil atualizado com sucesso!', 'success');
        editProfileModal.hide();
        updateDashboardUI(currentUser);
    }

    function showMentorProfile(mentorId) {
        const mentor = users.find(user => user.id === mentorId);
        if (!mentor) return;
        const allRatings = appointments.filter(a => a.mentorId === mentorId && a.feedback && a.feedback.rating).map(a => a.feedback.rating);
        const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 0;
        document.getElementById('modal-profile-avatar').src = getAvatarUrl(mentor);
        document.getElementById('modal-profile-name').textContent = mentor.name;
        document.getElementById('modal-profile-course').textContent = mentor.course;
        document.getElementById('modal-profile-bio').textContent = mentor.bio || 'Este mentor ainda não adicionou uma biografia.';
        const ratingContainer = document.getElementById('modal-profile-rating');
        ratingContainer.innerHTML = averageRating > 0 ? `<i class="bi bi-star-fill text-warning"></i> ${averageRating} (${allRatings.length} avaliações)` : '<span class="text-muted">Ainda não avaliado</span>';
        const skillsContainer = document.getElementById('modal-profile-skills');
        skillsContainer.innerHTML = '';
        if (mentor.skills && mentor.skills.length > 0) {
            mentor.skills.forEach(skill => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-primary me-2 mb-2 p-2';
                badge.textContent = skill;
                skillsContainer.appendChild(badge);
            });
        } else {
            skillsContainer.innerHTML = '<p class="text-muted">Nenhuma habilidade informada.</p>';
        }

        const historyList = document.getElementById('modal-mentor-history-list');
        historyList.innerHTML = '';
        const completedAppointments = appointments.filter(a => a.mentorId === mentor.id && (a.status === 'realizado' || a.status === 'avaliado')).sort((a,b) => new Date(b.date) - new Date(a.date));
        if (completedAppointments.length > 0) {
            completedAppointments.forEach(app => {
                historyList.innerHTML += `<li class="list-group-item small p-2">"${app.topic}" em ${new Date(app.date).toLocaleDateString()}</li>`;
            });
        } else {
            historyList.innerHTML = '<li class="list-group-item small text-muted p-2">Nenhum encontro finalizado.</li>';
        }

        sendMessageFromProfileBtn.style.display = 'none';
        requestMentorshipBtn.style.display = 'none';
        if (currentUser.role === 'mentee') {
            sendMessageFromProfileBtn.style.display = 'inline-block';
            requestMentorshipBtn.style.display = 'inline-block';
        }
        requestMentorshipBtn.dataset.mentorId = mentor.id;
        sendMessageFromProfileBtn.dataset.mentorId = mentor.id;
        viewProfileModal.show();
    }

    function handleRequestMentorshipSubmit(e) {
        e.preventDefault();
        const mentorId = parseInt(document.getElementById('mentorship-mentor-id').value, 10);
        const date = document.getElementById('mentorship-date').value;
        const time = document.getElementById('mentorship-time').value;
        const topic = document.getElementById('mentorship-topic').value;
        if (!mentorId || !date || !time || !topic) { showToast("Preencha todos os campos.", 'warning'); return; }
        appointments.push({ id: Date.now(), mentorId: mentorId, menteeId: currentUser.id, date, time, topic, status: 'pendente', createdAt: new Date().toISOString() });
        saveAppointments();
        showToast('Solicitação de agendamento enviada!', 'success');
        requestMentorshipModal.hide();
    }

    function renderAppointments() {
        if (currentUser.role === 'mentee') {
            initCalendar();
        } else if (currentUser.role === 'mentor') {
            const upcomingList = document.getElementById('upcoming-appointments-list');
            const pastList = document.getElementById('past-appointments-list');
            upcomingList.innerHTML = '';
            pastList.innerHTML = '';
    
            const myAppointments = appointments.filter(a => a.mentorId === currentUser.id);
            const now = new Date();
    
            const upcoming = myAppointments.filter(a => new Date(`${a.date}T${a.time}`) >= now && ['pendente', 'aceito'].includes(a.status));
            const past = myAppointments.filter(a => new Date(`${a.date}T${a.time}`) < now || ['recusado', 'realizado', 'avaliado'].includes(a.status));
            
            const completedCount = past.filter(a => ['realizado', 'avaliado'].includes(a.status)).length;
            const menteesMet = new Set(past.map(a => a.menteeId)).size;
    
            const sortedUpcoming = [...upcoming].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
            const nextAppointment = sortedUpcoming[0];
    
            document.getElementById('mentor-stats-total').textContent = completedCount;
            document.getElementById('mentor-stats-mentees').textContent = menteesMet;
            if(nextAppointment) {
                document.getElementById('mentor-stats-next').textContent = new Date(nextAppointment.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
            } else {
                 document.getElementById('mentor-stats-next').textContent = 'Nenhum';
            }
    
            if (sortedUpcoming.length === 0) {
                upcomingList.innerHTML = '<div class="text-center p-4 text-muted">Nenhuma solicitação ou encontro futuro.</div>';
            } else {
                sortedUpcoming.forEach(a => upcomingList.innerHTML += buildAppointmentCard(a));
            }
    
            if (past.length === 0) {
                pastList.innerHTML = '<div class="text-center p-4 text-muted">Nenhum encontro no seu histórico.</div>';
            } else {
                past.sort((a,b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)).forEach(a => pastList.innerHTML += buildAppointmentCard(a));
            }
        }
    }
    
    function buildAppointmentCard(appointment) {
        const otherUser = users.find(u => u.id === appointment.menteeId);
        if (!otherUser) return '';
        
        let statusBadge, actions = '';
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        const isPast = appointmentDate < new Date();
        
        switch (appointment.status) {
            case 'pendente':
                statusBadge = `<span class="badge text-bg-warning">Pendente</span>`;
                actions = `<button class="btn btn-success btn-sm me-2" data-action="aceito" data-id="${appointment.id}">Aceitar</button><button class="btn btn-danger btn-sm" data-action="recusado" data-id="${appointment.id}">Recusar</button>`;
                break;
            case 'aceito':
                statusBadge = `<span class="badge text-bg-success">Aceito</span>`;
                if (isPast) {
                    actions = `<button class="btn btn-primary btn-sm" data-action="realizado" data-id="${appointment.id}">Marcar como Realizado</button>`;
                } else {
                    actions = `<button class="btn btn-outline-secondary btn-sm me-2" data-action="editar" data-id="${appointment.id}">Editar</button><button class="btn btn-outline-danger btn-sm" data-action="excluir" data-id="${appointment.id}">Excluir</button>`;
                }
                break;
            case 'recusado': statusBadge = `<span class="badge text-bg-danger">Recusado</span>`; break;
            case 'realizado': statusBadge = `<span class="badge text-bg-info">Realizado</span>`; break;
            case 'avaliado': statusBadge = `<span class="badge text-bg-secondary">Avaliado</span>`; break;
        }

        return `
            <div class="card appointment-card mb-3">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-2">
                        <img src="${getAvatarUrl(otherUser)}" class="rounded-circle me-3" style="width:45px; height:45px;" alt="">
                        <div>
                            <h6 class="mb-0">Mentoria com <strong>${otherUser.name}</strong></h6>
                            <small class="text-muted">${appointmentDate.toLocaleDateString('pt-BR', {weekday: 'long', day: '2-digit', month: 'long'})} às ${appointmentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                        </div>
                        <div class="ms-auto">${statusBadge}</div>
                    </div>
                    <p class="card-text bg-light p-2 rounded"><strong>Tópico:</strong> ${appointment.topic}</p>
                    <div class="text-end">
                        ${actions}
                    </div>
                </div>
            </div>
        `;
    }

    function handleAppointmentAction(action, id) {
        const appointmentIndex = appointments.findIndex(a => a.id === id);
        if (appointmentIndex === -1) return;
        
        if (action === 'excluir') {
            const mentee = users.find(u => u.id === appointments[appointmentIndex].menteeId);
            showConfirm(
                'Excluir Agendamento',
                `Tem certeza que deseja excluir este agendamento? Uma notificação será enviada para ${mentee.name}.`,
                () => {
                    appointments.splice(appointmentIndex, 1);
                    saveAppointments();
                    showToast('Agendamento excluído com sucesso.', 'success');
                    renderAppointments();
                }
            );
        } else if (action === 'editar') {
            const appointment = appointments[appointmentIndex];
            document.getElementById('edit-appointment-id').value = appointment.id;
            document.getElementById('edit-appointment-date').value = appointment.date;
            document.getElementById('edit-appointment-time').value = appointment.time;
            document.getElementById('edit-appointment-topic').value = appointment.topic;
            editAppointmentModal.show();
            return;
        } else {
            appointments[appointmentIndex].status = action;
            saveAppointments();
        }
        renderAppointments();
    }
    
    function handleUpdateAppointment(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-appointment-id').value);
        const shouldNotify = document.getElementById('edit-notify-mentee').checked;
        const appointmentIndex = appointments.findIndex(a => a.id === id);
        if (appointmentIndex === -1) return;

        appointments[appointmentIndex].date = document.getElementById('edit-appointment-date').value;
        appointments[appointmentIndex].time = document.getElementById('edit-appointment-time').value;
        appointments[appointmentIndex].topic = document.getElementById('edit-appointment-topic').value;
        
        saveAppointments();
        editAppointmentModal.hide();
        editAppointmentForm.reset();
        showToast(`Agendamento atualizado com sucesso!${shouldNotify ? ' O mentorado foi notificado.' : ''}`, 'success');
        renderAppointments();
    }

    function handleFeedbackSubmit(e) {
        e.preventDefault();
        const appointmentId = parseInt(document.getElementById('feedback-appointment-id').value);
        const rating = parseInt(feedbackStarsContainer.dataset.rating || '0');
        const comment = document.getElementById('feedback-comment').value;
        if (rating === 0) { showToast('Por favor, selecione uma avaliação de 1 a 5 estrelas.', 'warning'); return; }
        const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
        if (appointmentIndex === -1) return;
        appointments[appointmentIndex].status = 'avaliado';
        appointments[appointmentIndex].feedback = { rating, comment, date: new Date().toISOString() };
        saveAppointments();
        showToast('Avaliação enviada com sucesso. Obrigado!', 'success');
        feedbackModal.hide();
        renderAppointments();
    }

    function renderConversations() {
        conversationsListUl.innerHTML = '';
        const conversationPartners = new Map();
        messages.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id).forEach(m => {
            const partnerId = m.senderId === currentUser.id ? m.receiverId : m.senderId;
            const lastTimestamp = conversationPartners.get(partnerId);
            if (!lastTimestamp || new Date(m.timestamp) > new Date(lastTimestamp)) { conversationPartners.set(partnerId, m.timestamp); }
        });
        if (conversationPartners.size === 0) {
            conversationsListUl.innerHTML = '<li class="list-group-item text-muted text-center p-4">Nenhuma conversa iniciada.</li>';
            return;
        }
        const sortedPartners = [...conversationPartners.entries()].sort((a,b) => new Date(b[1]) - new Date(a[1]));
        sortedPartners.forEach(([partnerId, timestamp]) => {
            const partner = users.find(u => u.id === partnerId);
            if(partner) {
                const lastMessage = messages.filter(m => (m.senderId === partnerId && m.receiverId === currentUser.id) || (m.senderId === currentUser.id && m.receiverId === partnerId)).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                conversationsListUl.innerHTML += `<li class="list-group-item list-group-item-action" style="cursor: pointer;" data-conversation-with="${partner.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${partner.name}</h5><small>${new Date(lastMessage.timestamp).toLocaleDateString()}</small></div><p class="mb-1 text-truncate"><strong>${lastMessage.subject || '(Sem assunto)'}:</strong> ${lastMessage.body}</p></li>`;
            }
        });
    }

    function openConversationThread(otherUserId) {
        const partner = users.find(u => u.id === otherUserId);
        document.getElementById('viewConversationModalLabel').textContent = `Conversa com ${partner.name}`;
        const threadBody = document.getElementById('conversation-thread-body');
        threadBody.innerHTML = '';
        const relevantMessages = messages.filter(m => (m.senderId === currentUser.id && m.receiverId === otherUserId) || (m.senderId === otherUserId && m.receiverId === currentUser.id)).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
        relevantMessages.forEach(msg => {
            const sender = users.find(u => u.id === msg.senderId);
            const alignment = msg.senderId === currentUser.id ? 'bg-primary bg-opacity-10' : '';
            threadBody.innerHTML += `<div class="card mb-2 ${alignment}"><div class="card-body p-2"><div class="d-flex justify-content-between align-items-center mb-1"><small><strong>${sender.name}</strong></small><small class="text-muted">${new Date(msg.timestamp).toLocaleString()}</small></div><p class="card-text small">${msg.body.replace(/\n/g, '<br>')}</p></div></div>`;
        });
        replyMessageForm.dataset.replyTo = otherUserId;
        viewConversationModal.show();
        threadBody.scrollTop = threadBody.scrollHeight;
    }

    function handleSendMessage(e) {
        e.preventDefault();
        const recipientId = parseInt(document.getElementById('message-recipient-id').value, 10);
        const subject = document.getElementById('message-subject').value;
        const body = document.getElementById('message-body').value;
        if (!recipientId || !body) { showToast('Mensagem não pode estar vazia.', 'warning'); return; }
        messages.push({ id: Date.now(), senderId: currentUser.id, receiverId: recipientId, subject: subject, body: body, timestamp: new Date().toISOString() });
        saveMessages();
        showToast('Mensagem enviada com sucesso!', 'success');
        composeMessageForm.reset();
        composeMessageModal.hide();
        renderConversations();
        switchView('mensagem-section');
    }

    function handleReplyMessage(e) {
        e.preventDefault();
        const recipientId = parseInt(e.target.dataset.replyTo, 10);
        const body = document.getElementById('reply-message-body').value;
        if (!recipientId || !body) return;
        const originalThreadMessages = messages.filter(m => (m.senderId === currentUser.id && m.receiverId === recipientId) || (m.senderId === recipientId && m.receiverId === currentUser.id));
        const lastSubject = originalThreadMessages.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0].subject;
        messages.push({ id: Date.now(), senderId: currentUser.id, receiverId: recipientId, subject: lastSubject.startsWith('Re: ') ? lastSubject : `Re: ${lastSubject}`, body: body, timestamp: new Date().toISOString() });
        saveMessages();
        document.getElementById('reply-message-body').value = '';
        openConversationThread(recipientId);
    }

    function renderForumTopics() {
        const container = document.querySelector('#forum-card-body .list-group');
        container.innerHTML = '';
        if (forumTopics.length === 0) {
            container.innerHTML = '<p class="text-muted">Ainda não há tópicos no fórum. Seja o primeiro a criar um!</p>';
            return;
        }
        forumTopics.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(topic => {
            const author = users.find(u => u.id === topic.authorId);
            container.innerHTML += `<a href="#" class="list-group-item list-group-item-action" data-topic-id="${topic.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${topic.title}</h5><small>${new Date(topic.createdAt).toLocaleDateString()}</small></div><p class="mb-1">${topic.body.substring(0, 150)}...</p><small>Por ${author ? author.name : 'Usuário Removido'} • ${topic.replies.length} respostas</small></a>`;
        });
    }

    function handleCreateTopic(e) {
        e.preventDefault();
        const title = document.getElementById('topic-title').value;
        const body = document.getElementById('topic-body').value;
        if (!title || !body) { showToast('Título e mensagem são obrigatórios.', 'warning'); return; }
        forumTopics.push({ id: Date.now(), title, body, authorId: currentUser.id, createdAt: new Date().toISOString(), replies: [] });
        saveForumTopics();
        showToast('Tópico criado com sucesso!', 'success');
        createTopicForm.reset();
        createTopicModal.hide();
        renderForumTopics();
    }

    function openTopic(topicId) {
        const topic = forumTopics.find(t => t.id === topicId);
        if (!topic) return;
        document.getElementById('view-topic-title').textContent = topic.title;
        const container = document.getElementById('topic-replies-container');
        container.innerHTML = '';
        const author = users.find(u => u.id === topic.authorId);
        container.innerHTML += `<div class="card mb-3"><div class="card-header bg-light d-flex align-items-center gap-2"><img src="${getAvatarUrl(author)}" class="rounded-circle" style="width:30px;height:30px;"><h6 class="mb-0"><strong>${author.name}</strong> iniciou a discussão</h6></div><div class="card-body"><p>${topic.body.replace(/\n/g, '<br>')}</p><small class="text-muted">${new Date(topic.createdAt).toLocaleString()}</small></div></div><hr>`;
        topic.replies.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)).forEach(reply => {
            const replier = users.find(u => u.id === reply.authorId);
            container.innerHTML += `<div class="card mb-2 ms-4"><div class="card-body p-2"><div class="d-flex align-items-center gap-2 mb-1"><img src="${getAvatarUrl(replier)}" class="rounded-circle" style="width:25px;height:25px;"><strong>${replier.name}</strong><small class="text-muted ms-auto">${new Date(reply.createdAt).toLocaleString()}</small></div><p class="card-text small">${reply.body.replace(/\n/g, '<br>')}</p></div></div>`;
        });
        replyTopicForm.dataset.topicId = topicId;
        viewTopicModal.show();
    }

    function handleReplyToTopic(e) {
        e.preventDefault();
        const topicId = parseInt(replyTopicForm.dataset.topicId);
        const body = document.getElementById('reply-topic-body').value;
        if (!body) return;
        const topicIndex = forumTopics.findIndex(t => t.id === topicId);
        if (topicIndex === -1) return;
        forumTopics[topicIndex].replies.push({ id: Date.now(), authorId: currentUser.id, body, createdAt: new Date().toISOString() });
        saveForumTopics();
        document.getElementById('reply-topic-body').value = '';
        openTopic(topicId);
    }
    
    function showLoginFormView() {
        registerSection.classList.add('d-none');
        loginContainer.classList.remove('d-none');
    }

    function showRegisterFormView() {
        document.getElementById('admin-register-option').hidden = users.some(user => user.role === 'admin');
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
        return myAppointments.map(app => {
            const otherUser = users.find(u => u.id === (currentUser.role === 'mentee' ? app.mentorId : app.menteeId));
            let color = '#0d6efd';
            if (app.status === 'pendente') color = '#ffc107';
            if (app.status === 'aceito') color = '#198754';
            if (app.status === 'realizado' || app.status === 'avaliado') color = '#6c757d';
            
            return {
                id: app.id,
                title: `Mentoria com ${otherUser ? otherUser.name : '...'}`,
                start: `${app.date}T${app.time}`,
                color: color,
                extendedProps: {
                    topic: app.topic,
                    status: app.status
                }
            };
        });
    }

    function initCalendar() {
        if (calendar) {
            calendar.destroy();
        }
        const myAppointments = appointments.filter(a => a.menteeId === currentUser.id || a.mentorId === currentUser.id);
        const calendarEvents = formatAppointmentsForCalendar(myAppointments);

        calendar = new FullCalendar.Calendar(calendarContainer, {
            locale: 'pt-br',

            buttonText: {
                today:    'hoje',
                month:    'mês',
                week:     'semana',
                day:      'dia',
                list:     'lista' 
            },

            allDayText: 'Dia',

            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            height: 'auto',
            initialView: 'dayGridMonth',
            events: calendarEvents,
            eventClick: function(info) {
                const eventBody = `
                    <p><strong>Com:</strong> ${info.event.title.replace('Mentoria com ', '')}</p>
                    <p><strong>Data:</strong> ${info.event.start.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    <p><strong>Tópico:</strong> ${info.event.extendedProps.topic}</p>
                    <p><strong>Status:</strong> <span class="badge" style="background-color: ${info.event.backgroundColor}">${info.event.extendedProps.status}</span></p>
                `;
                showInfo('Detalhes do Encontro', eventBody);
            }
        });
        calendar.render();
    }

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
    
    document.getElementById('mentors-list-container').addEventListener('click', (e) => { const btn = e.target.closest('.btn-view-profile'); if (btn) showMentorProfile(parseInt(btn.dataset.id)); });
    document.getElementById('recommended-mentors-container').addEventListener('click', (e) => { const btn = e.target.closest('.btn-view-profile'); if (btn) showMentorProfile(parseInt(btn.dataset.id)); });
    document.getElementById('featured-mentors-container').addEventListener('click', (e) => { const btn = e.target.closest('.btn-view-profile'); if (btn) showMentorProfile(parseInt(btn.dataset.id)); });
    
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
                const mentor = users.find(u => u.id === appointment.mentorId);
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

    function init() {
        if (users.length === 0) {
            users.push({ id: 1, name: 'Admin', email: 'admin@mentoring.com', password: 'admin', role: 'admin', course: 'Sistema', gender: 'outro', skills: ['Gerenciamento'], bio: '', availability: '' });
            saveUsers();
        }
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

    init();
});