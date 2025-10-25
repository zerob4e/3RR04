const output = document.getElementById("output");
const input = document.getElementById("terminalInput");
const form = document.getElementById("loginForm");

let stage = "user";
let selectedUser = null;

const validUsers = {
  ghost: "MOONG16N2",
  bear: "D9009ER",
  fox: "S4N95OP"
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = input.value.trim();
  input.value = "";

  if (!value) return;

  if (stage === "user") {
    const user = value.toLowerCase(); // ignora maiúsculas/minúsculas
    if (validUsers[user]) {
      selectedUser = user;
      stage = "password";
      output.innerHTML += `<div>> ${value}</div>`;
      output.innerHTML += `<div>Senha para ${user}:</div>`;
    } else {
      output.innerHTML += `<div>> ${value}</div>`;
      output.innerHTML += `<div>Usuário inválido. Tente novamente.</div>`;
    }
  } else if (stage === "password") {
    output.innerHTML += `<div>Senha: ********</div>`;
    if (value === validUsers[selectedUser]) {
      output.innerHTML += `<div>[+] Acesso concedido como ${selectedUser}. Redirecionando...</div>`;
      setTimeout(() => {
        window.location.href = `terminal.html?user=${selectedUser}`;
      }, 2000);
    } else {
      output.innerHTML += `<div>[!] Senha incorreta. Tente novamente.</div>`;
      stage = "user";
      selectedUser = null;
    }
  }
});
