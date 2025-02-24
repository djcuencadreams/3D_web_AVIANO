document.addEventListener('DOMContentLoaded', () => {
  // Orientación del dispositivo
  const orientationPopup = document.getElementById('orientation-popup');
  const understandBtn = document.getElementById('understand-btn');
  
  function checkOrientation() {
    if (window.innerWidth < window.innerHeight && window.innerWidth <= 768) {
      orientationPopup.style.display = 'flex';
    }
  }

  understandBtn.addEventListener('click', () => {
    orientationPopup.style.display = 'none';
  });

  // Verificar orientación al cargar y al rotar
  checkOrientation();
  window.addEventListener('resize', checkOrientation);
  const intro = document.getElementById('intro'); // Introducción
  const mainContent = document.getElementById('main-content'); // Carrusel
  const enterButton = document.getElementById('enter'); // Botón "Entrar"
  const backToIntro = document.getElementById('back-to-intro'); // Botón "Regresar"
  const medias = document.querySelectorAll('.media'); // Medios del carrusel
  const videos = document.querySelectorAll('.media video'); // Videos
  const prevButton = document.getElementById('prev'); // Botón Anterior
  const nextButton = document.getElementById('next'); // Botón Siguiente
  let current = 0; // Índice del medio actual

  // Función para pre-cargar todos los videos
  function preloadVideos() {
    return Promise.all(
      Array.from(videos).map((video) => {
        return new Promise((resolve) => {
          video.oncanplaythrough = () => resolve(); // Resuelve cuando el video está listo
          video.load(); // Fuerza la carga del video
        });
      })
    );
  }

  // Bloquea la interacción hasta que todos los videos estén cargados
  preloadVideos().then(() => {
    console.log('Todos los videos están precargados.');
    enterButton.disabled = false; // Habilita el botón de entrada
  });

  // Función para mostrar el carrusel y ocultar la introducción
  enterButton.addEventListener('click', () => {
    intro.style.display = 'none'; // Oculta la introducción
    mainContent.style.display = 'flex'; // Muestra el carrusel
    showMedia(current); // Muestra el primer medio
  });

  // Función para regresar a la introducción
  backToIntro.addEventListener('click', () => {
    mainContent.style.display = 'none'; // Oculta el carrusel
    intro.style.display = 'flex'; // Muestra la introducción
  });

  // Función para mostrar el medio actual
  function showMedia(index) {
    medias.forEach((media, i) => {
      media.classList.remove('active'); // Oculta todos los medios
      if (i === index) {
        media.classList.add('active'); // Muestra solo el medio actual
        const video = media.querySelector('video');
        if (video) {
          video.currentTime = 0; // Reinicia el video
          video.play(); // Reproduce el video
        }
      }
    });
  }

  // Botón Anterior
  prevButton.addEventListener('click', () => {
    current = (current - 1 + medias.length) % medias.length;
    showMedia(current);
  });

  // Botón Siguiente
  nextButton.addEventListener('click', () => {
    current = (current + 1) % medias.length;
    showMedia(current);
  });

  // Inicializa mostrando el primer medio
  showMedia(current);

  // Floor Plans Viewer
  const verPlantasBtn = document.getElementById('ver-plantas');
  const floorViewer = document.getElementById('floor-viewer');
  const floorImage = document.getElementById('floor-image');
  const floorBtns = document.querySelectorAll('.floor-btn');
  const closeFloorViewer = document.getElementById('close-floor-viewer');

  closeFloorViewer.addEventListener('click', () => {
    floorViewer.classList.remove('active');
    mainContent.style.display = 'flex';
  });

  // Preload images
  function preloadFloorImages() {
    const floors = ['1', '2', '3', '4', '5'];
    floors.forEach(floor => {
      const img = new Image();
      img.src = `0${floor}. ${getFloorName(floor)}.png`;
    });
  }

  verPlantasBtn.addEventListener('click', () => {
    preloadFloorImages(); // Preload first
    floorViewer.classList.add('active');
    mainContent.style.display = 'none';
  });

  backToIntro.addEventListener('click', () => {
    mainContent.style.display = 'none';
    floorViewer.classList.remove('active');
    intro.style.display = 'flex';
  });

  // Initialize floor viewer
  let currentFloor = '5'; // Starting with 5th floor
  const preloadedImages = {};

  function preloadFloorImages() {
    const floors = ['1', '2', '3', '4', '5'];
    floors.forEach(floor => {
      const img = new Image();
      img.src = `0${floor}. ${getFloorName(floor)}.png`;
      preloadedImages[floor] = img;
    });
  }

  function resetImagePosition() {
    panzoom.reset({ animate: false });
    panzoom.setOptions({ startScale: 1, startX: 0, startY: 0 });
  }

  // Preload images when floor viewer is initialized
  preloadFloorImages();

  floorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const floor = btn.dataset.floor;
      if (floor !== currentFloor) {
        // Update active state
        floorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Reset position only when changing floors
        resetImagePosition();
        
        // Change image source
        floorImage.src = `${floor.padStart(2, '0')}. ${getFloorName(floor)}.png`;
        currentFloor = floor;
      }
    });
  });

  function getFloorName(floor) {
    const names = {
      '5': 'Quinto Piso',
      '4': 'Cuarto Piso',
      '3': 'Tercer Piso',
      '2': 'Segundo Piso',
      '1': 'Primer Piso'
    };
    return names[floor];
  }

  // Initialize panzoom
  const panzoom = Panzoom(floorImage, {
    maxScale: 4,
    minScale: 1,
    contain: 'outer',
    startScale: 1,
    startX: 0,
    startY: 0,
    step: 0.3,
    animate: true
  });

  // Enable mouse wheel zoom
  const parent = floorImage.parentElement;
  parent.addEventListener('wheel', panzoom.zoomWithWheel);

  // Enable touch events
  parent.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });
  
  parent.addEventListener('gesturechange', function(e) {
    e.preventDefault();
  });

  parent.addEventListener('gestureend', function(e) {
    e.preventDefault();
  });

  // Ensure image is centered after load
  floorImage.addEventListener('load', () => {
    panzoom.reset();
  });

  // Double tap to zoom on mobile
  let lastTap = 0;
  floorImage.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      panzoom.zoomIn();
      e.preventDefault();
    }
    lastTap = currentTime;
  });

  });