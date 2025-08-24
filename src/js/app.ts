import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap';
import '/src/css/style.css';
import '/src/css/calendar.css';
import { Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

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

document.addEventListener('DOMContentLoaded', function () {
    const authWrapper = document.getElementById('auth-wrapper') as HTMLElement;
    const appWrapper = document.getElementById('app-wrapper') as HTMLElement;
    const loginContainer = document.getElementById('login-container') as HTMLElement;
    const registerSection = document.getElementById('cadastro-section') as HTMLElement;
    const forgotPasswordSection = document.getElementById('forgot-password-section') as HTMLElement;
    const resetPasswordSection = document.getElementById('reset-password-section') as HTMLElement;
    const loginForm = document.getElementById('form-login') as HTMLFormElement;
    const registerForm = document.getElementById('form-cadastro') as HTMLFormElement;
    const forgotPasswordForm = document.getElementById('form-forgot-password') as HTMLFormElement;
    const resetPasswordForm = document.getElementById('form-reset-password') as HTMLFormElement;
    const showRegisterBtn = document.getElementById('btn-show-register-form') as HTMLButtonElement;
    const showLoginBtn = document.getElementById('btn-show-login-form') as HTMLButtonElement;
    const showForgotPasswordBtn = document.getElementById('btn-forgot-password') as HTMLAnchorElement;
    const backToLoginBtn = document.getElementById('btn-back-to-login') as HTMLButtonElement;
    const logoutBtn = document.getElementById('btn-logout') as HTMLButtonElement;
    const views = document.querySelectorAll<HTMLElement>('.content-view');
    const sidebar = document.getElementById('app-sidebar') as HTMLElement;
    const sidebarBackdrop = document.getElementById('sidebar-backdrop') as HTMLElement;
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar') as HTMLButtonElement;
    const closeSidebarBtn = document.getElementById('btn-close-sidebar') as HTMLButtonElement;
    const sidebarUsername = document.getElementById('sidebar-username') as HTMLSpanElement;
    const sidebarAvatar = document.getElementById('sidebar-avatar') as HTMLImageElement;
    const mentorsListContainer = document.getElementById('mentors-list-container') as HTMLElement;
    const searchMentorInput = document.getElementById('search-mentor-input') as HTMLInputElement;
    const userListUl = document.getElementById('users-list-ul') as HTMLUListElement;
    const navItems: { [key: string]: HTMLElement | null } = {
        dashboard: document.getElementById('nav-dashboard'),
        buscar: document.getElementById('nav-buscar-mentores'),
        agendamentos: document.getElementById('nav-agendamentos'),
        mensagens: document.getElementById('nav-mensagens'),
        forum: document.getElementById('nav-forum'),
        admin: document.getElementById('nav-admin'),
    };
    const editProfileBtn = document.getElementById('btn-edit-profile') as HTMLButtonElement;
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal') as HTMLElement);
    const editProfileForm = document.getElementById('form-edit-profile') as HTMLFormElement;
    const addUserBtn = document.getElementById('btn-add-user') as HTMLButtonElement;
    const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal') as HTMLElement);
    const addUserForm = document.getElementById('form-add-user') as HTMLFormElement;
    const viewProfileModal = new bootstrap.Modal(document.getElementById('viewProfileModal') as HTMLElement);
    const requestMentorshipBtn = document.getElementById('btn-request-mentorship') as HTMLButtonElement;
    const sendMessageFromProfileBtn = document.getElementById('btn-send-message-from-profile') as HTMLButtonElement;
    const composeMessageModal = new bootstrap.Modal(document.getElementById('composeMessageModal') as HTMLElement);
    const composeMessageForm = document.getElementById('form-compose-message') as HTMLFormElement;
    const conversationsListUl = document.getElementById('conversations-list-ul') as HTMLUListElement;
    const requestMentorshipModal = new bootstrap.Modal(document.getElementById('requestMentorshipModal') as HTMLElement);
    const requestMentorshipForm = document.getElementById('form-request-mentorship') as HTMLFormElement;
    const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal') as HTMLElement);
    const feedbackForm = document.getElementById('form-send-feedback') as HTMLFormElement;
    const feedbackStarsContainer = document.getElementById('feedback-stars') as HTMLElement;
    const createTopicBtn = document.getElementById('btn-create-topic') as HTMLButtonElement;
    const createTopicModal = new bootstrap.Modal(document.getElementById('createTopicModal') as HTMLElement);
    const createTopicForm = document.getElementById('form-create-topic') as HTMLFormElement;
    const viewTopicModal = new bootstrap.Modal(document.getElementById('viewTopicModal') as HTMLElement);
    const replyTopicForm = document.getElementById('form-reply-topic') as HTMLFormElement;
    const popularTagsContainer = document.getElementById('popular-tags-container') as HTMLElement;
    const calendarContainer = document.getElementById('calendar-container') as HTMLElement;
    const mentorAppointmentView = document.getElementById('mentor-appointment-view') as HTMLElement;
    const mobileHeaderTitle = document.getElementById('mobile-header-title') as HTMLElement;
    const toastElement = document.getElementById('appToast') as HTMLElement;
    const appToast = new bootstrap.Toast(toastElement, { delay: 4000 });
    const confirmModalElement = document.getElementById('confirmModal') as HTMLElement;
    const appConfirmModal = new bootstrap.Modal(confirmModalElement);
    const infoModalElement = document.getElementById('infoModal') as HTMLElement;
    const appInfoModal = new bootstrap.Modal(infoModalElement);
    
    let users: User[] = JSON.parse(localStorage.getItem('mentoring_users') || '[]');
    let appointments: Appointment[] = JSON.parse(localStorage.getItem('mentoring_appointments') || '[]');
    let messages: Message[] = JSON.parse(localStorage.getItem('mentoring_messages') || '[]');
    let forumTopics: ForumTopic[] = JSON.parse(localStorage.getItem('mentoring_forum_topics') || '[]');
    let currentUser: User | null = JSON.parse(sessionStorage.getItem('mentoring_currentUser') || 'null');
    let calendar: Calendar | null = null;
    let currentOpenTopicId: number | null = null;
    let userToResetPasswordId: number | null = null;

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
        if (confirmBtn.parentNode) {
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        }
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

    function getAvatarUrl(user: User | null | undefined): string {
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
        const completedAppointments = appointments.filter(a => a.mentorId === mentor.id && (a.status === 'realizado' || a.status === 'avaliado')).sort((a: Appointment, b: Appointment) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
            navItems.dashboard?.classList.remove('d-none');
            navItems.buscar?.classList.remove('d-none');
            navItems.agendamentos?.classList.remove('d-none');
            navItems.mensagens?.classList.remove('d-none');
            navItems.forum?.classList.remove('d-none');
            switchView('dashboard-section');
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
        if (users.some(user => user.username === userData.username)) {
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
            <div class="col-12 col-md-6 col-lg-4">
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
        const popularSkills = Object.entries(skillCounts).sort(([, a]: [string, number], [, b]: [string, number]) => b - a).slice(0, 5).map(([skill]) => skill);
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
        forgotPasswordSection.classList.add('d-none');
        resetPasswordSection.classList.add('d-none');
        loginContainer.classList.remove('d-none');
    }

    function showRegisterFormView(): void {
        loginContainer.classList.add('d-none');
        forgotPasswordSection.classList.add('d-none');
        resetPasswordSection.classList.add('d-none');
        registerSection.classList.remove('d-none');
    }

    function showForgotPasswordView(): void {
        loginContainer.classList.add('d-none');
        registerSection.classList.add('d-none');
        resetPasswordSection.classList.add('d-none');
        forgotPasswordSection.classList.remove('d-none');
    }

    function showResetPasswordView(): void {
        loginContainer.classList.add('d-none');
        registerSection.classList.add('d-none');
        forgotPasswordSection.classList.add('d-none');
        resetPasswordSection.classList.remove('d-none');
    }

    function handleForgotPasswordRequest(e: SubmitEvent) {
        e.preventDefault();
        const email = (forgotPasswordForm.querySelector('input[name="email"]') as HTMLInputElement).value;
        const user = users.find(u => u.email === email);
    
        if (user) {
            userToResetPasswordId = user.id;
            showToast('Usuário encontrado! Por favor, defina uma nova senha.', 'success');
            showResetPasswordView();
        } else {
            showToast('Se o e-mail estiver correto, instruções foram enviadas.', 'info');
            showLoginFormView();
        }
        forgotPasswordForm.reset();
    }

    function handlePasswordReset(e: SubmitEvent) {
        e.preventDefault();
        if (userToResetPasswordId === null) return;
    
        const newPassword = (resetPasswordForm.querySelector('input[name="newPassword"]') as HTMLInputElement).value;
        const confirmPassword = (resetPasswordForm.querySelector('input[name="confirmPassword"]') as HTMLInputElement).value;
    
        if (newPassword.length < 6) {
            showToast('A nova senha deve ter no mínimo 6 caracteres.', 'warning');
            return;
        }
    
        if (newPassword !== confirmPassword) {
            showToast('As senhas não coincidem.', 'danger');
            return;
        }
    
        const userIndex = users.findIndex(u => u.id === userToResetPasswordId);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            saveUsers();
            showToast('Senha redefinida com sucesso! Você já pode fazer o login.', 'success');
            userToResetPasswordId = null;
            resetPasswordForm.reset();
            showLoginFormView();
        } else {
            showToast('Ocorreu um erro ao redefinir a senha.', 'danger');
        }
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
        const sortedPartners = [...conversationPartners.entries()].sort((a: [number, string], b: [number, string]) => new Date(b[1]).getTime() - new Date(a[1]).getTime());
        sortedPartners.forEach(([partnerId]) => {
            const partner = users.find(u => u.id === partnerId);
            const lastMessage = messages.filter(m => (m.senderId === partnerId && m.receiverId === currentUser!.id) || (m.senderId === currentUser!.id && m.receiverId === partnerId)).sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            
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
    
    function processPostContent(content: string): string {
        const youtubeVideoRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const youtubePlaylistRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/;
    
        const playlistMatch = content.match(youtubePlaylistRegex);
        if (playlistMatch && playlistMatch[1]) {
            const playlistId = playlistMatch[1];
            return `
                <div class="youtube-embed-container my-3">
                    <iframe 
                        width="100%" 
                        height="315" 
                        src="https://www.youtube.com/embed/videoseries?list=${playlistId}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        }
    
        const videoMatch = content.match(youtubeVideoRegex);
        if (videoMatch && videoMatch[1]) {
            const videoId = videoMatch[1];
            return `
                <div class="youtube-embed-container my-3">
                    <iframe 
                        width="100%" 
                        height="315" 
                        src="https://www.youtube.com/embed/${videoId}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        }
    
        return content;
    }

    function renderForumTopics() {
        const container = document.querySelector('#forum-card-body .list-group') as HTMLElement;
        container.innerHTML = '';
        if (forumTopics.length === 0) {
            container.innerHTML = '<p class="text-muted">Ainda não há tópicos no fórum. Seja o primeiro a criar um!</p>';
            return;
        }
        
        forumTopics.sort((a: ForumTopic, b: ForumTopic) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).forEach(topic => {
            const author = users.find(u => u.id === topic.authorId);
            const processedBody = processPostContent(topic.body);
    
            container.innerHTML += `
                <a href="#" class="list-group-item list-group-item-action" data-topic-id="${topic.id}">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${topic.title}</h5>
                        <small>${new Date(topic.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div class="forum-post-body mt-2">${processedBody}</div> 
                    <small class="d-block mt-2">Por ${author ? author.name : 'Usuário Removido'} • ${topic.replies.length} respostas</small>
                </a>`;
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

    function renderTopicView(topicId: number): void {
        const topic = forumTopics.find(t => t.id === topicId);
        if (!topic) {
            showToast('Tópico não encontrado.', 'danger');
            return;
        }
    
        currentOpenTopicId = topicId;
    
        const modalTitle = document.getElementById('view-topic-title') as HTMLElement;
        modalTitle.textContent = topic.title;
    
        const repliesContainer = document.getElementById('topic-replies-container') as HTMLElement;
        repliesContainer.innerHTML = '';
    
        const originalPostAuthor = users.find(u => u.id === topic.authorId);
        const processedBody = processPostContent(topic.body);
        const originalPostHtml = `
            <div class="card mb-4">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${getAvatarUrl(originalPostAuthor)}" class="rounded-circle me-3" width="40" height="40" alt="Avatar">
                        <div>
                            <h6 class="mb-0">${originalPostAuthor ? originalPostAuthor.name : 'Usuário Removido'}</h6>
                            <small class="text-muted">Postado em ${new Date(topic.createdAt).toLocaleDateString()}</small>
                        </div>
                    </div>
                    <div class="forum-post-body">${processedBody}</div>
                </div>
            </div>
            <h5 class="mb-3">Respostas (${topic.replies.length})</h5>
        `;
        repliesContainer.innerHTML += originalPostHtml;
    
        if (topic.replies.length > 0) {
            topic.replies.forEach(reply => {
                const replyAuthor = users.find(u => u.id === reply.authorId);
                const replyHtml = `
                    <div class="d-flex align-items-start mb-3">
                        <img src="${getAvatarUrl(replyAuthor)}" class="rounded-circle me-3" width="35" height="35" alt="Avatar">
                        <div class="w-100">
                            <div class="bg-light p-3 rounded">
                                <div class="d-flex justify-content-between">
                                    <h6 class="mb-1 small">${replyAuthor ? replyAuthor.name : 'Usuário Removido'}</h6>
                                    <small class="text-muted">${new Date(reply.createdAt).toLocaleDateString()}</small>
                                </div>
                                <p class="mb-0 small">${reply.body}</p>
                            </div>
                        </div>
                    </div>
                `;
                repliesContainer.innerHTML += replyHtml;
            });
        } else {
            repliesContainer.innerHTML += '<p class="text-center text-muted">Nenhuma resposta ainda. Seja o primeiro a comentar!</p>';
        }
    
        viewTopicModal.show();
    }

    function handleReplyToTopic(e: SubmitEvent): void {
        e.preventDefault();
        if (!currentUser || currentOpenTopicId === null) return;
    
        const replyBodyInput = document.getElementById('reply-topic-body') as HTMLTextAreaElement;
        const replyBody = replyBodyInput.value.trim();
    
        if (!replyBody) {
            showToast('A resposta não pode estar vazia.', 'warning');
            return;
        }
    
        const topic = forumTopics.find(t => t.id === currentOpenTopicId);
        if (topic) {
            const newReply: ForumReply = {
                id: Date.now(),
                authorId: currentUser.id,
                body: replyBody,
                createdAt: new Date().toISOString()
            };
    
            topic.replies.push(newReply);
            saveForumTopics();
            
            replyTopicForm.reset();
            renderTopicView(currentOpenTopicId);
        }
    }

    function initCalendar(): void {
        if (!currentUser) return;
        if (calendar) {
            calendar.destroy();
        }

        const isMobile = window.innerWidth < 768;
        const myAppointments = appointments.filter(a => a.menteeId === currentUser!.id || a.mentorId === currentUser!.id);
        
        const calendarEvents = myAppointments.map(app => {
            const otherUserId = currentUser!.role === 'mentee' ? app.mentorId : app.menteeId;
            const otherUser = users.find(u => u.id === otherUserId);

            const eventTitle = otherUser 
                ? `Mentoria com ${otherUser.name}` 
                : 'Mentoria (Usuário Removido)';

            let color = '#0d6efd';
            if (app.status === 'pendente') color = '#ffc107';
            if (app.status === 'aceito') color = '#198754';
            if (app.status === 'realizado' || app.status === 'avaliado') color = '#6c757d';

            return {
                id: app.id.toString(),
                title: eventTitle,
                start: `${app.date}T${app.time}`,
                color: color,
                extendedProps: {
                    topic: app.topic,
                    status: app.status
                }
            };
        });

        calendar = new Calendar(calendarContainer, {
            plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
            locale: 'pt-br',
            buttonText: { today: 'hoje', month: 'mês', week: 'semana', day: 'dia', list: 'lista' },
            allDayText: 'Dia',
            headerToolbar: isMobile 
                ? { left: 'prev,next', center: 'title', right: 'today' }
                : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
            height: '100%',
            initialView: isMobile ? 'listWeek' : 'dayGridMonth',
            events: calendarEvents,
            eventClick: function (info: EventClickArg) {
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
            renderMentorDashboard();
        }
    }

    function handleAcceptAppointment(appId: number): void {
        const appointment = appointments.find(app => app.id === appId);
        if (appointment) {
            appointment.status = 'aceito';
            saveAppointments();
            renderMentorDashboard();
            showToast('Agendamento aceito com sucesso!', 'success');
        }
    }
    
    function handleDeclineAppointment(appId: number): void {
        const appointment = appointments.find(app => app.id === appId);
        if (appointment) {
            const mentee = users.find(u => u.id === appointment.menteeId);
            showConfirm(
                'Recusar Agendamento',
                `Tem certeza que deseja recusar a mentoria com ${mentee ? mentee.name : 'este usuário'}?`,
                () => {
                    appointment.status = 'recusado';
                    saveAppointments();
                    renderMentorDashboard();
                    showToast('Agendamento recusado.', 'info');
                }
            );
        }
    }

    function renderMentorDashboard(): void {
        if (!currentUser || currentUser.role !== 'mentor') return;
    
        const myAppointments = appointments.filter(app => app.mentorId === currentUser!.id);
    
        const completedCount = myAppointments.filter(app => app.status === 'realizado' || app.status === 'avaliado').length;
        const mentees = new Set(myAppointments.map(app => app.menteeId));
        const menteeCount = mentees.size;
    
        const upcomingAppointments = myAppointments
            .filter(app => new Date(`${app.date}T${app.time}`) >= new Date() && (app.status === 'pendente' || app.status === 'aceito'))
            .sort((a: Appointment, b: Appointment) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
        
        const nextAppointment = upcomingAppointments[0];
    
        (document.getElementById('mentor-stats-total') as HTMLElement).textContent = completedCount.toString();
        (document.getElementById('mentor-stats-mentees') as HTMLElement).textContent = menteeCount.toString();
        if (nextAppointment) {
            const mentee = users.find(u => u.id === nextAppointment.mentorId);
            (document.getElementById('mentor-stats-next') as HTMLElement).textContent = 
             `${new Date(nextAppointment.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} com ${mentee ? mentee.name : 'Desconhecido'}`;
        } else {
            (document.getElementById('mentor-stats-next') as HTMLElement).textContent = 'Nenhum';
        }
    
        const upcomingList = document.getElementById('upcoming-appointments-list') as HTMLElement;
        upcomingList.innerHTML = '';
        if (upcomingAppointments.length > 0) {
            upcomingAppointments.forEach(app => {
                const mentee = users.find(u => u.id === app.menteeId);
                
                let actionButtons = '';
                if (app.status === 'pendente') {
                    actionButtons = `
                        <button class="btn btn-success btn-sm me-2 btn-accept-appointment" data-id="${app.id}">Aceitar</button>
                        <button class="btn btn-danger btn-sm btn-decline-appointment" data-id="${app.id}">Recusar</button>
                    `;
                }

                const statusBadge = app.status === 'pendente' 
                    ? `<span class="badge bg-warning text-dark">${app.status}</span>`
                    : `<span class="badge bg-success">${app.status}</span>`;

                upcomingList.innerHTML += `
                    <div class="list-group-item d-flex align-items-center gap-3">
                        <img src="${getAvatarUrl(mentee)}" class="rounded-circle" width="45" height="45" alt="Avatar">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">Mentoria com ${mentee ? mentee.name : 'Desconhecido'}</h6>
                            <small class="d-block text-muted">Tópico: ${app.topic}</small>
                        </div>
                        <div class="text-end">
                            <small class="text-muted d-block">${new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</small>
                            <div class="mt-1">
                                ${statusBadge}
                            </div>
                            <div class="mt-2">
                                ${actionButtons}
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            upcomingList.innerHTML = '<p class="text-center text-muted p-3">Nenhum próximo encontro agendado.</p>';
        }
    
        const pastAppointmentsList = document.getElementById('past-appointments-list') as HTMLElement;
        const pastAppointments = myAppointments
         .filter(app => new Date(`${app.date}T${app.time}`) < new Date() || ['recusado', 'realizado', 'avaliado'].includes(app.status))
         .sort((a: Appointment, b: Appointment) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
        
        pastAppointmentsList.innerHTML = '';
        if (pastAppointments.length > 0) {
            pastAppointments.forEach(app => {
                const mentee = users.find(u => u.id === app.menteeId);
                pastAppointmentsList.innerHTML += `
                    <div class="list-group-item d-flex align-items-center gap-3">
                        <img src="${getAvatarUrl(mentee)}" class="rounded-circle" width="45" height="45" alt="Avatar">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between">
                                <h6 class="mb-0">Mentoria com ${mentee ? mentee.name : 'Desconhecido'}</h6>
                                <small class="text-muted">${new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</small>
                            </div>
                            <small class="d-block text-muted">Tópico: ${app.topic}</small>
                        </div>
                        <span class="badge bg-secondary">${app.status}</span>
                    </div>
                `;
            });
        } else {
            pastAppointmentsList.innerHTML = '<p class="text-center text-muted p-3">Nenhum encontro no histórico.</p>';
        }
    }

    function renderMenteeDashboard(): void {
        if (!currentUser || currentUser.role !== 'mentee') return;
    
        const nextAppointmentContainer = document.getElementById('dashboard-next-appointment') as HTMLElement;
        const recentMentorsContainer = document.getElementById('dashboard-recent-mentors') as HTMLElement;
        const suggestedMentorsContainer = document.getElementById('dashboard-suggested-mentors') as HTMLElement;
    
        const myAppointments = appointments.filter(app => app.menteeId === currentUser!.id);
        const nextAppointment = myAppointments
            .filter(app => app.status === 'aceito' && new Date(`${app.date}T${app.time}`) >= new Date())
            .sort((a: Appointment, b: Appointment) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];
    
        if (nextAppointment) {
            const mentor = users.find(u => u.id === nextAppointment.mentorId);
            nextAppointmentContainer.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${getAvatarUrl(mentor)}" class="rounded-circle me-3" width="50" height="50">
                    <div>
                        <h6 class="mb-0">Mentoria com ${mentor ? mentor.name : 'Desconhecido'}</h6>
                        <p class="mb-0 text-muted">${new Date(nextAppointment.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} às ${nextAppointment.time}</p>
                        <p class="mb-0 small"><strong>Tópico:</strong> ${nextAppointment.topic}</p>
                    </div>
                </div>`;
        } else {
            nextAppointmentContainer.innerHTML = '<p class="text-muted">Nenhum próximo encontro agendado.</p>';
        }
    
        const recentMentorIds = [...new Set(myAppointments.map(app => app.mentorId))].slice(0, 3);
        recentMentorsContainer.innerHTML = '';
        if (recentMentorIds.length > 0) {
            recentMentorIds.forEach(mentorId => {
                const mentor = users.find(u => u.id === mentorId);
                if (mentor) {
                    recentMentorsContainer.innerHTML += `
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center gap-3">
                            <img src="${getAvatarUrl(mentor)}" class="rounded-circle" width="35" height="35">
                            <span>${mentor.name}</span>
                        </a>`;
                }
            });
        } else {
            recentMentorsContainer.innerHTML = '<p class="text-muted p-3">Nenhuma interação recente.</p>';
        }
    
        const suggestedMentors = users.filter(user => user.role === 'mentor' && user.course === currentUser!.course && user.id !== currentUser!.id).slice(0, 3);
        suggestedMentorsContainer.innerHTML = '';
        if (suggestedMentors.length > 0) {
            suggestedMentors.forEach(mentor => {
                suggestedMentorsContainer.innerHTML += buildMentorCard(mentor);
            });
        } else {
            suggestedMentorsContainer.innerHTML = '<div class="col-12"><p class="text-muted text-center">Nenhum mentor sugerido no momento.</p></div>';
        }
    }

    function switchView(targetViewId: string): void {
        if (!currentUser) return;
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-view="${targetViewId}"]`);
        if (activeLink && mobileHeaderTitle) {
         mobileHeaderTitle.textContent = activeLink.textContent || 'Mentoring';
        }
        if (activeLink) activeLink.classList.add('active');
        views.forEach(view => view.classList.toggle('d-none', view.id !== targetViewId));
        
        if (targetViewId === 'agendamento-section') {
            if (currentUser.role === 'mentee') {
                mentorAppointmentView.classList.add('d-none');
                calendarContainer.classList.remove('d-none');
                setTimeout(() => {
                    renderAppointments();
                }, 0);
            } else if (currentUser.role === 'mentor') {
                mentorAppointmentView.classList.remove('d-none');
                calendarContainer.classList.add('d-none');
                renderMentorDashboard();
            }
        } else if (targetViewId === 'admin-panel') {
            renderAdminDashboard();
        } else if (targetViewId === 'mensagem-section') {
            renderConversations();
        } else if (targetViewId === 'forum-section') {
            renderForumTopics();
        } else if (targetViewId === 'buscar-mentores-section') {
            renderDiscoveryPage();
        } else if (targetViewId === 'dashboard-section') {
            renderMenteeDashboard();
        }
    }

    function init(): void {
        if (currentUser) {
            authWrapper.classList.add('d-none');
            appWrapper.classList.remove('d-none');
            appWrapper.classList.add('d-flex');
            updateDashboardUI(currentUser);
            toggleSidebarBtn.addEventListener('click', () => {
                sidebar.classList.add('show');
                sidebarBackdrop.classList.remove('d-none');
            });
        } else {
            authWrapper.classList.remove('d-none');
            appWrapper.classList.add('d-none');
        }
    }

    // --- Inicialização e Event Listeners ---
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handlePublicRegister);
    showRegisterBtn.addEventListener('click', showRegisterFormView);
    showLoginBtn.addEventListener('click', showLoginFormView);
    logoutBtn.addEventListener('click', () => {
        clearCurrentUser();
        window.location.reload();
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('show');
        sidebarBackdrop.classList.add('d-none');
    });

    sidebarBackdrop.addEventListener('click', () => {
        sidebar.classList.remove('show');
        sidebarBackdrop.classList.add('d-none');
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
                sidebar.classList.remove('show');
                sidebarBackdrop.classList.add('d-none');
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

    const upcomingAppointmentsList = document.getElementById('upcoming-appointments-list');
    if (upcomingAppointmentsList) {
        upcomingAppointmentsList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            
            const acceptBtn = target.closest('.btn-accept-appointment');
            if (acceptBtn) {
                const appId = parseInt(acceptBtn.getAttribute('data-id')!, 10);
                handleAcceptAppointment(appId);
                return;
            }
    
            const declineBtn = target.closest('.btn-decline-appointment');
            if (declineBtn) {
                const appId = parseInt(declineBtn.getAttribute('data-id')!, 10);
                handleDeclineAppointment(appId);
                return;
            }
        });
    }

    const forumListContainer = document.querySelector('#forum-card-body .list-group');
    if (forumListContainer) {
        forumListContainer.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target as HTMLElement;
            const topicLink = target.closest('.list-group-item-action');

            if (topicLink) {
                const topicId = parseInt(topicLink.getAttribute('data-topic-id')!, 10);
                if (topicId) {
                    renderTopicView(topicId);
                }
            }
        });
    }

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

    showForgotPasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPasswordView();
    });

    backToLoginBtn.addEventListener('click', showLoginFormView);

    forgotPasswordForm.addEventListener('submit', handleForgotPasswordRequest);
    resetPasswordForm.addEventListener('submit', handlePasswordReset);

    composeMessageForm.addEventListener('submit', handleSendMessage);
    requestMentorshipForm.addEventListener('submit', handleRequestMentorshipSubmit);
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    createTopicBtn.addEventListener('click', () => createTopicModal.show());
    createTopicForm.addEventListener('submit', handleCreateTopic);
    replyTopicForm.addEventListener('submit', handleReplyToTopic);
    
    init();
});