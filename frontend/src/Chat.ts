const chatContainer = document.getElementById("liveChatContainer") as HTMLElement;
const chatBox = document.getElementById("chatBox") as HTMLElement;
const chatInputContainer = document.getElementById("chatInputContainer") as HTMLElement;
const chatInput = document.getElementById("chatInput") as HTMLInputElement;
const sendChatBtn = document.getElementById("sendChatBtn") as HTMLButtonElement;
const toggleButton = document.getElementById("toggleChat") as HTMLButtonElement;
const userList = document.getElementById("userList") as HTMLUListElement | null;
const toggleUserListButton = document.getElementById("toggleUserListButton");
const userListContainer = document.getElementById("userListContainer");

document.addEventListener("DOMContentLoaded", () => {

    let chatMinimized = false;

    // Minimizar o maximizar chat
	toggleButton.addEventListener("click", () => {
		if (chatMinimized) {
			chatContainer.classList.remove("h-[50px]");
			chatContainer.classList.add("h-auto", "md:h-3/5");
			chatBox.classList.remove("hidden");
			chatInputContainer.classList.remove("hidden");
			toggleButton.textContent = "−";
		} else {
			chatContainer.classList.remove("h-auto", "md:h-3/5");
			chatContainer.classList.add("h-[50px]");
			chatBox.classList.add("hidden");
			chatInputContainer.classList.add("hidden");
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

	let socket = new WebSocket(`wss://localhost:3000/chat`);

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
				handleIncomingMessage(data);
			}

			if (data.type === "userList") {
				updateUserList(data);
			}		
		} catch (err) {
			console.error("Error procesando mensaje:", err);
		}
	};
		// Función para manejar mensajes recibidos
	function handleIncomingMessage(data: { user: string; message: any; }) {
		const messageElement = document.createElement("div");
		messageElement.textContent = `${data.user}: ${data.message}`;

		// Asignar clase según el usuario
		if (data.user === "chat") {
			messageElement.classList.add("p-3", "bg-yellow-200", "rounded-lg", "block", "w-full", "break-words", "mb-2");
		} else if (data.user === user.username) {
			messageElement.classList.add("p-3", "bg-blue-200", "rounded-lg", "block", "w-full", "break-words", "mb-2");
		} else {
			messageElement.classList.add("p-3", "bg-green-200", "rounded-lg", "block", "w-full", "break-words", "mb-2");
		}

		chatBox.appendChild(messageElement);
		chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al último mensaje
	}

	// Función para actualizar la lista de usuarios
	function updateUserList(data: { users: any[]; }) {
		if (!userList) return;
		
		userList.innerHTML = ""; // Limpiar la lista actual
		const currentUser = user.username;

		data.users.forEach((username: string | null) => {
			const li = document.createElement("li");
			li.classList.add(
				"p-3", "text-xs", "bg-blue-100", "rounded-lg", "block", "w-full",
				"text-gray-800", "mb-1", "hover:bg-blue-300", "transition-all",
				"sm:flex", "sm:items-center", "sm:space-x-3", "sm:w-auto", "relative"
			);

			// Indicador de usuario en línea
			const onlineIndicator = document.createElement("span");
			onlineIndicator.classList.add("inline-block", "w-2", "h-2", "mr-3", "rounded-full", "bg-green-500", "sm:w-4", "sm:h-4");

			// Nombre del usuario
			const userNameText = document.createElement("span");
			userNameText.textContent = username;
			userNameText.classList.add("align-middle", "text-xs", "sm:text-xs", "cursor-pointer", "relative");

			// Tooltip
			const tooltip = createUserTooltip(username, currentUser);

			// Evento para mostrar y ocultar tooltip
			userNameText.addEventListener("mouseenter", () => tooltip.classList.remove("hidden"));
			tooltip.addEventListener("mouseenter", () => tooltip.classList.remove("hidden"));
			const hideTooltip = () => {
				setTimeout(() => {
					if (!tooltip.matches(":hover") && !userNameText.matches(":hover")) {
						tooltip.classList.add("hidden");
					}
				}, 200);
			};
			userNameText.addEventListener("mouseleave", hideTooltip);
			tooltip.addEventListener("mouseleave", hideTooltip);

			// Agregar elementos al <li>
			li.appendChild(onlineIndicator);
			li.appendChild(userNameText);
			li.appendChild(tooltip);

			userList.appendChild(li);
		});
	}

	// Función para crear el tooltip de usuario
	function createUserTooltip(username: string | null, currentUser: any) {
		const tooltip = document.createElement("div");
		tooltip.classList.add(
			"absolute", "left-1/2", "top-full", "transform", "-translate-x-1/2",
			"mt-2", "w-48", "bg-white", "p-3", "shadow-lg", "rounded-lg", "border",
			"hidden", "z-50"
		);

		// Imagen de perfil
		const profileImg = document.createElement("img");
		profileImg.src = "https://via.placeholder.com/40"; // Imagen de perfil temporal
		profileImg.alt = "Perfil";
		profileImg.classList.add("w-10", "h-10", "rounded-full", "mx-auto");

		// Nombre con estado
		const nameWithStatus = document.createElement("div");
		nameWithStatus.classList.add("flex", "items-center", "justify-center", "mt-2", "text-sm", "font-semibold");

		const nameText = document.createElement("span");
		nameText.textContent = username;
		const statusDot = document.createElement("span");
		statusDot.classList.add("ml-2", "w-2", "h-2", "bg-green-500", "rounded-full");

		nameWithStatus.appendChild(nameText);
		nameWithStatus.appendChild(statusDot);

		tooltip.appendChild(profileImg);
		tooltip.appendChild(nameWithStatus);

		// Agregar botones si el usuario no es el actual
		if (username !== currentUser) {
			const buttonsWrapper = document.createElement("div");
			buttonsWrapper.classList.add("mt-2", "space-y-1");

			const messageButton = createButton("Mensaje", "bg-blue-500", "hover:bg-blue-600",`
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 inline-block mr-1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 12.38V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l4-4h12a2 2 0 002-2z" />
				</svg>
			`);

			// Añadir el evento click para enviar el mensaje privado
			messageButton.addEventListener("click", () => {
				openPrivateChat(username); // Llamar a la función para enviar un mensaje privado
			});
			buttonsWrapper.appendChild(messageButton);

			const blockButton = createButton("Bloquear", "bg-red-500", "hover:bg-red-600", `
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 inline-block mr-1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 3a5 5 0 00-5 5v4H5a2 2 0 00-2 2v6h18v-6a2 2 0 00-2-2h-2V8a5 5 0 00-5-5z" />
				</svg>
			`);

			blockButton.addEventListener("click", () => {
				alert("Bloqueando al usuario");
			});
			buttonsWrapper.appendChild(blockButton);

			const inviteButton = createButton("Invitar", "bg-green-500", "hover:bg-green-600", `
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 inline-block mr-1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 14v6m-6-6v6m12-6v6m-3-18a3 3 0 110 6 3 3 0 010-6zm-6 0a3 3 0 110 6 3 3 0 010-6zm-6 8a5 5 0 0110 0m4 0a5 5 0 00-10 0m10 0a5 5 0 01-10 0" />
				</svg>
			`);

			inviteButton.addEventListener("click", () => {
				alert("Invitando al jugador");
			});
			buttonsWrapper.appendChild(inviteButton);
			tooltip.appendChild(buttonsWrapper);
		}
		return tooltip;
	}

	function openPrivateChat(username: string | null) {
		// Verificar si el chat ya está abierto en cualquier forma (maximizado o minimizado)
		let existingChat = document.getElementById(`chat-${username}`);
		let minimizedChat = document.querySelector(`#minimized-${username}`);
		
		if (existingChat || minimizedChat) {
			// Si el chat ya está abierto (ya sea en forma maximizada o minimizada), no hacer nada más
			return;
		}
	
		// Crear el contenedor para el chat privado
		const chatContainer = document.createElement("div");
		chatContainer.id = `chat-${username}`;
		chatContainer.classList.add(
			"private-chat", 
			"bg-white", 
			"p-4", 
			"rounded-lg", 
			"shadow-lg", 
			"w-full", 
			"h-[50vh]",  // Ajusta a un alto fijo
			"flex", 
			"flex-col", 
			"space-y-4", 
			"relative", 
			"transition-all",
			"duration-300"
		);
	
		// Encabezado del chat
		const chatHeader = document.createElement("div");
		chatHeader.classList.add("flex", "justify-between", "items-center", "bg-blue-500", "text-white", "p-2", "rounded-t-lg");
		chatHeader.innerHTML = `
			<span class="text-xs">${username}</span>
			<div class="flex space-x-2"> <!-- Contenedor para los botones -->
				<button class="minimize-btn text-lg hover:cursor-pointer">−</button>
				<button class="close-btn text-lg hover:cursor-pointer">×</button>
			</div>
		`;
		chatContainer.appendChild(chatHeader);
	
		// Cuerpo del chat
		const chatBody = document.createElement("div");
		chatBody.classList.add("chat-body", "flex-1", "overflow-y-auto", "bg-gray-100", "p-2", "rounded-md");
		chatContainer.appendChild(chatBody);
	
		// Área de entrada de mensaje
		const chatFooter = document.createElement("div");
		chatFooter.classList.add("flex", "items-center", "bg-gray-200", "p-2", "rounded-b-lg");
		chatFooter.innerHTML = `
			<input type="text" class="message-input flex-1 p-2 border border-gray-300 rounded-md" placeholder="Escribe un mensaje...">
			<button class="send-btn bg-blue-500 text-white p-2 rounded-md ml-2">Enviar</button>
		`;
		chatContainer.appendChild(chatFooter);
	
		// Agregar el chat privado al contenedor flotante
		const privChat = document.getElementById("privateChatsContainer") as HTMLElement | null;
		if (privChat) {
			privChat.appendChild(chatContainer);
		}
	
		// Lógica para minimizar el chat
		const minimizeButton = chatHeader.querySelector(".minimize-btn") as HTMLButtonElement | null;
		if (minimizeButton) {
			minimizeButton.addEventListener("click", () => {
				// Crear el cuadro minimizado
				const minimizedBox = document.createElement("div");
				minimizedBox.id = `minimized-${username}`; // Usamos un ID único para la versión minimizada
				minimizedBox.classList.add(
					"minimized-chat",
					"bg-blue-500",
					"text-white",
					"p-0.5",
					"mt-2",
					"rounded-lg",
					"cursor-pointer",
					"w-32", // Ajusta el tamaño del cuadro minimizado
					"flex",
					"items-center",
					"justify-center",
					"space-x-2"
				);
				minimizedBox.innerHTML = `
					<span class="text-xs">${username}</span>
					<button class="restore-btn hover:cursor-pointer">+</button>
					<button class="close-btn text-lg hover:cursor-pointer">×</button> <!-- Botón de cerrar en el cuadro minimizado -->
				`;
			
				// Reemplazar el chat con el cuadro minimizado
				chatContainer.replaceWith(minimizedBox);
			
				// Lógica para restaurar el chat
				const restoreButton = minimizedBox.querySelector(".restore-btn") as HTMLButtonElement | null;
				if (restoreButton) {
					restoreButton.addEventListener("click", () => {
						// Reemplazar el cuadro minimizado con el chat original
						if (privChat)
							privChat.appendChild(chatContainer);
						minimizedBox.remove(); // Eliminar el cuadro minimizado
					});
				}
	
				// Lógica para cerrar el chat en el cuadro minimizado
				const minimizedCloseButton = minimizedBox.querySelector(".close-btn") as HTMLButtonElement | null;
				if (minimizedCloseButton) {
					minimizedCloseButton.addEventListener("click", () => {
						// Eliminar el chat y la conexión
						minimizedBox.remove();
						// Aquí también podrías cerrar la conexión si es necesario
						// closeConnection(username);
					});
				}
			});
		}
	
		// Lógica para cerrar el chat
		const closeButton = chatHeader.querySelector(".close-btn") as HTMLButtonElement | null;
		if (closeButton) {
			closeButton.addEventListener("click", () => {
				// Eliminar el chat y la conexión
				chatContainer.remove();
				// Aquí también podrías cerrar la conexión si es necesario
				// closeConnection(username);
			});
		}
	
		// Lógica para enviar mensajes
		const sendButton = chatFooter.querySelector(".send-btn") as HTMLButtonElement | null;
		const messageInput = chatFooter.querySelector(".message-input") as HTMLInputElement | null;
	
		if (sendButton && messageInput) {
			sendButton.addEventListener("click", () => {
				const message = messageInput.value.trim();
				if (message) {
					sendPrivateMessage(username, message);
					displayPrivateMessage(username, message);
					messageInput.value = "";
				}
			});
		}
	}

	// Función para enviar mensaje privado a través del WebSocket
	function sendPrivateMessage(username: string | null, message: string | null) {
		const privateMessage = {
			type: "privateMessage",
			to: username,
			message: message,
		};

		socket.send(JSON.stringify(privateMessage));
	}

	// Función para mostrar un mensaje privado en el chat
	function displayPrivateMessage(username: string | null, message: string | null) {
		const chatBody = document.querySelector(`#chat-${username} .chat-body`);
		const messageElement = document.createElement("div");
		messageElement.classList.add("message", "p-2", "bg-white", "rounded-lg", "my-2");
		messageElement.textContent = message;
		if (chatBody)
		{
			chatBody.appendChild(messageElement);
			chatBody.scrollTop = chatBody.scrollHeight; // Hacer scroll hacia el último mensaje
		}
	}

	// Función auxiliar para crear botones con icono
	function createButton(text: string, bgColor: string, hoverColor: string, icon: string) {
		const button = document.createElement("button");
		button.innerHTML = `${icon} ${text}`;
		button.classList.add("w-full", bgColor, "text-white", "py-1", "rounded", hoverColor, "flex", "items-center", "justify-center", "hover:cursor-pointer");
		return button;
	}

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

//Para pantallas pequenas que oculte los usuarios o los muestre al pinchar
if (toggleUserListButton && userListContainer) {
    toggleUserListButton.classList.add("hover:bg-blue-500", "hover:cursor-pointer"); // Agregar clases de hover

    toggleUserListButton.addEventListener("click", () => {
        if (userListContainer.classList.contains("hidden")) {
            userListContainer.classList.remove("hidden");
            toggleUserListButton.textContent = "Ocultar Usuarios";
        } else {
            userListContainer.classList.add("hidden");
            toggleUserListButton.textContent = "Mostrar Usuarios";
        }
    });
}

