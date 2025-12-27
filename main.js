let participants, results, currentUser;
const BASE = window.location.pathname.includes("Secret-santa")
  ? "/Secret-santa"
  : "";

// Подгружаем данные
async function loadData() {
  participants = await fetch(`${BASE}/data/participants.json`).then((r) =>
    r.json()
  );
  results = await fetch(`${BASE}/data/results.json`).then((r) => r.json());
}
await loadData();

// SHA-256 для проверки пароля
async function hashPassword(pwd) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(pwd)
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Функция запуска основного видео
function startMainVideo() {
  const targetId = results[currentUser];
  const videoSrc = participants[targetId].video;

  const videoScreen = document.getElementById("videoScreen");
  const video = document.getElementById("video");

  video.src = videoSrc;
  videoScreen.classList.remove("hidden");
  video.play();
}

// Авторизация по паролю
document.getElementById("authBtn").onclick = async () => {
  const pwd = document.getElementById("password").value;
  const hash = await hashPassword(pwd);

  const id = Object.keys(participants).find(
    (key) => participants[key].passwordHash === hash
  );

  if (!id) return alert("Неверный пароль");

  currentUser = id;
  // clearFallingElements();

  // Скрываем экран логина
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("logo").classList.add("hidden");

  // Показываем интро-видео
  const intro = document.getElementById("introVideo");
  intro.classList.remove("hidden");
  intro.play(); // теперь видео точно сможет стартовать

  // После окончания интро запускаем основное видео
  intro.onended = () => {
    intro.classList.add("hidden");
    startMainVideo();
  };
};

// Снежинки и картинки
const images = [
  "images/dota.png",
  "images/banana.png",
  "images/granate.png",
  "images/fox.png",
  "images/BTS.png",
  "images/microbe.png",
];

function createFallingElements(count = 50) {
  const container = document.getElementById("snowContainer");

  const imgCount = Math.floor(count * 0.2);
  const snowCount = count - imgCount;

  for (let i = 0; i < imgCount; i++) {
    const img = document.createElement("img");
    img.src = images[Math.floor(Math.random() * images.length)];
    img.className = "fallingImg";
    img.style.left = Math.random() * window.innerWidth + "px";
    img.style.top = "-20px";
    img.style.opacity = 0;
    img.style.animationDuration = 3 + Math.random() * 5 + "s";
    img.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(img);
  }

  for (let i = 0; i < snowCount; i++) {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.top = "-20px";
    snow.style.opacity = 0;
    snow.style.animationDuration = 3 + Math.random() * 5 + "s";
    snow.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(snow);
  }
}

createFallingElements();

function clearFallingElements() {
  document.getElementById("snowContainer").innerHTML = "";
}
