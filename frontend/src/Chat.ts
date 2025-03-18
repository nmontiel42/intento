const chatContainer = document.getElementById("liveChatContainer") as HTMLElement;
const chatBox = document.getElementById("chatBox") as HTMLElement;
const chatInputContainer = document.getElementById("chatInputContainer") as HTMLElement;
const toggleButton = document.getElementById("toggleChat") as HTMLButtonElement;

let chatMinimized = false;

toggleButton.addEventListener("click", () => {
    if (chatMinimized) {
        chatContainer.style.height = "100%";  // Restaura altura completa
        chatBox.style.display = "flex";
        chatInputContainer.style.display = "flex";
        toggleButton.textContent = "−"; // Cambia icono
    } else {
        chatContainer.style.height = "50px";  // Solo muestra la cabecera
        chatBox.style.display = "none";
        chatInputContainer.style.display = "none";
        toggleButton.textContent = "+"; // Cambia icono
    }
    chatMinimized = !chatMinimized;
});