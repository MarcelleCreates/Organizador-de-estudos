// Elementos
const btnCadastrarTarefa = document.getElementById('btnCadastrarTarefa');
const formularioContainer = document.getElementById('formularioContainer');
const formTarefa = document.getElementById('formTarefa');
const tabelaTarefas = document.getElementById('tabelaTarefas').querySelector('tbody');
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; // Carrega as tarefas salvas no localstorage
let editIndex = -1;

// Mostrar ou esconder o cadastro
btnCadastrarTarefa.addEventListener('click', () => {
  formularioContainer.classList.toggle('oculto');
  formTarefa.reset(); // Limpa o cadastro
  editIndex = -1;
});

// Salvar ou atualizar tarefa
formTarefa.addEventListener('submit', (e) => {
  e.preventDefault();

  const descricao = document.getElementById('descricao').value.trim();
  const data = document.getElementById('data').value;
  const materia = document.getElementById('materia').value.trim();
  const status = document.getElementById('status').value;

  if (!descricao || !data || !materia || !status) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const tarefaObj = { descricao, data, materia, status };

  if (editIndex >= 0) {
    tarefas[editIndex] = tarefaObj;  // Atualiza tarefa que ja existe
  editIndex = -1;
  } else {
    tarefas.push(tarefaObj); // Adiciona uma nova tarefa
  }

  localStorage.setItem('tarefas', JSON.stringify(tarefas));// Salva no localStorage
  formTarefa.reset();
  formularioContainer.classList.add('oculto');

  // atualiza quando busca no pesquisar
  renderizarTabela(searchInput.value.trim());
});

// Editar tarefa
function editarTarefa(index) {
  const tarefa = tarefas[index];
  document.getElementById('descricao').value = tarefa.descricao;
  document.getElementById('data').value = tarefa.data;
  document.getElementById('materia').value = tarefa.materia;
  document.getElementById('status').value = tarefa.status;

  formularioContainer.classList.remove('oculto');
  editIndex = index;
}

// Excluir tarefa
function excluirTarefa(index) {
  if (confirm('Tem certeza que deseja excluir essa tarefa?')) {
    tarefas.splice(index, 1);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderizarTabela(searchInput.value.trim());
  }
}

// Renderizar filtro  de busca opcional
function renderizarTabela(filtro = "") {
  tabelaTarefas.innerHTML = "";

  const filtroLower = filtro.toLowerCase();

  const tarefasParaExibir = tarefas.filter(tarefa =>
    tarefa.descricao.toLowerCase().includes(filtroLower) ||
    tarefa.materia.toLowerCase().includes(filtroLower) ||
    tarefa.status.toLowerCase().includes(filtroLower) ||
    tarefa.data.includes(filtro) 
  );

  tarefasParaExibir.forEach((tarefa, index) => {
    const tr = document.createElement("tr");

    
    let descricao = tarefa.descricao;
    // Destaque visual na busca
    if (filtro) {
      const regex = new RegExp(`(${filtro})`, "gi");
      descricao = descricao.replace(regex, '<span class="destaque">$1</span>');
    }

    tr.innerHTML = `
      <td>${descricao}</td>
      <td>${tarefa.data}</td>
      <td>${tarefa.materia}</td>
      <td>${tarefa.status}</td>
      <td>
        <button class="acao-btn editar-btn" onclick="editarTarefa(${index})">Editar</button>
        <button class="acao-btn excluir-btn" onclick="excluirTarefa(${index})">Excluir</button>
      </td>
    `;

    tabelaTarefas.appendChild(tr);
  });

  if (tarefasParaExibir.length === 0) {
    tabelaTarefas.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhuma tarefa encontrada.</td></tr>`;
  }

  document.getElementById('tabelaTarefas').classList.toggle('oculto', tarefas.length === 0);
}


searchInput.addEventListener("input", () => {
  const termo = searchInput.value.trim();
  renderizarTabela(termo);
});


searchBtn.addEventListener("click", () => {
  const termo = searchInput.value.trim();
  renderizarTabela(termo);
});

// voltar a tabela inicial
renderizarTabela();


