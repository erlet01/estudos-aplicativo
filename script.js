document.addEventListener("DOMContentLoaded", () => {
    // 1. CLIQUE DO BOTÃO DE LOGIN
    const leticiaBtn = document.getElementById("leticia-btn");
    if (leticiaBtn) {
        leticiaBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }

    // 2. CONTROLE DO CALENDÁRIO E CRONOGRAMA
    const dayNameDisplay = document.getElementById("current-day-name");
    if (dayNameDisplay) {
        const dataAtual = new Date();
        const mesesAbrev = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
        const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

        // Objeto com o seu cronograma mapeado por número do dia (0 = Domingo, 1 = Segunda, etc.)
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

        // Atualiza o dia de hoje e o mês no topo
        dayNameDisplay.innerText = diasSemana[numeroDiaHoje];
        document.getElementById("current-month-year").innerText = `${mesesAbrev[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;

        // Injeta a matéria do dia correspondente no card
        const subjectDisplay = document.getElementById("schedule-subject");
        const iconDisplay = document.getElementById("schedule-icon-day");
        
        if (subjectDisplay) {
            subjectDisplay.innerHTML = cronogramaEstudos[numeroDiaHoje];
        }
        
        // Se for domingo, troca o ícone de livro por um de hotel/descanso
        const subText = document.querySelector(".schedule-info p");
        
        if (numeroDiaHoje === 0) {
            if (iconDisplay) iconDisplay.innerText = "king_bed";
            if (subText) subText.style.display = "none";
        } else {
            if (subText) subText.style.display = "block"; // Garante que aparece nos dias de semana
        }
        // Preenche a barra do mini calendário semanal
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

        // --- LÓGICA DO CALENDÁRIO COMPLETO (MODAL) ---
        const modal = document.getElementById("calendar-modal");
        const btnOpen = document.getElementById("open-full-calendar");
        const btnClose = document.getElementById("close-calendar");
        const btnPrev = document.getElementById("prev-month");
        const btnNext = document.getElementById("next-month");
        
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

        btnClose.addEventListener("click", () => modal.classList.remove("open"));

        btnPrev.addEventListener("click", () => {
            mesVisivel--;
            if (mesVisivel < 0) { mesVisivel = 11; anoVisivel--; }
            renderizarCalendarioModal(mesVisivel, anoVisivel);
        });

        btnNext.addEventListener("click", () => {
            mesVisivel++;
            if (mesVisivel > 11) { mesVisivel = 0; anoVisivel++; }
            renderizarCalendarioModal(mesVisivel, anoVisivel);
        });
    }
});