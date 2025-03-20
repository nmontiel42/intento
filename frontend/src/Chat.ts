let isSocketOpen = false;

document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.getElementById("liveChatContainer") as HTMLElement;
    const chatBox = document.getElementById("chatBox") as HTMLElement;
    const chatInputContainer = document.getElementById("chatInputContainer") as HTMLElement;
    const chatInput = document.getElementById("chatInput") as HTMLInputElement;
    const sendChatBtn = document.getElementById("sendChatBtn") as HTMLButtonElement;
    const toggleButton = document.getElementById("toggleChat") as HTMLButtonElement;

    let chatMinimized = false;

    // Obtener el token del usuario autenticado
    const token = localStorage.getItem("authToken");
	const userData = localStorage.getItem("user");
	const user = userData ? JSON.parse(userData) : null;

	if (!token || !user) {
		console.error("Token o usuario no disponibles.");
		return;
	}

	// Verificar que el token en el usuario coincida con el token almacenado en localStorage
	if (user.token !== token) {
		console.error("Los tokens no coinciden.");
		return;
	}

    // Conectar WebSocket al backend
    let socket = new WebSocket(`wss://localhost:3000/`);

	socket.onopen = () => {
		console.log("Conectado al chat.");
		isSocketOpen = true; // Marcar la conexión como abierta
		socket?.send(JSON.stringify({ type: "auth", token })); // Enviar token de autenticación al abrir la conexión
	  };
	
	  socket.onmessage = (event) => {
		try {
		  const data = JSON.parse(event.data);
		  if (data.type === "message") {
			const messageElement = document.createElement("div");
			messageElement.textContent = `${data.user}: ${data.message}`;
			messageElement.classList.add("p-2", "bg-gray-200", "rounded");
			chatBox.appendChild(messageElement);
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
	
		  if (isSocketOpen && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(message)); // Enviar el mensaje
			chatInput.value = ""; // Limpiar el campo de entrada
		  } else {
			console.error("La conexión WebSocket no está abierta.");
		  }
		}
	  });

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
