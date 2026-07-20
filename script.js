document.addEventListener("DOMContentLoaded", () => {
    // --- 1. BANCO DE DADOS LOCAL (LOCALSTORAGE) ---
    let arrayTarefas = JSON.parse(localStorage.getItem("meuCronogramaTarefas")) || [
        { texto: "Fazer um resumo", status: "todo", disciplina: "Geral" },
        { texto: "Assistir uma aula", status: "doing", disciplina: "Geral" }
    ];

    function salvarNoBanco() {
        localStorage.setItem("meuCronogramaTarefas", JSON.stringify(arrayTarefas));
    }

    // --- VARIÁVEIS PARA CONTROLE DE EXCLUSÃO (BLINDADO) ---
    let indiceParaDeletar = null;

    // Usamos uma função auxiliar para garantir que os botões funcionem mesmo se o HTML atualizar
    function configurarBotoesExclusao() {
        const modalDeAviso = document.getElementById("confirm-modal");
        const botaoCancelar = document.getElementById("btn-cancel-delete");
        const botaoConfirmar = document.getElementById("btn-confirm-delete");

        if (botaoCancelar && modalDeAviso) {
            // Remove evento antigo para não duplicar e adiciona o novo
            botaoCancelar.onclick = () => {
                modalDeAviso.classList.remove("open");
                renderizarTarefasPaginaIndependente(); // Traz o card de volta se desistir
            };
        }

        if (botaoConfirmar && modalDeAviso) {
            botaoConfirmar.onclick = () => {
                if (indiceParaDeletar !== null) {
                    arrayTarefas.splice(indiceParaDeletar, 1);
                    salvarNoBanco();
                    
                    // Fecha o modal e atualiza as duas telas
                    modalDeAviso.classList.remove("open");
                    renderizarTarefasPaginaIndependente();
                    renderizarTarefasDashboard();
                    
                    indiceParaDeletar = null;
                }
            };
        }
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

    // --- 3. LÓGICA DO CALENDÁRIO E CRONOGRAMA (BLINDADO) ---
    const dayNameDisplay = document.getElementById("current-day-name");
    
    // Só executa o calendário se estivermos na página que possui esses elementos (Dashboard)
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
        if (monthYearEl) {
            monthYearEl.innerText = `${mesesAbrev[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;
        }

        const subjectDisplay = document.getElementById("schedule-subject");
        if (subjectDisplay) {
            subjectDisplay.innerHTML = cronogramaEstudos[numeroDiaHoje];
        }

        // --- SINCRONIZAÇÃO DOS NÚMEROS E DIAS DA SEMANA ---
        const elementoHoje = document.querySelector(`.day[data-day="${numeroDiaHoje}"]`);
        if (elementoHoje) {
            elementoHoje.classList.add("active");
        }

        // Calcula dinamicamente as datas numéricas de cada quadradinho do mini-calendário
        document.querySelectorAll('.day').forEach(diaDom => {
            const alvoDiaSemana = parseInt(diaDom.getAttribute('data-day'));
            if (!isNaN(alvoDiaSemana)) {
                let diferenca = alvoDiaSemana - numeroDiaHoje;
                const dataAlvo = new Date(dataAtual);
                dataAlvo.setDate(dataAtual.getDate() + diferenca);
                
                const numDisplay = diaDom.querySelector('.num');
                if (numDisplay) {
                    numDisplay.innerText = dataAlvo.getDate();
                }
            }
        });
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
            item.style.transform = "translateX(0px)";
            item.style.opacity = "1";
            
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

            // --- CONTROLE DE ARRASTAR ISOLADO POR CARD ---
            let mouseXInicial = 0;
            let deslocamentoX = 0;
            let segurandoCard = false;

            // Mover (computador)
            const moverMouse = (e) => {
                if (!segurandoCard) return;
                deslocamentoX = e.clientX - mouseXInicial;
                if (deslocamentoX < 0) {
                    item.style.transform = `translateX(${deslocamentoX}px)`;
                    if (deslocamentoX < -60) item.style.opacity = "0.6";
                }
            };

            // Soltar (computador)
            const soltarMouse = () => {
                if (!segurandoCard) return;
                segurandoCard = false;
                item.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                item.style.cursor = "grab";

                if (deslocamentoX < -80) {
                    item.style.transform = "translateX(-100%)";
                    item.style.opacity = "0";
                    indiceParaDeletar = index;
                    
                    const modalDeAviso = document.getElementById("confirm-modal");
if (modalDeAviso) {
    configurarBotoesExclusao(); // Garante os cliques nos botões do aviso
    modalDeAviso.classList.add("open");
} else {
    // Caso o HTML do modal suma por algum motivo, ele deleta via navegador para não travar!
    const prosseguir = confirm("Deseja mesmo excluir esta tarefa?");
    if (prosseguir) {
        arrayTarefas.splice(index, 1);
        salvarNoBanco();
        renderizarTarefasPaginaIndependente();
    } else {
        item.style.transform = "translateX(0px)";
        item.style.opacity = "1";
    }
}
                } else {
                    item.style.transform = "translateX(0px)";
                    item.style.opacity = "1";
                }

                window.removeEventListener("mousemove", moverMouse);
                window.removeEventListener("mouseup", soltarMouse);
            };

            // Clicar (computador)
            item.addEventListener("mousedown", (e) => {
                if (e.target.tagName === 'SELECT') return;
                segurandoCard = true;
                mouseXInicial = e.clientX;
                deslocamentoX = 0;
                item.style.transition = "none";
                item.style.cursor = "grabbing";

                window.addEventListener("mousemove", moverMouse);
                window.addEventListener("mouseup", soltarMouse);
            });

            // --- EVENTOS PARA CELULAR (TOQUE) ---
            item.addEventListener("touchstart", (e) => {
                mouseXInicial = e.touches[0].clientX;
                deslocamentoX = 0;
                item.style.transition = "none";
            });

            item.addEventListener("touchmove", (e) => {
                deslocamentoX = e.touches[0].clientX - mouseXInicial;
                if (deslocamentoX < 0) {
                    item.style.transform = `translateX(${deslocamentoX}px)`;
                }
            });

            item.addEventListener("touchend", () => {
                item.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                if (deslocamentoX < -80) {
                    item.style.transform = "translateX(-100%)";
                    item.style.opacity = "0";
                    indiceParaDeletar = index;
                    if (confirmModal) confirmModal.classList.add("open");
                } else {
                    item.style.transform = "translateX(0px)";
                    item.style.opacity = "1";
                }
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
// --- 6. MODAL DO CALENDÁRIO COMPLETO DO MÊS ---
    const modalCalendario = document.getElementById("calendar-modal");
    const btnOpenCalendario = document.getElementById("open-full-calendar");
    const btnCloseCalendario = document.getElementById("close-calendar");
    const btnPrevMes = document.getElementById("prev-month");
    const btnNextMes = document.getElementById("next-month");
    
    if (modalCalendario && btnOpenCalendario) {
        const dataAtual = new Date();
        let mesVisivel = dataAtual.getMonth();
        let anoVisivel = dataAtual.getFullYear();
        const mesesCompletos = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        function renderizarCalendarioModal(mes, ano) {
            const tituloModal = document.getElementById("modal-month-title");
            if (tituloModal) tituloModal.innerText = `${mesesCompletos[mes]} ${ano}`;
            
            const grid = document.getElementById("modal-days-grid");
            if (!grid) return;
            grid.innerHTML = "";

            const primeiroDiaMes = new Date(ano, mes, 1).getDay();
            const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

            // Preenche os espaços vazios do início do mês
            for (let i = 0; i < primeiroDiaMes; i++) {
                const divVazia = document.createElement("div");
                divVazia.className = "modal-day empty";
                grid.appendChild(divVazia);
            }

            // Preenche os dias numéricos do mês
            for (let dia = 1; dia <= totalDiasMes; dia++) {
                const divDia = document.createElement("div");
                divDia.className = "modal-day";
                divDia.innerText = dia;

                // Destaca o dia de hoje real se for o mês/ano corretos
                if (dia === dataAtual.getDate() && mes === dataAtual.getMonth() && ano === dataAtual.getFullYear()) {
                    divDia.classList.add("today");
                }
                grid.appendChild(divDia);
            }
        }

        // Abre o modal ao clicar no botão
        btnOpenCalendario.addEventListener("click", () => {
            mesVisivel = dataAtual.getMonth();
            anoVisivel = dataAtual.getFullYear();
            renderizarCalendarioModal(mesVisivel, anoVisivel);
            modalCalendario.classList.add("open");
        });

        // Fecha o modal
        if (btnCloseCalendario) {
            btnCloseCalendario.addEventListener("click", () => modalCalendario.classList.remove("open"));
        }

        // Botão de mês anterior
        if (btnPrevMes) {
            btnPrevMes.addEventListener("click", () => {
                mesVisivel--;
                if (mesVisivel < 0) { mesVisivel = 11; anoVisivel--; }
                renderizarCalendarioModal(mesVisivel, anoVisivel);
            });
        }

        // Botão de próximo mês
        if (btnNextMes) {
            btnNextMes.addEventListener("click", () => {
                mesVisivel++;
                if (mesVisivel > 11) { mesVisivel = 0; anoVisivel++; }
                renderizarCalendarioModal(mesVisivel, anoVisivel);
            });
        }
    }