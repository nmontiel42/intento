window.addEventListener("DOMContentLoaded", () => {
  // Configuración del juego]
  const config = {
    canvas: 'renderCanvas',
    paddleSpeed: 0.3,
    ballSpeed: 0.15,
    paddleWidth: 1,
    paddleHeight: 4,
    borderThickness: 0.2,
    gameWidth: 20,
    gameHeight: 12,
    winScore: 5
  };

  /* ----------------------CANVAS---------------------- */
  const canvas = document.getElementById(config.canvas) as unknown as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas not found");
    return;
  }

  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;

  /* ----------------------MOTOR Y ESCENA---------------------- */
  const engine = new BABYLON.Engine(canvas, true, {
    antialias: true,  // Habilitar antialiasing
    preserveDrawingBuffer: true,
  });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0.01, 0, 0.9);

  scene.getEngine().setHardwareScalingLevel(1 / window.devicePixelRatio);

  /* ----------------------ESTADO---------------------- */
  const state = {
    scorePlayer1: 0,
    scorePlayer2: 0,
    paddle1Speed: 0,
    paddle2Speed: 0,
    ballVelocity: new BABYLON.Vector3(config.ballSpeed, config.ballSpeed, 0)
  };

  /* ----------------------CÁMARA Y LUCES---------------------- */
  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    Math.PI / 2,
    Math.PI / 4,
    40,
    BABYLON.Vector3.Zero(),
    scene
  );
  (camera.attachControl as any)(canvas, false);

  // Configurar luces
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );

  const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 5, 0), scene);
  pointLight.intensity = 1;
  pointLight.diffuse = new BABYLON.Color3(0, 0, 1);

  /* ----------------------FONDO---------------------- */
  // Crea el skybox (fondo)
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { width: 1000.0, height: 1000.0, depth: 1000.0 }, scene);

  // Crea el material del skybox
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

  // Renderiza todas las caras del skybox
  skyboxMaterial.backFaceCulling = false;
  // Desactiva la iluminación
  skyboxMaterial.disableLighting = true;

  // Crea una textura digital de 512x512 píxeles
  const textureData = new Uint8Array(1024 * 1024 * 4);

  for (let i = 0; i < 512; i++) {
    for (let j = 0; j < 512; j++) {
      // Comprueba si es una línea de la cuadrícula
      const isGrid = (i % 50 === 0) || (j % 50 === 0);
      // Calcula el índice de la textura
      const idx = (i * 512 + j) * 4;
      // Asigna el color
      textureData[idx] = isGrid ? 50 : 0;
      textureData[idx + 1] = isGrid ? 35 : 0;
      textureData[idx + 2] = isGrid ? 90 : 0;
      textureData[idx + 3] = 255;
    }
  }

  // Crea la textura digital
  const digitalTexture = new BABYLON.RawTexture(
    textureData, // Los datos de la textura
    512, // La anchura de la textura
    512, // La altura de la textura
    BABYLON.Engine.TEXTUREFORMAT_RGBA, // El formato de la textura
    scene, // La escena
    false, // No tiene mipmap
    false, // No es una textura invertida
    BABYLON.Texture.NEAREST_SAMPLINGMODE // El modo de muestreo
  );

  // Asigna la textura al material del skybox
  skyboxMaterial.emissiveTexture = digitalTexture;
  // Define el color base del material
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  // Controla el color de los reflejos especulares
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  // Asigna el material al skybox
  skybox.material = skyboxMaterial;
  // Activa la distancia infinita
  skybox.infiniteDistance = true;

  /* ----------------------ELEMENTOS DEL JUEGO---------------------- */
  // Crear elementos del juego
  const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, scene);
  ball.position = new BABYLON.Vector3(0, 0, 0);

  const paddle1 = BABYLON.MeshBuilder.CreateBox("paddle1", {
    width: config.paddleWidth,
    height: config.paddleHeight,
    depth: 0.5
  }, scene);
  paddle1.position.x = -config.gameWidth / 2 + 1;

  const paddle2 = BABYLON.MeshBuilder.CreateBox("paddle2", {
    width: config.paddleWidth,
    height: config.paddleHeight,
    depth: 0.5
  }, scene);
  paddle2.position.x = config.gameWidth / 2 - 1;

  const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
  ballMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
  ballMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  ball.material = ballMaterial;

  // Para las paletas
  const paddleMaterial = new BABYLON.StandardMaterial("paddleMaterial", scene);
  paddleMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.8);
  paddleMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  paddle1.material = paddleMaterial;
  paddle2.material = paddleMaterial;

  /* ----------------------BORDES---------------------- */
  // Crear bordes
  const createBorder = (name: string, width: number, height: number, position: BABYLON.Vector3) => {
    const border = BABYLON.MeshBuilder.CreateBox(name, {
      width,
      height,
      depth: 0.5
    }, scene);
    border.position = position;
    return border;
  };

  const topBorder = createBorder("topBorder", config.gameWidth, config.borderThickness,
    new BABYLON.Vector3(0, config.gameHeight / 2, 0));
  const bottomBorder = createBorder("bottomBorder", config.gameWidth, config.borderThickness,
    new BABYLON.Vector3(0, -config.gameHeight / 2, 0));
  const leftBorder = createBorder("leftBorder", config.borderThickness, config.gameHeight,
    new BABYLON.Vector3(-config.gameWidth / 2, 0, 0));
  const rightBorder = createBorder("rightBorder", config.borderThickness, config.gameHeight,
    new BABYLON.Vector3(config.gameWidth / 2, 0, 0));
  const middleLine = createBorder("middleLine", config.borderThickness, config.gameHeight,
    new BABYLON.Vector3(0, 0, 0));

  const borderMaterial = new BABYLON.StandardMaterial("borderMaterial", scene);
  borderMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
  [topBorder, bottomBorder, leftBorder, rightBorder, middleLine].forEach(border => {
    border.material = borderMaterial;
  });

  /* ----------------------PARTÍCULAS---------------------- */
  const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
  particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", scene);
  particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
  particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
  particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
  particleSystem.color2 = new BABYLON.Color4(0, 0, 0, 1);
  particleSystem.emitter = ball;
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.5;
  particleSystem.minLifeTime = 0.1;
  particleSystem.maxLifeTime = 0.3;

  /* ----------------------CONTROL DE TECLADO---------------------- */
  const keyState: { [key: string]: boolean } = {};

  window.addEventListener("keydown", (event) => {
    keyState[event.key] = true;
  });

  window.addEventListener("keyup", (event) => {
    keyState[event.key] = false;
  });

  // Función de movimiento de paletas
  const movePaddles = () => {
    // Jugador 2 (WASD)
    if (keyState['w']) state.paddle2Speed = config.paddleSpeed;
    else if (keyState['s']) state.paddle2Speed = -config.paddleSpeed;
    else state.paddle2Speed = 0;

    // Jugador 1 (Flechas)
    if (keyState['ArrowUp']) state.paddle1Speed = config.paddleSpeed;
    else if (keyState['ArrowDown']) state.paddle1Speed = -config.paddleSpeed;
    else state.paddle1Speed = 0;
  };

  /* ----------------------LOGÍCA DE JUEGO---------------------- */
  const lerp = (start: number, end: number, alpha: number) =>
    start + (end - start) * alpha;

  // Lógica de juego
  scene.registerBeforeRender(() => {
    // Mover paletas
    movePaddles();

    // Actualizar posición de paletas con interpolación
    paddle1.position.y = lerp(
      paddle1.position.y,
      paddle1.position.y + state.paddle1Speed,
      0.8
    );
    paddle2.position.y = lerp(
      paddle2.position.y,
      paddle2.position.y + state.paddle2Speed,
      0.8
    );

    // Limitar movimiento de paletas
    const halfHeight = config.gameHeight / 2 - config.paddleHeight / 2;
    paddle1.position.y = Math.max(-halfHeight, Math.min(halfHeight, paddle1.position.y));
    paddle2.position.y = Math.max(-halfHeight, Math.min(halfHeight, paddle2.position.y));

    // Mover pelota
    ball.position.addInPlace(state.ballVelocity);

    // Colisión con bordes verticales
    if (Math.abs(ball.position.y) >= config.gameHeight / 2 - config.borderThickness / 2) {
      state.ballVelocity.y *= -1;
    }

    // Colisión con paletas
    const checkPaddleCollision = (paddle: BABYLON.Mesh, isLeftPaddle: boolean) => {
      const paddleLeft = paddle.position.x - config.paddleWidth / 2;
      const paddleRight = paddle.position.x + config.paddleWidth / 2;
      const paddleTop = paddle.position.y + config.paddleHeight / 2;
      const paddleBottom = paddle.position.y - config.paddleHeight / 2;

      const ballInPaddleX = isLeftPaddle
        ? ball.position.x - ball.scaling.x / 2 <= paddleRight && ball.position.x + ball.scaling.x / 2 >= paddleLeft
        : ball.position.x + ball.scaling.x / 2 >= paddleLeft && ball.position.x - ball.scaling.x / 2 <= paddleRight;

      const ballInPaddleY = ball.position.y + ball.scaling.y / 2 >= paddleBottom &&
        ball.position.y - ball.scaling.y / 2 <= paddleTop;

      if (ballInPaddleX && ballInPaddleY) {
        state.ballVelocity.x *= -1;
        state.ballVelocity.y = (ball.position.y - paddle.position.y) * 0.2;
        particleSystem.start();
        setTimeout(() => particleSystem.stop(), 200);
      }
    };

    checkPaddleCollision(paddle1, true);
    checkPaddleCollision(paddle2, false);

    // Marcar puntos
    if (ball.position.x >= config.gameWidth / 2) {
      
      ball.position = new BABYLON.Vector3(0, 0, 0);
      state.ballVelocity.x = -config.ballSpeed;
      if (isActivated) {
        state.scorePlayer2++;
        player1Score.innerText = state.scorePlayer1.toString();
        player2Score.innerText = state.scorePlayer2.toString();
        console.log("Player 2 score: ", state.scorePlayer1);
      }
    }

    if (ball.position.x <= -config.gameWidth / 2) {
      ball.position = new BABYLON.Vector3(0, 0, 0);
      state.ballVelocity.x = config.ballSpeed;
      if (isActivated) {
        state.scorePlayer1++;
        player2Score.innerText = state.scorePlayer2.toString();
        player1Score.innerText = state.scorePlayer1.toString();
        console.log("Player 1 score: ", state.scorePlayer2);
      }
    }

    show3dGame.addEventListener('click', () => {
      state.scorePlayer1 = 0;
      state.scorePlayer2 = 0;
    });

    if (state.scorePlayer1 >= config.winScore || state.scorePlayer2 >= config.winScore) {
      // Guardar quién ganó antes de resetear las puntuaciones
      const player1Won = state.scorePlayer1 >= config.winScore;
      
      // Ahora resetea los puntajes
      isActivated = false;
      state.scorePlayer1 = 0;
      state.scorePlayer2 = 0;
      player1Score.innerHTML = '0';
      player2Score.innerHTML = '0';
      ball.position = new BABYLON.Vector3(0, 0, 0);
      state.ballVelocity.x = config.ballSpeed;
      state.ballVelocity.y = config.ballSpeed;
      activateScore.innerText = '▶';
      
      winnerPlayer.innerText = player1Won ? ' Ping' : ' Pong';

      winView.style.display = "block";
      show3d.style.display = "none";
      showAdvert.style.display = "none";
    }
    // Actualizar posición de la luz
    pointLight.position = ball.position.add(new BABYLON.Vector3(0, 2, 0));
  });

  reset3dGame.addEventListener("click", () => {
    isActivated = false;
    state.scorePlayer1 = 0;
    state.scorePlayer2 = 0;
    ball.position = new BABYLON.Vector3(0, 0, 0);
    state.ballVelocity.x = config.ballSpeed;
    state.ballVelocity.y = config.ballSpeed;
    activateScore.innerText = '▶';
  });

  // Bucle de renderizado
  engine.runRenderLoop(() => {
    scene.render();
  });

  // Redimensionamiento
  window.addEventListener("resize", () => {
    engine.resize();
  });
});
