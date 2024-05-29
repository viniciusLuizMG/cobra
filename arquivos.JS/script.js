 // Obtenção do contexto do canvas e definição de variáveis globais
 const canvas = document.getElementById('gameCanvas');
 const ctx = canvas.getContext('2d');
 const box = 20;
 const canvasSize = canvas.width;
 const snake = [{ x: 10 * box, y: 10 * box }];
 let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
 let direction = 'right';
 let changingDirection = false;
 let gameRunning = false;
 let paused = false;
 let intervalId;
 let score = 0;
 let seconds = 0;
 let minutes = 0;

 // Obtenção de referências para elementos HTML relevantes
 const scoreElement = document.getElementById('score');
 const timerElement = document.getElementById('timer');
 const startButton = document.getElementById('startButton');
 const pauseButton = document.getElementById('pauseButton');
 const eatSound = document.getElementById('eatSound');

 // Adicionar eventos de clique aos botões de iniciar e pausar o jogo
 startButton.addEventListener('click', startGame);
 pauseButton.addEventListener('click', togglePause);

 // Função para iniciar o jogo
 function startGame() {
     if (!gameRunning) {
         gameRunning = true;
         intervalId = setInterval(() => {
             if (!paused) {
                 draw(); // Chama a função para desenhar os elementos do jogo apenas se não estiver pausado
                 updateTime(); // Atualiza o tempo do jogo
             }
         }, 250);
     }
 }

 // Função para pausar e despausar o jogo
 function togglePause() {
     paused = !paused;
     pauseButton.textContent = paused ? 'Despausar' : 'Pausar';
 }

 // Adicionar evento de tecla pressionada para mudar a direção da cobrinha e pausar o jogo
 document.addEventListener('keydown', function(event) {
     if (event.key === 'p' || event.key === 'P') {
         togglePause();
     } else {
         changeDirection(event);
     }
 });

 // Função para mudar a direção da cobrinha
 function changeDirection(event) {
     if (!changingDirection) {
         changingDirection = true;
         setTimeout(() => {
             if (event.keyCode == 37 && direction !== 'right') direction = 'left';
             else if (event.keyCode == 38 && direction !== 'down') direction = 'up';
             else if (event.keyCode == 39 && direction !== 'left') direction = 'right';
             else if (event.keyCode == 40 && direction !== 'up') direction = 'down';
             changingDirection = false;
         }, 100);
     }
 }

 // Função para desenhar os elementos do jogo
 function draw() {
     ctx.clearRect(0, 0, canvasSize, canvasSize); // Limpa o canvas
     drawGrid(); // Desenha a grade do jogo
     drawSnake(); // Desenha a cobrinha
     drawFood(); // Desenha a comida
     moveSnake(); // Move a cobrinha
     checkCollision(); // Verifica colisões
     updateScore(); // Atualiza o placar
 }

 // Função para desenhar a grade do jogo
 function drawGrid() {
     ctx.strokeStyle = "#ddd";
     ctx.lineWidth = 1;
     for (let x = 0; x <= canvasSize; x += box) {
         ctx.beginPath();
         ctx.moveTo(x, 0);
         ctx.lineTo(x, canvasSize);
         ctx.stroke();
     }
     for (let y = 0; y <= canvasSize; y += box) {
         ctx.beginPath();
         ctx.moveTo(0, y);
         ctx.lineTo(canvasSize, y);
         ctx.stroke();
     }
 }

 // Função para desenhar a cobrinha
 function drawSnake() {
     ctx.fillStyle = 'green';
     snake.forEach(segment => {
         ctx.fillRect(segment.x, segment.y, box, box);
     });
 }

 // Função para desenhar a comida
 function drawFood() {
     ctx.fillStyle = 'red';
     ctx.fillRect(food.x, food.y, box, box);
 }

 // Função para mover a cobrinha
 function moveSnake() {
     const head = { x: snake[0].x, y: snake[0].y };

     if (direction === 'right') head.x += box;
     else if (direction === 'left') head.x -= box;
     else if (direction === 'up') head.y -= box;
     else if (direction === 'down') head.y += box;

     snake.unshift(head);

     if (head.x === food.x && head.y === food.y) {
         food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
         score++;
         eatSound.currentTime = 0; // Reseta a reprodução do som para poder ser tocado várias vezes seguidas
         eatSound.play(); // Toca o som de comer
         if (score >= 25) { // Nº max. de pontos do jogo 
             gameOver(true); // Chama a função de fim do jogo com vitória
         }
     } else {
         snake.pop();
     }
 }

 // Função para verificar colisões
 function checkCollision() {
     if (snake[0].x < 0 || snake[0].x >= canvasSize || snake[0].y < 0 || snake[0].y >= canvasSize) {
         gameOver(false); // Chama a função de fim do jogo sem vitória
     }

     for (let i = 1; i < snake.length; i++) {
         if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
             gameOver(false); // Chama a função de fim do jogo sem vitória
         }
     }
 }

 // Função para lidar com o fim do jogo
 function gameOver(victory) {
     clearInterval(intervalId);
     gameRunning = false;
     if (victory) {
         alert('Parabéns! Você venceu com um placar de ' + score + ' pontos e o tempo decorrido foi: ' + minutes + ' minutos e ' + seconds + ' segundos.');
     } else {
         alert('Game Over! Seu placar foi: ' + score + ' e o tempo decorrido foi: ' + minutes + ' minutos e ' + seconds + ' segundos.');
     }
     snake.length = 1;
     snake[0] = { x: 10 * box, y: 10 * box };
     direction = 'right';
     food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
     score = 0;
     seconds = 0;
     minutes = 0;
     updateScore();
     updateTime();
 }

 // Função para atualizar o placar
 function updateScore() {
     scoreElement.textContent = 'Placar: ' + score;
 }

 // Função para atualizar o tempo
 function updateTime() {
     seconds++;
     if (seconds >= 60) {
         seconds = 0;
         minutes++;
     }
     timerElement.textContent = 'Tempo: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
 }