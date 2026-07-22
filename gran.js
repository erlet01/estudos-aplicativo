document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // SEÇÃO 1: GERENCIAMENTO DE DISCIPLINAS E UAs
    // ======================================================

    // Elementos do Modal de Disciplina
    const subjectModal = document.getElementById('subject-modal');
    const btnOpenSubjectModal = document.getElementById('btn-open-subject-modal');
    const btnCloseSubjectModal = document.getElementById('btn-close-subject-modal');
    const btnCancelSubject = document.getElementById('btn-cancel-subject');
    const btnSaveSubject = document.getElementById('btn-save-subject');

    // Campos do Formulário
    const inputSubjectName = document.getElementById('modal-subject-name');
    const inputSubjectSemester = document.getElementById('modal-subject-semester');
    
    // Elementos de UAs
    const btnAddUa = document.getElementById('btn-add-ua');
    const inputUaTemp = document.getElementById('input-ua-temp');
    const uaChipsList = document.getElementById('ua-chips-list');
    const subjectsContainer = document.getElementById('subjects-container');

    let uasArray = []; // UAs temporárias da disciplina

    // --- Abrir e Fechar Modal de Disciplina ---
    if (btnOpenSubjectModal && subjectModal) {
        btnOpenSubjectModal.addEventListener('click', (e) => {
            e.preventDefault();
            limparFormulario();
            subjectModal.classList.add('active');
        });
    }

    [btnCloseSubjectModal, btnCancelSubject].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                subjectModal.classList.remove('active');
            });
        }
    });

    // --- Adicionar UAs ---
    if (btnAddUa && inputUaTemp) {
        btnAddUa.addEventListener('click', (e) => {
            e.preventDefault();
            const text = inputUaTemp.value.trim();
            if (text !== '') {
                uasArray.push(text);
                renderUaChips();
                inputUaTemp.value = '';
            }
        });
    }

    function renderUaChips() {
        if (!uaChipsList) return;
        uaChipsList.innerHTML = '';
        uasArray.forEach((ua, index) => {
            const chip = document.createElement('span');
            chip.className = 'ua-chip';
            chip.innerHTML = `
                ${ua}
                <i class="material-icons btn-remove-ua" data-index="${index}">close</i>
            `;
            uaChipsList.appendChild(chip);
        });

        document.querySelectorAll('.btn-remove-ua').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                uasArray.splice(index, 1);
                renderUaChips();
            });
        });
    }

    // --- Salvar Disciplina ---
    if (btnSaveSubject) {
        btnSaveSubject.addEventListener('click', (e) => {
            e.preventDefault();
            const nome = inputSubjectName.value.trim();
            const semestre = inputSubjectSemester.value.trim();

            if (!nome) {
                alert('Por favor, digite o nome da disciplina!');
                return;
            }

            criarCardDisciplina(nome, semestre, uasArray);
            subjectModal.classList.remove('active');
            limparFormulario();
        });
    }

    function criarCardDisciplina(nome, semestre, uas) {
        if (!subjectsContainer) return;
        const card = document.createElement('div');
        card.className = 'subject-card';
        const qtdUas = uas.length;
        const textoSubtitulo = `${semestre || 'Semestre não informado'} • ${qtdUas} UA(s)`;

        card.innerHTML = `
            <div class="subject-info">
                <div class="subject-icon">
                    <i class="material-icons">book</i>
                </div>
                <div class="subject-details">
                    <h3>${nome}</h3>
                    <p>${textoSubtitulo}</p>
                </div>
            </div>
            <div class="subject-status">
                <span class="status-tag in-progress">Em Andamento</span>
                <button class="btn-card-action">
                    <i class="material-icons">chevron_right</i>
                </button>
            </div>
        `;
        subjectsContainer.prepend(card);
    }

    function limparFormulario() {
        if (inputSubjectName) inputSubjectName.value = '';
        if (inputSubjectSemester) inputSubjectSemester.value = '';
        if (inputUaTemp) inputUaTemp.value = '';
        uasArray = [];
        if (uaChipsList) uaChipsList.innerHTML = '';
    }


    // ======================================================
    // SEÇÃO 2: CALENDÁRIO DE COMPROMISSOS DA GRAN
    // ======================================================

    let currentDate = new Date();
    let selectedDateKey = null;

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    function getSharedEvents() {
        return JSON.parse(localStorage.getItem("shared_calendar_events") || "{}");
    }

    function saveSharedEvent(dateKey, title) {
        const events = getSharedEvents();
        if (!events[dateKey]) events[dateKey] = [];
        events[dateKey].push(title);
        localStorage.setItem("shared_calendar_events", JSON.stringify(events));
    }

    function renderFullCalendar() {
        const calendarDays = document.getElementById("calendar-days");
        const calendarMonthYear = document.getElementById("calendar-month-year");
        if (!calendarDays || !calendarMonthYear) return;

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
        calendarDays.innerHTML = "";

        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const events = getSharedEvents();

        for (let x = 0; x < firstDayIndex; x++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.className = "calendar-day empty";
            calendarDays.appendChild(emptyDiv);
        }

        for (let day = 1; day <= lastDay; day++) {
            const monthFormatted = String(month + 1).padStart(2, '0');
            const dayFormatted = String(day).padStart(2, '0');
            const dateKey = `${year}-${monthFormatted}-${dayFormatted}`;

            const dayEl = document.createElement("div");
            dayEl.className = "calendar-day";
            dayEl.innerHTML = `<span>${day}</span>`;

            if (events[dateKey] && events[dateKey].length > 0) {
                dayEl.classList.add("has-event");
            }

            if (selectedDateKey === dateKey) {
                dayEl.classList.add("selected");
            }

            dayEl.style.cursor = "pointer";
            dayEl.addEventListener("click", () => selectCalendarDay(dateKey, day, month, year));

            calendarDays.appendChild(dayEl);
        }
    }

    function selectCalendarDay(dateKey, day, month, year) {
        selectedDateKey = dateKey;
        renderFullCalendar();

        const selectedDateTitle = document.getElementById("selected-date-title");
        const eventForm = document.getElementById("event-form");
        
        if (selectedDateTitle) {
            selectedDateTitle.textContent = `Compromissos - ${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
        }
        if (eventForm) {
            eventForm.style.display = "flex";
        }

        loadEventsForSelectedDay();
    }

    function loadEventsForSelectedDay() {
        const eventsList = document.getElementById("events-list");
        if (!eventsList || !selectedDateKey) return;

        const events = getSharedEvents();
        const dayEvents = events[selectedDateKey] || [];

        eventsList.innerHTML = "";

        if (dayEvents.length === 0) {
            eventsList.innerHTML = `<li class="empty-msg">Nenhum compromisso marcado para este dia.</li>`;
            return;
        }

        dayEvents.forEach(evt => {
            const li = document.createElement("li");
            li.textContent = evt;
            eventsList.appendChild(li);
        });
    }

    const btnAddEvent = document.getElementById("btn-add-event");
    const eventInput = document.getElementById("event-input");

    if (btnAddEvent && eventInput) {
        btnAddEvent.addEventListener("click", () => {
            const text = eventInput.value.trim();
            if (text && selectedDateKey) {
                saveSharedEvent(selectedDateKey, text);
                eventInput.value = "";
                loadEventsForSelectedDay();
                renderFullCalendar();
            }
        });
    }

    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderFullCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener("click", () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderFullCalendar();
        });
    }

    const btnBack = document.getElementById("btn-back");
    if (btnBack) {
        btnBack.addEventListener("click", () => {
            window.location.href = "estudos.html";
        });
    }

    // Inicialização do Calendário ao abrir a página
    renderFullCalendar();
});