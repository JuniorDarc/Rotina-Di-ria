//Relogio e Hitorico
const listaHistorico = document.getElementById('lista-historico');
const hoje = new Date().toLocaleDateString('pt-BR');
document.getElementById('data-atual').textContent = `Data de hoje: ${hoje}`;

// Elementos principais
const form = document.getElementById('form-rotina');
const input = document.getElementById('input-rotina');
const listaPendentes = document.getElementById('lista-pendentes');
const botaoResetar = document.getElementById('resetar-dia');

// Perfil
const rotinasFeitasSpan = document.getElementById('rotinas-feitas');
const pontosDisponiveisSpan = document.getElementById('pontos-disponiveis');
const botoesAtributos = document.querySelectorAll('#atributos button');

// Estado
let rotinas = JSON.parse(localStorage.getItem('rotinas')) || [];
let rotinasFeitasHoje = 0;
let pontosDisponiveis = 0;
const atributos = {
  forca: 0,
  inteligencia: 0,
  resistencia: 0,
  foco: 0
};

// Carrega perfil salvo
function carregarPerfil() {
  const data = JSON.parse(localStorage.getItem('perfil'));
  if (data) {
    rotinasFeitasHoje = data.rotinasFeitasHoje || 0;
    pontosDisponiveis = data.pontosDisponiveis || 0;
    Object.assign(atributos, data.atributos || {});
  }
}

// Salva perfil
function salvarPerfil() {
  localStorage.setItem('perfil', JSON.stringify({
    rotinasFeitasHoje,
    pontosDisponiveis,
    atributos
  }));
}

// Atualiza área do perfil
function atualizarPerfil() {
  rotinasFeitasSpan.textContent = rotinasFeitasHoje;
  pontosDisponiveisSpan.textContent = pontosDisponiveis;
  for (let key in atributos) {
    const span = document.getElementById(`${key}-valor`);
    if (span) span.textContent = atributos[key];
  }
  botoesAtributos.forEach(btn => {
    btn.disabled = pontosDisponiveis <= 0;
  });
}

// Evento para distribuir pontos
botoesAtributos.forEach(btn => {
  btn.addEventListener('click', () => {
    const atributo = btn.dataset.atributo;
    if (pontosDisponiveis > 0) {
      atributos[atributo]++;
      pontosDisponiveis--;
      salvarPerfil();
      atualizarPerfil();
    }
  });
});

// Salvar rotinas
function salvarRotinas() {
  localStorage.setItem('rotinas', JSON.stringify(rotinas));
  salvarPerfil();
}

// Cria visualmente uma rotina
function criarItem(rotina) {
  if (rotina.concluida) return; // Tarefa concluída não aparece

  const li = document.createElement('li');
  li.dataset.id = rotina.id;

  const span = document.createElement('span');
  span.textContent = rotina.texto;

  const btnConcluir = document.createElement('button');
  btnConcluir.textContent = 'Concluir';

  btnConcluir.addEventListener('click', () => {
    if (rotinasFeitasHoje >= 5) {
      alert('Você só pode concluir 5 rotinas por dia.');
      return;
    }

    rotina.concluida = true;
    rotinasFeitasHoje++;
    pontosDisponiveis++;

    salvarRotinas();
    atualizarPerfil();
    atualizarListas(); // remove da lista visual
  });

  const btnDescartar = document.createElement('button');
  btnDescartar.textContent = 'Descartar';

  btnDescartar.addEventListener('click', () => {
    // Se ela ainda não foi concluída, pode remover direto
    rotinas = rotinas.filter(r => r.id !== rotina.id);
    salvarRotinas();
    atualizarPerfil();
    atualizarListas();
  });

  li.appendChild(span);
  li.appendChild(btnConcluir);
  li.appendChild(btnDescartar);
  listaPendentes.appendChild(li);
}

// Atualiza a lista de rotinas
function atualizarListas() {
  listaPendentes.innerHTML = '';
  listaHistorico.innerHTML = '';

  rotinas.forEach(rotina => {
    if (!rotina.concluida) {
      criarItem(rotina);
    } else {
      criarHistorico(rotina);
    }
  });
}

function criarHistorico(rotina) {
  const li = document.createElement('li');
  li.textContent = `✔ ${rotina.texto}`;
  listaHistorico.appendChild(li);
}

function verificarDataEAtualizar() {
  const ultimaData = localStorage.getItem('ultimaData');
  if (ultimaData !== hoje) {
    // Resetar tudo
    rotinas = [];
    rotinasFeitasHoje = 0;
    pontosDisponiveis = 0;
    for (let key in atributos) atributos[key] = 0;

    localStorage.setItem('ultimaData', hoje);
    salvarRotinas();
  }
}

// Evento de envio de rotina
form.addEventListener('submit', e => {
  e.preventDefault();
  const texto = input.value.trim();
  if (texto === '') return;

  const novaRotina = {
    id: Date.now(),
    texto,
    concluida: false
  };

  rotinas.push(novaRotina);
  input.value = '';
  salvarRotinas();
  atualizarListas();
});

// Resetar tudo
botaoResetar.addEventListener('click', () => {
  if (confirm('Deseja realmente resetar o dia? Isso apagará todas as rotinas e atributos.')) {
    rotinas = [];
    rotinasFeitasHoje = 0;
    pontosDisponiveis = 0;
    for (let key in atributos) atributos[key] = 0;
    salvarRotinas();
    atualizarPerfil();
    atualizarListas();
  }
});

// Inicialização
verificarDataEAtualizar();
carregarPerfil();
atualizarPerfil();
atualizarListas();
