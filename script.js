document.addEventListener("DOMContentLoaded", () => {
    const ball = document.getElementById("loading-ball");
    const splashScreen = document.getElementById("splash-screen");
    const loginScreen = document.getElementById("login-screen");
    const motivationScreen = document.getElementById("motivation-screen");
    const leticiaBtn = document.getElementById("leticia-btn");

    // PASSO 1: Espera 2.5 segundos com a bola piscando
    setTimeout(() => {
        // PASSO 2: Adiciona a classe que faz a bola expandir
        ball.classList.add("expand");

        // PASSO 3: Quando a bola terminar de cobrir tudo (600ms), mostra a tela de login
        setTimeout(() => {
            splashScreen.classList.remove("active");
            loginScreen.classList.add("active");
        }, 600); // Esse tempo bate com o 'transition' do CSS da bola

    }, 2500);

    // PASSO 4: Evento de clique no botão da Letícia
    leticiaBtn.addEventListener("click", () => {
        // Esconde a tela de login e mostra a tela motivacional
        loginScreen.classList.remove("active");
        motivationScreen.classList.add("active");
        
        // Aqui o app simularia que terminou de carregar após 3 segundos
        setTimeout(() => {
            alert("App Iniciado! Bons estudos, Letícia! 📚✨");
        }, 3000);
    });
});