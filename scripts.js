const chatbots = [
  { name: "Chatbot FAQs", url: "chat_faqs.html", icon: "fa-circle-question" },
  { name: "Agente para Comprador", url: "chat_comprador.html", icon: "fa-house" },
  { name: "Asistente Virtual", url: "chat_virtual.html", icon: "fa-robot" }
];

function loadChatbotMenu() {
  const menuContainer = document.getElementById("chatbotMenu");
  const frame = document.getElementById("chatbotFrame");

  if (!menuContainer) {
    console.error("Elemento con ID 'chatbotMenu' no encontrado.");
    return;
  }

  chatbots.forEach((bot, index) => {
    const button = document.createElement("button");
    button.className = "chatbot-button";
    button.innerHTML = `<i class="fa-solid ${bot.icon} icon"></i> ${bot.name}`;
    button.addEventListener("click", () => {
      document.querySelectorAll(".chatbot-button.active").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      if (frame) frame.src = bot.url;
    });
    if (index === 0 && frame) {
      frame.src = bot.url;
      button.classList.add("active");
    }
    menuContainer.appendChild(button);
  });
}

window.addEventListener("DOMContentLoaded", loadChatbotMenu);
