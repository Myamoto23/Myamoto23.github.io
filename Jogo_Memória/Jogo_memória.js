const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCards = 0; // Contador de pares encontrados
let timeLeft = 30; // Tempo inicial em segundos
let timerInterval;

// Função para mostrar o pop-up inicial
function showStartPopup() {
    const startPopup = document.getElementById('start-popup');
    startPopup.style.display = 'block'; // Exibe o pop-up
}

// Função para iniciar o jogo
function startGame() {
    const startPopup = document.getElementById('start-popup');
    startPopup.style.display = 'none'; // Esconde o pop-up

    // Vira todas as cartas para cima inicialmente
    cards.forEach(card => card.classList.add('flip'));

    // Após 8 segundos, virar todas as cartas para baixo e embaralhar
    setTimeout(() => {
        cards.forEach(card => card.classList.remove('flip'));
        setTimeout(shuffleCards, 500); // Embaralha após um pequeno atraso para evitar conflito de animações

        // Inicia o temporizador após as cartas serem viradas
        timerInterval = setInterval(updateTimer, 1000);

        // Permite que as cartas sejam clicadas novamente
        cards.forEach(card => card.addEventListener('click', flipCard));
    }, 8000);
}

// Função para virar a carta
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Primeira carta clicada
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segunda carta clicada
    secondCard = this;
    checkForMatch();
}

// Verifica se as cartas correspondem
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

// Desabilita cartas correspondentes
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedCards += 2; // Incrementa o contador de pares encontrados

    if (matchedCards === cards.length) {
        // Se todas as cartas foram encontradas, mostra o pop-up de vitória
        setTimeout(showVictoryPopup, 500);
    }

    resetBoard();
}

// Desvira as cartas se não corresponderem
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

// Reseta as variáveis do tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Embaralha as cartas
function shuffleCards() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

// Função para mostrar o pop-up de vitória
function showVictoryPopup() {
    const popup = document.getElementById('victory-popup');
    popup.style.display = 'block';
    clearInterval(timerInterval); // Para o temporizador
}

// Função para mostrar o pop-up de derrota
function showLosePopup() {
    const popup = document.getElementById('lose-popup');
    popup.style.display = 'block';
}

// Função para fechar o pop-up de vitória
function closeVictoryPopup() {
    const popup = document.getElementById('victory-popup');
    popup.style.display = 'none';
}

// Função para reiniciar o jogo
function restartGame() {
    window.location.reload(); // Recarrega a página para reiniciar o jogo
}

// Função para atualizar o temporizador
function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timerInterval); // Para o temporizador
        showLosePopup(); // Mostra o pop-up de derrota
    }

    timeLeft--;
}

// Mostra o pop-up de início ao carregar a página
window.onload = showStartPopup;

// Adiciona eventos aos botões no pop-up
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('play-again').addEventListener('click', restartGame);
document.getElementById('restart-game').addEventListener('click', restartGame);


