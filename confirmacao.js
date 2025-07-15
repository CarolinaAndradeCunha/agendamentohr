// Preços base dos serviços
const precos = {
  "Unhas Básicas": 40,
  "Esmaltação": 35,
  "Alongamento": 120,
  "Unhas Postiças": 100,
  "Banho de Gel": 90
};

function getSelectedServices() {
  const params = new URLSearchParams(window.location.search);
  const servicos = params.getAll('servicos');
  return servicos;
}

function mostrarServicos() {
  const lista = document.getElementById('lista-servicos');
  const servicos = getSelectedServices();

  if (servicos.length === 0) {
    lista.innerHTML = "<p>Nenhum serviço selecionado. Volte e escolha os serviços.</p>";
    document.getElementById('form-agendamento').style.display = "none";
    return;
  }

  let html = "";
  let total = 0;

  servicos.forEach(s => {
    const preco = precos[s] || 0;
    total += preco;
    html += `<div class="servico-item">${s} - R$ ${preco.toFixed(2)}</div>`;
  });

  html += `<div class="total">Total: R$ ${total.toFixed(2)}</div>`;

  lista.innerHTML = html;
}

mostrarServicos();

document.getElementById('form-agendamento').addEventListener('submit', function(e) {
  e.preventDefault();

  const servicos = getSelectedServices();
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const pagamento = document.getElementById('pagamento').value;

  if (!data || !hora || !pagamento) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  let mensagem = `Olá! Gostaria de agendar os seguintes serviços:\n\n`;

  servicos.forEach(s => {
    mensagem += `- ${s} (R$ ${precos[s].toFixed(2)})\n`;
  });

  mensagem += `\nData: ${data}\nHorário: ${hora}\nForma de pagamento: ${pagamento}\n\nObrigado!`;

  // Substitua pelo número da profissional (com código do país e DDD)
  const numeroWhats = "5511999999999";
  const urlWhats = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;

  window.open(urlWhats, '_blank');
});
