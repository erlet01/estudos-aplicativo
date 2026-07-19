document.addEventListener("DOMContentLoaded", () => {
    // 1. CONTROLAR O CLIQUE NO BOTÃO DA LETÍCIA
    const leticiaBtn = document.getElementById("leticia-btn");
    if (leticiaBtn) {
        leticiaBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }

    // 2. CONTROLAR O CALENDÁRIO COM NÚMEROS DINÂMICOS
    const dayNameDisplay = document.getElementById("current-day-name");
    
    if (dayNameDisplay) {
        const dataAtual = new Date();
        
        const diasSemana = [
            "Domingo", "Segunda-feira", "Terça-feira", 
            "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
        ];

        // Mostra o nome do dia de hoje no topo
        dayNameDisplay.innerText = diasSemana[dataAtual.getDay()];

        // Ativa o dia atual na barra do calendário
        const numeroDiaHoje = dataAtual.getDay(); 
        const elementoHoje = document.querySelector(`.day[data-day="${numeroDiaHoje}"]`);
        if (elementoHoje) {
            elementoHoje.classList.add("active");
        }

        // Preenche o número correto de cada dia da semana na barra
        const todosOsDias = document.querySelectorAll('.day');
        todosOsDias.forEach(diaDom => {
            const alvoDiaSemana = parseInt(diaDom.getAttribute('data-day'));
            
            // Calcula a diferença de dias entre o dia do botão e o dia de hoje
            let diferenca = alvoDiaSemana - numeroDiaHoje;
            
            const dataAlvo = new Date(dataAtual);
            dataAlvo.setDate(dataAtual.getDate() + diferenca);
            
            // Coloca o número do dia calculado dentro da tag strong .num
            const numDisplay = diaDom.querySelector('.num');
            if (numDisplay) {
                numDisplay.innerText = dataAlvo.getDate();
            }
        });
    }
});