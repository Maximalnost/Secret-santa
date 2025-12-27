const fs = require('fs');
const crypto = require('crypto');

const participantsList = [
  {name: 'Максим', password: 'BananaLover', video: "videos/maxim.mp4" },
  {name: 'Вика', password: 'MoyLubimiyNovozibkov', video: "videos/vika.mp4" },
  {name: 'Катя', password: 'FurryArtist18+', video: "videos/katya.mp4" },
  {name: 'Марина', password: 'Lisi4ka18', video: "videos/marina.mp4" },
  {name: 'Серёжа', password: 'ImagineMiyaGiBTS', video: "videos/serega.mp4" },
  {name: 'Даня', password: 'TopEEEInvoker228', video: "videos/danya.mp4" }
];

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

function shuffle(arr) {
  return arr
    .map(v => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map(v => v[1]);
}

function draw(list) {
  let shuffled;
  do {
    shuffled = shuffle([...list]);
  } while (list.some((p, i) => list[i] === shuffled[i])); // никто не сам себе
  return Object.fromEntries(list.map((p, i) => [`user${i+1}`, `user${shuffled.indexOf(p)+1}`]));
}

const results = draw(participantsList);

const participants = {};
participantsList.forEach((p, index) => {
  const key = `user${index+1}`;
  participants[key] = {
    name: p.name,
    passwordHash: hashPassword(p.password),
    video: p.video
  };
});

if (!fs.existsSync('data')) fs.mkdirSync('data');
fs.writeFileSync('data/results.json', JSON.stringify(results, null, 2), 'utf-8');
fs.writeFileSync('data/participants.json', JSON.stringify(participants, null, 2), 'utf-8');

