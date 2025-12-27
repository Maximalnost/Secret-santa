const fs = require('fs');
const crypto = require('crypto');

const participantsList = [
  {name: 'Максим', password: 'BananaLover', video: "https://disk.yandex.ru/i/1Ov58hurhhNugw" },
  {name: 'Вика', password: 'MoyLubimiyNovozibkov', video: "https://disk.yandex.ru/i/FnUrRa_JM8cYTg" },
  {name: 'Катя', password: 'FurryArtist18+', video: "https://disk.yandex.ru/i/95y_bytUx8M_8w" },
  {name: 'Марина', password: 'Lisi4ka18', video: "https://disk.yandex.ru/i/DACH9pGpwUvxaQ" },
  {name: 'Серёжа', password: 'ImagineMiyaGiBTS', video: "https://disk.yandex.ru/i/ZVH2G6FUzlFxJA" },
  {name: 'Даня', password: 'TopEEEInvoker228', video: "https://disk.yandex.ru/i/Sw1mJp_IVBiJeA" }
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

