let startContainer = document.querySelector(".start-container");
let quizContainer = document.querySelector(".quiz-container");
let statisticsContainer = document.querySelector(".statistics-container");
let startBtn = document.querySelector(".start-btn");
let restartBtn = document.querySelector(".restart-btn");
let questionElement = document.querySelector(".question");
let answerElements = document.querySelectorAll(".answer");
let resultMessage = document.querySelector(".result-message");

let correctAnswers = 0;
let totalAnswers = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let signs = ["+", "-", "*", "/"];

function getRandomSign() {
    return signs[getRandomInt(0, signs.length - 1)];
}

class Question {
    constructor() {
        let num1 = getRandomInt(1, 30);
        let num2 = getRandomInt(1, 30);
        let sign = getRandomSign();
        if (sign === "/") {
            num2 = getRandomInt(1, num1); 
        }

        this.question = `${num1} ${sign} ${num2}`;
        this.correct = this.calculateAnswer(num1, num2, sign);

        let incorrectAnswers = [
            this.correct + getRandomInt(-5, 5),
            this.correct + getRandomInt(-5, 5),
            this.correct + getRandomInt(-5, 5),
            this.correct + getRandomInt(-5, 5)
        ];

        incorrectAnswers.push(this.correct);

        this.answers = this.shuffle(incorrectAnswers);
    }

    calculateAnswer(num1, num2, sign) {
        if (sign === "+") return num1 + num2;
        else if (sign === "-") return num1 - num2;
        else if (sign === "*") return num1 * num2;
        else if (sign === "/") return Math.floor(num1 / num2); 
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    display() {
        questionElement.innerHTML = this.question;
        answerElements.forEach((answerElement, i) => {
            answerElement.innerHTML = this.answers[i];
        });
    }
}

let currentQuestion = new Question();
currentQuestion.display();

let timerElement = document.querySelector(".timer");
let timerInterval;
let remainingTime = 10;

function startTimer() {
    remainingTime = 10; 
    timerElement.textContent = remainingTime;
    timerInterval = setInterval(() => {
        remainingTime--;
        timerElement.textContent = remainingTime;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            showStatistics(); 
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = "10"; 
}

function showStatistics() {
    let accuracy = totalAnswers > 0 ? Math.round((correctAnswers * 100) / totalAnswers) : 0;
    resultMessage.innerHTML = `Правильно: ${correctAnswers}<br>Усього: ${totalAnswers}<br>Точність: ${accuracy}%`;
    statisticsContainer.style.display = 'block'; 
    quizContainer.style.display = 'none'; 
}

function startGame() {
    correctAnswers = 0;
    totalAnswers = 0;

    startContainer.style.display = 'none'; 
    quizContainer.style.display = 'block'; 
    statisticsContainer.style.display = 'none';
    
    document.querySelector(".timer-container").style.display = 'block';

    startTimer();
    currentQuestion = new Question(); 
    currentQuestion.display(); 
}

startBtn.addEventListener("click", () => {
    startGame();
});

restartBtn.addEventListener("click", () => {
    statisticsContainer.style.display = 'none';
    startGame();
});

answerElements.forEach((answerElement) => {
    answerElement.addEventListener("click", () => {
        totalAnswers++;

        if (answerElement.innerHTML == currentQuestion.correct) {
            correctAnswers++;
            anime({
                targets: answerElement,
                scale: [1, 1.5],
                backgroundColor: '#28a745',
                duration: 500,
                easing: 'easeInOutQuad',
                direction: 'alternate',
            });
        } else {
            anime({
                targets: answerElement,
                translateX: [0, 30],
                backgroundColor: '#dc3545',
                duration: 300,
                easing: 'easeInOutQuad',
                direction: 'alternate',
            });
        }

        currentQuestion = new Question();
        currentQuestion.display();
    });
});
