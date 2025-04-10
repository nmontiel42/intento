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
    const minimizedContainer = document.getElementById("minimizedChatsContainer") as HTMLElement;
	// Estado inicial minimizado al cargar
	chatContainer.classList.remove("h-[80vh]", "md:h-3/5", "lg:h-2/3");
	chatContainer.classList.add("h-[50px]");
	chatBox.classList.add("hidden");
	chatInputContainer.classList.add("hidden");
	toggleButton.textContent = "+";
	chatMinimized = true;

	// Ocultar el contenedor de chats minimizados (opcional si aún no hay ninguno)
	minimizedContainer.classList.add("hidden");

    
    // Función para actualizar la posición del contenedor minimizado
    const updateMinimizedContainerPosition = () => {
        if (minimizedContainer && chatContainer) {
            const chatRect = chatContainer.getBoundingClientRect();
            minimizedContainer.style.position = "fixed";
            minimizedContainer.style.top = `${chatRect.top - minimizedContainer.offsetHeight}px`; // Ajustamos la posición para acercarlo más
            minimizedContainer.style.left = `${chatRect.left - 9}px`; // Alineamos al chat principal
            minimizedContainer.style.width = `${chatRect.width}px`; // Ajustamos el ancho
        }
    };

    // Minimizar o maximizar chat
    toggleButton.addEventListener("click", () => {
        if (chatMinimized) {
            // Maximizar el chat
            chatContainer.classList.remove("h-[50px]");  // Quitar la altura mínima
            chatContainer.classList.add("h-[80vh]", "md:h-3/5", "lg:h-2/3");  // Ajustar las alturas para cada tamaño de pantalla
            chatBox.classList.remove("hidden");  // Mostrar la caja de mensajes
            chatInputContainer.classList.remove("hidden");  // Mostrar el input de mensaje
            toggleButton.textContent = "−";  // Cambiar el texto del botón a "-"
            
            // Mostrar el contenedor de chats minimizados (si estaba oculto)
            minimizedContainer.classList.remove("hidden");
            
            // Reajustar la posición del contenedor minimizado
            updateMinimizedContainerPosition();
        } else {
            // Minimizar el chat
            chatContainer.classList.remove("h-[80vh]", "md:h-3/5", "lg:h-2/3");  // Quitar las alturas actuales
            chatContainer.classList.add("h-[50px]");  // Establecer una altura pequeña para la versión minimizada
            chatBox.classList.add("hidden");  // Ocultar la caja de mensajes
            chatInputContainer.classList.add("hidden");  // Ocultar el input de mensaje
            toggleButton.textContent = "+";  // Cambiar el texto del botón a "+"
            
            // Ocultar el contenedor de chats minimizados (si es necesario)
            minimizedContainer.classList.add("hidden");
        }
        
        chatMinimized = !chatMinimized;  // Alternar entre el estado minimizado o maximizado
    });

    // Escuchar cambios en el tamaño de la ventana y actualizar la posición del contenedor minimizado
    window.addEventListener("resize", () => {
        // Solo actualizar si el chat está maximizado
        if (!chatMinimized) {
            updateMinimizedContainerPosition();
        }
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
            username: user?.username,
			picture: user?.picture,
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
			
			if (data.type === "privateMessage") {
				const chatExists = document.getElementById(`chat-${data.from}`);
		
				// Si el chat no existe y el mensaje viene con "openChat: true", abrirlo
				if (!chatExists && data.openChat) {
					openPrivateChat(data.from, data.to, true);
				}

				// Verifica si el chat está minimizado
				const chatContainer = document.getElementById(`chat-${data.from}`);
				if (chatContainer && chatContainer.classList.contains("hidden")) {
					blinkMinimizedChat(data.from); // <-- 👈 aplica el parpadeo si está minimizado
				}
					
				// Mostrar el mensaje en el chat
				displayPrivateMessage(data.from, data.message, data.to);
			}

			if (data.type === "privateMessageError") {
				const chatExists = document.getElementById(`chat-${data.from}`); // Buscar chat del remitente
	
				if (chatExists) {
					// Si el chat existe, mostrar el mensaje de error dentro del chat del remitente
					displayPrivateMessage(data.from, "El usuario no está disponible", data.to, false, true);
				}
			}
		} catch (err) {
			console.error("Error procesando mensaje:", err);
		}
	};

	function blinkMinimizedChat(username: string) {
		const minimizedBox = document.getElementById(`minimized-${username}`);
		if (minimizedBox && !minimizedBox.classList.contains("blinking")) {
			minimizedBox.classList.add("blinking");
	
			// Quitar parpadeo
			setTimeout(() => {
				minimizedBox.classList.remove("blinking");
			}, 200000);
		}
	}
	
	// Función para manejar mensajes recibidos
	function handleIncomingMessage(data: { user: string; message: any }) {
		const messageWrapper = document.createElement("div");
		messageWrapper.classList.add("flex", "w-full", "items-start");
	  
		// Crear contenedor con fondo para el nombre de usuario y mensaje
		const messageContainer = document.createElement("div");
		messageContainer.classList.add(
		  "flex", "w-full", "items-center", "p-3", "rounded-lg", "mb-2",
		  "whitespace-pre-wrap", "overflow-hidden",
		  "max-w-[90%]", "sm:max-w-[65%]", "md:max-w-[75%]", "lg:max-w-[85%]", // Controlar el ancho máximo
		  "break-words",  // Asegurar que las palabras largas se rompan
		  "overflow-ellipsis", // Asegurar que los textos muy largos no desborden
		  "truncate" // Limita el texto si es demasiado largo
		);
	  
		// Crear contenedor para el nombre de usuario
		const userNameElement = document.createElement("span");
		userNameElement.textContent = `${data.user}:`;
		userNameElement.classList.add(
		  "font-semibold", // Hace que el nombre sea en negrita
		  "mr-2", // Espaciado entre el nombre de usuario y el mensaje
		  "text-black", // Nombre de usuario en negro
		  "text-xs", // Tamaño de texto pequeño
		  "max-w-[40%]" // Limitar el ancho del nombre del usuario
		);
	  
		// Crear el mensaje
		const messageElement = document.createElement("div");
		messageElement.textContent = `${data.message}`;
		messageElement.classList.add(
		  "text-xs", "md:text-base", "whitespace-pre-wrap",
		  "overflow-hidden",
		  "flex",
		  "break-words", // Asegura que las palabras largas se rompan
		  "truncate" // Limita el texto si es demasiado largo
		);
	  
		// Aplicar colores de fondo y alineación según el usuario
		if (data.user === "chat") {
		  messageContainer.classList.add("bg-yellow-200", "text-gray-800", "text-center", "items-center");
		  messageWrapper.classList.add("justify-center");
		} else if (data.user === user.username) {
		  messageContainer.classList.add("bg-blue-500", "text-white", "text-left");
		  messageWrapper.classList.add("justify-end");
		} else {
		  messageContainer.classList.add("bg-green-500", "text-white", "text-left");
		  messageWrapper.classList.add("justify-start");
		}
	  
		// Agregar los elementos al contenedor de mensaje
		messageContainer.appendChild(userNameElement);
		messageContainer.appendChild(messageElement);
	  
		// Agregar el contenedor completo al wrapper
		messageWrapper.appendChild(messageContainer);
	  
		// Agregar el mensaje al chatBox sin afectar la lista de usuarios
		chatBox.appendChild(messageWrapper);
	  
		// Auto-scroll al último mensaje sin expandir el chat
		chatBox.scrollTop = chatBox.scrollHeight - 200;
	}

	//Si hace click envia el mensaje
	sendChatBtn.addEventListener("click", sendMessage);

	//Si pulsa Enter envia el mensaje
	chatInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			if (event.shiftKey) {
				// Shift + Enter → Insertar un salto de línea
				event.preventDefault();
				chatInput.setRangeText(
					"\n",
					chatInput.selectionStart ?? 0,
					chatInput.selectionEnd ?? 0,
					"end"
				);
			} else {
				// Solo Enter → Enviar mensaje
				event.preventDefault();
				sendMessage();
			}
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

	function updateUserList(data: { users: { username: string; picture: string }[] }) {

		if (!userList) return;
	
		userList.innerHTML = ""; // Limpiar la lista actual
		const currentUser = user.username;  // Obtener el nombre de usuario del usuario actual
	
		// Filtrar los usuarios para excluir al usuario actual
		const filteredUsers = data.users.filter((user: { username: string }) => user.username !== currentUser);
	
		data.users.forEach((user) => {
			const li = document.createElement("li");
			li.classList.add(
				"p-3", "bg-blue-100", "rounded-lg", "block", "w-full",
				"text-gray-800", "mb-1", "hover:bg-blue-300", "transition-all",
				"flex", "items-center", "space-x-2", "relative", // Flexbox para todos los tamaños
				"sm:flex", "sm:items-center", "sm:space-x-3", // Para pantallas pequeñas
				"md:flex-row", "md:space-x-4", "lg:space-x-5", "text-xs" // Ajustar el espaciado en pantallas medianas y grandes
			);
	
			// Indicador de usuario en línea
			const onlineIndicator = document.createElement("span");
			onlineIndicator.classList.add(
				"inline-block", "rounded-full", "bg-green-500", "mr-2",
				"w-2", "h-2",
				"aspect-square", "flex-shrink-0"
			);			  
	
			// Obtener la primera palabra y la primera letra de la segunda palabra
			const nameParts = user.username ? user.username.split(" ") : [];
			const firstWord = nameParts[0]; // Primera palabra
			const secondLetter = nameParts[1] ? nameParts[1][0] : ""; // Primera letra de la segunda palabra (si existe)
	
			// Nombre del usuario con primera palabra + primera letra de la segunda
			const userNameText = document.createElement("span");
			let userName = firstWord + (secondLetter ? " " + secondLetter + "." : ""); // Si hay una segunda palabra, agregamos la primera letra con un punto
	
			// Truncar el nombre si es más largo de 9 caracteres
			if (userName.length > 9) {
				userName = userName.substring(0, 9); // Truncar y agregar "..."
			}
	
			userNameText.textContent = userName;
			userNameText.classList.add(
				"align-middle", "cursor-pointer", "relative",
				"text-xs", 
				"whitespace-nowrap", "overflow-hidden", "text-ellipsis", 
				"min-w-0", "max-w-full", "truncate", "flex-1"
			);
	
			// Tooltip
			const tooltip = createUserTooltip(user.username, currentUser, user.picture);
	
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
	function createUserTooltip(username: string | null, currentUser: any, userImage : string) {
		const tooltip = document.createElement("div");
		tooltip.classList.add(
			"absolute", "left-1/2", "top-full", "transform", "-translate-x-1/2",
			"mt-2", "w-48", "bg-white", "p-3", "shadow-lg", "rounded-lg", "border",
			"hidden", "z-50"
		);

		// Imagen de perfil
		const profileImg = document.createElement("img");
		profileImg.src = userImage; // Imagen de perfil temporal
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
				openPrivateChat(username, currentUser, true); // Llamar a la función para enviar un mensaje privado
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

	function openPrivateChat(username: string | null, currentUser: string | null, sender: boolean = false) {
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
		  "absolute",
		  "top-0",
		  "right-0",
		  "bg-white",
		  "p-2",
		  "rounded-lg",
		  "shadow-lg",
		  "w-full",        // Mobile
		  "sm:w-[85%]",
		  "md:w-[22rem]",
		  "lg:w-[24rem]",
		  "h-[50vh]",
		  "md:h-[40vh]",
		  "lg:h-[35vh]",
		  "max-h-[70vh]",
		  "flex",
		  "flex-col",
		  "space-y-2",
		  "transition-all",
		  "duration-300",
		  "overflow-hidden",
		  "overflow-x-hidden"
		);
		
		// ✅ Responsive, cross-browser, stack al frente
		chatContainer.style.pointerEvents = "auto"; // Reactividad
		chatContainer.style.zIndex = `${1000 + document.querySelectorAll('.private-chat').length}`;
		
		// Encabezado del chat
		const chatHeader = document.createElement("div");
		chatHeader.classList.add(
		  "flex", 
		  "justify-between", 
		  "items-center", 
		  "bg-blue-500", 
		  "text-white", 
		  "p-2", 
		  "rounded-t-lg",
		  "space-x-2"  // Asegura que haya espacio entre el nombre y los botones
		);
		chatHeader.innerHTML = `
		  <span class="text-xs p-2 break-words overflow-hidden text-ellipsis" style="max-width: calc(100% - 3rem);">${username}</span>
		  <div class="flex space-x-2 flex-shrink-0"> <!-- Contenedor para los botones -->
			<button class="minimize-btn text-lg hover:cursor-pointer">−</button>
			<button class="close-btn text-lg hover:cursor-pointer">×</button>
		  </div>
		`;
		chatContainer.appendChild(chatHeader);
		
		// Cuerpo del chat
		const chatBody = document.createElement("div");
		chatBody.classList.add(
		  "chat-body", 
		  "flex-1", 
		  "overflow-y-auto", 
		  "bg-gray-100", 
		  "p-2", 
		  "rounded-md", 
		  "h-[50vh]", 
		  "md:h-[60%]"
		);
		chatBody.style.scrollBehavior = "smooth"; // Añadido para el desplazamiento suave
		chatContainer.appendChild(chatBody);
		
		// Área de entrada de mensaje
		const chatFooter = document.createElement("div");
		chatFooter.classList.add(
		  "flex", 
		  "items-center", 
		  "bg-gray-200", 
		  "p-2", 
		  "rounded-b-lg", 
		  "flex-shrink-0"
		);
		chatFooter.innerHTML = `
		  <textarea 
			class="message-input flex-1 p-2 border border-gray-300 rounded-md resize-none text-sm min-h-[1.5rem] max-h-[3.5rem] overflow-y-auto" 
			rows="1" 
			placeholder="Escribe un mensaje...">
		  </textarea>
		  <button class="send-btn bg-blue-500 text-white p-2 rounded-md ml-2">Enviar</button>
		`;
		chatContainer.appendChild(chatFooter);
		
		// Agregar el chat privado al contenedor flotante
		const privChat = document.getElementById("privateChatsContainer") as HTMLElement | null;
		if (privChat) {
		  privChat.appendChild(chatContainer);
		}
				
		const minimizedContainer = document.getElementById("minimizedChatsContainer") as HTMLElement | null;
		const liveChatContainer = document.getElementById("liveChatContainer") as HTMLElement | null;
		
		// Lógica para minimizar el chat
		const minimizeButton = chatHeader.querySelector(".minimize-btn") as HTMLButtonElement | null;
		if (minimizeButton && minimizedContainer && liveChatContainer) {
			minimizeButton.addEventListener("click", () => {
				if (document.getElementById(`minimized-${username}`)) return;
		
				// Mostrar el contenedor de chats minimizados si estaba oculto
				minimizedContainer.classList.remove("hidden");
		
				// Configuramos el contenedor para que se posicione correctamente encima del liveChatContainer
				const chatRect = liveChatContainer.getBoundingClientRect();
		
				// Ajustamos el contenedor minimizado para que se posicione justo encima del chat global
				minimizedContainer.style.position = "fixed";
				minimizedContainer.style.top = `${chatRect.top - minimizedContainer.offsetHeight}px`; // Justo encima del liveChatContainer
				minimizedContainer.style.left = `${chatRect.left - 9}px`; // Alineamos con el lado izquierdo
				minimizedContainer.style.width = `${chatRect.width}px`; // Ajustamos el ancho al del chat global
				minimizedContainer.style.zIndex = "50"; // Aseguramos que esté por encima de otros elementos
		
				// Aplicamos clases de Tailwind para hacer el contenedor responsive
				minimizedContainer.classList.remove("flex-col", "space-y-2");
				minimizedContainer.classList.add(
					"flex", 
					"flex-row", 
					"flex-wrap", 
					"gap-1", 
					"justify-start", // Alineamos al inicio (izquierda)
					"overflow-x-auto"  // Permitimos scroll horizontal si es necesario
				);
		
				// Crear el elemento de chat minimizado como una pestaña
				const minimizedBox = document.createElement("div");
				minimizedBox.id = `minimized-${username}`;
				minimizedBox.classList.add(
					"minimized-chat",
					"bg-blue-500",
					"text-white",
					"px-2", 
					"py-1", 
					"rounded-t-md", // Solo redondeamos la parte superior para estilo de pestaña
					"cursor-pointer",
					"flex",
					"items-center",
					"justify-between",
					"shadow-md",
					"text-xs",
					"truncate",
					"hover:bg-blue-600",
					"mb-0", // Sin margen inferior
					"inline-flex",
					"max-w-[200px]", // Limitamos el ancho máximo
					"transition-colors", // Añadimos transición suave para el hover
					"duration-200"
				);
		
				// Ajustamos el nombre de usuario según el tamaño de pantalla
				const displayName = (() => {
					if (window.innerWidth < 640) { // sm breakpoint
						return username && username.length > 8 ? `${username.slice(0, 8)}...` : username || "Chat";
					}
					return username && username.length > 12 ? `${username.slice(0, 12)}...` : username || "Chat";
				})();
		
				minimizedBox.innerHTML = `
					<span class="truncate mr-1">${displayName}</span>
					<div class="flex space-x-1 flex-shrink-0">
						<button class="restore-btn text-sm hover:cursor-pointer px-1 hover:text-gray-200">+</button>
						<button class="close-btn text-sm hover:cursor-pointer px-1 hover:text-gray-200">×</button>
					</div>
				`;
		
				// Agregar el chat minimizado al contenedor
				minimizedContainer.appendChild(minimizedBox);
				chatContainer.classList.add("hidden");
		
				// Función para actualizar la posición y tamaño responsive
				const updateContainerPosition = () => {
					if (minimizedContainer.children.length > 0) {
						const updatedChatRect = liveChatContainer.getBoundingClientRect();
						minimizedContainer.style.top = `${updatedChatRect.top - minimizedContainer.offsetHeight}px`;
						minimizedContainer.style.left = `${updatedChatRect.left - 9}px`;
						minimizedContainer.style.width = `${updatedChatRect.width}px`;
		
						// Ajustamos el tamaño de texto según el ancho de pantalla
						const allMinimizedChats = document.querySelectorAll(".minimized-chat");
						allMinimizedChats.forEach((chat) => {
							if (window.innerWidth < 640) { // sm breakpoint
								chat.classList.add("text-xs");
								chat.classList.remove("text-sm");
							} else {
								chat.classList.add("text-sm");
								chat.classList.remove("text-xs");
							}
						});
					}
				};
		
				// Actualizamos la posición y estilo cuando cambia el tamaño de la ventana
				window.addEventListener("resize", updateContainerPosition);
				// Ejecutamos una vez para configurar inicialmente
				updateContainerPosition();

				function getHighestZIndex(): number {
					const chats = document.querySelectorAll(".private-chat");
					let maxZ = 1000; // Z-index base
					chats.forEach(chat => {
						const z = parseInt(window.getComputedStyle(chat).zIndex || "1000", 10);
						if (!isNaN(z)) {
							maxZ = Math.max(maxZ, z);
						}
					});
					return maxZ;
				}
				
				// Lógica para restaurar el chat minimizado
				const restoreButton = minimizedBox.querySelector(".restore-btn");
				restoreButton?.addEventListener("click", (e) => {
					e.stopPropagation(); // Evita que el evento se propague al contenedor
					chatContainer.classList.remove("hidden");
					const highestZ = getHighestZIndex();
					chatContainer.style.zIndex = `${highestZ + 1}`;
					minimizedBox.remove();
					if (minimizedContainer.children.length === 0) {
						minimizedContainer.classList.add("hidden");
					}
				});
				
				// Lógica para cerrar el chat minimizado
				const closeButton = minimizedBox.querySelector(".close-btn");
				closeButton?.addEventListener("click", (e) => {
					e.stopPropagation(); // Evita que el evento se propague al contenedor
					minimizedBox.remove();
					chatContainer.remove();
					if (minimizedContainer.children.length === 0) {
						minimizedContainer.classList.add("hidden");
					}
				});
		
				// Opcionalmente, hacer que al hacer clic en la pestaña se restaure el chat
				minimizedBox.addEventListener("click", () => {
					chatContainer.classList.remove("hidden");
					minimizedBox.remove();
					if (minimizedContainer.children.length === 0) {
						minimizedContainer.classList.add("hidden");
					}
				});
			});
		}
			  
		
		// Lógica para cerrar el chat desde el botón en el header
		const closeButton = chatHeader.querySelector(".close-btn") as HTMLButtonElement | null;
		if (closeButton) {
			closeButton.addEventListener("click", () => {
				chatContainer.remove();
				const minimized = document.getElementById(`minimized-${username}`);
				if (minimized) minimized.remove();
				if (minimizedContainer && minimizedContainer.children.length === 0) {
					minimizedContainer.classList.add("hidden");
				}
			});
		}
		// Lógica para enviar mensajes
		const sendButton = chatFooter.querySelector(".send-btn") as HTMLButtonElement | null;
		const messageInput = chatFooter.querySelector(".message-input") as HTMLInputElement | null;
	
		messageInput?.addEventListener("input", () => {
			messageInput.style.height = "auto"; // Reinicia altura
			messageInput.style.height = `${messageInput.scrollHeight}px`; // Ajusta a contenido
		});
	
		if (sendButton && messageInput) {
			sendButton.addEventListener("click", () => {
				const message = messageInput.value.trim();
				if (message) {
					sendPrivateMessage(username, message);
					displayPrivateMessage(username, message, currentUser, sender);
					messageInput.value = "";
					messageInput.style.height = "auto"; // Reinicia altura
					messageInput.style.height = `${messageInput.scrollHeight}px`; // Ajusta a contenido
				}
			});
	
			messageInput.addEventListener("keydown", (event) => {
				if (event.key === "Enter") {
					if (event.shiftKey) {
						// Permite salto de línea
						return;
					}
					event.preventDefault(); // Evita el salto de línea en el input
					const message = messageInput.value.trim();
					if (message) {
						sendPrivateMessage(username, message);
						displayPrivateMessage(username, message, currentUser, sender);
						messageInput.value = "";
						messageInput.style.height = "auto"; // Reinicia altura
						messageInput.style.height = `${messageInput.scrollHeight}px`; // Ajusta a contenido
					}
				}
			});
		}
	}

	// Función para enviar mensaje privado a través del WebSocket
	function sendPrivateMessage(username: string | null, message: string | null, currentUSer = user.username, isError: boolean = false) {
		if (isError)
		{
			const privateMessageError = {
				type: "privateMessage",
				to: username,
				from: currentUSer,
				message: message,
			};
			socket.send(JSON.stringify(privateMessageError));
		}
		else{
			const privateMessage = {
				type: "privateMessage",
				to: username,
				from: currentUSer,
				message: message,
			};
			socket.send(JSON.stringify(privateMessage));
		}
	}

	// Función para mostrar un mensaje privado en el chat
	// Función para mostrar un mensaje privado en el chat
	function displayPrivateMessage(username: string | null, message: string | null, currentUser: string | null, sender: boolean = false, isError: boolean = false) {
		const chatBody = document.querySelector(`#chat-${username} .chat-body`);
		if (!chatBody) return; // Evitar errores si el chat no está abierto
	
		const messageElement = document.createElement("div");
		messageElement.classList.add(
			"message", 
			"p-2", 
			"rounded-lg", 
			"my-2", 
			"max-w-[70%]", // Limita el ancho máximo del mensaje
			"break-words", // Permite que las palabras largas se rompan
			"whitespace-pre-wrap", // Ajuste del texto para que se divida si es necesario
			"overflow-hidden", // Oculta el contenido desbordado
			"truncate" // Puntos suspensivos para contenido que no cabe
		);
	
		// Verificar si el mensaje fue enviado por el usuario actual
		const isSender = username === user.username; 
		console.log(username, currentUser, user.username);
	
		if (isError) {
			// Mensaje de error (siempre centrado con fondo rojo)
			messageElement.classList.add(
				"bg-red-500",  // Fondo rojo para el mensaje de error
				"text-white",  // Texto blanco
				"text-center", // Centrado del texto dentro del contenedor
				"w-full",      // El contenedor ocupará el 100% del ancho disponible
				"py-2",        // Espaciado vertical para hacer que el mensaje sea más legible
				"flex",         // Usar flexbox para alinear el contenido
				"items-center", // Alinear el contenido de forma vertical (centrado)
				"justify-center" // Alinear el contenido de forma horizontal (centrado)
			);
			messageElement.textContent = `⚠️ ${message}`;
		} else {
			if (sender) {
				// Mensaje enviado por el usuario actual (alineado a la derecha, azul claro)
				messageElement.classList.add(
					"bg-blue-200", 
					"text-black", 
					"self-end", 
					"ml-auto", 
					"text-left",
					"max-w-[85%]", // Asegura que el mensaje no ocupe todo el ancho
					"overflow-ellipsis", // Usar puntos suspensivos cuando el texto es largo
					"truncate" // Limitar el texto
				);
			} else {
				// Mensaje recibido del otro usuario (alineado a la izquierda, verde claro)
				messageElement.classList.add(
					"bg-green-200", 
					"text-black", 
					"self-start", 
					"mr-auto", 
					"text-left",
					"max-w-[85%]", // Asegura que el mensaje no ocupe todo el ancho
					"overflow-ellipsis", // Usar puntos suspensivos cuando el texto es largo
					"truncate" // Limitar el texto
				);
			}
			messageElement.textContent = message;
		}
	
		chatBody.appendChild(messageElement);
		chatBody.scrollTop = chatBody.scrollHeight; // Hacer scroll hacia el último mensaje
	}
	

	// Función auxiliar para crear botones con icono
	function createButton(text: string, bgColor: string, hoverColor: string, icon: string) {
		const button = document.createElement("button");
		button.innerHTML = `${icon} ${text}`;
		button.classList.add("w-full", bgColor, "text-white", "py-1", "rounded", hoverColor, "flex", "items-center", "justify-center", "hover:cursor-pointer");
		return button;
	}

	logoutBtn.addEventListener("click", () => {
		chatBox.innerHTML = ""; // Limpia el chat
		socket.close(); // Cierra la conexión WebSocket
	});

	deleteAccountBtn.addEventListener("click", () => {
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

