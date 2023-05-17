import express from "express";
const app = express();
app.use(express.json());
app.listen(8080, () => console.log("Servidor iniciado"));
app.get("/", (request, response) => {
  return response.json(
    "Bem-vindo ao API de gestões de recados! Crie sua conta ou Faça login!"
  );
});
const listaUsuarios = [];
const usuariologado = [];
const recadoslogado = [];
const recados = [];
app.post("/criarlogin", (request, response) => { //Criar Login
  const novo = request.body;
  const re = /\S+@\S+\.\S+/;
  const verifyEmail = listaUsuarios.some((user) => user.email === novo.email);
  if (!novo.nome) {
    return response.status(400).json("O campo Nome é obrigatório.");
  }
  if (typeof novo.nome !== "string") {
    return response.status(400).json("Nome inválido.");
  }
  if (verifyEmail) {
    return response.status(400).json("O email já foi cadastrado.");
  }
  if (!novo.email) {
    return response.status(400).json("O campo Email é obrigatório.");
  }
  if (!re.test(novo.email)) {
    return response.status(400).json("O valor de Email está inválido.");
  }
  if (!novo.password) {
    return response.status(400).json("O campo Senha é obrigatório.");
  }
  if (typeof novo.password !== "string") {
    return response.status(400).json("Senha inválida.");
  }
  if (!(novo.password.length >= 6)) {
    return response.status(400).json("Senha muito pequena.");
  }
  const newUser = {
    id: new Date().valueOf(),
    nome: novo.nome,
    email: novo.email,
    password: novo.password,
    logado: false,
  };
  listaUsuarios.push(newUser);
  console.log(listaUsuarios);
  return response.json(listaUsuarios);
});
app.post("/login", (request, response) => { //Logar
  const login = request.body;
  const verifylogged = usuariologado.some((user) => user.logado === true);
  const verifyEmail = listaUsuarios.some((user) => user.email === login.email);
  const verifyPassword = listaUsuarios.some(
    (user) => user.password === login.password
  );
  if (verifylogged) {
    return response.status(400).json("Já está logado!");
  }
  if (!login.email) {
    return response.status(400).json("O campo Email é obrigatório.");
  }
  if (!login.password) {
    return response.status(400).json("O campo Senha é obrigatório.");
  }
  if (!verifyEmail || !verifyPassword) {
    return response.status(400).json("Informações erradas.");
  }
  listaUsuarios.forEach((user) => (user.logado = false));
  const usuario = listaUsuarios.find((user) => user.email === login.email);
  usuario.logado = true;
  usuariologado.push(usuario);
  console.log(usuariologado);
  return response.json(usuariologado);
});
app.post("/criarRecado", (request, response) => { //Criar Recado
  const novorec = request.body;
  const recadoslogados = {
    recado_userid: usuariologado[0].id,
    recadoid: new Date().valueOf(),
    titulo: novorec.titulo,
    descricao: novorec.descricao,
  };
  recados.push(recadoslogados);
  console.log(recados);
  return response.json(recados);
});
app.get("/checarRecado", (request, response) => { //Puxar Recado
  const checarecado = recados.filter(
    (user) => user.recado_userid === usuariologado[0].id
  );
  return response.json(checarecado);
});
app.put("/alterarRecado/:id", (request, response) => { //Alterar Recado
  const verifyID = recados.some((user) => user.recadoid == request.params.id);
  if (!verifyID) {
    return response.json("ID não existe.");
  }
  const id = request.params.id;
  const recadoalterar = request.body;
  const recadoalterado = recados.findIndex((user) => user.recadoid == id);
  recados[recadoalterado].titulo = recadoalterar.titulo;
  recados[recadoalterado].descricao = recadoalterar.descricao;
  return response.json(recados);
});
app.delete("/apagarRecado/:id", (request, response) => { //Apagar Recado
  const verifyID = recados.some((user) => user.recadoid == request.params.id);
  if (!verifyID) {
    return response.json("ID não existe.");
  }
  const id = request.params.id;
  const recadoapagado = recados.findIndex((user) => user.recadoid == id);
  console.log(recadoapagado);
  recados.splice(recadoapagado, 1);
  return response.json(recados);
});