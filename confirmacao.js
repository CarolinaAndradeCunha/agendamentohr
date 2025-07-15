// Preços base dos serviços e duração (minutos)
const precos = {
  "Unhas Básicas": { preco: 40, duracao: 40 },
  "Esmaltação": { preco: 35, duracao: 50 },
  "Alongamento": { preco: 120, duracao: 90 },
  "Unhas Postiças": { preco: 100, duracao: 80 },
  "Banho de Gel": { preco: 90, duracao: 60 }
};

// Horários disponíveis fixos (exemplo)
const horariosDisponiveis = [
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00"
];

// Pega os serviços selecionados na URL
function getSelectedServices() {
  const params = new URLSearchParams(window.location.search);
  const servicos = params.getAll('servicos');
  return servicos;
}

// Calcula o total e a duração somando todos os serviços selecionados
function calcularTotalEDuracao(servicos) {
  let total = 0;
  let duracao = 0;
  servicos.forEach(s => {
    if (precos[s]) {
      total += precos[s].preco;
      duracao += precos[s].duracao;
    }
  });
  return { total, duracao };
}

// Preenche a lista de serviços e total
function mostrarServicos() {
  const lista = document.getElementById('lista-servicos');
  const servicos = getSelectedServices();

  if (servicos.length === 0) {
    lista.innerHTML = "<p>Nenhum serviço selecionado. Volte e escolha os serviços.</p>";
    document.getElementById('form-agendamento').style.display = "none";
    return;
  }

  let html = "";
  servicos.forEach(s => {
    const preco = precos[s] ? precos[s].preco : 0;
    html += `<div class="servico-item">${s} - R$ ${preco.toFixed(2)}</div>`;
  });

  const { total, duracao } = calcularTotalEDuracao(servicos);

  html += `<div class="total">Total: R$ ${total.toFixed(2)}</div>`;
  lista.innerHTML = html;

  preencherHorariosDisponiveis(duracao);
}

// Preenche o select de horário baseado na duração total dos serviços
function preencherHorariosDisponiveis(duracao) {
  const selectHora = document.getElementById('hora');
  selectHora.innerHTML = ''; // limpa opções

  // Duração total em minutos; considerar intervalos de 30 min para agendamento
  // Cada horário é o início da sessão, precisa ter tempo livre até duracao

  // Convertendo horários para minutos para facilitar comparação
  function horaParaMinutos(horaStr) {
    const [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
  }

  // Duração em minutos
  const duracaoMin = duracao;

  // Filtra horários que permitem encaixar a duração (ex: se horário + duração ultrapassa 18:00, não mostra)
  // Vamos assumir fim do expediente às 18:00 (1080 minutos)
  const fimExpediente = 18 * 60;

  horariosDisponiveis.forEach(horario => {
    const inicioMin = horaParaMinutos(horario);
    if (inicioMin + duracaoMin <= fimExpediente) {
      // adiciona no select
      const option = document.createElement('option');
      option.value = horario;
      option.textContent = horario;
      selectHora.appendChild(option);
    }
  });

  // Se não sobrar nenhum horário, desabilita select
  if (selectHora.options.length === 0) {
    const option = document.createElement('option');
    option.textContent = "Nenhum horário disponível";
    option.disabled = true;
    selectHora.appendChild(option);
    selectHora.disabled = true;
  } else {
    selectHora.disabled = false;
  }
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
    mensagem += `- ${s} (R$ ${precos[s].preco.toFixed(2)})\n`;
  });

  mensagem += `\nData: ${data}\nHorário: ${hora}\nForma de pagamento: ${pagamento}\n\nObrigado!`;

  const numeroWhats = "5511999999999"; // Troque aqui pelo número real da profissional
  const urlWhats = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;

  window.open(urlWhats, '_blank');
});
