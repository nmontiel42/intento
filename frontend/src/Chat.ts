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
				if (data.user === "chat")
				{
					const messageElement = document.createElement("div");
					messageElement.textContent = `${data.user}: ${data.message}`;
					messageElement.classList.add(
						"p-3",
						"bg-yellow-200",
						"rounded-lg",
						"block",
						"w-full",
						"break-words",
						"mb-2"
					);
					chatBox.appendChild(messageElement);
				}
				else if (data.user === user.username)
				{
					const messageElement = document.createElement("div");
					messageElement.textContent = `${data.user}: ${data.message}`;
					messageElement.classList.add(
						"p-3",
						"bg-blue-200",
						"rounded-lg",
						"block",
						"w-full", 
						"break-words",
						"mb-2"
					);
					chatBox.appendChild(messageElement);
				}
				else
				{
					const messageElement = document.createElement("div");
					messageElement.textContent = `${data.user}: ${data.message}`;
					messageElement.classList.add(
						"p-3",
						"bg-green-200",
						"rounded-lg",
						"block",
						"w-full", 
						"break-words",
						"mb-2"
					);
					chatBox.appendChild(messageElement);
				}

				chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al último mensaje
			}

			if (data.type === "userList" && userList) {
				userList.innerHTML = ""; // Limpiar la lista actual
			
				data.users.forEach((user: string) => {
					const li = document.createElement("li");
					li.classList.add(
						"p-3",
						"text-xs",
						"bg-blue-100",
						"rounded-lg",
						"block",
						"w-full",
						"text-gray-800",
						"mb-1",
						"hover:bg-blue-300",
						"transition-all",
						"sm:flex",          // Mostrar como flex en pantallas más grandes
						"sm:items-center",	// Centrar el contenido verticalmente
						"sm:space-x-3",		// Espaciado entre el círculo y el nombre
						"sm:w-auto",		// Deja que el ancho se ajuste en pantallas grandes
						"relative"			// Para posicionar el tooltip
					);
			
					// Crear el icono circular verde para indicar que está en línea
					const onlineIndicator = document.createElement("span");
					onlineIndicator.classList.add(
						"inline-block",
						"w-2",
						"h-2",
						"mr-3",
						"rounded-full",
						"bg-green-500",
						"sm:w-4", 
						"sm:h-4"
					);
			
					// Crear el texto del nombre de usuario
					const userNameText = document.createElement("span");
					userNameText.textContent = user;
					userNameText.classList.add(
						"align-middle",         // Alineación de texto
						"text-xs",              // Tamaño de texto pequeño en móviles
						"sm:text-xs",          // Tamaño de texto normal en pantallas más grandes
						"cursor-pointer",
						"relative"
					);
			
					// Crear el tooltip (oculto por defecto)
					const tooltip = document.createElement("div");
					tooltip.classList.add(
						"absolute",
						"left-1/2",
						"top-full",
						"transform",
						"-translate-x-1/2",
						"mt-2",
						"w-48",
						"bg-white",
						"p-3",
						"shadow-lg",
						"rounded-lg",
						"border",
						"hidden", // Oculto inicialmente
						"z-50"
					);

					// Imagen de perfil
					const profileImg = document.createElement("img");
					profileImg.src = "https://via.placeholder.com/40"; // Cambiar por la imagen real del usuario
					profileImg.alt = "Perfil";
					profileImg.classList.add("w-10", "h-10", "rounded-full", "mx-auto");

					// Nombre con estado
					const nameWithStatus = document.createElement("div");
					nameWithStatus.classList.add("flex", "items-center", "justify-center", "mt-2", "text-sm", "font-semibold");

					const nameText = document.createElement("span");
					nameText.textContent = user;
					const statusDot = document.createElement("span");
					statusDot.classList.add("ml-2", "w-2", "h-2", "bg-green-500", "rounded-full");

					nameWithStatus.appendChild(nameText);
					nameWithStatus.appendChild(statusDot);

					// Botones de acción
					const buttonsWrapper = document.createElement("div");
					buttonsWrapper.classList.add("mt-2", "space-y-1");

					const btnPrivateMessage = document.createElement("button");
					btnPrivateMessage.textContent = "Mensaje";
					btnPrivateMessage.classList.add("w-full", "bg-blue-500", "text-white", "py-1", "rounded", "hover:bg-blue-600");

					const btnBlock = document.createElement("button");
					btnBlock.textContent = "Bloquear";
					btnBlock.classList.add("w-full", "bg-red-500", "text-white", "py-1", "rounded", "hover:bg-red-600");

					const btnInvite = document.createElement("button");
					btnInvite.textContent = "Invitar";
					btnInvite.classList.add("w-full", "bg-green-500", "text-white", "py-1", "rounded", "hover:bg-green-600");

					// Agregar elementos al tooltip
					buttonsWrapper.appendChild(btnPrivateMessage);
					buttonsWrapper.appendChild(btnBlock);
					buttonsWrapper.appendChild(btnInvite);

					tooltip.appendChild(profileImg);
					tooltip.appendChild(nameWithStatus);
					tooltip.appendChild(buttonsWrapper);

					// Mostrar tooltip al pasar el mouse
					userNameText.addEventListener("mouseenter", () => {
						tooltip.classList.remove("hidden");
					});
					tooltip.addEventListener("mouseenter", () => {
						tooltip.classList.remove("hidden");
					});

					// Ocultar tooltip solo si el cursor deja tanto el nombre como el tooltip
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
					li.appendChild(tooltip); // Agregar el tooltip al li

					// Añadir el <li> a la lista
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

