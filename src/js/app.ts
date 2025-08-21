import type { Modal as BootstrapModal, Toast as BootstrapToast } from 'bootstrap';
import type { Calendar as FullCalendar } from '@fullcalendar/core';

// --- Definições de Tipo (Interfaces) ---
interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password?: string;
  course: string;
  role: 'mentee' | 'mentor' | 'admin';
  gender: 'masculino' | 'feminino' | 'outro';
  skills: string[];
  bio: string;
  availability: string;
}

interface AppointmentFeedback {
  rating: number;
  comment: string;
  date: string;
}

interface Appointment {
  id: number;
  mentorId: number;
  menteeId: number;
  date: string;
  time: string;
  topic: string;
  status: 'pendente' | 'aceito' | 'recusado' | 'realizado' | 'avaliado';
  createdAt: string;
  feedback?: AppointmentFeedback;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  subject: string;
  body: string;
  timestamp: string;
}

interface ForumReply {
  id: number;
  authorId: number;
  body: string;
  createdAt: string;
}

interface ForumTopic {
  id: number;
  title: string;
  body: string;
  authorId: number;
  createdAt: string;
  replies: ForumReply[];
}

declare global {
    interface Window {
        bootstrap: {
            Modal: typeof BootstrapModal;
            Toast: typeof BootstrapToast;
        };
        FullCalendar: {
            Calendar: typeof FullCalendar;
            dayGridPlugin: any;
            timeGridPlugin: any;
            listPlugin: any;
            interactionPlugin: any;
        };
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const authWrapper = document.getElementById('auth-wrapper') as HTMLElement;
    const appWrapper = document.getElementById('app-wrapper') as HTMLElement;
    const loginContainer = document.getElementById('login-container') as HTMLElement;
    const registerSection = document.getElementById('cadastro-section') as HTMLElement;
    const loginForm = document.getElementById('form-login') as HTMLFormElement;
    const registerForm = document.getElementById('form-cadastro') as HTMLFormElement;
    const showRegisterBtn = document.getElementById('btn-show-register-form') as HTMLButtonElement;
    const showLoginBtn = document.getElementById('btn-show-login-form') as HTMLButtonElement;
    const logoutBtn = document.getElementById('btn-logout') as HTMLButtonElement;
    const views = document.querySelectorAll<HTMLElement>('.content-view');
    const sidebarUsername = document.getElementById('sidebar-username') as HTMLSpanElement;
    const sidebarAvatar = document.getElementById('sidebar-avatar') as HTMLImageElement;
    const mentorsListContainer = document.getElementById('mentors-list-container') as HTMLElement;
    const searchMentorInput = document.getElementById('search-mentor-input') as HTMLInputElement;
    const userListUl = document.getElementById('users-list-ul') as HTMLUListElement;
    const navItems: { [key: string]: HTMLElement | null } = {
        buscar: document.getElementById('nav-buscar-mentores'),
        agendamentos: document.getElementById('nav-agendamentos'),
        mensagens: document.getElementById('nav-mensagens'),
        forum: document.getElementById('nav-forum'),
        admin: document.getElementById('nav-admin'),
    };
    const editProfileBtn = document.getElementById('btn-edit-profile') as HTMLButtonElement;
    const editProfileModal = new window.bootstrap.Modal(document.getElementById('editProfileModal') as HTMLElement);
    const editProfileForm = document.getElementById('form-edit-profile') as HTMLFormElement;
    const addUserBtn = document.getElementById('btn-add-user') as HTMLButtonElement;
    const addUserModal = new window.bootstrap.Modal(document.getElementById('addUserModal') as HTMLElement);
    const addUserForm = document.getElementById('form-add-user') as HTMLFormElement;
    const viewProfileModal = new window.bootstrap.Modal(document.getElementById('viewProfileModal') as HTMLElement);
    const requestMentorshipBtn = document.getElementById('btn-request-mentorship') as HTMLButtonElement;
    const sendMessageFromProfileBtn = document.getElementById('btn-send-message-from-profile') as HTMLButtonElement;
    const composeMessageModal = new window.bootstrap.Modal(document.getElementById('composeMessageModal') as HTMLElement);
    const composeMessageForm = document.getElementById('form-compose-message') as HTMLFormElement;
    const conversationsListUl = document.getElementById('conversations-list-ul') as HTMLUListElement;
    const requestMentorshipModal = new window.bootstrap.Modal(document.getElementById('requestMentorshipModal') as HTMLElement);
    const requestMentorshipForm = document.getElementById('form-request-mentorship') as HTMLFormElement;
    const feedbackModal = new window.bootstrap.Modal(document.getElementById('feedbackModal') as HTMLElement);
    const feedbackForm = document.getElementById('form-send-feedback') as HTMLFormElement;
    const feedbackStarsContainer = document.getElementById('feedback-stars') as HTMLElement;
    const createTopicBtn = document.getElementById('btn-create-topic') as HTMLButtonElement;
    const createTopicModal = new window.bootstrap.Modal(document.getElementById('createTopicModal') as HTMLElement);
    const createTopicForm = document.getElementById('form-create-topic') as HTMLFormElement;
    const popularTagsContainer = document.getElementById('popular-tags-container') as HTMLElement;
    const calendarContainer = document.getElementById('calendar-container') as HTMLElement;
    const mentorAppointmentView = document.getElementById('mentor-appointment-view') as HTMLElement;
    const toastElement = document.getElementById('appToast') as HTMLElement;
    const appToast = new window.bootstrap.Toast(toastElement, { delay: 4000 });
    const confirmModalElement = document.getElementById('confirmModal') as HTMLElement;
    const appConfirmModal = new window.bootstrap.Modal(confirmModalElement);
    const infoModalElement = document.getElementById('infoModal') as HTMLElement;
    const appInfoModal = new window.bootstrap.Modal(infoModalElement);
    
    let users: User[] = JSON.parse(localStorage.getItem('mentoring_users') || '[]');
    let appointments: Appointment[] = JSON.parse(localStorage.getItem('mentoring_appointments') || '[]');
    let messages: Message[] = JSON.parse(localStorage.getItem('mentoring_messages') || '[]');
    let forumTopics: ForumTopic[] = JSON.parse(localStorage.getItem('mentoring_forum_topics') || '[]');
    let currentUser: User | null = JSON.parse(sessionStorage.getItem('mentoring_currentUser') || 'null');
    let calendar: FullCalendar | null = null;

    function saveUsers(): void { localStorage.setItem('mentoring_users', JSON.stringify(users)); }
    function saveAppointments(): void { localStorage.setItem('mentoring_appointments', JSON.stringify(appointments)); }
    function saveMessages(): void { localStorage.setItem('mentoring_messages', JSON.stringify(messages)); }
    function saveForumTopics(): void { localStorage.setItem('mentoring_forum_topics', JSON.stringify(forumTopics)); }
    function setCurrentUser(user: User): void { currentUser = user; sessionStorage.setItem('mentoring_currentUser', JSON.stringify(user)); }
    function clearCurrentUser(): void { currentUser = null; sessionStorage.removeItem('mentoring_currentUser'); }

    function showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info'): void {
        const toastBody = document.getElementById('toastBody') as HTMLElement;
        const toastTitle = document.getElementById('toastTitle') as HTMLElement;
        const toastIcon = document.getElementById('toastIcon') as HTMLElement;
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

    function showConfirm(title: string, body: string, onConfirm: () => void): void {
        (document.getElementById('confirmModalLabel') as HTMLElement).textContent = title;
        (document.getElementById('confirmModalBody') as HTMLElement).textContent = body;
        const confirmBtn = document.getElementById('confirmModalConfirmBtn') as HTMLButtonElement;
        const newConfirmBtn = confirmBtn.cloneNode(true) as HTMLButtonElement;
        confirmBtn.parentNode!.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            appConfirmModal.hide();
        }, { once: true });
        appConfirmModal.show();
    }

    function showInfo(title: string, bodyContent: string): void {
        (document.getElementById('infoModalLabel') as HTMLElement).textContent = title;
        (document.getElementById('infoModalBody') as HTMLElement).innerHTML = bodyContent;
        appInfoModal.show();
    }

    function getAvatarUrl(user: User | null): string {
        if (!user || !user.email) return '';
        const seed = encodeURIComponent(user.email);
        if (user.gender === 'feminino') return `https://api.dicebear.com/8.x/personas/svg?seed=${seed}&face=variant1,variant2,variant3,variant4,variant5`;
        if (user.gender === 'masculino') return `https://api.dicebear.com/8.x/personas/svg?seed=${seed}&face=variant6,variant7,variant8,variant9,variant10`;
        return `https://api.dicebear.com/8.x/bottts/svg?seed=${seed}`;
    }

    function handleProfileUpdate(e: SubmitEvent): void {
        e.preventDefault();
        if (!currentUser) return;

        currentUser.name = (document.getElementById('edit-name') as HTMLInputElement).value;
        currentUser.bio = (document.getElementById('edit-bio') as HTMLTextAreaElement).value;
        currentUser.skills = (document.getElementById('edit-skills') as HTMLInputElement).value.split(',').map(skill => skill.trim()).filter(Boolean);
        currentUser.availability = (document.getElementById('edit-availability') as HTMLTextAreaElement).value;

        const userIndex = users.findIndex(user => user.id === currentUser!.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
        }
        saveUsers();
        setCurrentUser(currentUser);
        showToast('Perfil atualizado com sucesso!', 'success');
        editProfileModal.hide();
        updateDashboardUI(currentUser);
    }
    
    function showMentorProfile(mentorId: number): void {
        const mentor = users.find(user => user.id === mentorId);
        if (!mentor || !currentUser) return;
        
        const allRatings = appointments.filter(a => a.mentorId === mentorId && a.feedback && a.feedback.rating).map(a => a.feedback!.rating);
        const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : "0";
        
        (document.getElementById('modal-profile-avatar') as HTMLImageElement).src = getAvatarUrl(mentor);
        (document.getElementById('modal-profile-name') as HTMLElement).textContent = mentor.name;
        (document.getElementById('modal-profile-course') as HTMLElement).textContent = mentor.course;
        (document.getElementById('modal-profile-bio') as HTMLElement).textContent = mentor.bio || 'Este mentor ainda não adicionou uma biografia.';
        
        const ratingContainer = document.getElementById('modal-profile-rating') as HTMLElement;
        ratingContainer.innerHTML = parseFloat(averageRating) > 0 ? `<i class="bi bi-star-fill text-warning"></i> ${averageRating} (${allRatings.length} avaliações)` : '<span class="text-muted">Ainda não avaliado</span>';
        
        const skillsContainer = document.getElementById('modal-profile-skills') as HTMLElement;
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

        const historyList = document.getElementById('modal-mentor-history-list') as HTMLUListElement;
        historyList.innerHTML = '';
        const completedAppointments = appointments.filter(a => a.mentorId === mentor.id && (a.status === 'realizado' || a.status === 'avaliado')).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
        requestMentorshipBtn.dataset.mentorId = mentor.id.toString();
        sendMessageFromProfileBtn.dataset.mentorId = mentor.id.toString();
        viewProfileModal.show();
    }

    function updateDashboardUI(user: User): void {
        sidebarUsername.textContent = user.name;
        sidebarAvatar.src = getAvatarUrl(user);
        
        Object.values(navItems).forEach(item => item?.classList.add('d-none'));

        if (user.role === 'mentee') {
            navItems.buscar?.classList.remove('d-none');
            navItems.agendamentos?.classList.remove('d-none');
            navItems.mensagens?.classList.remove('d-none');
            navItems.forum?.classList.remove('d-none');
            switchView('buscar-mentores-section');
        } else if (user.role === 'mentor') {
            navItems.agendamentos?.classList.remove('d-none');
            navItems.mensagens?.classList.remove('d-none');
            navItems.forum?.classList.remove('d-none');
            switchView('agendamento-section');
        } else if (user.role === 'admin') {
            navItems.admin?.classList.remove('d-none');
            switchView('admin-panel');
        }
    }
    
    function handleLogin(e: SubmitEvent): void {
     e.preventDefault();
     const target = e.target as HTMLFormElement;

     const loginIdentifier = (target.querySelector('input[name="loginIdentifier"]') as HTMLInputElement).value;
     const password = (target.querySelector('input[type="password"]') as HTMLInputElement).value;

        const foundUser = users.find(user => 
          (user.email === loginIdentifier || user.username === loginIdentifier) && 
           user.password === password
        );
    
        if (foundUser) {
          setCurrentUser(foundUser);
          window.location.reload();
        } else {
          showToast('Identificador ou senha inválidos!', 'danger');
        }
   }

    function handlePublicRegister(e: SubmitEvent): void {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const userData = Object.fromEntries(formData.entries());

        if (!userData.fullName || !userData.email || !userData.password || !userData.course || !userData.role || !userData.gender) {
            showToast("Por favor, preencha todos os campos obrigatórios.", "warning");
            return;
        }
        if (users.some(user => user.username === userData.username)) { // Adicione esta verificação
           showToast('Este nome de usuário já está em uso.', 'danger');
           return;
       }
        if (users.some(user => user.email === userData.email)) {
            showToast('Este e-mail já está em uso.', 'danger');
            return;
        }
        
        const newUser: User = {
            id: Date.now(),
            username: String(userData.username),
            name: String(userData.fullName),
            email: String(userData.email),
            password: String(userData.password),
            course: String(userData.course),
            role: userData.role as 'mentee' | 'mentor' | 'admin',
            gender: userData.gender as 'masculino' | 'feminino' | 'outro',
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
    
    function handleAdminAddUser(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = Object.fromEntries(formData.entries());

    if (!userData.fullName || !userData.username || !userData.email || !userData.password || !userData.course || !userData.role || !userData.gender) {
        showToast("Por favor, preencha todos os campos.", "warning"); return;
    }
    
    if (users.some(user => user.username === userData.username)) {
        showToast('Este nome de usuário já está em uso.', 'danger'); return;
    }
    if (users.some(user => user.email === userData.email)) {
        showToast('Este e-mail já está em uso.', 'danger'); return;
    }
    
    const newUser: User = { 
        id: Date.now(), 
        username: String(userData.username), 
        name: String(userData.fullName),
        email: String(userData.email), 
        password: String(userData.password), 
        course: String(userData.course), 
        role: userData.role as 'mentee' | 'mentor', 
        gender: userData.gender as 'masculino' | 'feminino' | 'outro', 
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

    function buildMentorCard(mentor: User): string {
        const allRatings = appointments
            .filter(a => a.mentorId === mentor.id && a.feedback?.rating)
            .map(a => a.feedback!.rating);
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

    function renderRecommendedMentors(): void {
        const container = document.getElementById('recommended-mentors-container') as HTMLElement;
        container.innerHTML = '';
        if (!currentUser) return;
        const recommended = users.filter(user =>
            user.role === 'mentor' &&
            user.course === currentUser!.course &&
            user.id !== currentUser!.id
        );
        if (recommended.length > 0) {
            recommended.forEach(mentor => container.innerHTML += buildMentorCard(mentor));
        } else {
            container.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-compass fs-1"></i><h5 class="mt-3">Nenhum mentor recomendado do seu curso</h5><p>Ainda não há mentores do curso de ${currentUser.course}. Que tal explorar os mentores em destaque ou buscar em toda a comunidade?</p></div>`;
        }
    }

    function renderFeaturedMentors(): void {
        const container = document.getElementById('featured-mentors-container') as HTMLElement;
        container.innerHTML = '';
        const mentorsWithRatings = users
            .filter(user => user.role === 'mentor')
            .map(mentor => {
                const allRatings = appointments.filter(a => a.mentorId === mentor.id && a.feedback?.rating).map(a => a.feedback!.rating);
                const averageRating = allRatings.length > 0 ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;
                return { ...mentor, averageRating, ratingCount: allRatings.length };
            })
            .filter(mentor => mentor.ratingCount > 0)
            .sort((a, b) => b.averageRating - a.averageRating || b.ratingCount - a.ratingCount)
            .slice(0, 3);
        if (mentorsWithRatings.length > 0) {
            mentorsWithRatings.forEach(mentor => container.innerHTML += buildMentorCard(mentor));
        } else {
            container.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-star fs-1"></i><h5 class="mt-3">Ainda não há mentores em destaque</h5><p>Os mentores mais bem avaliados pela comunidade aparecerão aqui assim que receberem feedback.</p></div>`;
        }
    }
    
    function renderMentorList(filter: string = ''): void {
        const lowercasedFilter = filter.trim().toLowerCase();
        if (!lowercasedFilter) {
            mentorsListContainer.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-keyboard fs-1"></i><h5 class="mt-3">Comece a digitar para buscar</h5><p>Use o campo acima para encontrar mentores por nome ou habilidade.</p></div>`;
            return;
        }
        const mentors = users.filter(user => user.role === 'mentor');
        const filteredMentors = mentors.filter(mentor =>
            mentor.name.toLowerCase().includes(lowercasedFilter) ||
            mentor.skills.some(skill => skill.toLowerCase().includes(lowercasedFilter))
        );
        mentorsListContainer.innerHTML = '';
        if (filteredMentors.length === 0) {
            mentorsListContainer.innerHTML = `<div class="col-12 text-center p-5 text-muted"><i class="bi bi-emoji-frown fs-1"></i><h5 class="mt-3">Nenhum mentor encontrado</h5><p>Tente ajustar seus termos de busca.</p></div>`;
            return;
        }
        filteredMentors.forEach(mentor => {
            mentorsListContainer.innerHTML += buildMentorCard(mentor);
        });
    }

    function renderPopularTags(): void {
        if (!popularTagsContainer) return;
        const allSkills = users.filter(u => u.role === 'mentor' && u.skills).flatMap(u => u.skills);
        const skillCounts = allSkills.reduce((acc: { [key: string]: number }, skill: string) => { acc[skill] = (acc[skill] || 0) + 1; return acc; }, {});
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

    function renderDiscoveryPage(): void {
        renderRecommendedMentors();
        renderFeaturedMentors();
        renderPopularTags();
        renderMentorList();
    }
    
    function renderAdminDashboard(): void {
        const manageableUsers = users.filter(u => u.role !== 'admin');
        const adminUsers = users.filter(u => u.role === 'admin');
        (document.getElementById('total-users-stat') as HTMLElement).textContent = manageableUsers.length.toString();
        (document.getElementById('total-mentors-stat') as HTMLElement).textContent = manageableUsers.filter(u => u.role === 'mentor').length.toString();
        (document.getElementById('total-mentees-stat') as HTMLElement).textContent = manageableUsers.filter(u => u.role === 'mentee').length.toString();
        (document.getElementById('total-admins-stat') as HTMLElement).textContent = adminUsers.length.toString();
        renderUserListForAdmin();
    }

    function renderUserListForAdmin(): void {
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

    function handleDeleteUser(userId: number): void {
        if (!currentUser || currentUser.role !== 'admin') return;
        const userToDelete = users.find(user => user.id === userId);
        if (!userToDelete || userToDelete.role === 'admin') return;
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
    
    function showLoginFormView(): void {
        registerSection.classList.add('d-none');
        loginContainer.classList.remove('d-none');
    }

    function showRegisterFormView(): void {
        loginContainer.classList.add('d-none');
        registerSection.classList.remove('d-none');
    }

    function handleRequestMentorshipSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (!currentUser) return;
        const mentorId = parseInt((document.getElementById('mentorship-mentor-id') as HTMLInputElement).value, 10);
        const date = (document.getElementById('mentorship-date') as HTMLInputElement).value;
        const time = (document.getElementById('mentorship-time') as HTMLInputElement).value;
        const topic = (document.getElementById('mentorship-topic') as HTMLTextAreaElement).value;
        if (!mentorId || !date || !time || !topic) { showToast("Preencha todos os campos.", 'warning'); return; }
        appointments.push({ id: Date.now(), mentorId: mentorId, menteeId: currentUser.id, date, time, topic, status: 'pendente', createdAt: new Date().toISOString() });
        saveAppointments();
        showToast('Solicitação de agendamento enviada!', 'success');
        requestMentorshipModal.hide();
    }
    
    function renderConversations() {
        if (!currentUser) return;
        conversationsListUl.innerHTML = '';
        const conversationPartners = new Map<number, string>();
        messages.filter(m => m.senderId === currentUser!.id || m.receiverId === currentUser!.id).forEach(m => {
            const partnerId = m.senderId === currentUser!.id ? m.receiverId : m.senderId;
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
            const lastMessage = messages.filter(m => (m.senderId === partnerId && m.receiverId === currentUser!.id) || (m.senderId === currentUser!.id && m.receiverId === partnerId)).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            
            if (partner && lastMessage) {
                conversationsListUl.innerHTML += `<li class="list-group-item list-group-item-action" style="cursor: pointer;" data-conversation-with="${partner.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${partner.name}</h5><small>${new Date(lastMessage.timestamp).toLocaleDateString()}</small></div><p class="mb-1 text-truncate"><strong>${lastMessage.subject || '(Sem assunto)'}:</strong> ${lastMessage.body}</p></li>`;
            }
        });
    }

    function handleSendMessage(e: SubmitEvent) {
        e.preventDefault();
        if(!currentUser) return;
        const recipientId = parseInt((document.getElementById('message-recipient-id') as HTMLInputElement).value, 10);
        const subject = (document.getElementById('message-subject') as HTMLInputElement).value;
        const body = (document.getElementById('message-body') as HTMLTextAreaElement).value;
        if (!recipientId || !body) { showToast('Mensagem não pode estar vazia.', 'warning'); return; }
        messages.push({ id: Date.now(), senderId: currentUser.id, receiverId: recipientId, subject: subject, body: body, timestamp: new Date().toISOString() });
        saveMessages();
        showToast('Mensagem enviada com sucesso!', 'success');
        composeMessageForm.reset();
        composeMessageModal.hide();
        renderConversations();
        switchView('mensagem-section');
    }
    
    function renderForumTopics() {
        const container = document.querySelector('#forum-card-body .list-group') as HTMLElement;
        container.innerHTML = '';
        if (forumTopics.length === 0) {
            container.innerHTML = '<p class="text-muted">Ainda não há tópicos no fórum. Seja o primeiro a criar um!</p>';
            return;
        }
        forumTopics.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).forEach(topic => {
            const author = users.find(u => u.id === topic.authorId);
            container.innerHTML += `<a href="#" class="list-group-item list-group-item-action" data-topic-id="${topic.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${topic.title}</h5><small>${new Date(topic.createdAt).toLocaleDateString()}</small></div><p class="mb-1">${topic.body.substring(0, 150)}...</p><small>Por ${author ? author.name : 'Usuário Removido'} • ${topic.replies.length} respostas</small></a>`;
        });
    }

    function handleFeedbackSubmit(e: SubmitEvent) {
        e.preventDefault();
        const appointmentId = parseInt((document.getElementById('feedback-appointment-id') as HTMLInputElement).value);
        const rating = parseInt(feedbackStarsContainer.dataset.rating || '0');
        const comment = (document.getElementById('feedback-comment') as HTMLTextAreaElement).value;
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
    
    function handleCreateTopic(e: SubmitEvent) {
        e.preventDefault();
        if (!currentUser) return;
        const title = (document.getElementById('topic-title') as HTMLInputElement).value;
        const body = (document.getElementById('topic-body') as HTMLTextAreaElement).value;
        if (!title || !body) { showToast('Título e mensagem são obrigatórios.', 'warning'); return; }
        forumTopics.push({ id: Date.now(), title, body, authorId: currentUser.id, createdAt: new Date().toISOString(), replies: [] });
        saveForumTopics();
        showToast('Tópico criado com sucesso!', 'success');
        createTopicForm.reset();
        createTopicModal.hide();
        renderForumTopics();
    }

    function initCalendar(): void {
        if (!currentUser) return;
        if (calendar) {
            calendar.destroy();
        }
        const myAppointments = appointments.filter(a => a.menteeId === currentUser!.id || a.mentorId === currentUser!.id);
        const calendarEvents = myAppointments.map(app => {
            const otherUser = users.find(u => u.id === (currentUser!.role === 'mentee' ? app.mentorId : app.menteeId));
            let color = '#0d6efd';
            if (app.status === 'pendente') color = '#ffc107';
            if (app.status === 'aceito') color = '#198754';
            if (app.status === 'realizado' || app.status === 'avaliado') color = '#6c757d';
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
            eventClick: function (info: any) {
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

    function renderAppointments(): void {
        if (!currentUser) return;
        if (currentUser.role === 'mentee') {
            initCalendar();
        } else if (currentUser.role === 'mentor') {
            // Lógica completa de renderização para a visão do mentor.
        }
    }

    function switchView(targetViewId: string): void {
        if (!currentUser) return;
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-view="${targetViewId}"]`);
        if (activeLink) activeLink.classList.add('active');
        views.forEach(view => view.classList.toggle('d-none', view.id !== targetViewId));
        
        if (targetViewId === 'agendamento-section') {
            mentorAppointmentView.style.display = currentUser.role === 'mentor' ? 'block' : 'none';
            calendarContainer.style.display = currentUser.role === 'mentee' ? 'block' : 'none';
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

    function init(): void {
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

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handlePublicRegister);
    showRegisterBtn.addEventListener('click', showRegisterFormView);
    showLoginBtn.addEventListener('click', showLoginFormView);
    logoutBtn.addEventListener('click', () => {
        clearCurrentUser();
        window.location.reload();
    });

    editProfileBtn.addEventListener('click', () => {
        if (!currentUser) return;
        (document.getElementById('edit-name') as HTMLInputElement).value = currentUser.name;
        (document.getElementById('edit-bio') as HTMLTextAreaElement).value = currentUser.bio || '';
        (document.getElementById('edit-skills') as HTMLInputElement).value = currentUser.skills ? currentUser.skills.join(', ') : '';
        (document.getElementById('edit-availability') as HTMLTextAreaElement).value = currentUser.availability || '';
        const mentorOnlyFields = document.querySelectorAll('#edit-bio, #edit-availability');
        mentorOnlyFields.forEach(field => (field.closest('.mb-3') as HTMLElement).hidden = currentUser!.role !== 'mentor');
        editProfileModal.show();
    });

    editProfileForm.addEventListener('submit', handleProfileUpdate);

    addUserBtn.addEventListener('click', () => addUserModal.show());
    addUserForm.addEventListener('submit', handleAdminAddUser);
    
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = (e.currentTarget as HTMLElement).dataset.view;
            if (view) {
                switchView(view);
            }
        });
    });

    userListUl.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('btn-delete-user')) {
            const userId = parseInt(target.dataset.id!, 10);
            handleDeleteUser(userId);
        }
    });

    searchMentorInput.addEventListener('input', (e) => {
        renderMentorList((e.target as HTMLInputElement).value);
    });

    const handleViewProfileClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('.btn-view-profile');
        if (btn) {
            const mentorId = parseInt(btn.getAttribute('data-id')!, 10);
            showMentorProfile(mentorId);
        }
    };

    document.getElementById('mentors-list-container')!.addEventListener('click', handleViewProfileClick);
    document.getElementById('recommended-mentors-container')!.addEventListener('click', handleViewProfileClick);
    document.getElementById('featured-mentors-container')!.addEventListener('click', handleViewProfileClick);

    sendMessageFromProfileBtn.addEventListener('click', (e) => {
        const mentorId = parseInt((e.currentTarget as HTMLElement).dataset.mentorId!);
        const mentor = users.find(u => u.id === mentorId);
        if(!mentor) return;
        (document.getElementById('message-recipient-id') as HTMLInputElement).value = mentor.id.toString();
        (document.getElementById('message-recipient-name') as HTMLInputElement).value = mentor.name;
        viewProfileModal.hide();
        composeMessageModal.show();
    });

    requestMentorshipBtn.addEventListener('click', (e) => {
        const mentorId = (e.currentTarget as HTMLElement).dataset.mentorId;
        (document.getElementById('mentorship-mentor-id') as HTMLInputElement).value = mentorId || '';
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