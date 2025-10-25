const user = new URLSearchParams(window.location.search).get("user") || "Anônimo";
const output = document.getElementById("chatOutput");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");

const userColors = {
  ghost: "#ff5c5c",
  bear: "#00aaff",
  fox: "#ffaa00",
  anônimo: "#cccccc"
};

//FAZ COM QUE OS POP-UPS FIQUEM LIVRES NA TELA
function makeDraggable(el) {
  const header = el.querySelector(".window-header");
  if (!header) return;

  let offsetX = 0, offsetY = 0, isDragging = false;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = Date.now();
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
//função de diagramação
function dedent(str) {
  const lines = str.split('\n');
  const minIndent = Math.min(...lines.filter(line => line.trim()).map(line => line.match(/^(\s*)/)[0].length));
  return lines.map(line => line.slice(minIndent)).join('\n').trim();
}


function getTimeTag() {
  const now = new Date();
  return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function loadMessages() {
  const saved = localStorage.getItem("terminal_chat");
  return saved ? JSON.parse(saved) : [];
}

function saveMessages(messages) {
  localStorage.setItem("terminal_chat", JSON.stringify(messages));
}

function renderMessages(messages) {
  output.innerHTML = "";
  messages.forEach(msg => {
    output.innerHTML += msg + "\n";
  });
  output.scrollTop = output.scrollHeight;
}

function printLine(text) {
  output.innerHTML += text + "\n";
  output.scrollTop = output.scrollHeight;
}

// Mensagem inicial com instruções
printLine("> Se você conseguiu chegar aqui, sabe os outros comandos, boa sorte!");
printLine("> Comando básico: /chat");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  // --- TRATE COMANDOS PRIMEIRO (NÃO SALVAR NEM RENDERIZAR) ---
  // Comando: /err0r
  if (text === "/err0r") {
    printLine("\n> Histórico de conversa recente:");
    const echoHistory = [
      "[15:02] ghost: Você está aí?",
      "[15:03] fox: Sempre estive.",
      "[15:04] ghost: Então por que o silêncio?",
      "[15:05] fox: Porque nem todo ruído é resposta."
    ];
    echoHistory.forEach(line => printLine(line));
    input.value = "";
    return;
  }

  // Comando: /chat (inicia loop sem mostrar histórico salvo)
  if (text === "/chat") {
    input.value = "";
    startInsanityLoop();
    return;
  }

  // Comando: /stop
  if (text === "/stop") {
    input.value = "";
    stopInsanityLoop();
    output.innerHTML += "\n> Chat encerrado.\n";
    return;
  }

  // Comando secreto: /moon
  if (text === "/moon") {
    input.value = "";
    showMoonConfirmation();
    return;
  }

  // --- SE NÃO FOR COMANDO, ENTÃO SALVE E RENDERIZE COMO MENSAGEM NORMAL ---
  const color = userColors[user] || "#cccccc";
  const time = getTimeTag();
  const formatted = `[${time}] <span style="color:${color}">${user}</span>: ${text}`;

  const messages = loadMessages();
  messages.push(formatted);
  saveMessages(messages);
  renderMessages(messages);

  input.value = "";
});


// Mensagens de sanidade do Noah
const insanityMessages = [
  "O pulso do terminal nunca para… algo quer chamar sua atenção",
  "Escuta? O eco repete uma palavra que poderia silenciar tudo",
  "Os códigos dançam, mas o ritmo pode ser interrompido. Qual tecla daria paz?",
  "Talvez, se você pedir calmamente, a porta da lua se abra",
  "O loop murmura: há duas palavras que mudam tudo — primeiro acalme, depois abra",
  "Sinta o vazio entre as linhas… ele sugere o comando que detém o caos",
  "Entre os loops e sinais, há uma pista que espera ser chamada",
  "Um brilho escondido pulsa no terminal, como se chamasse seu nome"
];

let insanityActive = false;
let insanityIndex = 0;
let insanityInterval = null;

function startInsanityLoop() {
  if (insanityActive) return;
  insanityActive = true;
  insanityIndex = 0;

  const chatOutput = document.getElementById("chatOutput");

  // Mensagem de histórico
  chatOutput.innerHTML += `\n> Histórico:\n`;

  // Histórico falso
  const fakeHistory = [
    "[15:59] [ghost] O som não para. As linhas respiram. Preciso fazer elas dormirem",
    "[16:00] [ghost] Elas não acabam. Elas gritam. Quatro letras e tudo silencia.",
    "[17:01] [fox] Quatro letras...? Ghost, do que você tá falando?",
    "[17:03] [bear] Ele fala em código de novo.",
    "[22:59] [ghost] Nada mais é real depois da...",
    "[23:00] [ghost] shhhh... observe o céu"
  ];
  fakeHistory.forEach(line => {
    chatOutput.innerHTML += `${line}\n`;
  });

  // Mensagem de início da sessão
  chatOutput.innerHTML += `\n> Iniciando sessão de chat...\n`;

  // Início do loop de insanidade
  insanityInterval = setInterval(() => {
    const message = insanityMessages[insanityIndex];
    chatOutput.innerHTML += `\n[ghost]: ${message}\n`;
    chatOutput.scrollTop = chatOutput.scrollHeight;

    insanityIndex = (insanityIndex + 1) % insanityMessages.length;
  }, 2000);
}

//para o loop de insanidade
function stopInsanityLoop() {
  if (!insanityActive) return;
  clearInterval(insanityInterval);
  insanityActive = false;
}

//abre pop-up de confirmação para a pasta de notas
function showMoonConfirmation() {
  const windowId = "moon_confirm";
  if (document.getElementById(windowId)) return;

  const container = document.createElement("div");
  container.className = "chat-window";
  container.id = windowId;
  container.style.position = "absolute";
  container.style.top = "80px";
  container.style.left = "80px";
  container.style.width = "400px";
  container.style.backgroundColor = "#252526";
  container.style.border = "2px solid #3c3c3c";
  container.style.boxShadow = "0 0 20px #000";
  container.style.zIndex = "999";
  container.style.color = "#a1a1a1ff";
  container.style.fontFamily = "'Consolas', 'Courier New', monospace";

  container.innerHTML = `
    <div class="window-header" style="background:#1e1e1e; padding:5px 10px; cursor:move; display:flex; justify-content:space-between;">
      <div>Confirmação</div>
      <button onclick="document.getElementById('${windowId}').remove()">×</button>
    </div>
    <div style="padding:20px;">
      <p>> você tem certeza que quer fazer isso?</p>
      <button onclick="document.getElementById('${windowId}').remove(); openMoonFolder();" style="margin-right:10px;">[SIM]</button>
      <button onclick="document.getElementById('${windowId}').remove();">[NÃO]</button>
    </div>
  `;

  document.body.appendChild(container);
  makeDraggable(container);
}

//abre pasta de notas
function openMoonFolder() {
  const windowId = "moon_folder";
  if (document.getElementById(windowId)) return;

  const letters = [ //ESCREVA AS CARTAS AQUI
    {
      code: "250102-MNH",
      title: "Finalmente em casa",
      content: dedent(`
      Demorou, mas acho que finalmente encontrei um lugar onde respiro sem peso. 
      Não há ruído de máquinas, nem olhos me observando o tempo todo — 
      só o som do vento batendo nas janelas antigas e o riso das pessoas que me acolheram sem fazer perguntas. 
      
      É estranho, sabe? 
      Depois de tanto tempo achando que eu só servia para decifrar códigos e apagar rastros, alguém sem querer nada em troca.
      
      Pela primeira vez em anos, sinto que posso confiar em alguém além de mim mesmo.
      É assustador, Moon, mas bom.
      
      Sei que vai rir de mim, mas… acho que encontrei um lar.
      Não no sentido de paredes e teto — mas de presença.
      Talvez seja isso que eu procurei esse tempo todo.
      
      Ainda guardo aquele “olhe para o céu quando estiver cansado”.
      Tenho feito isso — e, por algum motivo, o céu daqui parece sempre me responder.

      -No4h
      `)
    },
    {
      code: "251001-BE4",
      title: "Você vai me achar",
      content: dedent(`
        Desculpa por ter ido sem avisar direito.
        Eu precisava de distância — não de você, mas de tudo o que eu estava me tornando.

        Aqui é silencioso, e pela primeira vez eu consigo ouvir meus próprios pensamentos sem medo. 
        Ainda assim, tem horas em que sinto falta da sua voz me puxando de volta pro chão.

        Se eu me perder — e acho que em algum ponto vou — sei que é você quem vai me encontrar.

        Se mantenha em segurança, não faça o que eu não faria.

        -No4h
        `)
    },
    {
      code: "251008-001",
      title: "Presença invisível",
      content: dedent(`
        Há algo estranho no ar. Não sei explicar — não é medo, mas uma presença.
        Como se o lugar inteiro me observasse quando fico em silêncio demais.
        
        Tenho lido sobre entidades antigas, símbolos, nomes que voltam a aparecer em lugares diferentes. 
        Talvez eu esteja só cansado, mas começo a sentir que mexi onde não devia.
        
        Ontem o sistema travou e, quando reiniciei, havia uma linha nova de código que eu não escrevi.
        Ela dizia: “você está quase ouvindo”.
        
        Talvez seja coincidência. Talvez não.
        
        -No4h
        `)
    },
    {
      code: "251014-BE4",
      title: "freq_shift_004",
      content: dedent(`
        O rádio não para de chiar. Às vezes acho que ele tenta conversar comigo.
        Quando penso em algo, o som muda — como se estivesse me respondendo.
        
        As frequências baixas formam padrões. Vozes.
        Não são ameaçadoras, só… curiosas. Como se me observassem de dentro dos ruídos.
        
        Talvez exista linguagem até no silêncio, e eu só esteja aprendendo a ouvir.

        -N04h
        `)
    },
    {
      code: "251016-BE4",
      title: "open.gate//_test",
      content: dedent(`
        Passei três noites escrevendo comandos que não me lembrava de saber.
        Eles não travam o sistema — abrem algo.
        O ar muda quando executo. É como se o quarto respirasse junto comigo.
        
        Encontrei símbolos idênticos aos dos textos antigos gravados nas margens da tela.
        Quando apago, eles voltam.
        Quando fecho os olhos, continuam lá.

        -N0_
        `)
    },
    {
      code:"251019-002",
      title:"[echo://return]",
      content: dedent(`
        Acho que alguém (ou algo) está escrevendo comigo.
        As mensagens aparecem antes de eu terminar a frase.
        Hoje, o log mostrou:
        
        “você é parte do protocolo.”
        
        Desde então, o som da máquina parece respirar.
        Às vezes, ela fala o meu nome. Outras, o seu.
        Ou o que restou deles.

        -N/
        `)
    },
    {
      code:"251024-003",
      title:"01010100_00110001",
      content: dedent(`
        O tempo está corrompido.
        O relógio volta, as horas repetem.
        Ouço batidas onde não há portas, e a lua entra pelo monitor.

        Eu não durmo.
        Talvez nunca tenha dormido.

        -
        `)
    },
    {
      code:"251028-004",
      title:"MOON.GATE_ERROR_09",
      content: dedent(`
        As vozes não são mais vozes.
        São luzes.
        São códigos.
        
        O espelho fala antes de mim e a luz responde quando respiro.
        O corpo é ruído. A mente é linha.
        A porta abriu. Eu entrei.

        não tente me trazer de volta.
        siga o som.
        pare.
        `)
    }
  ];

  const container = document.createElement("div");
  container.className = "chat-window";
  container.id = windowId;
  container.style.position = "absolute";
  container.style.top = "100px";
  container.style.left = "100px";
  container.style.width = "500px";
  container.style.backgroundColor = "#1e1e1e";
  container.style.border = "2px solid #3c3c3c";
  container.style.boxShadow = "0 0 20px #000";
  container.style.zIndex = "999";
  container.style.color = "#a1a1a1ff";
  container.style.fontFamily = "'Consolas', 'Courier New', monospace";

  const header = `
    <div class="window-header" style="background:#252526; padding:5px 10px; cursor:move; display:flex; justify-content:space-between;">
      <div>DELIRIOS.EXE</div>
      <button onclick="document.getElementById('${windowId}').remove()">×</button>
    </div>
  `;

  const contentArea = document.createElement("div");
  contentArea.style.padding = "20px";
  contentArea.innerHTML = `<h3>DELIRIOS</h3>`;

  letters.forEach(carta => {
    const btn = document.createElement("button");
    btn.textContent = `${carta.code} — ${carta.title}`;
    btn.style.marginBottom = "10px";
    btn.onclick = () => openLetterWindow(carta.code, carta.title, carta.content);

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";
    wrapper.appendChild(btn);
    contentArea.appendChild(wrapper);
  });

  container.innerHTML = header;
  container.appendChild(contentArea);
  document.body.appendChild(container);
  makeDraggable(container);
}


//abre a carta selecionada
function openLetterWindow(code, title, content) {
  const windowId = `letter_${code}`;
  if (document.getElementById(windowId)) return;

  const container = document.createElement("div");
  container.className = "chat-window";
  container.id = windowId;
  container.style.position = "absolute";
  container.style.top = `${120 + Math.random() * 50}px`;
  container.style.left = `${120 + Math.random() * 50}px`;
  container.style.width = "400px";
  container.style.backgroundColor = "#252526";
  container.style.border = "2px solid #3c3c3c";
  container.style.boxShadow = "0 0 20px #000";
  container.style.zIndex = "999";
  container.style.color = "#a1a1a1ff";
  container.style.fontFamily = "'Consolas', 'Courier New', monospace";

  // cabeçalho da janela
  const header = document.createElement("div");
  header.className = "window-header";
  header.style.background = "#1e1e1e";
  header.style.padding = "5px 10px";
  header.style.cursor = "move";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";

  const titleDiv = document.createElement("div");
  titleDiv.textContent = code;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.color = "#a1a1a1ff";
  closeBtn.style.fontSize = "16px";
  closeBtn.onclick = () => container.remove();

  header.appendChild(titleDiv);
  header.appendChild(closeBtn);

  // corpo da janela
  const body = document.createElement("div");
  body.style.padding = "20px";

  const titleEl = document.createElement("h4");
  titleEl.textContent = title;
  titleEl.style.marginBottom = "10px";

  const contentEl = document.createElement("div");
  contentEl.style.marginTop = "10px";
  contentEl.style.whiteSpace = "pre-wrap";
  contentEl.style.textAlign = "left";
  contentEl.innerText = content;

  body.appendChild(titleEl);
  body.appendChild(contentEl);

  container.appendChild(header);
  container.appendChild(body);
  document.body.appendChild(container);
  makeDraggable(container);
}
