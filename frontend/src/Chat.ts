const chatContainer = document.getElementById("liveChatContainer") as HTMLElement;
const chatBox = document.getElementById("chatBox") as HTMLElement;
const chatInputContainer = document.getElementById("chatInputContainer") as HTMLElement;
const chatInput = document.getElementById("chatInput") as HTMLInputElement;
const sendChatBtn = document.getElementById("sendChatBtn") as HTMLButtonElement;
const toggleButton = document.getElementById("toggleChat") as HTMLButtonElement;
const userList = document.getElementById("userList") as HTMLUListElement | null;

document.addEventListener("DOMContentLoaded", () => {
   
    let chatMinimized = false;

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

		socket.send(JSON.stringify({
            type: "setUsername",
            username: user?.username
        }));
	};

	socket.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			if (data.type === "message") {
				const messageElement = document.createElement("div");
				messageElement.textContent = `${data.user}: ${data.message}`;
				messageElement.classList.add(
					"p-2", "bg-gray-200", "rounded", "block", "w-full", "break-words"
				);
				chatBox.appendChild(messageElement);
				chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al último mensaje
			}

			if (data.type === "userList" && userList) {
                userList.innerHTML = ""; // Limpiar la lista actual
   				data.users.forEach((user: string) => {
        			const li = document.createElement("li");
					li.textContent = user;
					li.classList.add(
						"w-full", // Asegura que ocupe todo el ancho disponible
						"truncate", // Corta el texto con "..." si es muy largo
						"p-2",
						"bg-gray-200",
						"rounded",
						"block"
					);
					userList.appendChild(li);
   				 });
            }

		} catch (err) {
			console.error("Error procesando mensaje:", err);
		}
	};

	//Si hace click envia el mensaje
	sendChatBtn.addEventListener("click", sendMessage);

	//Si pulsa Enter envia el mensaje
	chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita el salto de línea en el input
            sendMessage(); // Llama a la función de envío
        }
    });

	function sendMessage() {
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
    }

	logoutBtn.addEventListener("click", () => {
		chatBox.innerHTML = ""; // Limpia el chat
		socket.close(); // Cierra la conexión WebSocket
	});
}