// variáveis globais
let estudos = [];
let tempoTotal = 0;
let tempoRestante = 0;
let cronometro = null;
let pausado = false;

// Carrega as sessões salvas no localStorage e mostra no seletor de estudos
function carregarSessoes() {
  const select = document.getElementById("selectSessao");
  const dados = localStorage.getItem("estudos");
  if (!dados) return;

  estudos = JSON.parse(dados);
  select.innerHTML = "<option value=''>Selecione uma sessão</option>";

  estudos.forEach((estudo, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${estudo.descricao} (${estudo.duracao} min)`;
    select.appendChild(option);
  });
}

// Formata o tempo para de acordo com os minutos marcado no cadastro
function formatarTempo(segundos) {
  const horas = String(Math.floor(segundos / 3600)).padStart(2, "0");
  const min = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
  const seg = String(segundos % 60).padStart(2, "0");
  return `${horas}:${min}:${seg}`;
}

function atualizarDisplay() {
  const display = document.getElementById("cronometroDisplay");
  display.textContent = formatarTempo(tempoRestante);
}

// Começa a contagem do cronometro
function iniciarCronometro() {
  const select = document.getElementById("selectSessao");
  const valor = select.value;

  if (valor === "") {
    alert("Selecione uma sessão de estudo.");
    return;
  }

  const estudo = estudos[valor];
  tempoTotal = estudo.duracao * 60;
  tempoRestante = tempoTotal;
  atualizarDisplay();

  document.getElementById("btnIniciar").disabled = true;
  document.getElementById("btnPausar").disabled = false;
  document.getElementById("btnContinuar").disabled = true;

  cronometro = setInterval(() => {
    if (tempoRestante > 0) {
      tempoRestante--;
      atualizarDisplay();
    } else {
      clearInterval(cronometro);
      alert("Tempo finalizado!");
    }
  }, 1000);
}

// Pausa a contagem 
function pausarCronometro() {
  clearInterval(cronometro);
  pausado = true;
  document.getElementById("btnPausar").disabled = true;
  document.getElementById("btnContinuar").disabled = false;
}

// Continua de onde parou
function continuarCronometro() {
  if (!pausado || tempoRestante <= 0) return;

  document.getElementById("btnPausar").disabled = false;
  document.getElementById("btnContinuar").disabled = true;

  cronometro = setInterval(() => {
    if (tempoRestante > 0) {
      tempoRestante--;
      atualizarDisplay();
    } else {
      clearInterval(cronometro);
      alert("Tempo finalizado!");
    }
  }, 1000);
}

// botões
document.addEventListener("DOMContentLoaded", () => {
  carregarSessoes();

  document.getElementById("btnIniciar").addEventListener("click", iniciarCronometro);
  document.getElementById("btnPausar").addEventListener("click", pausarCronometro);
  document.getElementById("btnContinuar").addEventListener("click", continuarCronometro);
});

// botao voltar ao inicio
document.getElementById("btnVoltar").addEventListener("click", function () {
  window.location.href = "inicio.html"; 
});

