const chatbots = [
  { name: "Chatbot de Ventas", url: "https://ejemplo.com/chatbot-ventas", icon: "🛒" },
  { name: "Chatbot de Soporte", url: "https://ejemplo.com/chatbot-soporte", icon: "🛠️" },
  { name: "Chatbot de Finanzas", url: "https://ejemplo.com/chatbot-finanzas", icon: "💰" },
  { name: "Chatbot de RRHH", url: "https://ejemplo.com/chatbot-rrhh", icon: "👥" },
  { name: "Chatbot Legal", url: "https://ejemplo.com/chatbot-legal", icon: "⚖️" }
];

function loadChatbotMenu() {
  const menuContainer = document.getElementById("chatbotMenu");

  if (!menuContainer) {
    console.error("Elemento con ID 'chatbotMenu' no encontrado.");
    return;
  }

  chatbots.forEach(bot => {
    const button = document.createElement("button");
    button.className = "chatbot-button";
    button.onclick = () => window.open(bot.url, "_blank");
    button.innerHTML = `<span class="emoji">${bot.icon}</span> ${bot.name}`;
    menuContainer.appendChild(button);
  });
}

window.addEventListener("DOMContentLoaded", loadChatbotMenu);
