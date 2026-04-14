// ==========================
// BOTÕES DA TELA INICIAL
// ==========================
const btnAgendar = document.querySelector(".btn-agendar");
const btnSolicitar = document.querySelector(".btn-solicitar");

if (btnAgendar) {
    btnAgendar.addEventListener("click", () => {
        window.location.href = "agendamento.html";
    });
}

if (btnSolicitar) {
    btnSolicitar.addEventListener("click", () => {
        window.location.href = "solicitacao.html";
    });
}

// ==========================
// CONTROLE DE ETAPAS
// ==========================
function mostrarEtapa(numero) {
    document.querySelectorAll(".etapa").forEach(e => {
        e.classList.remove("ativa");
    });

    document.getElementById("etapa" + numero).classList.add("ativa");
}

// ==========================
// AGENDAMENTO
// ==========================
document.addEventListener('DOMContentLoaded', function () {

    const calendarioEl = document.getElementById('calendario');

    if (!calendarioEl) return;

    let dataEscolhida = "";

    let calendario = new FullCalendar.Calendar(calendarioEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',

        dateClick: function (info) {

            dataEscolhida = info.dateStr;

            const texto = document.getElementById("dataSelecionada");

            if (texto) {
                texto.innerText = "Data selecionada: " + dataEscolhida;
                texto.style.display = "block";
            }

            bloquearHorarios(dataEscolhida);
            mostrarEtapa(2);
        }
    });

    calendario.render();
});

// ==========================
// BLOQUEAR HORÁRIOS
// ==========================
function bloquearHorarios(dataEscolhida) {

    fetch("http://localhost:3000/agendamentos-data?data=" + dataEscolhida)
        .then(res => res.json())
        .then(agendamentos => {

            const ocupados = agendamentos.map(a => a.hora);

            document.querySelectorAll(".horarios button").forEach(btn => {

                if (ocupados.includes(btn.innerText)) {
                    btn.style.background = "#ccc";
                    btn.disabled = true;
                } else {
                    btn.style.background = "";
                    btn.disabled = false;
                }

            });

        })
        .catch(() => {
            console.log("Servidor não respondeu");
        });
}

// ==========================
// MÁSCARA TELEFONE
// ==========================
const telefone = document.getElementById("telefone");

if (telefone) {
    telefone.addEventListener("input", function () {

        let valor = telefone.value.replace(/\D/g, "");

        valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

        telefone.value = valor;
    });
}

// ==========================
// ENVIO FORMULÁRIO
// ==========================
const form = document.getElementById("formSolicitacao");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        fetch("http://localhost:3000/agendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: document.querySelector('[name="nome"]').value,
                telefone: document.querySelector('[name="telefone"]').value,
                quantidade: document.querySelector('[name="quantidade"]').value,
                data: document.getElementById("dataInput").value,
                hora: document.getElementById("horaInput").value
            })
        })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            form.reset();
            mostrarEtapa(1);
        })
        .catch(() => {
            alert("Não foi possível enviar o agendamento. Tente novamente mais tarde.");
        });
    });
}

// ==========================
// CLIQUE NOS HORÁRIOS (HTML FIXO)
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    const botoes = document.querySelectorAll(".horarios button");

    botoes.forEach(btn => {

        btn.addEventListener("click", () => {

            // remove seleção anterior
            document.querySelectorAll(".horarios button")
                .forEach(b => b.classList.remove("selecionado"));

            // seleciona o clicado
            btn.classList.add("selecionado");

            // pega a data já escolhida
            const data = document.getElementById("dataSelecionada").innerText
                .replace("Data selecionada: ", "");

            // salva nos inputs escondidos
            document.querySelectorAll("#dataInput")
                .forEach(i => i.value = data);

            document.querySelectorAll("#horaInput")
                .forEach(i => i.value = btn.innerText);

            // 👉 VAI PARA O FORMULÁRIO
            mostrarEtapa(3);
        });

    });

});