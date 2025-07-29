//Rotina/Perfil
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let points = parseInt(localStorage.getItem('points')) || 0;
let attributes = JSON.parse(localStorage.getItem('attributes')) || {
  Força: 0,
  Inteligência: 0,
  Resistência: 0,
  Foco: 0
};
//Nivel/xp
let xp = parseInt(localStorage.getItem('xp')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;
let xpToNextLevel = parseInt(localStorage.getItem('xpToNextLevel')) || 100;

//Funcões Rotina/Perfil
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('points', points);
  localStorage.setItem('attributes', JSON.stringify(attributes));
}

function updateUI() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${task.text}</span>
      <button onclick="completeTask(${index})">✔️</button>
    `;
    taskList.appendChild(li);
  });

  document.getElementById('points').innerText = points;

  const attrList = document.getElementById('attributeList');
  attrList.innerHTML = '';
  for (let attr in attributes) {
    const div = document.createElement('div');
    div.className = 'attribute';
    div.innerHTML = `
      <strong>${attr}</strong>: ${attributes[attr]} 
      <button onclick="increaseAttr('${attr}')">+1</button>
    `;
    attrList.appendChild(div);
  }
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (text) {
    tasks.push({ text });
    input.value = '';
    save();
    updateUI();
  }
}

function completeTask(index) {
  tasks.splice(index, 1);
  points += 1;
  save();
  updateUI();
  giveXpOnTask();
}

function increaseAttr(attr) {
  if (points > 0) {
    attributes[attr]++;
    points--;
    save();
    updateUI();
  }
}

function toggleEditName() {
  const form = document.getElementById('editNameForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';

  document.getElementById('nameInput').value =
    localStorage.getItem('username') || 'Junior Silva';
}

function showTab(tabId) {
  document.getElementById('rotina').style.display = 'none';
  document.getElementById('perfil').style.display = 'none';
  document.getElementById(tabId).style.display = 'block';
}

function saveName() {
  const newName = document.getElementById('nameInput').value.trim();
  if (newName) {
    localStorage.setItem('username', newName);
    document.getElementById('userName').innerText = newName;
    document.getElementById('perfilNomeExibido').innerText = newName;
    document.getElementById('nameInput').value = '';
  }
}

// Ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('username');
  if (savedName) {
    document.getElementById('userName').innerText = savedName;
    document.getElementById('perfilNomeExibido').innerText = savedName;
  }

  updateUI(); // mantém o funcionamento da aba rotina
    updateXpUI(); // <- ADICIONE ISSO AQUI!
});

//Funcões Nivel/Xp
function updateXpUI() {
  document.getElementById('userLevel').innerText = level;
  document.getElementById('currentXp').innerText = xp;
  document.getElementById('xpToNext').innerText = xpToNextLevel;
  const percent = Math.min((xp / xpToNextLevel) * 100, 100);
  document.getElementById('xpBar').style.width = percent + '%';
}
function giveXpOnTask() {
  const xpGain = Math.floor(Math.random() * 21) + 5; // 5 a 25 XP aleatórios
  xp += xpGain;

  if (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.2); // aumenta dificuldade
    unlockRewards(level);
  }

  localStorage.setItem('xp', xp);
  localStorage.setItem('level', level);
  localStorage.setItem('xpToNextLevel', xpToNextLevel);
  updateXpUI();
}


updateUI();


