//Rotina/Perfil
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let points = parseInt(localStorage.getItem('points')) || 0;
let attributes = JSON.parse(localStorage.getItem('attributes')) || {
  Força: 0,
  Inteligência: 0,
  Resistência: 0,
  Foco: 0,
  Disciplina: 0,
  Fé: 0
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
      <button onclick="deleteTask(${index})">🗑</button>
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
      <br>
      <button onclick="increaseAttr('${attr}')">+1</button>
    `;
    attrList.appendChild(div);
  }
}

function deleteTask(index) {
  if (confirm("Deseja realmente deletar esta tarefa?")) {
    tasks.splice(index, 1);
    save();
    updateUI();
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
  document.getElementById('galeria').style.display = 'none';
  document.getElementById(tabId).style.display = 'block';

  if (tabId === 'galeria') {
    renderGallery(); // <-- CHAMA AQUI
  }
  
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
  const savedAvatar = localStorage.getItem('avatarSelecionado');
      if (savedAvatar) {
        document.getElementById('profileImage').src = savedAvatar;
      }

  updateUI(); // mantém o funcionamento da aba rotina
    updateXpUI(); // <- ADICIONE ISSO AQUI!
    updateHeaderBanner();
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

// Service Worker: atualização automática
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/Rotina-Di-ria/service-worker.js').then(registration => {
    // Detecta nova versão
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          document.getElementById('updateBanner').style.display = 'block';
        }
      });
    });
  });

  // Recarrega página quando novo SW assume o controle
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

function updateSite() {
  navigator.serviceWorker.getRegistration().then(reg => {
    if (reg && reg.waiting) {
      reg.waiting.postMessage('SKIP_WAITING');
    }
  });
}

//galeria 


//avatar
const avatars = [
  { url: 'img/avatar1.png', requiredLevel: 1 },
  { url: 'img/avatar2.png', requiredLevel: 3 },
  { url: 'img/avatar3.png', requiredLevel: 5 },
  { url: 'img/avatar4.png', requiredLevel: 7 },
  { url: 'img/avatar5.png', requiredLevel: 9 },
  { url: 'img/avatar6.png', requiredLevel: 10 },
  { url: 'img/avatar7.png', requiredLevel: 12 },
  { url: 'img/avatar8.png', requiredLevel: 14 },
   { url: 'img/avatar9.png', requiredLevel: 16 }
];

function renderGallery() {
  const avatarSection = document.getElementById('avatar-section');
  const bannerSection = document.getElementById('banner-section');
  const userLevel = parseInt(localStorage.getItem('level') || '1');

  avatarSection.innerHTML = '<h3>Avatares</h3>';
  bannerSection.innerHTML = '<h3>Banners</h3>';

  // Avatares
  avatars.forEach(avatar => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = avatar.url;
    img.alt = 'Avatar';
    img.classList.add('avatar');

    const label = document.createElement('div');
    label.innerText = `Desbloqueia no nível ${avatar.requiredLevel}`;

    div.appendChild(img);
    div.appendChild(label);

    if (userLevel >= avatar.requiredLevel) {
      const btn = document.createElement('button');
      btn.innerText = 'Usar como perfil';
      btn.onclick = () => selecionarAvatar(avatar.url, avatar.requiredLevel);
      div.appendChild(btn);
    }
    avatarSection.appendChild(div);
  });

  // Banners
  banners.forEach(banner => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = banner.src;
    img.alt = 'Banner';
    img.classList.add('banner-img');

    const label = document.createElement('div');
    label.innerText = `Desbloqueia no nível ${banner.requiredLevel}`;

    div.appendChild(img);
    div.appendChild(label);

    if (userLevel >= banner.requiredLevel) {
      const btn = document.createElement('button');
      btn.innerText = 'Ativar banner';
      btn.onclick = () => selecionarBanner(banner.src, banner.requiredLevel);
      div.appendChild(btn);
    }
    bannerSection.appendChild(div);
  });
}

function selecionarAvatar(src, nivelNecessario) {
      const userLevel = parseInt(localStorage.getItem('level') || '1');
      if (userLevel >= nivelNecessario) {
        document.getElementById('profileImage').src = src;
        localStorage.setItem('avatarSelecionado', src);
        alert("Avatar alterado com sucesso!");
      } else {
        alert(`Você precisa estar no nível ${nivelNecessario} para usar este avatar.`);
      }
    }
+-
    function limparLocalStorage() {
  if (confirm("Tem certeza que deseja apagar todos os dados salvos? Essa ação não pode ser desfeita.")) {
    localStorage.clear();
    location.reload();
  }
}

//banners
const banners = [
  { src: "img/banner1.png", requiredLevel: 1 },
  { src: "img/banner2.png", requiredLevel: 3 },
  { src: "img/banner3.png", requiredLevel: 5 },
  { src: "img/banner4.png", requiredLevel: 6 },
  { src: "img/banner5.png", requiredLevel: 7 },
  { src: "img/banner6.png", requiredLevel: 9 },
  { src: "img/banner7.png", requiredLevel: 10 },
  { src: "img/banner8.png", requiredLevel: 12},
  { src: "img/banner9.png", requiredLevel: 13},
  { src: "img/banner10.png", requiredLevel: 14 },
  { src: "img/banner11.png", requiredLevel: 15 },
  { src: "img/banner12.png", requiredLevel: 17 }
];

function updateHeaderBanner() {
  const header = document.querySelector('.header');
  const selectedBanner = localStorage.getItem('selectedBanner');

  if (selectedBanner) {
    header.style.backgroundImage = `url('${selectedBanner}')`;
    header.style.backgroundColor = ''; // remove cor sólida, se houver
  } else {
    header.style.backgroundImage = 'none';
    header.style.backgroundColor = '#333'; // cinza escuro
  }
}

function selecionarBanner(src, nivelNecessario) {
  const userLevel = parseInt(localStorage.getItem('level')) || 1;
  if (userLevel >= nivelNecessario) {
    localStorage.setItem('selectedBanner', src);
    updateHeaderBanner();
    alert('Banner ativado com sucesso!');
  } else {
    alert(`Você precisa estar no nível ${nivelNecessario} para usar este banner.`);
  }
}

updateUI();


