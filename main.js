startButton = document.getElementById('start');
restartButton = document.getElementById('restart');

timer = document.getElementById('timer');
let duration = 5 * 60;
let timerInterval;

fruits = [
    {name: 'apple', image: 'fruits/apple.png'},
    {name: 'banana', image: 'fruits/banana.png'},
    {name: 'cherry', image: 'fruits/cherry.png'},
    {name: 'orange', image: 'fruits/orange.png'},
    {name: 'pineapple', image: 'fruits/pineapple.png'},
    {name: 'watermelon', image: 'fruits/watermelon.png'},
    {name: 'grape', image: 'fruits/grapes.png'},
    {name: 'lemon', image: 'fruits/lemon.png'},
]

const cardInner = document.querySelectorAll('.card-inner');
const gameContainer = document.querySelector('.game-container');

function randomizeFruits(array) {
    const pairFruits = [...array, ...array];

    for (let i = pairFruits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairFruits[i], pairFruits[j]] = [pairFruits[j], pairFruits[i]];
    }
    return pairFruits;
}

function loadFruits(){
    const randomOrder = randomizeFruits(fruits);

    cardInner.forEach((card, index) => {
        const cardElement = document.createElement('button');
        cardElement.classList.add('card-front');
        cardElement.innerHTML = `<img src="${randomOrder[index].image}" alt="${randomOrder[index].name}" draggable="false">`;
        card.appendChild(cardElement);
    });
}


function updateTimer() {
    if (duration < 0) {
        clearInterval(timerInterval);
        timer.textContent = "Time's up!";
        return;
    }

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    duration--;
}

function startTimer() {
    updateTimer();
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(updateTimer, 1000);
}

startButton.addEventListener('click', () => { 
    gameContainer.classList.add('started');
    startTimer();
    startButton.disabled = true;
});

restartButton.addEventListener('click', () => {
    gameContainer.classList.remove('started');
    startButton.disabled = false;
    clearInterval(timerInterval);
    duration = 5 * 60;
    timer.textContent = "5:00";
    
    document.querySelectorAll('.card-container').forEach(card => {
        card.classList.remove('flipped');
        card.classList.remove('matched');
    });

    setTimeout(() => {
        cardInner.forEach(card => {
            const cardFront = card.querySelector('.card-front');
            if (cardFront) {
                card.removeChild(cardFront);
            }
        });

        loadFruits();
    }, 500);
});

document.querySelectorAll('.card-container').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');

        if (card.classList.contains('flipped')) {
            const flippedCards = document.querySelectorAll('.card-container.flipped');
            if (flippedCards.length === 2) {
                let firstCard = flippedCards[0].querySelector('.card-front img').src;
                let secondCard = flippedCards[1].querySelector('.card-front img').src;

                if (firstCard === secondCard) {
                    flippedCards.forEach(card => card.classList.add('matched'));
                    flippedCards[0].classList.remove('flipped');
                    flippedCards[1].classList.remove('flipped');

                    if (document.querySelectorAll('.card-container.matched').length === cardInner.length) {
                        clearInterval(timerInterval);
                        setTimeout(() => {
                            timer.textContent = "You win!";
                        }, 500);
                    }
                } else {
                    setTimeout(() => {
                        flippedCards.forEach(card => card.classList.remove('flipped'));
                    }, 400);

                }
                firstCard = null;
                secondCard = null;
            }
        }
        
    });
});

loadFruits();

