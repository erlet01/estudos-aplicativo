// ==========================================
// LÓGICA DO POMODORO TIMER (CORRIGIDA)
// ==========================================

let timeLeft = 25 * 60; // 25 minutos em segundos (1500 segundos)
let timerId = null;

document.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById('timer');
    const btnStartPause = document.getElementById('start-pause');
    const btnReset = document.getElementById('reset');
    const statusLabel = document.getElementById('status-label');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // Função que formata o tempo atual e atualiza na tela
    function updateDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        
        // Garante que fique no formato 00:00
        if (display) {
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Função para iniciar a contagem regressiva
    function startTimer() {
        if (timerId !== null) return;

        btnStartPause.innerHTML = '<i class="material-icons">pause</i>';
        
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--; // Diminui 1 segundo
                updateDisplay(); // Atualiza a tela com o novo tempo
            } else {
                // Chegou a zero
                clearInterval(timerId);
                timerId = null;
                btnStartPause.innerHTML = '<i class="material-icons">play_arrow</i>';
                alert('Tempo finalizado!');
            }
        }, 1000);
    }

    // Função para pausar a contagem
    function pauseTimer() {
        clearInterval(timerId);
        timerId = null;
        btnStartPause.innerHTML = '<i class="material-icons">play_arrow</i>';
    }

    // Botão de Play / Pause
    if (btnStartPause) {
        btnStartPause.addEventListener('click', () => {
            if (timerId === null) {
                startTimer();
            } else {
                pauseTimer();
            }
        });
    }

    // Botão de Reset
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            pauseTimer();
            // Verifica qual modo está ativo para resetar para o tempo correto
            const isPausa = modeButtons[1] && modeButtons[1].classList.contains('active');
            timeLeft = isPausa ? 5 * 60 : 25 * 60;
            updateDisplay();
        });
    }

    // Alternar entre Pomodoro (25m) e Pausa (5m)
    modeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            pauseTimer();

            if (index === 0) {
                timeLeft = 25 * 60; // 25 Minutos
                if (statusLabel) statusLabel.textContent = "Hora de focar";
            } else {
                timeLeft = 5 * 60; // 5 Minutos
                if (statusLabel) statusLabel.textContent = "Pausa curta";
            }

            updateDisplay();
        });
    });

    // Exibe o tempo inicial na tela assim que carrega a página
    updateDisplay();
});