// global variables
const battleGround = document.querySelector('#playground');
const home = document.querySelector('#home');
const gameLauncher = document.querySelector('#game-launcher');
const ground = document.querySelector('#ground');
const scoreLabel = document.querySelector('#score-label');
const step = 25;
let score = 0;

gameLauncher.addEventListener('click', (evt) => {
  startGame(evt);
  const initPlayerInterval = setInterval(() => {
    initPlayer({ src: '/assets/drone.png', type: 'evil'});
    const evilObjects = document.querySelectorAll('.evil-player');
      if(evilObjects.length) { 
        evilObjects.forEach(item => {
          let { y } = item;
          console.log('top', y);
          y += 40;
          item.style.top = y + 'px';
        })
      }
    
    if(isEnemyBreach()) {
      clearInterval(initPlayerInterval);
      console.log('you lost');
    }
  }, 2000);
})

const startGame = (evt) => {
  home.classList.toggle('d-none');
  battleGround.classList.toggle('d-none');
  initPlayer({ src: '/assets/drone.png', type: 'evil'});
  initPlayer({ src: '/assets/spaceship.png', type: 'good'});
}

const initPlayer = (params) => {
  const { type, src } = params;
  const player = document.createElement('img');
  player.src = src;
  player.style.width = '80px';
  player.style.position = 'absolute';
  
  player.style.zIndex = 3;

  if(type == 'good') {
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
  const spaceShip = document.querySelector('#spaceShip');
  const {left, width} = spaceShip.getBoundingClientRect();

  const rocket = document.createElement('img');
  rocket.src = '/assets/rocket.png';
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
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    const rocket = launchRockets();
    let { x: rocketX, bottom, y: rocketY } = rocket.getBoundingClientRect();
    console.log(rocketX, rocketY);
    let currentBottom = 90;
    const id = setInterval(() => {
      let { x: rocketX, y: rocketY } = rocket.getBoundingClientRect();
      console.log(rocketX, rocketY);
      currentBottom += step;
      rocket.style.bottom = currentBottom + 'px';
      if(currentBottom > bottom - 50) {
        clearInterval(id);
        ground.removeChild(rocket);
      };
      
      const evilObjects = document.querySelectorAll('.evil-player');
      if(evilObjects.length) {
        evilObjects.forEach(item => {
          const { x, y } = item;
          console.log(x, y, rocketY, rocketX);
          if(inRange(rocketY, y, y + 100) && inRange(rocketX, x, x + 80) ) {
            item.setAttribute('src', 'assets/explode.png')
            ground.removeChild(item);
            score += 10;
            if(score > 500) console.log('Congratulations');
            scoreLabel.textContent = score +'';
          }
        })
      }
    }, 150);
  }

  if (e.keyCode == 37) {// move spaceship left
    const spaceShip = document.querySelector('#spaceShip');
    const {left} = spaceShip.getBoundingClientRect();
    let currentLeft = left;

    if(left > step) {
      currentLeft -= 4*step;
      spaceShip.style.left = currentLeft + 'px';
    }
  }

  if (e.keyCode == 39) {// move spaceship right
    const spaceShip = document.querySelector('#spaceShip');
    const { right } = spaceShip.getBoundingClientRect();
    const { width } = ground.getBoundingClientRect();
    let currentRight = right;
    console.log(right);
    console.log(width);

    if(right < width - 2 * step) {
      currentRight += step;
      spaceShip.style.left = currentRight + 'px';
    }
  }
})

const inRange = (target, min, max) => {
  console.log(target, min, max);
  if(target >= min && target < max) return true;
  return false;
}

const randomNumber = () => {
  return Math.random() * 80;
}

const isEnemyBreach = () => {
  const spaceShip = document.querySelector('#spaceShip');
  const { y } = spaceShip.getBoundingClientRect();
  const evilObjects = document.querySelectorAll('.evil-player');
  if(evilObjects.length) {
    return Array.from(evilObjects).some(item => item.y >= y - 80);
  }
}