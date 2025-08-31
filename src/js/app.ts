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
  role: 'mentee' | 'mentor' | 'admin' | 'professor';
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
  linkedContentId?: number;
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

interface Content {
    id: number;
    authorId: number;
    title: string;
    description: string;
    resources: string;
    createdAt: string;
}

interface ContentSchedule {
  id: number;
  mentorId: number;
  title: string;
  date: string;
  createdAt: string;
}

interface Notification {
  id: number;
  userId: number;
  text: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
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
        notificacoes: document.getElementById('nav-notificacoes'),
        conteudo: document.getElementById('nav-conteudo'),
        admin: document.getElementById('nav-admin'),
    };
    const editProfileBtn = document.getElementById('btn-edit-profile') as HTMLButtonElement;
    const editProfileForm = document.getElementById('form-edit-profile') as HTMLFormElement;
    const addUserBtn = document.getElementById('btn-add-user') as HTMLButtonElement;
    const addUserForm = document.getElementById('form-add-user') as HTMLFormElement;
    const requestMentorshipBtn = document.getElementById('btn-request-mentorship') as HTMLButtonElement;
    const sendMessageFromProfileBtn = document.getElementById('btn-send-message-from-profile') as HTMLButtonElement;
    const composeMessageForm = document.getElementById('form-compose-message') as HTMLFormElement;
    const conversationsListUl = document.getElementById('conversations-list-ul') as HTMLUListElement;
    const requestMentorshipForm = document.getElementById('form-request-mentorship') as HTMLFormElement;
    const feedbackForm = document.getElementById('form-send-feedback') as HTMLFormElement;
    const feedbackStarsContainer = document.getElementById('feedback-stars') as HTMLElement;
    const createTopicBtn = document.getElementById('btn-create-topic') as HTMLButtonElement;
    const createTopicForm = document.getElementById('form-create-topic') as HTMLFormElement;
    const replyTopicForm = document.getElementById('form-reply-topic') as HTMLFormElement;
    const editAppointmentForm = document.getElementById('form-edit-appointment') as HTMLFormElement;
    const popularTagsContainer = document.getElementById('popular-tags-container') as HTMLElement;
    const calendarContainer = document.getElementById('calendar-container') as HTMLElement;
    const mentorAppointmentView = document.getElementById('mentor-appointment-view') as HTMLElement;
    const mobileHeaderTitle = document.getElementById('mobile-header-title') as HTMLElement;
    const scheduleContentForm = document.getElementById('form-schedule-content') as HTMLFormElement;

    const toastElement = document.getElementById('appToast') as HTMLElement;
    const appToast = new bootstrap.Toast(toastElement, { delay: 4000 });
    const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal') as HTMLElement);
    const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal') as HTMLElement);
    const viewProfileModal = new bootstrap.Modal(document.getElementById('viewProfileModal') as HTMLElement);
    const composeMessageModal = new bootstrap.Modal(document.getElementById('composeMessageModal') as HTMLElement);
    const requestMentorshipModal = new bootstrap.Modal(document.getElementById('requestMentorshipModal') as HTMLElement);
    const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal') as HTMLElement);
    const createTopicModal = new bootstrap.Modal(document.getElementById('createTopicModal') as HTMLElement);
    const viewTopicModal = new bootstrap.Modal(document.getElementById('viewTopicModal') as HTMLElement);
    const editAppointmentModal = new bootstrap.Modal(document.getElementById('editAppointmentModal') as HTMLElement);
    const manageContentModal = new bootstrap.Modal(document.getElementById('manageContentModal') as HTMLElement);
    const viewContentModal = new bootstrap.Modal(document.getElementById('viewContentModal') as HTMLElement);
    const scheduleContentModal = new bootstrap.Modal(document.getElementById('scheduleContentModal') as HTMLElement);
    const appConfirmModal = new bootstrap.Modal(document.getElementById('confirmModal') as HTMLElement);
    const appInfoModal = new bootstrap.Modal(document.getElementById('infoModal') as HTMLElement);

    let users: User[] = JSON.parse(localStorage.getItem('mentoring_users') || '[]');
    let appointments: Appointment[] = JSON.parse(localStorage.getItem('mentoring_appointments') || '[]');
    let messages: Message[] = JSON.parse(localStorage.getItem('mentoring_messages') || '[]');
    let forumTopics: ForumTopic[] = JSON.parse(localStorage.getItem('mentoring_forum_topics') || '[]');
    let contents: Content[] = JSON.parse(localStorage.getItem('mentoring_contents') || '[]');
    let contentSchedules: ContentSchedule[] = JSON.parse(localStorage.getItem('mentoring_content_schedules') || '[]');
    let notifications: Notification[] = JSON.parse(localStorage.getItem('mentoring_notifications') || '[]');
    let currentUser: User | null = JSON.parse(sessionStorage.getItem('mentoring_currentUser') || 'null');
    let calendar: Calendar | null = null;
    let currentOpenTopicId: number | null = null;
    let userToResetPasswordId: number | null = null;
    let appointmentToEditId: number | null = null;
    let contentToEditId: number | null = null;
    let currentOpenConversationPartnerId: number | null = null;

    function saveUsers(): void { localStorage.setItem('mentoring_users', JSON.stringify(users)); }
    function saveAppointments(): void { localStorage.setItem('mentoring_appointments', JSON.stringify(appointments)); }
    function saveMessages(): void { localStorage.setItem('mentoring_messages', JSON.stringify(messages)); }
    function saveForumTopics(): void { localStorage.setItem('mentoring_forum_topics', JSON.stringify(forumTopics)); }
    function saveContents(): void { localStorage.setItem('mentoring_contents', JSON.stringify(contents)); }
    function saveContentSchedules(): void { localStorage.setItem('mentoring_content_schedules', JSON.stringify(contentSchedules)); }
    function saveNotifications(): void { localStorage.setItem('mentoring_notifications', JSON.stringify(notifications)); }
    function setCurrentUser(user: User): void { currentUser = user; sessionStorage.setItem('mentoring_currentUser', JSON.stringify(user)); }
    function clearCurrentUser(): void { currentUser = null; sessionStorage.removeItem('mentoring_currentUser'); }

    function createNotification(userId: number, text: string, link?: string): void {
        const newNotification: Notification = {
            id: Date.now(),
            userId,
            text,
            link,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        saveNotifications();
        updateNotificationBadge();
    }

    function updateNotificationBadge(): void {
        if (!currentUser) return;
        const badge = document.getElementById('notification-badge') as HTMLElement;
        const unreadCount = notifications.filter(n => n.userId === currentUser!.id && !n.isRead).length;
        if (unreadCount > 0) {
            badge.textContent = unreadCount.toString();
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    }

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

    function generateStarRatingHTML(averageRating: number, ratingCount: number): string {
        if (ratingCount === 0) {
            return '<span class="text-muted">Ainda não avaliado</span>';
        }
    
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= averageRating) {
                starsHTML += '<i class="bi bi-star-fill text-warning"></i>';
            } else if (i - 0.5 <= averageRating) {
                starsHTML += '<i class="bi bi-star-half text-warning"></i>';
            } else {
                starsHTML += '<i class="bi bi-star text-warning"></i>';
            }
        }
    
        const ratingText = `<span class="ms-2 fw-bold">${averageRating.toFixed(1)}</span> <span class="text-muted small">(${ratingCount} ${ratingCount === 1 ? 'avaliação' : 'avaliações'})</span>`;
        
        return `<div class="d-flex align-items-center">${starsHTML} ${ratingText}</div>`;
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
        const ratingCount = allRatings.length;
        const averageRating = ratingCount > 0 ? (allRatings.reduce((a, b) => a + b, 0) / ratingCount) : 0;
        
        (document.getElementById('modal-profile-avatar') as HTMLImageElement).src = getAvatarUrl(mentor);
        (document.getElementById('modal-profile-name') as HTMLElement).textContent = mentor.name;
        (document.getElementById('modal-profile-course') as HTMLElement).textContent = mentor.course;
        (document.getElementById('modal-profile-bio') as HTMLElement).textContent = mentor.bio || 'Este mentor ainda não adicionou uma biografia.';
        
        const ratingContainer = document.getElementById('modal-profile-rating') as HTMLElement;
        ratingContainer.innerHTML = generateStarRatingHTML(averageRating, ratingCount);
        
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

        const completedAppointments = appointments.filter(a => 
            a.mentorId === mentor.id && 
            a.menteeId === currentUser!.id &&
            (a.status === 'realizado' || a.status === 'avaliado')
        ).sort((a: Appointment, b: Appointment) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (completedAppointments.length > 0) {
            completedAppointments.forEach(app => {
                let actionArea = '';

                if (app.status === 'realizado') {
                    actionArea = `<button class="btn btn-primary btn-sm btn-evaluate-appointment" data-id="${app.id}">Avaliar</button>`;
                } 
                else if (app.status === 'avaliado' && app.feedback) {
                    let stars = '';
                    for(let i = 1; i <= 5; i++) {
                        stars += `<i class="bi bi-star-fill ${i <= app.feedback.rating ? 'text-warning' : 'text-secondary'}"></i>`;
                    }
                    actionArea = `<div class="text-nowrap">${stars}</div>`;
                }

                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center p-2';
                listItem.innerHTML = `
                    <span class="small">"${app.topic}" em ${new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                    ${actionArea}
                `;
                historyList.appendChild(listItem);
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
    (window as any).showMentorProfile = showMentorProfile;

    function updateDashboardUI(user: User): void {
        sidebarUsername.textContent = user.name;
        sidebarAvatar.src = getAvatarUrl(user);
        updateNotificationBadge();
        
        Object.values(navItems).forEach(item => item?.classList.add('d-none'));

        if (user.role === 'mentee') {
            navItems.dashboard?.classList.remove('d-none');
            navItems.buscar?.classList.remove('d-none');
            navItems.agendamentos?.classList.remove('d-none');
            navItems.mensagens?.classList.remove('d-none');
            navItems.forum?.classList.remove('d-none');
            navItems.notificacoes?.classList.remove('d-none');
            switchView('dashboard-section');
        } else if (user.role === 'mentor') {
            navItems.agendamentos?.classList.remove('d-none');
            navItems.mensagens?.classList.remove('d-none');
            navItems.forum?.classList.remove('d-none');
            navItems.conteudo?.classList.remove('d-none');
            navItems.notificacoes?.classList.remove('d-none');
            switchView('agendamento-section');
        } else if (user.role === 'admin' || user.role === 'professor') {
            navItems.admin?.classList.remove('d-none');
            (navItems.admin!.querySelector('.nav-link') as HTMLElement).innerHTML = `<i class="bi bi-sliders"></i> Painel Geral`;
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
            role: userData.role as 'mentee' | 'mentor' | 'admin' | 'professor',
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
            role: userData.role as 'mentee' | 'mentor' | 'professor', 
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
        const ratingCount = allRatings.length;
        const averageRating = ratingCount > 0 ? (allRatings.reduce((a, b) => a + b, 0) / ratingCount) : 0;
    
        const ratingHTML = generateStarRatingHTML(averageRating, ratingCount);
    
        const skillBadges = mentor.skills.slice(0, 2).map(skill => `<span class="badge rounded-pill text-bg-primary bg-opacity-75 me-1 mb-1">${skill}</span>`).join('');
        
        return `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card mentor-card h-100 shadow-sm text-center">
                    <div class="card-body d-flex flex-column">
                        <img src="${getAvatarUrl(mentor)}" class="rounded-circle mb-3 mx-auto" style="width: 90px; height: 90px; object-fit: cover; background-color: #f0f0f0;" alt="Avatar de ${mentor.name}">
                        <h5 class="card-title mb-1">${mentor.name}</h5>
                        <p class="card-text text-muted small">${mentor.course}</p>
                        
                        <div class="d-flex justify-content-center mb-2">
                            ${ratingHTML}
                        </div>

                        <div class="my-3 flex-grow-1">
                            ${skillBadges || '<p class="small text-muted">Nenhuma habilidade informada.</p>'}
                        </div>
                        <button class="btn btn-primary mt-auto btn-view-profile" data-id="${mentor.id}">Ver Perfil</button>
                    </div>
                </div>
            </div>
        `;
    }

    function buildCompactMentorCard(mentor: User): string {
        const skillBadge = mentor.skills.length > 0 
            ? `<span class="badge rounded-pill text-bg-secondary fw-normal">${mentor.skills[0]}</span>` 
            : '';
    
        return `
            <div class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3" style="cursor: pointer;" onclick="showMentorProfile(${mentor.id})">
                <img src="${getAvatarUrl(mentor)}" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover; background-color: #f0f0f0;" alt="Avatar de ${mentor.name}">
                <div class="flex-grow-1">
                    <h6 class="mb-0">${mentor.name}</h6>
                    <small class="text-muted">${mentor.course}</small>
                </div>
                ${skillBadge}
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
        const manageableUsers = users.filter(u => u.role !== 'admin' && u.role !== 'professor');
        const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'professor');
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
            userListUl.innerHTML = '<li class="list-group-item">Nenhum usuário gerenciável registrado.</li>';
            return;
        }
        usersToDisplay.forEach(user => {
            let roleBadgeColor = 'bg-secondary';
            if (user.role === 'mentor') roleBadgeColor = 'bg-success';
            if (user.role === 'mentee') roleBadgeColor = 'bg-info';
            if (user.role === 'professor') roleBadgeColor = 'bg-warning';
            userListUl.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center"><div class="d-flex align-items-center gap-3"><img src="${getAvatarUrl(user)}" class="rounded-circle" style="width: 40px; height: 40px; background-color: #f0f0f0;"><div><strong>${user.name}</strong><small class="d-block text-muted">${user.email}</small></div></div><div><span class="badge ${roleBadgeColor} me-3">${user.role}</span><button class="btn btn-sm btn-outline-danger btn-delete-user" data-id="${user.id}">Remover</button></div></li>`;
        });
    }

    function handleDeleteUser(userId: number): void {
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'professor')) return;
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
        if (!currentUser || currentUser.role !== 'mentee') return;

        const WEEKLY_APPOINTMENT_LIMIT = 7;

        function getWeekBounds(date: Date): { start: Date, end: Date } {
            const firstDay = new Date(date);
            const dayOfWeek = firstDay.getDay();
            const diff = firstDay.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const startOfWeek = new Date(firstDay.setDate(diff));
            startOfWeek.setHours(0, 0, 0, 0);
    
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            return { start: startOfWeek, end: endOfWeek };
        }
    
        const requestedDateStr = (document.getElementById('mentorship-date') as HTMLInputElement).value;
        const requestedDate = new Date(`${requestedDateStr}T00:00:00`);
    
        const { start, end } = getWeekBounds(requestedDate);
    
        const appointmentsInWeek = appointments.filter(app => {
            if (app.menteeId !== currentUser!.id) return false;
            const appDate = new Date(`${app.date}T00:00:00`);
            return appDate >= start && appDate <= end && (app.status === 'pendente' || app.status === 'aceito');
        });
    
        if (appointmentsInWeek.length >= WEEKLY_APPOINTMENT_LIMIT) {
            showToast(`Você já atingiu o limite de ${WEEKLY_APPOINTMENT_LIMIT} agendamento(s) para esta semana.`, 'warning');
            return;
        }

        const mentorId = parseInt((document.getElementById('mentorship-mentor-id') as HTMLInputElement).value, 10);
        const date = (document.getElementById('mentorship-date') as HTMLInputElement).value;
        const time = (document.getElementById('mentorship-time') as HTMLInputElement).value;
        const topic = (document.getElementById('mentorship-topic') as HTMLTextAreaElement).value;

        if (!mentorId || !date || !time || !topic) { 
            showToast("Preencha todos os campos.", 'warning'); 
            return; 
        }
        
        const mentor = users.find(u => u.id === mentorId);
        if(mentor) {
            createNotification(mentorId, `Você recebeu uma nova solicitação de mentoria de ${currentUser.name}.`, 'agendamento-section');
        }

        appointments.push({ 
            id: Date.now(), 
            mentorId: mentorId, 
            menteeId: currentUser.id, 
            date, 
            time, 
            topic, 
            status: 'pendente', 
            createdAt: new Date().toISOString() 
        });

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

    function renderConversationThread(partnerId: number): void {
        if (!currentUser) return;
        const partner = users.find(u => u.id === partnerId);
        if (!partner) {
            showToast('Usuário da conversa não encontrado.', 'danger');
            return;
        }

        currentOpenConversationPartnerId = partnerId;

        const modalTitle = document.getElementById('viewConversationModalLabel') as HTMLElement;
        const modalBody = document.getElementById('conversation-thread-body') as HTMLElement;

        modalTitle.textContent = `Conversa com ${partner.name}`;
        modalBody.innerHTML = '';

        const conversationMessages = messages
            .filter(m =>
                (m.senderId === currentUser!.id && m.receiverId === partnerId) ||
                (m.senderId === partnerId && m.receiverId === currentUser!.id)
            )
            .sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        if (conversationMessages.length === 0) {
            modalBody.innerHTML = '<p class="text-center text-muted">Nenhuma mensagem nesta conversa ainda.</p>';
        } else {
            conversationMessages.forEach(msg => {
                const isSent = msg.senderId === currentUser!.id;
                const bubbleClass = isSent ? 'message-sent' : 'message-received';

                const messageHtml = `
                    <div class="conversation-bubble ${bubbleClass}">
                        <p class="mb-1"><strong>${msg.subject || '(Sem assunto)'}</strong></p>
                        <p class="mb-0 small">${msg.body}</p>
                        <small class="d-block text-end mt-2 opacity-75">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                `;
                modalBody.innerHTML += messageHtml;
            });
        }
        
        const viewConversationModal = new bootstrap.Modal(document.getElementById('viewConversationModal') as HTMLElement);
        viewConversationModal.show();
        setTimeout(() => {
            modalBody.scrollTop = modalBody.scrollHeight;
        }, 100);
    }

    function handleSendMessage(e: SubmitEvent) {
        e.preventDefault();
        if(!currentUser) return;
        const recipientId = parseInt((document.getElementById('message-recipient-id') as HTMLInputElement).value, 10);
        const subject = (document.getElementById('message-subject') as HTMLInputElement).value;
        const body = (document.getElementById('message-body') as HTMLTextAreaElement).value;
        if (!recipientId || !body) { showToast('Mensagem não pode estar vazia.', 'warning'); return; }
        messages.push({ id: Date.now(), senderId: currentUser.id, receiverId: recipientId, subject: subject, body: body, timestamp: new Date().toISOString() });
        createNotification(recipientId, `Você recebeu uma nova mensagem de ${currentUser.name}.`, 'mensagem-section');
        saveMessages();
        showToast('Mensagem enviada com sucesso!', 'success');
        composeMessageForm.reset();
        composeMessageModal.hide();
        renderConversations();
        switchView('mensagem-section');
    }
    
    function handleReplyToMessage(e: SubmitEvent): void {
        e.preventDefault();
        if (!currentUser || currentOpenConversationPartnerId === null) return;

        const replyForm = e.target as HTMLFormElement;
        const replyBodyInput = document.getElementById('reply-message-body') as HTMLTextAreaElement;
        const body = replyBodyInput.value.trim();

        if (!body) return;

        const lastMessage = messages
            .filter(m =>
                (m.senderId === currentUser!.id && m.receiverId === currentOpenConversationPartnerId) ||
                (m.senderId === currentOpenConversationPartnerId && m.receiverId === currentUser!.id)
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        messages.push({
            id: Date.now(),
            senderId: currentUser.id,
            receiverId: currentOpenConversationPartnerId,
            subject: lastMessage ? lastMessage.subject : 'Re:',
            body: body,
            timestamp: new Date().toISOString()
        });
        
        createNotification(currentOpenConversationPartnerId, `Você recebeu uma nova resposta de ${currentUser.name}.`, 'mensagem-section');
        saveMessages();
        replyForm.reset();
        renderConversationThread(currentOpenConversationPartnerId);
        renderConversations();
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
                        frameBorder="0" 
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
                        frameBorder="0" 
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
        createNotification(appointment.mentorId, `${currentUser?.name} avaliou o encontro de vocês.`, 'agendamento-section');
        saveAppointments();
        showToast('Avaliação enviada com sucesso. Obrigado!', 'success');
        feedbackModal.hide();
        
        if(currentUser?.role === 'mentor') {
            renderMentorDashboard();
        }
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
            if(currentUser.id !== topic.authorId) {
                createNotification(topic.authorId, `${currentUser.name} respondeu ao seu tópico '${topic.title}'.`, 'forum-section');
            }
            saveForumTopics();
            
            replyTopicForm.reset();
            renderTopicView(currentOpenTopicId);
        }
    }

    function initCalendar(): void {
        if (!currentUser) return;
        if (calendar) calendar.destroy();
        const isMobile = window.innerWidth < 768;
        
        let events: any[] = [];
    
        if (currentUser.role === 'mentee') {
            const myAppointments = appointments.filter(a => a.menteeId === currentUser!.id);
            const appointmentEvents = myAppointments.map(app => {
                const otherUser = users.find(u => u.id === app.mentorId);
                const eventTitle = otherUser ? `Mentoria com ${otherUser.name}` : 'Mentoria';
                let color = '#0d6efd';
                if (app.status === 'pendente') color = '#ffc107';
                if (app.status === 'aceito') color = '#198754';
                if (['realizado', 'avaliado'].includes(app.status)) color = '#6c757d';
                return { id: `app-${app.id}`, title: eventTitle, start: `${app.date}T${app.time}`, color, extendedProps: { type: 'appointment', ...app } };
            });
            const contentScheduleEvents = contentSchedules.map(schedule => {
                const mentor = users.find(u => u.id === schedule.mentorId);
                return { id: `cs-${schedule.id}`, title: `Conteúdo: ${schedule.title}`, start: schedule.date, allDay: true, color: '#fd7e14', extendedProps: { type: 'content-schedule', mentorName: mentor?.name || 'Desconhecido', ...schedule } };
            });
            events.push(...appointmentEvents, ...contentScheduleEvents);
        } else if (currentUser.role === 'mentor') {
            const myAppointments = appointments.filter(a => a.mentorId === currentUser!.id);
            const myContentSchedules = contentSchedules.filter(cs => cs.mentorId === currentUser!.id);
            const appointmentEvents = myAppointments.map(app => {
                const otherUser = users.find(u => u.id === app.menteeId);
                return { id: `app-${app.id}`, title: `Mentoria com ${otherUser?.name || 'Desconhecido'}`, start: `${app.date}T${app.time}`, color: '#198754', extendedProps: { type: 'appointment', ...app } };
            });
            const contentScheduleEvents = myContentSchedules.map(schedule => ({ id: `cs-${schedule.id}`, title: `Publicar: ${schedule.title}`, start: schedule.date, allDay: true, color: '#fd7e14', extendedProps: { type: 'content-schedule', ...schedule } }));
            events.push(...appointmentEvents, ...contentScheduleEvents);
        }

        calendar = new Calendar(calendarContainer, {
            plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
            locale: 'pt-br',
            buttonText: { today: 'hoje', month: 'mês', week: 'semana', day: 'dia', list: 'lista' },
            allDayText: 'Dia',
            headerToolbar: isMobile 
                ? { left: 'prev,next', center: 'title', right: 'today' }
                : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' },
            height: '100%',
            initialView: isMobile ? 'listWeek' : 'dayGridMonth',
            events: events,
            dateClick: (info) => {
                if (currentUser?.role === 'mentor') {
                    openScheduleContentModal(info.dateStr);
                }
            },
            eventClick: function (info: EventClickArg) {
                const props = info.event.extendedProps;
                let eventBody = '';
                if(props.type === 'appointment') {
                    const otherUser = users.find(u => u.id === (currentUser?.role === 'mentee' ? props.mentorId : props.menteeId));
                    eventBody = `<p><strong>Com:</strong> ${otherUser?.name || 'Desconhecido'}</p>
                                 <p><strong>Data:</strong> ${info.event.start?.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                 <p><strong>Tópico:</strong> ${props.topic}</p>
                                 <p><strong>Status:</strong> <span class="badge" style="background-color: ${info.event.backgroundColor}">${props.status}</span></p>`;
                } else if (props.type === 'content-schedule') {
                     eventBody = `<p><strong>Mentor:</strong> ${props.mentorName || 'Desconhecido'}</p>
                                  <p><strong>Data de Publicação:</strong> ${info.event.start?.toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>
                                  <p><strong>Material:</strong> ${info.event.title.replace('Conteúdo: ', '').replace('Publicar: ', '')}</p>`;
                }
                showInfo('Detalhes do Evento', eventBody);
            }
        });
        calendar.render();
    }

    function openScheduleContentModal(dateStr: string): void {
        scheduleContentForm.reset();
        (document.getElementById('schedule-content-date') as HTMLInputElement).value = dateStr;
        (document.getElementById('schedule-content-date-display') as HTMLInputElement).value = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { dateStyle: 'full', timeZone: 'UTC' });
        scheduleContentModal.show();
    }

    function handleScheduleContentSubmit(e: SubmitEvent): void {
        e.preventDefault();
        if (!currentUser || currentUser.role !== 'mentor') return;
        const title = (document.getElementById('schedule-content-title') as HTMLInputElement).value;
        const date = (document.getElementById('schedule-content-date') as HTMLInputElement).value;
        if(!title || !date) { showToast('Título é obrigatório.', 'warning'); return; }
        const newSchedule: ContentSchedule = {
            id: Date.now(),
            mentorId: currentUser.id,
            title, date,
            createdAt: new Date().toISOString()
        };
        contentSchedules.push(newSchedule);
        saveContentSchedules();
        users.filter(u => u.role === 'mentee').forEach(mentee => {
             createNotification(mentee.id, `O mentor ${currentUser!.name} agendou um novo material: '${title}'.`, 'agendamento-section');
        });
        showToast('Publicação de conteúdo agendada!', 'success');
        scheduleContentModal.hide();
        calendar?.refetchEvents();
    }

    function renderAppointments(): void {
        if (!currentUser) return;
        if (['mentee', 'mentor'].includes(currentUser.role)) {
            mentorAppointmentView.classList.add('d-none');
            calendarContainer.classList.remove('d-none');
            setTimeout(() => {
                initCalendar();
            }, 0);
        }
        if (currentUser.role === 'mentor') {
            mentorAppointmentView.classList.remove('d-none');
            calendarContainer.classList.add('d-none');
            renderMentorDashboard();
        }
    }

    function handleAcceptAppointment(appId: number): void {
        const appointment = appointments.find(app => app.id === appId);
        const mentor = users.find(u => u.id === appointment?.mentorId);
        if (appointment && mentor) {
            appointment.status = 'aceito';
            createNotification(appointment.menteeId, `Seu mentor, ${mentor.name}, aceitou o agendamento sobre '${appointment.topic}'.`, 'agendamento-section');
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
                    createNotification(appointment.menteeId, `Seu mentor, ${currentUser?.name}, recusou o agendamento sobre '${appointment.topic}'.`, 'agendamento-section');
                    saveAppointments();
                    renderMentorDashboard();
                    showToast('Agendamento recusado.', 'info');
                }
            );
        }
    }

    function openEditAppointmentModal(appId: number): void {
        const appointment = appointments.find(app => app.id === appId);
        if (!appointment || !currentUser || currentUser.role !== 'mentor') return;
    
        appointmentToEditId = appId;
        (document.getElementById('edit-appointment-date') as HTMLInputElement).value = appointment.date;
        (document.getElementById('edit-appointment-time') as HTMLInputElement).value = appointment.time;
        (document.getElementById('edit-appointment-topic') as HTMLTextAreaElement).value = appointment.topic;

        const contentSelect = document.getElementById('edit-appointment-content') as HTMLSelectElement;
        contentSelect.innerHTML = '<option value="">Nenhum</option>';
        const myContents = contents.filter(c => c.authorId === currentUser!.id);
        myContents.forEach(content => {
            const option = new Option(content.title, content.id.toString());
            contentSelect.add(option);
        });
        contentSelect.value = appointment.linkedContentId?.toString() || '';
    
        editAppointmentModal.show();
    }
    
    function handleEditAppointment(e: SubmitEvent): void {
        e.preventDefault();
        if (appointmentToEditId === null) return;
    
        const appointment = appointments.find(app => app.id === appointmentToEditId);
        if (!appointment) return;
    
        appointment.date = (document.getElementById('edit-appointment-date') as HTMLInputElement).value;
        appointment.time = (document.getElementById('edit-appointment-time') as HTMLInputElement).value;
        appointment.topic = (document.getElementById('edit-appointment-topic') as HTMLTextAreaElement).value;
        
        const selectedContentId = (document.getElementById('edit-appointment-content') as HTMLSelectElement).value;
        appointment.linkedContentId = selectedContentId ? parseInt(selectedContentId, 10) : undefined;
        
        const shouldNotify = (document.getElementById('edit-notify-mentee') as HTMLInputElement).checked;
        if(shouldNotify) {
            createNotification(appointment.menteeId, `Seu mentor, ${currentUser?.name}, alterou o agendamento sobre '${appointment.topic}'.`, 'agendamento-section');
        }
    
        saveAppointments();
        renderMentorDashboard();
        editAppointmentModal.hide();
        showToast('Agendamento atualizado com sucesso!', 'success');
        appointmentToEditId = null;
    }

    function handleMarkAsCompleted(appId: number): void {
        const appointment = appointments.find(app => app.id === appId);
        if (appointment && currentUser && currentUser.role === 'mentor') {
            appointment.status = 'realizado';
            createNotification(appointment.menteeId, `O encontro sobre '${appointment.topic}' foi finalizado. Deixe sua avaliação!`, 'agendamento-section');
            saveAppointments();
            renderMentorDashboard();
            showToast('Encontro marcado como realizado! O mentee já pode avaliar.', 'success');
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
            const mentee = users.find(u => u.id === nextAppointment.menteeId);
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
                        <div class="btn-group" role="group">
                            <button class="btn btn-success btn-sm btn-accept-appointment" data-id="${app.id}">Aceitar</button>
                            <button class="btn btn-danger btn-sm btn-decline-appointment" data-id="${app.id}">Recusar</button>
                        </div>
                    `;
                } else if (app.status === 'aceito') {
                    actionButtons = `
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge rounded-pill bg-success">aceito</span>
                            <button class="btn btn-outline-secondary btn-sm py-0 px-1 btn-edit-appointment" data-id="${app.id}" title="Editar">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                    `;
                }

                upcomingList.innerHTML += `
                    <div class="list-group-item d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                        <img src="${getAvatarUrl(mentee)}" class="rounded-circle" width="50" height="50" alt="Avatar">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">Mentoria com ${mentee ? mentee.name : 'Desconhecido'}</h6>
                            <small class="d-block text-muted"><strong>Tópico:</strong> ${app.topic}</small>
                        </div>
                        <div class="text-sm-end mt-2 mt-sm-0">
                            <div class="fw-bold">${new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às ${app.time}</div>
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
                let actionArea = `<span class="badge rounded-pill bg-secondary">${app.status}</span>`;
                const isPastAndAccepted = new Date(`${app.date}T${app.time}`) < new Date() && app.status === 'aceito';
            
                if (isPastAndAccepted) {
                    actionArea = `<button class="btn btn-success btn-sm btn-mark-completed" data-id="${app.id}">Marcar como Realizado</button>`;
                } else if (app.status === 'avaliado') {
                    actionArea = `<span class="badge bg-light text-dark">Avaliado</span>`;
                }
            
                pastAppointmentsList.innerHTML += `
                    <div class="list-group-item d-flex align-items-center gap-3">
                        <img src="${getAvatarUrl(mentee)}" class="rounded-circle" width="50" height="50" alt="Avatar">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">Mentoria com ${mentee ? mentee.name : 'Desconhecido'}</h6>
                            <small class="d-block text-muted">Tópico: ${app.topic}</small>
                        </div>
                        <div class="text-sm-end">
                            <div class="fw-bold">${new Date(app.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</div>
                            <div class="mt-1">
                                ${actionArea}
                            </div>
                        </div>
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
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center gap-3" onclick="event.preventDefault(); showMentorProfile(${mentor.id})">
                            <img src="${getAvatarUrl(mentor)}" class="rounded-circle" width="35" height="35">
                            <span>${mentor.name}</span>
                        </a>`;
                }
            });
        } else {
            recentMentorsContainer.innerHTML = '<p class="text-muted p-3">Nenhuma interação recente.</p>';
        }
    
        const suggestedMentorsContainer = document.getElementById('dashboard-suggested-mentors') as HTMLElement;
        suggestedMentorsContainer.className = 'list-group'; 
        
        const suggestedMentors = users.filter(user => user.role === 'mentor' && user.course === currentUser!.course && user.id !== currentUser!.id).slice(0, 4);
        
        suggestedMentorsContainer.innerHTML = '';
        if (suggestedMentors.length > 0) {
            suggestedMentors.forEach(mentor => {
                suggestedMentorsContainer.innerHTML += buildCompactMentorCard(mentor);
            });
        } else {
            suggestedMentorsContainer.innerHTML = '<div class="col-12"><p class="text-muted text-center p-4">Nenhum mentor sugerido no momento.</p></div>';
        }
    }

    function renderNotifications(): void {
        if (!currentUser) return;
        const container = document.getElementById('notifications-list-container') as HTMLElement;
        container.innerHTML = '';
        const myNotifications = notifications
            .filter(n => n.userId === currentUser!.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
        if (myNotifications.length === 0) {
            container.innerHTML = `<div class="text-center text-muted p-5"><i class="bi bi-bell-slash fs-1"></i><h5 class="mt-3">Nenhuma notificação</h5><p>Suas atualizações aparecerão aqui.</p></div>`;
            return;
        }
    
        myNotifications.forEach(n => {
            const item = document.createElement('a');
            item.href = '#';
            item.className = `list-group-item list-group-item-action ${n.isRead ? '' : 'list-group-item-primary'}`;
            item.dataset.notificationId = n.id.toString();
            item.dataset.link = n.link;
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <p class="mb-1">${n.text}</p>
                    <small>${new Date(n.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>
                </div>
            `;
            container.appendChild(item);
        });
    }

    function switchView(targetViewId: string): void {
        if (!currentUser) return;
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-view="${targetViewId}"]`);
        if (activeLink && mobileHeaderTitle) {
         mobileHeaderTitle.textContent = activeLink.textContent?.replace(/\d/g, '').trim() || 'Mentoring';
        }
        if (activeLink) activeLink.classList.add('active');
        views.forEach(view => view.classList.toggle('d-none', view.id !== targetViewId));
        
        if (targetViewId === 'agendamento-section') {
            renderAppointments();
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
        } else if (targetViewId === 'content-management-section') {
            renderContentManagement();
        } else if (targetViewId === 'notificacoes-section') {
            renderNotifications();
        }
    }

    function renderContentManagement(): void {
        if (!currentUser || currentUser.role !== 'mentor') return;
        const container = document.getElementById('content-list-container') as HTMLElement;
        container.innerHTML = '';
        const myContents = contents.filter(c => c.authorId === currentUser!.id);
    
        if (myContents.length === 0) {
            container.innerHTML = '<div class="text-center p-5 text-muted"><i class="bi bi-journal-bookmark fs-1"></i><h5 class="mt-3">Nenhum conteúdo criado</h5><p>Crie materiais de apoio reutilizáveis para suas mentorias.</p></div>';
            return;
        }
    
        const contentList = document.createElement('div');
        contentList.className = 'list-group';
        myContents.forEach(content => {
            contentList.innerHTML += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${content.title}</h5>
                        <small>Criado em ${new Date(content.createdAt).toLocaleDateString()}</small>
                    </div>
                    <p class="mb-1">${content.description}</p>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-primary btn-view-content" data-id="${content.id}">Visualizar</button>
                        <button class="btn btn-sm btn-outline-secondary btn-edit-content" data-id="${content.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger btn-delete-content" data-id="${content.id}">Excluir</button>
                    </div>
                </div>
            `;
        });
        container.appendChild(contentList);
    }
    
    function openManageContentModal(contentId: number | null = null): void {
        const form = document.getElementById('form-manage-content') as HTMLFormElement;
        form.reset();
        contentToEditId = contentId;
        if (contentId) {
            const content = contents.find(c => c.id === contentId);
            if (content) {
                (document.getElementById('content-title') as HTMLInputElement).value = content.title;
                (document.getElementById('content-description') as HTMLTextAreaElement).value = content.description;
                (document.getElementById('content-resources') as HTMLTextAreaElement).value = content.resources;
            }
        }
        manageContentModal.show();
    }
    
    function handleManageContentSubmit(e: SubmitEvent): void {
        e.preventDefault();
        if (!currentUser || currentUser.role !== 'mentor') return;
    
        const title = (document.getElementById('content-title') as HTMLInputElement).value;
        const description = (document.getElementById('content-description') as HTMLTextAreaElement).value;
        const resources = (document.getElementById('content-resources') as HTMLTextAreaElement).value;
    
        if (!title || !description) {
            showToast('Título e descrição são obrigatórios.', 'warning');
            return;
        }
    
        if (contentToEditId) {
            const contentIndex = contents.findIndex(c => c.id === contentToEditId);
            if (contentIndex > -1) {
                contents[contentIndex] = { ...contents[contentIndex], title, description, resources };
                showToast('Conteúdo atualizado com sucesso!', 'success');
            }
        } else {
            const newContent: Content = {
                id: Date.now(),
                authorId: currentUser.id,
                title, description, resources,
                createdAt: new Date().toISOString()
            };
            contents.push(newContent);
            showToast('Conteúdo criado com sucesso!', 'success');
        }
    
        saveContents();
        renderContentManagement();
        contentToEditId = null;
        manageContentModal.hide();
    }
    
    function handleDeleteContent(contentId: number): void {
        showConfirm('Excluir Conteúdo', 'Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.', () => {
            contents = contents.filter(c => c.id !== contentId);
            saveContents();
            renderContentManagement();
            showToast('Conteúdo excluído.', 'success');
        });
    }
    
    function showViewContentModal(contentId: number): void {
        const content = contents.find(c => c.id === contentId);
        if (!content) return;
        (document.getElementById('view-content-title') as HTMLElement).textContent = content.title;
        (document.getElementById('view-content-description') as HTMLElement).textContent = content.description;
        const resourcesContainer = document.getElementById('view-content-resources') as HTMLElement;
        resourcesContainer.innerHTML = '';
        content.resources.split('\n').filter(Boolean).forEach(link => {
            try {
                const url = new URL(link);
                resourcesContainer.innerHTML += `<a href="${url.href}" target="_blank" class="btn btn-outline-primary mb-2 d-block text-start text-truncate"><i class="bi bi-link-45deg me-2"></i>${url.hostname}</a>`;
            } catch (e) {
                 resourcesContainer.innerHTML += `<p class="text-muted">${link}</p>`;
            }
        });
        viewContentModal.show();
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
    editAppointmentForm.addEventListener('submit', handleEditAppointment);
    scheduleContentForm.addEventListener('submit', handleScheduleContentSubmit);

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

            const editBtn = target.closest('.btn-edit-appointment');
            if (editBtn) {
                const appId = parseInt(editBtn.getAttribute('data-id')!, 10);
                openEditAppointmentModal(appId);
                return;
            }
        });
    }

    document.getElementById('past-appointments-list')!.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const markCompletedBtn = target.closest('.btn-mark-completed');
        if (markCompletedBtn) {
            const appId = parseInt(markCompletedBtn.getAttribute('data-id')!, 10);
            handleMarkAsCompleted(appId);
        }
    });

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
    
    conversationsListUl.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const conversationItem = target.closest('.list-group-item-action') as HTMLElement;

        if (conversationItem && conversationItem.dataset.conversationWith) {
            const partnerId = parseInt(conversationItem.dataset.conversationWith, 10);
            renderConversationThread(partnerId);
        }
    });

    const replyMessageForm = document.getElementById('form-reply-message') as HTMLFormElement;
    replyMessageForm.addEventListener('submit', handleReplyToMessage);

    const stars = feedbackStarsContainer.querySelectorAll('i');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            feedbackStarsContainer.dataset.rating = rating.toString();
            stars.forEach((s, i) => {
                s.classList.toggle('bi-star-fill', i < rating);
                s.classList.toggle('bi-star', i >= rating);
                s.classList.toggle('text-warning', i < rating);
                s.classList.toggle('text-secondary', i >= rating);
            });
        });
    });

    document.getElementById('modal-mentor-history-list')!.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const evaluateBtn = target.closest('.btn-evaluate-appointment');
    
        if (evaluateBtn) {
            const appId = parseInt(evaluateBtn.getAttribute('data-id')!, 10);
            const appointment = appointments.find(a => a.id === appId);
            const mentor = users.find(u => u.id === appointment?.mentorId);
    
            if (appointment && mentor) {
                (document.getElementById('feedback-appointment-id') as HTMLInputElement).value = appId.toString();
                (document.getElementById('feedback-mentor-name') as HTMLElement).textContent = mentor.name;
                
                feedbackForm.reset();
                feedbackStarsContainer.dataset.rating = '0';
                feedbackStarsContainer.querySelectorAll('i').forEach(s => {
                    s.className = 'bi bi-star text-secondary';
                });
                
                viewProfileModal.hide();
                feedbackModal.show();
            }
        }
    });

    document.getElementById('btn-create-content')?.addEventListener('click', () => openManageContentModal());
    document.getElementById('form-manage-content')?.addEventListener('submit', handleManageContentSubmit);

    document.getElementById('content-list-container')?.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const viewBtn = target.closest('.btn-view-content');
        if (viewBtn) showViewContentModal(parseInt(viewBtn.getAttribute('data-id')!, 10));
        
        const editBtn = target.closest('.btn-edit-content');
        if (editBtn) openManageContentModal(parseInt(editBtn.getAttribute('data-id')!, 10));
    
        const deleteBtn = target.closest('.btn-delete-content');
        if (deleteBtn) handleDeleteContent(parseInt(deleteBtn.getAttribute('data-id')!, 10));
    });

    document.getElementById('notifications-list-container')?.addEventListener('click', e => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const item = target.closest('.list-group-item-action') as HTMLElement;
        if (!item) return;

        const notifId = parseInt(item.dataset.notificationId!);
        const notif = notifications.find(n => n.id === notifId);
        if (notif) {
            notif.isRead = true;
            saveNotifications();
            if (notif.link) {
                switchView(notif.link);
            }
            renderNotifications();
            updateNotificationBadge();
        }
    });

    document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
        if(!currentUser) return;
        notifications.forEach(n => {
            if(n.userId === currentUser!.id) n.isRead = true;
        });
        saveNotifications();
        renderNotifications();
        updateNotificationBadge();
    });

    init();
});