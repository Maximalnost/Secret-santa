let participants, results, currentUser;

// Загружаем JSON
async function loadData() {
  participants = await fetch('./data/participants.json').then(r => r.json());
  results = await fetch('./data/results.json').then(r => r.json());
}
await loadData();

// SHA-256 для проверки пароля
async function hashPassword(pwd) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Основное видео
function startMainVideo() {
  const targetId = results[currentUser];
  const videoSrc = participants[targetId].video;

  const videoScreen = document.getElementById('videoScreen');
  const video = document.getElementById('video');

  video.src = videoSrc;
  videoScreen.classList.remove('hidden');
  video.play();
}

// Авторизация
document.getElementById('authBtn').onclick = async () => {
  const pwd = document.getElementById('password').value;
  const hash = await hashPassword(pwd);

  const id = Object.keys(participants).find(key => participants[key].passwordHash === hash);
  if (!id) return alert('Неверный пароль');

  currentUser = id;

  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('logo').classList.add('hidden');

  const intro = document.getElementById('introVideo');
  intro.classList.remove('hidden');
  intro.play();

  intro.onended = () => {
    intro.classList.add('hidden');
    startMainVideo();
  };
};

// Снежинки
const images = ['images/dota.png','images/banana.png','images/granate.png','images/fox.png','images/BTS.png','images/microbe.png'];
function createFallingElements(count = 50) {
  const container = document.getElementById('snowContainer');
  const imgCount = Math.floor(count*0.2), snowCount = count-imgCount;

  for (let i=0;i<imgCount;i++){
    const img=document.createElement('img');
    img.src=images[Math.floor(Math.random()*images.length)];
    img.className='fallingImg';
    img.style.left=Math.random()*window.innerWidth+'px';
    img.style.top='-20px';
    img.style.opacity=0;
    img.style.animationDuration=(3+Math.random()*5)+'s';
    img.style.animationDelay=Math.random()*5+'s';
    container.appendChild(img);
  }
  for (let i=0;i<snowCount;i++){
    const snow=document.createElement('div');
    snow.className='snowflake';
    snow.style.left=Math.random()*window.innerWidth+'px';
    snow.style.top='-20px';
    snow.style.opacity=0;
    snow.style.animationDuration=(3+Math.random()*5)+'s';
    snow.style.animationDelay=Math.random()*5+'s';
    container.appendChild(snow);
  }
}
createFallingElements();
function clearFallingElements(){document.getElementById('snowContainer').innerHTML='';}
