document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple&category=18'; // Technology category
    const questionContainer = document.getElementById('questionContainer');
    const questionElement = document.getElementById('question');
    const answerButtons = document.getElementById('answerButtons');
    const result = document.getElementById('result');
    const scoreElement = document.getElementById('score');
    const nextButton = document.getElementById('nextButton');
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    // Start the game
    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        fetchQuestions();
    });

    // Fetch questions from the API
    async function fetchQuestions() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            questions = data.results;
            showQuestion(questions[currentQuestionIndex]);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    // Display a question and its answers
    function showQuestion(question) {
        questionElement.textContent = question.question;
        answerButtons.innerHTML = '';
        const answers = [...question.incorrect_answers, question.correct_answer];
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => checkAnswer(answer, question.correct_answer));
            answerButtons.appendChild(button);
        });
    }

    // Check the user's answer and provide feedback
    function checkAnswer(selectedAnswer, correctAnswer) {
        Array.from(answerButtons.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer) {
                button.classList.add('incorrect');
            }
            button.disabled = true;
        });

        if (selectedAnswer === correctAnswer) {
            score++;
        }

        result.classList.remove('hidden');
        scoreElement.textContent = `Your score: ${score}`;
    }

    // Move to the next question or end the game
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
            result.classList.add('hidden');
        } else {
            questionContainer.innerHTML = `<h2>Game Over! Your final score is ${score}</h2>`;
            result.classList.add('hidden');
            nextButton.style.display = 'none';
        }
    });
});