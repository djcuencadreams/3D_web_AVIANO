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
});