document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. GRÁFICO ROSQUINHA: DISTRIBUIÇÃO DE ESFORÇO
    // ==========================================
    const ctxEffort = document.getElementById('chartEffort');
    if (ctxEffort) {
        new Chart(ctxEffort, {
            type: 'doughnut',
            data: {
                labels: ['Estudo Ativo', 'Revisão', 'Exercícios'],
                datasets: [{
                    data: [50, 25, 25], // Valores em % ou minutos (exemplo inicial)
                    backgroundColor: [
                        '#7c3aed', // Roxo (Estudo Ativo)
                        '#3b82f6', // Azul (Revisão)
                        '#10b981'  // Verde (Exercícios)
                    ],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            padding: 15,
                            font: { family: 'sans-serif', size: 12 }
                        }
                    }
                },
                cutout: '70%' // Deixa o furo da rosquinha bonito e proporcional
            }
        });
    }

    // ==========================================
    // 2. GRÁFICO DE BARRAS HORIZONTAIS: TEMPO SEMANAL
    // ==========================================
    const ctxWeekly = document.getElementById('chartWeekly');
    if (ctxWeekly) {
        new Chart(ctxWeekly, {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Tempo (min)',
                    data: [120, 90, 150, 80, 110, 60, 45], // Exemplo de minutos por dia
                    backgroundColor: '#8b5cf6',
                    borderRadius: 8,
                    barThickness: 16
                }]
            },
            options: {
                indexAxis: 'y', // Define a orientação das barras na HORIZONTAL
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Oculta a legenda desnecessária
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }
});