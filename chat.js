(function() {
  const cfg = window.chatConfig || {};
  const PROD_ENDPOINT = cfg.prodEndpoint;
  const TEST_ENDPOINT = cfg.testEndpoint;
  let ENDPOINT_URL = cfg.useTest ? TEST_ENDPOINT : PROD_ENDPOINT;

  const USERS_KEY = cfg.usersKey;
  const HISTORY_PREFIX = cfg.historyPrefix;
  const THEME_KEY = cfg.themeKey;

  function generateUserId() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  // DOM references
  const chatBox = document.getElementById("chat");
  const textarea = document.getElementById("message");
  const sendBtn = document.getElementById("send");
  const resetBtn = document.getElementById("reset");
  const userSelect = document.getElementById("userSelect");
  const renameBtn = document.getElementById("renameUser");
  const deleteBtn = document.getElementById("deleteUser");
  const themeToggle = document.getElementById("themeToggle");

  let abortController = null; // to cancel fetch
  let awaitingResponse = false;
  let pendingSinceLastBot = "";

  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  function initTheme() {
    const stored =
      localStorage.getItem(THEME_KEY) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(stored);
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  });

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveUsers(arr) {
    localStorage.setItem(USERS_KEY, JSON.stringify(arr));
  }

  function ensureAtLeastOneUser() {
    let users = loadUsers();
    if (!users.length) {
      users = [{ id: generateUserId(), name: "Usuario 1" }];
      saveUsers(users);
    }
  }

  function renderUserOptions() {
    const users = loadUsers();
    userSelect.innerHTML = "";
    users.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.textContent = `${u.name} (#${String(u.id).slice(0, 8)})`;
      userSelect.appendChild(opt);
    });
    const nOpt = document.createElement("option");
    nOpt.value = "new";
    nOpt.textContent = "➕ Nuevo…";
    userSelect.appendChild(nOpt);
  }

  function disableUserButtons(disabled) {
    [renameBtn, deleteBtn].forEach((b) => {
      b.disabled = disabled;
      b.classList.toggle("opacity-40", disabled);
      b.classList.toggle("cursor-not-allowed", disabled);
    });
  }

  function changeActiveUser(id) {
    if (id === "new") {
      const name = prompt("Nombre del nuevo usuario:");
      if (!name) {
        userSelect.value = loadUsers()[0].id; // restore previous selection
        return;
      }
      const users = loadUsers();
      const newId = generateUserId();
      users.push({ id: newId, name });
      saveUsers(users);
      renderUserOptions();
      userSelect.value = newId;
      id = newId;
    }
    loadHistoryIntoChat(id);
    resetConversationState();
    disableUserButtons(false);
  }

  renameBtn.addEventListener("click", () => {
    const currentId = userSelect.value;
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === currentId);
    if (idx === -1) return;
    const newName = prompt("Nuevo nombre:", users[idx].name);
    if (!newName) return;
    users[idx].name = newName;
    saveUsers(users);
    renderUserOptions();
    userSelect.value = currentId;
  });

  deleteBtn.addEventListener("click", () => {
    const currentId = userSelect.value;
    if (!confirm("¿Eliminar usuario y su historial?")) return;
    let users = loadUsers().filter((u) => u.id !== currentId);
    saveUsers(users);
    localStorage.removeItem(HISTORY_PREFIX + currentId);
    ensureAtLeastOneUser();
    renderUserOptions();
    userSelect.value = loadUsers()[0].id;
    loadHistoryIntoChat(userSelect.value);
    resetConversationState();
  });

  userSelect.addEventListener("change", (e) => {
    changeActiveUser(e.target.value);
  });

  function saveHistory(userId, arr) {
    localStorage.setItem(HISTORY_PREFIX + userId, JSON.stringify(arr));
  }

  function loadHistory(userId) {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_PREFIX + userId)) || [];
    } catch {
      return [];
    }
  }

  function loadHistoryIntoChat(userId) {
    chatBox.innerHTML = "";
    const hist = loadHistory(userId);
    hist.forEach((msg) => addMessage(msg.text, msg.from, new Date(msg.ts), false));
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function formatDate(d) {
    return (
      d.toLocaleDateString("es-ES", { month: "2-digit", day: "2-digit", year: "2-digit" }) +
      " " +
      d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    );
  }

  function addMessage(text, from = "user", date = new Date(), save = true) {
    const bubble = document.createElement("div");
    const alignRight = from === "user";
    bubble.className = `${alignRight ? "self-end bg-green-600 text-white" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"} rounded-2xl py-2 px-4 shadow-md inline-block max-w-[90%] whitespace-pre-wrap`;
    appendTextOrImages(bubble, text);

    const wrapper = document.createElement("div");
    wrapper.className = "flex flex-col" + (alignRight ? " items-end" : " items-start");
    wrapper.appendChild(bubble);

    const meta = document.createElement("span");
    meta.className = "text-[0.625rem] mt-1 text-gray-500 dark:text-gray-400 select-none";
    meta.textContent = formatDate(date);
    wrapper.appendChild(meta);

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (save) {
      const userId = userSelect.value;
      const hist = loadHistory(userId);
      hist.push({ text, from, ts: date.getTime() });
      saveHistory(userId, hist);
    }
  }

  function addSpinner() {
    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center gap-2";
    wrapper.id = "spinnerWrapper";
    const spin = document.createElement("div");
    spin.className = "spinner";
    wrapper.appendChild(spin);
    const txt = document.createElement("span");
    txt.className = "text-sm text-gray-500 dark:text-gray-400";
    txt.textContent = "Esperando respuesta…";
    wrapper.appendChild(txt);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeSpinner() {
    const el = document.getElementById("spinnerWrapper");
    el && el.remove();
  }

  function resetConversationState() {
    pendingSinceLastBot = "";
    awaitingResponse = false;
    abortController && abortController.abort();
    abortController = null;
    removeSpinner();
  }

  async function launchRequest(payload) {
    awaitingResponse = true;
    abortController = new AbortController();
    addSpinner();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("question", payload);
    urlencoded.append("user_key", userSelect.value);

    try {
      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data) && data[0]?.output) {
        addMessage(data[0].output.trim(), "bot");
      } else {
        addMessage("⚠️ Respuesta inesperada del servidor", "bot");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }
      addMessage(`⚠️ ${err.message}`, "bot");
    } finally {
      awaitingResponse = false;
      abortController = null;
      removeSpinner();
      pendingSinceLastBot = "";
    }
  }

  function handleSend() {
    const text = textarea.value.trim();
    if (!text) return;
    textarea.value = "";
    textarea.style.height = "auto";
    addMessage(text, "user");

    if (awaitingResponse) {
      pendingSinceLastBot += (pendingSinceLastBot ? "\n" : "") + text;
      abortController && abortController.abort();
      launchRequest(pendingSinceLastBot);
    } else {
      pendingSinceLastBot = text;
      launchRequest(pendingSinceLastBot);
    }
  }

  sendBtn.addEventListener("click", handleSend);

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("¿Vaciar la conversación de este usuario?")) return;
    const userId = userSelect.value;
    saveHistory(userId, []);
    chatBox.innerHTML = "";
    resetConversationState();
  });

  function init() {
    initTheme();
    ensureAtLeastOneUser();
    renderUserOptions();
    userSelect.value = loadUsers()[0].id;
    disableUserButtons(false);
    loadHistoryIntoChat(userSelect.value);
    textarea.focus();
  }

  init();
})();
