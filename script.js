function filtrar(categoria) {
  const fotos = document.querySelectorAll('.foto');
  fotos.forEach((foto) => {
    if (categoria === 'todos') {
      foto.style.display = 'block';
    } else {
      foto.style.display = foto.classList.contains(categoria) ? 'block' : 'none';
    }
  });
}

const form = document.getElementById("form-agendamento");
const linkAgenda = document.getElementById("linkAgenda");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const servico = document.getElementById("servico").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;

  const dataInicio = new Date(`${data}T${hora}`);
  const dataFim = new Date(dataInicio.getTime() + 30 * 60000);

  function formatData(d) {
    return d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  }

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(servico)}+-+${encodeURIComponent(nome)}&dates=${formatData(dataInicio)}/${formatData(dataFim)}&details=Agendamento+de+${encodeURIComponent(categoria)}&location=Studio+Glam`;

  linkAgenda.href = url;
  linkAgenda.style.display = "inline-block";
  linkAgenda.textContent = "Adicionar ao Google Agenda";
});

const links = document.querySelectorAll("header nav a");
links.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
