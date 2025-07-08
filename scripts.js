const chatbots = [
  { name: "Agente Comprador", url: "chat_comprador.html", icon: "🏠" },
  { name: "Chatbot FAQs", url: "chat_faqs.html", icon: "❓" },
  { name: "Chatbot de Ventas", url: "https://ejemplo.com/chatbot-ventas", icon: "🛒" },
  { name: "Chatbot de Soporte", url: "https://ejemplo.com/chatbot-soporte", icon: "🛠️" },
  { name: "Chatbot de Finanzas", url: "https://ejemplo.com/chatbot-finanzas", icon: "💰" },
  { name: "Chatbot de RRHH", url: "https://ejemplo.com/chatbot-rrhh", icon: "👥" },
  { name: "Chatbot Legal", url: "https://ejemplo.com/chatbot-legal", icon: "⚖️" }
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
    button.innerHTML = `<span class="emoji">${bot.icon}</span> ${bot.name}`;
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
