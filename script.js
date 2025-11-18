const output = document.getElementById("output");
const input = document.getElementById("terminalInput");

let stage = "user"; // user or password
let selectedUser = null;

const validUsers = {
  ghost: "MOONG162N",
  bear: "D9009ER",
  fox: "S4N95OP"
};

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const value = input.value.trim();
  input.value = "";

  if (stage === "user") {
    if (value.startsWith("/")) {
      const user = value.slice(1);
      if (validUsers[user]) {
        selectedUser = user;
        stage = "password";
        output.innerHTML += `<div>> ${value}</div>`;
        output.innerHTML += `<div>Senha para ${user}:</div>`;
      } else {
        output.innerHTML += `<div>> ${value}</div>`;
        output.innerHTML += `<div>Usuário inválido. Tente novamente.</div>`;
      }
    } else {
      output.innerHTML += `<div>> ${value}</div>`;
      output.innerHTML += `<div>Formato inválido. Use /nome.</div>`;
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
