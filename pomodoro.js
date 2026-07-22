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
        // Converte focusDuration (que está em segundos) para minutos
        const minutesSpent = Math.round(focusDuration / 60); 
        
        history.push({
            date: new Date().toISOString(),
            duration: minutesSpent
        });

        localStorage.setItem('pomodoro_history', JSON.stringify(history));
    }
    const display = document.getElementById('timer');
    const btnStartPause = document.getElementById('start-pause');
    const btnReset = document.getElementById('reset');
    const statusLabel = document.getElementById('status-label');
    

    const inputFocus = document.getElementById('focus-min');
    const inputBreak = document.getElementById('break-min');
    const presetChips = document.querySelectorAll('.chip-btn');
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

        applyCustomSettings();

        if (mode === 'pomodoro') {
            if (statusLabel) statusLabel.textContent = "Hora de focar";
            timeLeft = focusDuration;
        } else {
            if (statusLabel) statusLabel.textContent = "Pausa curta";
            timeLeft = breakDuration;
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

            const breakMinutes = Math.round(breakDuration / 60);
            showNotification(
                "Sessão Concluída! 🎉", 
                `Excelente trabalho! Sua pausa de ${breakMinutes} min começou.`, 
                "free_breakfast"
            );
            
            setMode('pausa');
        } else {
            const focusMinutes = Math.round(focusDuration / 60);
            showNotification(
                "Pausa Finalizada! ⚡", 
                `Hora de voltar ao foco (${focusMinutes} min). Novo ciclo iniciado!`, 
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

// Aplica as durações configuradas nos campos de texto
    function applyCustomSettings() {
        const inputFocus = document.getElementById('focus-min');
        const inputBreak = document.getElementById('break-min');

        const fMin = inputFocus ? (parseInt(inputFocus.value) || 25) : 25;
        const bMin = inputBreak ? (parseInt(inputBreak.value) || 5) : 5;

        focusDuration = fMin * 60;
        breakDuration = bMin * 60;

        if (currentMode === 'pomodoro') {
            timeLeft = focusDuration;
        } else {
            timeLeft = breakDuration;
        }
        updateDisplay();
    }

    // Eventos para atualizar quando o usuário digita no input
    if (inputFocus) inputFocus.addEventListener('change', () => {
        presetChips.forEach(c => c.classList.remove('active'));
        applyCustomSettings();
    });

    if (inputBreak) inputBreak.addEventListener('change', () => {
        presetChips.forEach(c => c.classList.remove('active'));
        applyCustomSettings();
    });

    // Eventos para os botões atalho (chips 25/5, 45/10, etc)
    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            presetChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const f = chip.getAttribute('data-focus');
            const b = chip.getAttribute('data-break');

            if (inputFocus) inputFocus.value = f;
            if (inputBreak) inputBreak.value = b;

            applyCustomSettings();
        });
    });
// Exibição inicial
    updateDisplay();
});