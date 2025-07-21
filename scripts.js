const chatbots = [
  {
    name: "Chatbot FAQs",
    slug: "faq",
    file: "faq",
    icon: "fa-circle-question",
    active: true,
  },
  {
    name: "Agente para Comprador",
    slug: "comprador",
    file: "comprador",
    icon: "fa-house",
    active: true,
  },
  {
    name: "Agente para Vendedor",
    slug: "vendedor",
    file: "vendedor",
    icon: "fa-user-tie",
    active: false,
  },
  {
    name: "Agente para Inquilino",
    slug: "inquilino",
    file: "inquilino",
    icon: "fa-user",
    active: false,
  },
  {
    name: "Asistente Virtual",
    slug: "virtual",
    file: "virtual",
    icon: "fa-robot",
    active: true,
  },
];

function loadChatbotMenu() {
  const menuContainer = document.getElementById("chatbotMenu");
  const frame = document.getElementById("chatbotFrame");

  const params = new URLSearchParams(window.location.search);
  const botParam = params.get("bot");
  let initialIndex = 0;
  if (botParam) {
    const found = chatbots.findIndex(
      (b) => b.slug === botParam || b.file === botParam
    );
    if (found >= 0) initialIndex = found;
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
      document
        .querySelectorAll(".chatbot-button.active")
        .forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      if (frame) frame.src = bot.file;
      const params = new URLSearchParams(window.location.search);
      params.set("bot", bot.slug);
      window.history.pushState(
        {},
        "",
        window.location.pathname + "?" + params.toString()
      );
    });
    if (index === initialIndex && frame && bot.active) {
      frame.src = bot.file;
      button.classList.add("active");
    }
    menuContainer.appendChild(button);
  });
}

window.addEventListener("DOMContentLoaded", loadChatbotMenu);
