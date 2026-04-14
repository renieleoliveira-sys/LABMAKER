const http = require("http");
const url = require("url");

let horarios = [];
let agendamentos = [];
let solicitacoes = [];

const server = http.createServer((req, res) => {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {
        // POST /agendar
        if (req.method === "POST" && pathname === "/agendar") {
            const dados = JSON.parse(body);
            const protocolo = "LAB" + Math.floor(1000 + Math.random() * 9000);
            agendamentos.push({
                protocolo,
                nome: dados.nome,
                telefone: dados.telefone,
                quantidade: dados.quantidade,
                data: dados.data,
                hora: dados.hora,
                status: "recebido"
            });
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Agendamento realizado! Protocolo: " + protocolo);
            return;
        }

        // GET /agendamentos-data
        if (req.method === "GET" && pathname === "/agendamentos-data") {
            const data = query.data;
            const filtrados = agendamentos.filter(a => a.data === data);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(filtrados));
            return;
        }

        // POST /horarios
        if (req.method === "POST" && pathname === "/horarios") {
            const dados = JSON.parse(body);
            horarios.push(dados);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Horário adicionado com sucesso!");
            return;
        }

        // GET /horarios
        if (req.method === "GET" && pathname === "/horarios") {
            const data = query.data;
            const filtrados = data ? horarios.filter(h => h.data === data) : horarios;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(filtrados));
            return;
        }

        // GET /buscar
        if (req.method === "GET" && pathname === "/buscar") {
            const valor = (query.valor || "").toLowerCase();
            const resultado = agendamentos.filter(a =>
                a.protocolo.toLowerCase().includes(valor) ||
                a.nome.toLowerCase().includes(valor)
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(resultado));
            return;
        }

        // POST /solicitacoes
        if (req.method === "POST" && pathname === "/solicitacoes") {
            const dados = JSON.parse(body);
            const protocolo = "SOL" + Math.floor(1000 + Math.random() * 9000);
            solicitacoes.push({
                protocolo,
                nome: dados.nome,
                telefone: dados.telefone,
                quantidade: dados.quantidade,
                descricao: dados.descricao,
                especificacoes: dados.especificacoes,
                status: "recebido"
            });
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Solicitação enviada! Protocolo: " + protocolo);
            return;
        }

        // GET /solicitacoes
        if (req.method === "GET" && pathname === "/solicitacoes") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(solicitacoes));
            return;
        }

        res.writeHead(404);
        res.end("Não encontrado");
    });
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});