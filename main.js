// global variables
const battleGround = document.querySelector('#playground');
const home = document.querySelector('#home');
const gameLauncher = document.querySelector('#game-launcher');
const takeMeHome = document.querySelector('#backBtn');
const ground = document.querySelector('#ground');
const gameOver = document.querySelector('#gameOver');
const scoreLabel = document.querySelector('#score-label');
const startingAudio = document.querySelector('#starting_audio');
const step = 25;
let score = 0;
const width = '60px';
let isGameOver = false;
let speed = 1;

// document.addEventListener('mouseover', () => {
//     startingAudio.play();
// })

//music
const shoot = new Audio('assets/music/shoot.wav');
const droneKilled = new Audio('assets/music/drone-killed.wav');

gameLauncher.addEventListener('click', (evt) => {
  startGame(evt);
  
})

const startGame = (evt) => {
  home.classList.toggle('d-none');
  battleGround.classList.toggle('d-none');
  initPlayer({ src: 'assets/drone.png', type: 'evil' });
  initPlayer({ src: 'assets/spaceship.png', type: 'good' });

  const initPlayerInterval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      initPlayer({ src: 'assets/drone.png', type: 'evil' });
    }

    const evilObjects = document.querySelectorAll('.evil-player');
    if (evilObjects.length) {
      evilObjects.forEach(item => {
        let { y } = item;
        y += 20;
        item.style.top = y + 'px';
      })
    }

    if (isEnemyBreach()) {
      clearInterval(initPlayerInterval);
      isGameOver = true;
      home.classList.add('d-none');
      battleGround.classList.toggle('d-none');
      gameOver.classList.toggle('d-none');
    }
  }, speed * 1000);
}

const initPlayer = (params) => {
  const { type, src } = params;
  const player = document.createElement('img');
  player.src = src;
  player.style.width = width;
  player.style.position = 'absolute';

  player.style.zIndex = 3;

  if (type == 'good') {
    player.id = 'spaceShip';
    player.style.bottom = '20px';
    player.style.left = '50%';
  } else {
    player.style.top = '10px';
    player.setAttribute('class', 'evil-player');
    player.style.left = randomNumber() + '%';
  }

  ground.appendChild(player);
}

const launchRockets = () => {
  shoot.play()
  const spaceShip = document.querySelector('#spaceShip');
  const { left, width } = spaceShip.getBoundingClientRect();

  const rocket = document.createElement('img');
  rocket.src = 'assets/rocket.png';
  rocket.style.width = '15px';
  rocket.style.height = '30px';
  rocket.style.position = 'absolute';
  rocket.style.bottom = '90px';
  rocket.style.left = (left + width / 2) - 8 + 'px';
  rocket.zIndex = 3;
  rocket.setAttribute('damage', 10);
  ground.appendChild(rocket);
  return rocket;
}

document.addEventListener('keyup', (e) => {
  if (isGameOver) return;

  if (e.key == " " ||
    e.code == "Space" ||
    e.keyCode == 32
  ) {
    const rocket = launchRockets();
    let { x: rocketX, bottom, y: rocketY } = rocket.getBoundingClientRect();
    let currentBottom = 90;

    const id = setInterval(() => {
      let { x: rocketX, y: rocketY } = rocket.getBoundingClientRect();
      currentBottom += step;
      rocket.style.bottom = currentBottom + 'px';
      if (currentBottom > bottom - 50) {
        clearInterval(id);
        ground.removeChild(rocket);
      };

      const evilObjects = document.querySelectorAll('.evil-player');
      if (evilObjects.length) {
        evilObjects.forEach(item => {
          const { x, y } = item;

          if (inRange(rocketY, y, y + 100) && inRange(rocketX, x, x + 80)) {
            item.setAttribute('src', 'assets/explode.png');
            setTimeout(() => {
              ground.removeChild(item);
            }, 120);
            score += 10;
            if (score > 100) {
              speed -= 1;
            }
            scoreLabel.textContent = score + '';
          }
        })
      }
    }, 200);
  }

  if (e.keyCode == 37) {// move spaceship left
    const spaceShip = document.querySelector('#spaceShip');
    const { left } = spaceShip.getBoundingClientRect();
    let currentLeft = left;

    if (left > step) {
      currentLeft -= 4 * step;
      spaceShip.style.left = currentLeft + 'px';
    }
  }

  if (e.keyCode == 39) {// move spaceship right
    const spaceShip = document.querySelector('#spaceShip');
    const { right } = spaceShip.getBoundingClientRect();
    const { width } = ground.getBoundingClientRect();
    let currentRight = right;

    if (right < width - 4 * step) {
      currentRight += step;
      spaceShip.style.left = currentRight + 'px';
    }
  }
})

const inRange = (target, min, max) => {
  if (target >= min && target < max) return true;
  return false;
}

const randomNumber = () => {
  return Math.random() * 80;
}

const isEnemyBreach = () => {
  const spaceShip = document.querySelector('#spaceShip');
  const { y } = spaceShip.getBoundingClientRect();
  const evilObjects = document.querySelectorAll('.evil-player');
  if (evilObjects.length) {
    return Array.from(evilObjects).some(item => item.y >= y - 100);
  }
}

takeMeHome.addEventListener('click', () => {
  home.classList.remove('d-none');
  battleGround.classList.add('d-none');
  gameOver.classList.toggle('d-none');
})