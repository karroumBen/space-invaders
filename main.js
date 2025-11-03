// global variables
const battleGround = document.querySelector("#playground");
const home = document.querySelector("#home");
const gameLauncher = document.querySelector("#game-launcher");
const takeMeHome = document.querySelector("#backBtn");
const ground = document.querySelector("#ground");
const gameOver = document.querySelector("#gameOver");
const scoreLabel = document.querySelector("#score-label");
const startingAudio = document.querySelector("#starting_audio");
const step = 20;
const width = "60px";
let score;
let isGameOver;
let speed;
let initPlayerInterval = null;
let rocketIntervals = [];

// document.addEventListener('mouseover', () => {
//     startingAudio.play();
// })

//music
const shoot = new Audio("assets/music/shoot.wav");
const droneKilled = new Audio("assets/music/drone-killed.wav");

gameLauncher.addEventListener("click", (evt) => {
  startGame(evt);
});

const startGame = (evt) => {
  score = 0;
  speed = 1;
  isGameOver = false;
  scoreLabel.textContent = score + "";
  home.classList.add("d-none");
  gameOver.classList.add("d-none");
  battleGround.classList.remove("d-none");

  // Clear any existing intervals
  if (initPlayerInterval) {
    clearInterval(initPlayerInterval);
  }
  rocketIntervals.forEach((interval) => clearInterval(interval));
  rocketIntervals = [];

  initPlayer({ src: "assets/spaceship.png", type: "good" });

  initPlayerInterval = setInterval(() => {
    for (let i = 0; i < 2; i++) {
      initPlayer({ src: "assets/drone.png", type: "evil" });
    }

    const evilObjects = document.querySelectorAll(".evil-player");
    if (evilObjects.length) {
      evilObjects.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const groundRect = ground.getBoundingClientRect();
        let currentTop = rect.top - groundRect.top;
        currentTop += 20;
        item.style.top = currentTop + "px";
      });
    }

    if (isEnemyBreach()) {
      clearInterval(initPlayerInterval);
      isGameOver = true;
      home.classList.add("d-none");
      battleGround.classList.add("d-none");
      gameOver.classList.remove("d-none");
    }
  }, speed * 1000);
};

const initPlayer = (params) => {
  const { type, src } = params;
  const player = document.createElement("img");
  player.src = src;
  player.style.width = width;
  player.style.position = "absolute";

  player.style.zIndex = 3;

  if (type == "good") {
    player.id = "spaceShip";
    player.style.bottom = "20px";
    player.style.left = "50%";
  } else {
    player.style.top = "10px";
    player.setAttribute("class", "evil-player");
    player.style.left = randomNumber() + "%";
  }

  ground.appendChild(player);
};

const launchRockets = () => {
  shoot.play();
  const spaceShip = document.querySelector("#spaceShip");
  const spaceShipRect = spaceShip.getBoundingClientRect();
  const groundRect = ground.getBoundingClientRect();
  const left = spaceShipRect.left - groundRect.left;
  const spaceShipWidth = spaceShipRect.width;

  const rocket = document.createElement("img");
  rocket.src = "assets/rocket.png";
  rocket.style.width = "15px";
  rocket.style.height = "30px";
  rocket.style.position = "absolute";
  rocket.style.bottom = "90px";
  rocket.style.left = left + spaceShipWidth / 2 - 8 + "px";
  rocket.style.zIndex = "3";
  rocket.setAttribute("damage", 10);
  ground.appendChild(rocket);
  return rocket;
};

document.addEventListener("keyup", (e) => {
  if (isGameOver) return;

  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    const rocket = launchRockets();
    const groundRect = ground.getBoundingClientRect();
    const groundHeight = groundRect.height;
    let currentBottom = 90;

    const id = setInterval(() => {
      const rocketRect = rocket.getBoundingClientRect();
      const rocketX = rocketRect.left - groundRect.left;
      const rocketY = rocketRect.top - groundRect.top;
      currentBottom += step;
      rocket.style.bottom = currentBottom + "px";

      if (currentBottom > groundHeight - 50) {
        clearInterval(id);
        rocketIntervals = rocketIntervals.filter((interval) => interval !== id);
        if (rocket.parentNode) {
          ground.removeChild(rocket);
        }
        return;
      }

      const evilObjects = document.querySelectorAll(".evil-player");
      if (evilObjects.length) {
        evilObjects.forEach((item) => {
          if (item.parentNode) {
            const itemRect = item.getBoundingClientRect();
            const itemX = itemRect.left - groundRect.left;
            const itemY = itemRect.top - groundRect.top;
            const itemWidth = itemRect.width;
            const itemHeight = itemRect.height;

            if (
              inRange(rocketY, itemY, itemY + itemHeight) &&
              inRange(rocketX, itemX, itemX + itemWidth)
            ) {
              item.setAttribute("src", "assets/explode.png");
              droneKilled.play();
              clearInterval(id);
              rocketIntervals = rocketIntervals.filter(
                (interval) => interval !== id
              );
              if (rocket.parentNode) {
                ground.removeChild(rocket);
              }
              setTimeout(() => {
                if (item.parentNode) {
                  ground.removeChild(item);
                }
              }, 120);
              score += 10;
              if (score > 100) {
                // speed -= 1;
              }
              scoreLabel.textContent = score + "";
            }
          }
        });
      }
    }, 200);
    rocketIntervals.push(id);
  }

  if (e.keyCode == 37) {
    // move spaceship left
    const spaceShip = document.querySelector("#spaceShip");
    if (!spaceShip) return;
    const spaceShipRect = spaceShip.getBoundingClientRect();
    const groundRect = ground.getBoundingClientRect();
    const left = spaceShipRect.left - groundRect.left;
    let currentLeft = left;

    if (left > step) {
      currentLeft -= 4 * step;
      spaceShip.style.left = currentLeft + "px";
    }
  }

  if (e.keyCode == 39) {
    // move spaceship right
    const spaceShip = document.querySelector("#spaceShip");
    if (!spaceShip) return;
    const spaceShipRect = spaceShip.getBoundingClientRect();
    const groundRect = ground.getBoundingClientRect();
    const groundWidth = groundRect.width;
    const spaceShipWidth = spaceShipRect.width;
    const right = spaceShipRect.right - groundRect.left;
    let currentLeft = spaceShipRect.left - groundRect.left;

    if (right < groundWidth - 4 * step) {
      currentLeft += 4 * step;
      spaceShip.style.left = currentLeft + "px";
    }
  }
});

const inRange = (target, min, max) => {
  if (target >= min && target < max) return true;
  return false;
};

const randomNumber = () => {
  return Math.random() * 80;
};

const isEnemyBreach = () => {
  const spaceShip = document.querySelector("#spaceShip");
  if (!spaceShip) return false;
  const spaceShipRect = spaceShip.getBoundingClientRect();
  const groundRect = ground.getBoundingClientRect();
  const spaceShipY = spaceShipRect.top - groundRect.top;
  const evilObjects = document.querySelectorAll(".evil-player");

  if (evilObjects.length) {
    return Array.from(evilObjects).some((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemY = itemRect.top - groundRect.top;
      return itemY >= spaceShipY - 100;
    });
  }
  return false;
};

takeMeHome.addEventListener("click", () => {
  clearGame();
});

const clearGame = () => {
  // Clear intervals
  if (initPlayerInterval) {
    clearInterval(initPlayerInterval);
    initPlayerInterval = null;
  }
  rocketIntervals.forEach((interval) => clearInterval(interval));
  rocketIntervals = [];

  // Remove spaceShip if it exists
  const spaceShip = document.querySelector("#spaceShip");
  if (spaceShip && spaceShip.parentNode) {
    ground.removeChild(spaceShip);
  }

  // Remove all evil objects
  const evilObjects = document.querySelectorAll(".evil-player");
  if (evilObjects.length) {
    evilObjects.forEach((item) => {
      if (item.parentNode) {
        ground.removeChild(item);
      }
    });
  }

  // Remove all rockets
  const rockets = document.querySelectorAll("img[src='assets/rocket.png']");
  if (rockets.length) {
    rockets.forEach((rocket) => {
      if (rocket.parentNode) {
        ground.removeChild(rocket);
      }
    });
  }

  home.classList.remove("d-none");
  battleGround.classList.add("d-none");
  gameOver.classList.add("d-none");
};
