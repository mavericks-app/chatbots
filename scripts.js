const chatbots = [
  { name: "Chatbot FAQs", url: "chat_faqs.html", icon: "fa-circle-question", active: true },
  { name: "Agente para Comprador", url: "chat_comprador.html", icon: "fa-house", active: true },
  { name: "Agente para Vendedor", url: "chat_vendedor.html", icon: "fa-user-tie", active: false },
  { name: "Agente para Inquilino", url: "chat_inquilino.html", icon: "fa-user", active: false },
  { name: "Asistente Virtual", url: "chat_virtual.html", icon: "fa-robot", active: true }
];

function loadChatbotMenu() {
  const menuContainer = document.getElementById("chatbotMenu");
  const frame = document.getElementById("chatbotFrame");

  const params = new URLSearchParams(window.location.search);
  const botParam = params.get("bot");
  const homePage = "home.html";
  let initialIndex = -1;
  if (botParam) {
    const found = chatbots.findIndex((b) => b.url === botParam && b.active);
    if (found >= 0) {
      initialIndex = found;
    } else if (frame) {
      frame.src = homePage;
    }
  } else if (frame) {
    frame.src = homePage;
  }

  if (!menuContainer) {
    console.error("Elemento con ID 'chatbotMenu' no encontrado.");
    return;
  }

  chatbots.forEach((bot, index) => {
    const button = document.createElement("button");
    button.className = "chatbot-button";
    if (!bot.active) {
      button.classList.add("disabled");
      button.disabled = true;
    }
    button.innerHTML = `<i class="fa-solid ${bot.icon} icon"></i> ${bot.name}`;
    button.addEventListener("click", () => {
      if (!bot.active) return;
      document.querySelectorAll(".chatbot-button.active").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      if (frame) frame.src = bot.url;
      const params = new URLSearchParams(window.location.search);
      params.set("bot", bot.url);
      window.history.pushState({}, "", window.location.pathname + "?" + params.toString());
    });
    if (index === initialIndex && frame && bot.active) {
      frame.src = bot.url;
      button.classList.add("active");
    }
    menuContainer.appendChild(button);
  });
}

window.addEventListener("DOMContentLoaded", loadChatbotMenu);
