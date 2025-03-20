const chatContainer = document.getElementById("liveChatContainer") as HTMLElement;
const chatBox = document.getElementById("chatBox") as HTMLElement;
const chatInputContainer = document.getElementById("chatInputContainer") as HTMLElement;
const chatInput = document.getElementById("chatInput") as HTMLInputElement;
const sendChatBtn = document.getElementById("sendChatBtn") as HTMLButtonElement;
const toggleButton = document.getElementById("toggleChat") as HTMLButtonElement;

document.addEventListener("DOMContentLoaded", () => {
   
    let chatMinimized = false;

	//connectWebSocket();
	
    // Minimizar o maximizar chat
    toggleButton.addEventListener("click", () => {
        if (chatMinimized) {
            chatContainer.style.height = "100%";
            chatBox.style.display = "flex";
            chatInputContainer.style.display = "flex";
            toggleButton.textContent = "−";
        } else {
            chatContainer.style.height = "50px";
            chatBox.style.display = "none";
            chatInputContainer.style.display = "none";
            toggleButton.textContent = "+";
        }
        chatMinimized = !chatMinimized;
    });
});

window.addEventListener("storage", (event) => {
    if (event.key === "user") {
        connectWebSocket();
    }
});

function connectWebSocket()
{
	// Obtener el token del usuario autenticado
	const userData = localStorage.getItem("user");
	const user = userData ? JSON.parse(userData) : null;
	const token = user?.token;

	let socket = new WebSocket(`wss://localhost:3000/`);

	socket.onopen = () => {
		console.log("Conectado al chat.");
		console.log(user);
	};

	socket.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			if (data.type === "message") {
				const messageElement = document.createElement("div");
				messageElement.textContent = `${data.user}: ${data.message}`;
				chatBox.appendChild(messageElement);
				messageElement.classList.add("p-2", "bg-gray-200", "rounded", "block");
				chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al último mensaje
			}
		} catch (err) {
			console.error("Error procesando mensaje:", err);
		}
	};

	sendChatBtn.addEventListener("click", () => {
		if (socket && chatInput.value.trim()) {
			const message = {
				type: "message",
				user: user.username, // Suponiendo que tienes un campo "username" en el objeto "user"
				message: chatInput.value.trim(),
			};

			console.log("Enviando mensaje:", message);
			console.log("Estado WebSocket:", socket.readyState);
			console.log("WebSocket.OPEN:", WebSocket.OPEN);

			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(message)); // Enviar el mensaje
				chatInput.value = ""; // Limpiar el campo de entrada
			} else {
				console.error("La conexión WebSocket no está abierta.");
			}
		}
	});
}