document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos da Modal
    const subjectModal = document.getElementById('subject-modal');
    const btnOpenSubjectModal = document.getElementById('btn-open-subject-modal');
    const btnCloseSubjectModal = document.getElementById('btn-close-subject-modal');
    const btnCancelSubject = document.getElementById('btn-cancel-subject');
    const btnSaveSubject = document.getElementById('btn-save-subject'); // BOTÃO SALVAR

    // Campos do Formulário
    const inputSubjectName = document.getElementById('modal-subject-name');
    const inputSubjectSemester = document.getElementById('modal-subject-semester');
    
    // Elementos das UAs
    const btnAddUa = document.getElementById('btn-add-ua');
    const inputUaTemp = document.getElementById('input-ua-temp');
    const uaChipsList = document.getElementById('ua-chips-list');

    // Container onde os cards serão adicionados
    const subjectsContainer = document.getElementById('subjects-container');

    let uasArray = []; // Guarda as UAs temporárias da disciplina atual

    // --- 1. ABRIR E FECHAR MODAL ---
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

    // --- 2. ADICIONAR UNIDADES DE APRENDIZAGEM (UAs) ---
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

        // Evento para remover UA
        document.querySelectorAll('.btn-remove-ua').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                uasArray.splice(index, 1);
                renderUaChips();
            });
        });
    }

    // --- 3. AÇÃO DO BOTÃO SALVAR DISCIPLINA ---
    if (btnSaveSubject) {
        btnSaveSubject.addEventListener('click', (e) => {
            e.preventDefault();

            const nome = inputSubjectName.value.trim();
            const semestre = inputSubjectSemester.value.trim();

            // Validação simples para não salvar em branco
            if (!nome) {
                alert('Por favor, digite o nome da disciplina!');
                return;
            }

            // Criar o Card de Disciplina
            criarCardDisciplina(nome, semestre, uasArray);

            // Fechar modal e limpar inputs
            subjectModal.classList.remove('active');
            limparFormulario();
        });
    }

    // --- 4. FUNÇÃO PARA CRIAR E INSERIR O CARD NO HTML ---
    function criarCardDisciplina(nome, semestre, uas) {
        if (!subjectsContainer) return;

        const card = document.createElement('div');
        card.className = 'subject-card';

        // Prepara o texto das UAs (se houver)
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

        // Adiciona o card novo no início da lista
        subjectsContainer.prepend(card);
    }

    // Função auxiliar para resetar o formulário
    function limparFormulario() {
        if (inputSubjectName) inputSubjectName.value = '';
        if (inputSubjectSemester) inputSubjectSemester.value = '';
        if (inputUaTemp) inputUaTemp.value = '';
        uasArray = [];
        if (uaChipsList) uaChipsList.innerHTML = '';
    }
});