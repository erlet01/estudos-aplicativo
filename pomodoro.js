// ==========================================
// LÓGICA DO POMODORO COM TEMPOS CUSTOMIZADOS
// ==========================================

let focusDuration = 25 * 60; // Duração customizável de foco (padrão: 25 min)
let breakDuration = 5 * 60;  // Duração de pausa (padrão: 5 min)
let timeLeft = focusDuration;
let timerId = null;
let currentMode = 'pomodoro'; // 'pomodoro' ou 'pausa'

document.addEventListener("DOMContentLoaded", () => {
    function getSessionsHistory() {
        try {
            return JSON.parse(localStorage.getItem('pomodoro_history') || '[]');
        } catch(e) {
            return [];
        }
    }

    function saveCompletedSession() {
        const history = getSessionsHistory();
        history.push(new Date().toISOString());
        localStorage.setItem('pomodoro_history', JSON.stringify(history));
    }
    const display = document.getElementById('timer');
    const btnStartPause = document.getElementById('start-pause');
    const btnReset = document.getElementById('reset');
    const statusLabel = document.getElementById('status-label');
    const btnPomodoro = document.getElementById('btn-mode-pomodoro');
    const btnPausa = document.getElementById('btn-mode-pausa');
    const timeButtons = document.querySelectorAll('.time-btn');
    const customInput = document.getElementById('custom-min');
    const btnSetCustom = document.getElementById('btn-set-custom');
    const timeOptionsContainer = document.getElementById('time-options');
    // Elementos do Modal
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalIcon = document.getElementById('modal-icon');
    const btnModalClose = document.getElementById('btn-modal-close');

    function showNotification(title, message, iconName) {
        if (!modal) return;
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (modalIcon && iconName) {
            modalIcon.innerHTML = `<i class="material-icons">${iconName}</i>`;
        }
        modal.classList.add('active');
    }

    if (btnModalClose) {
        btnModalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Atualiza os números no visor no formato 00:00
    function updateDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        if (display) {
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Alterna o modo (Foco vs Pausa)
    function setMode(mode) {
        currentMode = mode;
        pauseTimer();

        if (mode === 'pomodoro') {
            if (btnPomodoro) btnPomodoro.classList.add('active');
            if (btnPausa) btnPausa.classList.remove('active');
            timeLeft = focusDuration;
            if (statusLabel) statusLabel.textContent = "Hora de focar";
            if (timeOptionsContainer) timeOptionsContainer.style.display = 'flex';
        } else {
            if (btnPausa) btnPausa.classList.add('active');
            if (btnPomodoro) btnPomodoro.classList.remove('active');
            timeLeft = breakDuration;
            if (statusLabel) statusLabel.textContent = "Pausa curta";
            if (timeOptionsContainer) timeOptionsContainer.style.display = 'none'; // Esconde opções de tempo durante a pausa
        }

        updateDisplay();
    }

    // Define nova duração para o modo foco em minutos
    function setDuration(minutes) {
        focusDuration = minutes * 60;
        if (currentMode === 'pomodoro') {
            pauseTimer();
            timeLeft = focusDuration;
            updateDisplay();
        }
    }

    // Ação acionada ao zerar o tempo (Ciclo Automático)
    function handleCycleEnd() {
        clearInterval(timerId);
        timerId = null;

        if (currentMode === 'pomodoro') {
            // REGISTRA A SESSÃO NO LOCALSTORAGE
            saveCompletedSession();

            showNotification(
                "Sessão Concluída! 🎉", 
                "Excelente trabalho! Sua pausa de 5 minutos já começou.", 
                "free_breakfast"
            );
            setMode('pausa');
        } else {
            showNotification(
                "Pausa Finalizada! ⚡", 
                "Hora de voltar ao foco. Novo ciclo iniciado!", 
                "fitness_center"
            );
            setMode('pomodoro');
        }

        startTimer(); // Ciclo Automático
    }

    // Inicia a contagem regressiva
    function startTimer() {
        if (timerId !== null) return;

        if (btnStartPause) {
            btnStartPause.innerHTML = '<i class="material-icons">pause</i>';
        }

        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                handleCycleEnd();
            }
        }, 1000);
    }

    // Pausa a contagem regressiva
    function pauseTimer() {
        clearInterval(timerId);
        timerId = null;
        if (btnStartPause) {
            btnStartPause.innerHTML = '<i class="material-icons">play_arrow</i>';
        }
    }

    // Eventos Play / Pause
    if (btnStartPause) {
        btnStartPause.addEventListener('click', () => {
            if (timerId === null) startTimer();
            else pauseTimer();
        });
    }

    // Evento Reset
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            pauseTimer();
            timeLeft = (currentMode === 'pomodoro') ? focusDuration : breakDuration;
            updateDisplay();
        });
    }

    // Botões de Troca de Modo
    if (btnPomodoro) btnPomodoro.addEventListener('click', () => setMode('pomodoro'));
    if (btnPausa) btnPausa.addEventListener('click', () => setMode('pausa'));

    // Botões de tempo pré-definido (25m, 30m, 45m, 60m)
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const min = parseInt(btn.getAttribute('data-time'));
            setDuration(min);
        });
    });

    // Botão de tempo customizado (Digitado no input)
    if (btnSetCustom && customInput) {
        btnSetCustom.addEventListener('click', () => {
            const min = parseInt(customInput.value);
            if (min && min > 0) {
                timeButtons.forEach(b => b.classList.remove('active'));
                setDuration(min);
                customInput.value = '';
            }
        });
    }

// Exibição inicial
    updateDisplay();
});