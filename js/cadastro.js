document.getElementById('cadastroForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  localStorage.setItem('usuario', nome);// Salva o nome no localStorage
  
  // vai para a tela inicial 
  window.location.href = 'inicio.html'; 
});
