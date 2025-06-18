document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formEstudo");
  const tabela = document.querySelector("#tabelaEstudos tbody");
  const formularioContainer = document.getElementById("formularioContainer");
  const btnCadastrar = document.getElementById("btnCadastrarEstudo");
  const searchInput = document.getElementById("searchInputEstudo");
  const searchBtn = document.getElementById("searchBtnEstudo");

  let estudos = JSON.parse(localStorage.getItem("estudos")) || [];

  function salvarEstudos() {
    localStorage.setItem("estudos", JSON.stringify(estudos)); // Salva os estudos no localstorage
  }

  function renderizarTabela(filtro = "") {
    tabela.innerHTML = "";

    const filtroLower = filtro.toLowerCase();

    const estudosFiltrados = estudos.filter(estudo =>
      estudo.descricao.toLowerCase().includes(filtroLower) ||
      estudo.observacoes.toLowerCase().includes(filtroLower) ||
      estudo.data.includes(filtro) ||
      estudo.duracao.includes(filtro)
    );

    estudosFiltrados.forEach((estudo, index) => {
      let descricao = estudo.descricao;
      let observacoes = estudo.observacoes;

      // Destaque visual na busca
      if (filtro) {
        const regex = new RegExp(`(${filtro})`, "gi");
        descricao = descricao.replace(regex, '<span class="destaque">$1</span>');
        observacoes = observacoes.replace(regex, '<span class="destaque">$1</span>');
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${descricao}</td>
        <td>${estudo.data}</td>
        <td>${estudo.duracao}</td>
        <td>${observacoes}</td>
        <td class="botoes-acoes">
          <button class="acao-btn editar-btn" data-index="${index}">Editar</button>
          <button class="acao-btn excluir-btn" data-index="${index}">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });

    if (estudosFiltrados.length === 0) {
      tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhuma sessão encontrada.</td></tr>`;
    }
  }

  btnCadastrar.addEventListener("click", () => {
    formularioContainer.classList.toggle("oculto");
    form.reset();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const descricao = document.getElementById("descricaoEstudo").value;
    const data = document.getElementById("dataEstudo").value;
    const duracao = document.getElementById("duracaoEstudo").value;
    const observacoes = document.getElementById("observacoesEstudo").value;

    const novoEstudo = { descricao, data, duracao, observacoes };
    estudos.push(novoEstudo);
    salvarEstudos();
    renderizarTabela(searchInput.value.trim());

    form.reset();
    formularioContainer.classList.add("oculto");
  });

  tabela.addEventListener("click", function (e) {
    if (e.target.classList.contains("excluir-btn")) {
      const index = e.target.dataset.index;
      estudos.splice(index, 1);
      salvarEstudos();
      renderizarTabela(searchInput.value.trim());
    }

    if (e.target.classList.contains("editar-btn")) {
      const index = e.target.dataset.index;
      const estudo = estudos[index];
      document.getElementById("descricaoEstudo").value = estudo.descricao;
      document.getElementById("dataEstudo").value = estudo.data;
      document.getElementById("duracaoEstudo").value = estudo.duracao;
      document.getElementById("observacoesEstudo").value = estudo.observacoes;
      estudos.splice(index, 1);
      salvarEstudos();
      renderizarTabela(searchInput.value.trim());
      formularioContainer.classList.remove("oculto");
    }
  });

  searchInput.addEventListener("input", () => {
    const termo = searchInput.value.trim();
    renderizarTabela(termo);
  });

  searchBtn.addEventListener("click", () => {
    const termo = searchInput.value.trim();
    renderizarTabela(termo);
  });

  renderizarTabela();
});
