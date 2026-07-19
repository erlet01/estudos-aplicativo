document.addEventListener("DOMContentLoaded", () => {
    // --- 1. BANCO DE DADOS LOCAL (LOCALSTORAGE) ---
    // Carrega as tarefas salvas ou inicia com tarefas padrão se estiver vazio
    let arrayTarefas = JSON.parse(localStorage.getItem("meuCronogramaTarefas")) || [
        { texto: "Fazer um resumo", status: "todo" },
        { texto: "Assistir uma aula", status: "doing" }
    ];

    function salvarNoBanco() {
        localStorage.setItem("meuCronogramaTarefas", JSON.stringify(arrayTarefas));
    }

    // --- 2. NAVEGAÇÃO ENTRE TELAS ---
    const leticiaBtn = document.getElementById("leticia-btn");
    if (leticiaBtn) {
        leticiaBtn.addEventListener("click", () => { window.location.href = "dashboard.html"; });
    }

    const navHome = document.getElementById("nav-home");
    const navTasks = document.getElementById("nav-tasks");

    if (navHome) {
        navHome.addEventListener("click", () => { window.location.href = "dashboard.html"; });
    }
    if (navTasks) {
        navTasks.addEventListener("click", () => { window.location.href = "tarefas.html"; });
    }

    // --- 3. LOGICA DO CALENDÁRIO E CRONOGRAMA (APENAS NA DASHBOARD) ---
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
            0: "Descanso"
        };

        const numeroDiaHoje = dataAtual.getDay(); 

        dayNameDisplay.innerText = diasSemana[numeroDiaHoje];
        document.getElementById("current-month-year").innerText = `${mesesAbrev[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;

        const subjectDisplay = document.getElementById("schedule-subject");
        const iconDisplay = document.getElementById("schedule-icon-day");
        
        if (subjectDisplay) subjectDisplay.innerHTML = cronogramaEstudos[numeroDiaHoje];
        
        const subText = document.querySelector(".schedule-info p");
        if (numeroDiaHoje === 0) {
            if (iconDisplay) iconDisplay.innerText = "king_bed";
            if (subText) subText.style.display = "none";
        } else {
            if (subText) subText.style.display = "block";
        }

        const elementoHoje = document.querySelector(`.day[data-day="${numeroDiaHoje}"]`);
        if (elementoHoje) elementoHoje.classList.add("active");

        document.querySelectorAll('.day').forEach(diaDom => {
            const alvoDiaSemana = parseInt(diaDom.getAttribute('data-day'));
            let diferenca = alvoDiaSemana - numeroDiaHoje;
            const dataAlvo = new Date(dataAtual);
            dataAlvo.setDate(dataAtual.getDate() + diferenca);
            const numDisplay = diaDom.querySelector('.num');
            if (numDisplay) numDisplay.innerText = dataAlvo.getDate();
        });
    }

    // --- 4. RENDERIZAR TAREFAS NA DASHBOARD DA TELA PRINCIPAL ---
    const listContainerDashboard = document.getElementById("tasks-list");
    const addTaskBtnDashboard = document.getElementById("add-task-btn");

    function renderizarTarefasDashboard() {
        if (!listContainerDashboard) return;
        listContainerDashboard.innerHTML = "";

        // Ordena para mandar concluídas para baixo
        let cópiaOrdenada = [...arrayTarefas].sort((a, b) => {
            if (a.status === "done" && b.status !== "done") return 1;
            if (a.status !== "done" && b.status === "done") return -1;
            return 0;
        });

        cópiaOrdenada.forEach((tarefa) => {
            // Encontra o índice real no array original
            const indiceReal = arrayTarefas.findIndex(t => t.texto === tarefa.texto && t.status === tarefa.status);

            const item = document.createElement("div");
            item.className = `task-item status-${tarefa.status}`;
            item.innerHTML = `
                <span class="task-text">${tarefa.texto}</span>
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
        addTaskBtnDashboard.addEventListener("click", () => {
            window.location.href = "tarefas.html";
        });
    }

    // --- 5. RENDERIZAR TAREFAS POR COLUNA NA PÁGINA INDEPENDENTE ---
    const listTodo = document.getElementById("list-todo");
    const listDoing = document.getElementById("list-doing");
    const listDone = document.getElementById("list-done");
    const pageAddTaskBtn = document.getElementById("page-add-task-btn");

    function renderizarTarefasPaginaIndependente() {
        if (!listTodo || !listDoing || !listDone) return;

        // Limpa as três colunas
        listTodo.innerHTML = "";
        listDoing.innerHTML = "";
        listDone.innerHTML = "";

        arrayTarefas.forEach((tarefa, index) => {
            const item = document.createElement("div");
            item.className = `task-item status-${tarefa.status}`;
            item.innerHTML = `
                <span class="task-text">${tarefa.texto}</span>
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

            // Injeta a tarefa diretamente na coluna certa
            if (tarefa.status === "todo") listTodo.appendChild(item);
            else if (tarefa.status === "doing") listDoing.appendChild(item);
            else if (tarefa.status === "done") listDone.appendChild(item);
        });
    }

    if (pageAddTaskBtn) {
        pageAddTaskBtn.addEventListener("click", () => {
            const texto = prompt("Digite a nova tarefa:");
            if (texto && texto.trim() !== "") {
                arrayTarefas.push({ texto: texto.trim(), status: "todo" });
                salvarNoBanco();
                renderizarTarefasPaginaIndependente();
            }
        });
    }

    // Inicializa a lista da página que estiver aberta no momento
    renderizarTarefasDashboard();
    renderizarTarefasPaginaIndependente();

    // --- LÓGICA DO CALENDÁRIO COMPLETO (MODAL) ---
    const modal = document.getElementById("calendar-modal");
    const btnOpen = document.getElementById("open-full-calendar");
    const btnClose = document.getElementById("close-calendar");
    const btnPrev = document.getElementById("prev-month");
    const btnNext = document.getElementById("next-month");
    
    if(modal && btnOpen) {
        const dataAtual = new Date();
        let mesVisivel = dataAtual.getMonth();
        let anoVisivel = dataAtual.getFullYear();
        const mesesCompletos = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        function renderizarCalendarioModal(mes, ano) {
            document.getElementById("modal-month-title").innerText = `${mesesCompletos[mes]} ${ano}`;
            const grid = document.getElementById("modal-days-grid");
            grid.innerHTML = "";

            const primeiroDiaMês = new Date(ano, mes, 1).getDay();
            const totalDiasMês = new Date(ano, mes + 1, 0).getDate();

            for (let i = 0; i < primeiroDiaMês; i++) {
                const divVazia = document.createElement("div");
                divVazia.className = "modal-day empty";
                grid.appendChild(divVazia);
            }

            for (let dia = 1; dia <= totalDiasMês; dia++) {
                const divDia = document.createElement("div");
                divDia.className = "modal-day";
                divDia.innerText = dia;

                if (dia === dataAtual.getDate() && mes === dataAtual.getMonth() && ano === dataAtual.getFullYear()) {
                    divDia.classList.add("today");
                }
                grid.appendChild(divDia);
            }
        }

        btnOpen.addEventListener("click", () => {
            mesVisivel = dataAtual.getMonth();
            anoVisivel = dataAtual.getFullYear();
            renderizarCalendarioModal(mesVisivel, anoVisivel);
            modal.classList.add("open");
        });

        if (btnClose) btnClose.addEventListener("click", () => modal.classList.remove("open"));

        if (btnPrev) btnPrev.addEventListener("click", () => {
            mesVisivel--;
            if (mesVisivel < 0) { mesVisivel = 11; anoVisivel--; }
            renderizarCalendarioModal(mesVisivel, anoVisivel);
        });

        if (btnNext) btnNext.addEventListener("click", () => {
            mesVisivel++;
            if (mesVisivel > 11) { mesVisivel = 0; anoVisivel++; }
            renderizarCalendarioModal(mesVisivel, anoVisivel);
        });
    }
});