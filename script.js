document.addEventListener("DOMContentLoaded", () => {
    // --- 1. BANCO DE DADOS LOCAL (LOCALSTORAGE) ---
    let arrayTarefas = JSON.parse(localStorage.getItem("meuCronogramaTarefas")) || [
        { texto: "Fazer um resumo", status: "todo", disciplina: "Geral" },
        { texto: "Assistir uma aula", status: "doing", disciplina: "Geral" }
    ];

    function salvarNoBanco() {
        localStorage.setItem("meuCronogramaTarefas", JSON.stringify(arrayTarefas));
    }

    // --- VARIÁVEIS PARA CONTROLE DE EXCLUSÃO ---
    let indiceParaDeletar = null;
    const confirmModal = document.getElementById("confirm-modal");
    const btnCancelDelete = document.getElementById("btn-cancel-delete");
    const btnConfirmDelete = document.getElementById("btn-confirm-delete");

    if (btnCancelDelete && confirmModal) {
        btnCancelDelete.addEventListener("click", () => {
            confirmModal.classList.remove("open");
            renderizarTarefasPaginaIndependente(); // Reseta o card
        });
    }

    if (btnConfirmDelete && confirmModal) {
        btnConfirmDelete.addEventListener("click", () => {
            if (indiceParaDeletar !== null) {
                arrayTarefas.splice(indiceParaDeletar, 1);
                salvarNoBanco();
                renderizarTarefasPaginaIndependente();
                renderizarTarefasDashboard();
                confirmModal.classList.remove("open");
                indiceParaDeletar = null;
            }
        });
    }

    // --- 2. NAVEGAÇÃO ENTRE TELAS (CORRIGIDO) ---
    const leticiaBtn = document.getElementById("leticia-btn");
    if (leticiaBtn) {
        leticiaBtn.addEventListener("click", () => { 
            window.location.href = "dashboard.html"; 
        });
    }

    const navHome = document.getElementById("nav-home");
    const navTasks = document.getElementById("nav-tasks");

    if (navHome) navHome.addEventListener("click", () => { window.location.href = "dashboard.html"; });
    if (navTasks) navTasks.addEventListener("click", () => { window.location.href = "tarefas.html"; });

    // --- 3. LÓGICA DO CALENDÁRIO E CRONOGRAMA ---
    const dayNameDisplay = document.getElementById("current-day-name");
    if (dayNameDisplay) {
        const dataAtual = new Date();
        const mesesAbrev = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
        const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

        const cronogramaEstudos = {
            1: "Arquitetura de Computadores e Sistemas Operacionais",
            2: "Engenharia de Software",
            3: "Práticas de Programação",
            4: "Carreira e Futuro;<br>Projeto Integrador: Carreira e Futuro",
            5: "Cultura; Atividade Extensionista 1",
            6: "Anotar no Fichário; Realizar Atividades",
            0: "Descanso 🏖️"
        };

        const numeroDiaHoje = dataAtual.getDay(); 
        dayNameDisplay.innerText = diasSemana[numeroDiaHoje];
        const monthYearEl = document.getElementById("current-month-year");
        if (monthYearEl) monthYearEl.innerText = `${mesesAbrev[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;

        const subjectDisplay = document.getElementById("schedule-subject");
        if (subjectDisplay) subjectDisplay.innerHTML = cronogramaEstudos[numeroDiaHoje];
    }

    // --- 4. RENDERIZAR TAREFAS NA DASHBOARD PRINCIPAL ---
    const listContainerDashboard = document.getElementById("tasks-list");
    const addTaskBtnDashboard = document.getElementById("add-task-btn");

    function renderizarTarefasDashboard() {
        if (!listContainerDashboard) return;
        listContainerDashboard.innerHTML = "";

        let copiaOrdenada = [...arrayTarefas].sort((a, b) => {
            if (a.status === "done" && b.status !== "done") return 1;
            if (a.status !== "done" && b.status === "done") return -1;
            return 0;
        });

        copiaOrdenada.forEach((tarefa) => {
            const indiceReal = arrayTarefas.findIndex(t => t.texto === tarefa.texto && t.status === tarefa.status);

            const item = document.createElement("div");
            item.className = `task-item status-${tarefa.status}`;
            item.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <span class="task-text">${tarefa.texto}</span>
                    <small style="color:#64748b; font-size:11px; font-weight:600;">${tarefa.disciplina || 'Geral'}</small>
                </div>
                <select class="status-select" data-index="${indiceReal}">
                    <option value="todo" ${tarefa.status === 'todo' ? 'selected' : ''}>Aguardando</option>
                    <option value="doing" ${tarefa.status === 'doing' ? 'selected' : ''}>Em preparo</option>
                    <option value="done" ${tarefa.status === 'done' ? 'selected' : ''}>Concluído</option>
                </select>
            `;

            item.querySelector(".status-select").addEventListener("change", (e) => {
                const idx = e.target.getAttribute("data-index");
                arrayTarefas[idx].status = e.target.value;
                salvarNoBanco();
                renderizarTarefasDashboard();
            });

            listContainerDashboard.appendChild(item);
        });
    }

    if (addTaskBtnDashboard) {
        addTaskBtnDashboard.addEventListener("click", () => { window.location.href = "tarefas.html"; });
    }

    // --- 5. RENDERIZAR TAREFAS NA PÁGINA INDEPENDENTE COM CAPTURA CORRETA DE MOUSE ---
    const listTodo = document.getElementById("list-todo");
    const listDoing = document.getElementById("list-doing");
    const listDone = document.getElementById("list-done");
    const pageAddTaskBtn = document.getElementById("page-add-task-btn");
    const taskModal = document.getElementById("task-modal");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const btnSaveTask = document.getElementById("btn-save-task");
    const inputName = document.getElementById("modal-task-name");

    let cardSendoArrastado = null;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function renderizarTarefasPaginaIndependente() {
        if (!listTodo || !listDoing || !listDone) return;

        listTodo.innerHTML = "";
        listDoing.innerHTML = "";
        listDone.innerHTML = "";

        arrayTarefas.forEach((tarefa, index) => {
            const item = document.createElement("div");
            item.className = `task-item status-${tarefa.status}`;
            item.setAttribute("data-id", index);
            item.style.cursor = "grab";
            item.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:4px; pointer-events:none;">
                    <span class="task-text">${tarefa.texto}</span>
                    <small style="color: #64748b; font-size:11px; font-weight:600; text-transform:uppercase;">${tarefa.disciplina || 'Geral'}</small>
                </div>
                <select class="status-select" data-index="${index}">
                    <option value="todo" ${tarefa.status === 'todo' ? 'selected' : ''}>Aguardando</option>
                    <option value="doing" ${tarefa.status === 'doing' ? 'selected' : ''}>Em preparo</option>
                    <option value="done" ${tarefa.status === 'done' ? 'selected' : ''}>Concluído</option>
                </select>
            `;

            item.querySelector(".status-select").addEventListener("change", (e) => {
                const idx = e.target.getAttribute("data-index");
                arrayTarefas[idx].status = e.target.value;
                salvarNoBanco();
                renderizarTarefasPaginaIndependente();
            });

            // Handlers para dispositivos móveis (Toque)
            item.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
                cardSendoArrastado = item;
                item.style.transition = "none";
            });

            item.addEventListener("touchmove", (e) => {
                if (cardSendoArrastado !== item) return;
                currentX = e.touches[0].clientX - startX;
                if (currentX < 0) {
                    item.style.transform = `translateX(${currentX}px)`;
                }
            });

            item.addEventListener("touchend", () => {
                if (cardSendoArrastado !== item) return;
                item.style.transition = "transform 0.3s ease";
                if (currentX < -100) {
                    item.style.transform = "translateX(-100%)";
                    indiceParaDeletar = index;
                    if (confirmModal) confirmModal.classList.add("open");
                } else {
                    item.style.transform = "translateX(0)";
                }
                cardSendoArrastado = null;
                currentX = 0;
            });

            // Handlers para Desktop (Mouse de Computador)
            item.addEventListener("mousedown", (e) => {
                if (e.target.tagName === 'SELECT') return;
                startX = e.clientX;
                isDragging = true;
                cardSendoArrastado = item;
                item.style.transition = "none";
                item.style.cursor = "grabbing";
            });

            if (tarefa.status === "todo") listTodo.appendChild(item);
            else if (tarefa.status === "doing") listDoing.appendChild(item);
            else if (tarefa.status === "done") listDone.appendChild(item);
        });
    }

    // Escutas globais na janela para o mouse não "escapar" do card
    window.addEventListener("mousemove", (e) => {
        if (!isDragging || !cardSendoArrastado) return;
        currentX = e.clientX - startX;
        if (currentX < 0) {
            cardSendoArrastado.style.transform = `translateX(${currentX}px)`;
            if (currentX < -80) cardSendoArrastado.style.opacity = "0.6";
        }
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging || !cardSendoArrastado) return;
        isDragging = false;
        cardSendoArrastado.style.transition = "transform 0.3s ease, opacity 0.3s ease";
        cardSendoArrastado.style.cursor = "grab";

        const idx = parseInt(cardSendoArrastado.getAttribute("data-id"));

        if (currentX < -80) { 
            cardSendoArrastado.style.transform = "translateX(-100%)";
            cardSendoArrastado.style.opacity = "0";
            indiceParaDeletar = idx;
            if (confirmModal) confirmModal.classList.add("open");
        } else {
            cardSendoArrastado.style.transform = "translateX(0)";
            cardSendoArrastado.style.opacity = "1";
        }
        currentX = 0;
    });

    // --- ENTRADAS DO MODAL DE CRIAÇÃO ---
    document.querySelectorAll('.custom-select-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const wrapper = trigger.parentElement;
            document.querySelectorAll('.custom-select-wrapper').forEach(w => {
                if(w !== wrapper) w.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });
    });

    document.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = option.parentElement;
            const wrapper = container.parentElement;
            const trigger = wrapper.querySelector('.custom-select-trigger');

            container.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            trigger.innerText = option.innerText;
            trigger.setAttribute('data-value', option.getAttribute('data-value'));
            wrapper.classList.remove('open');
        });
    });

    window.addEventListener('click', () => {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
    });

    if (pageAddTaskBtn) {
        pageAddTaskBtn.addEventListener("click", () => {
            if (inputName) inputName.value = "";
            if (taskModal) taskModal.classList.add("open");
        });
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener("click", () => {
            if (taskModal) taskModal.classList.remove("open");
        });
    }

    if (btnSaveTask) {
        btnSaveTask.addEventListener("click", () => {
            const nome = inputName.value.trim();
            const triggerDay = document.getElementById("day-trigger");
            const triggerSubject = document.getElementById("subject-trigger");
            const dia = triggerDay ? triggerDay.getAttribute("data-value") : "1";
            const disciplina = triggerSubject ? triggerSubject.getAttribute("data-value") : "Geral";

            if (nome !== "") {
                arrayTarefas.push({ texto: nome, status: "todo", dia: dia, disciplina: disciplina });
                salvarNoBanco();
                renderizarTarefasPaginaIndependente();
                if (taskModal) taskModal.classList.remove("open");
            }
        });
    }

    // Inicializa as renderizações apenas se as listas existirem na página atual
    if (listContainerDashboard) {
        renderizarTarefasDashboard();
    }
    if (listTodo || listDoing || listDone) {
        renderizarTarefasPaginaIndependente();
    }
});