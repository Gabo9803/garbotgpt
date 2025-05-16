// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.error('Error al registrar Service Worker:', err));
    });
}

// Translations
const translations = {
    es: {
        title: "GarBotGPT en Evolución",
        subtitle: "Estamos reconstruyendo el núcleo de nuestra IA para ofrecer una experiencia revolucionaria. ¡Prepárate para el futuro!",
        status: [
            "Recalibrando sistemas...",
            "Optimizando algoritmos...",
            "Entrenando redes neuronales...",
            "Sincronizando clústeres...",
            "Actualizando protocolos...",
            "Reforzando seguridad...",
            "Integrando módulos..."
        ],
        countdown: "Tiempo estimado: ",
        features: [
            "Procesamiento Ultrarrápido",
            "Interacciones Multimodales",
            "Precisión Avanzada",
            "Diseño Futurista"
        ],
        notifyButton: "Notificarme",
        pushNotify: "Activar Notificaciones Push",
        contact: "¿Dudas? Escríbenos a ",
        contactLink: "soporte@garbotgpt.com",
        faqTitle: "Preguntas Frecuentes",
        faq: [
            { question: "¿Qué es GarBotGPT?", answer: "GarBotGPT es una IA avanzada en desarrollo para ofrecer interacciones multimodales y precisas." },
            { question: "¿Cuándo estará disponible?", answer: "Estamos trabajando en la evolución, ¡sigue el temporizador para saber más!" }
        ],
        countdownPopupTitle: "Estado de la Evolución",
        countdownPopupMessages: [
            "¡La revolución está cerca!",
            "Cada segundo nos acerca a la IA del futuro.",
            "GarBotGPT: Preparándose para sorprenderte."
        ],
        notifyPopupTitle: "Notificaciones",
        notifyPopupMessages: {
            granted: "¡Notificaciones activadas! Te avisaremos al lanzamiento.",
            denied: "Permiso para notificaciones denegado.",
            error: "No se pudo activar las notificaciones. Intenta de nuevo.",
            unsupported: "Las notificaciones no son compatibles con este navegador."
        },
        closeButton: "Cerrar",
        musicPlayerTitle: "Reproductor de Música",
        playing: "Reproducir",
        paused: "Pausar",
        volume: "Volumen",
        shuffle: "Mezclar",
        repeatOff: "Repetir desactivado",
        repeatOne: "Repetir una pista",
        repeatAll: "Repetir todas",
        showTrackList: "Mostrar lista de pistas",
        hideTrackList: "Ocultar lista de pistas",
        welcomePopupTitle: "¡Bienvenido!",
        welcomePopupMessage: "¡Hola! Soy GarBotGPT. Enhorabuena al Barça, el nuevo campeón de liga. Te dejo una canción que te gustará."
    },
    ca: {
        title: "GarBotGPT en Evolució",
        subtitle: "Estem reconstruint el nucli de la nostra IA per oferir una experiència revolucionària. Prepara't per al futur!",
        status: [
            "Recalibrant sistemes...",
            "Optimitzant algoritmes...",
            "Entrenant xarxes neuronals...",
            "Sincronitzant clústers...",
            "Actualitzant protocols...",
            "Reforçant la seguretat...",
            "Integrant mòduls..."
        ],
        countdown: "Temps estimat: ",
        features: [
            "Processament Ultraràpid",
            "Interaccions Multimodals",
            "Precisió Avançada",
            "Disseny Futurista"
        ],
        notifyButton: "Notifica'm",
        pushNotify: "Activar Notificacions Push",
        contact: "Dubtes? Escriu-nos a ",
        contactLink: "suport@garbotgpt.com",
        faqTitle: "Preguntes Freqüents",
        faq: [
            { question: "Què és GarBotGPT?", answer: "GarBotGPT és una IA avançada en desenvolupament per oferir interaccions multimodals i precises." },
            { question: "Quan estarà disponible?", answer: "Estem treballant en l'evolució, segueix el temporitzador per saber-ne més!" }
        ],
        countdownPopupTitle: "Estat de l'Evolució",
        countdownPopupMessages: [
            "La revolució és a prop!",
            "Cada segon ens apropa a la IA del futur.",
            "GarBotGPT: Preparant-se per sorprendre't."
        ],
        notifyPopupTitle: "Notificacions",
        notifyPopupMessages: {
            granted: "Notificacions activades! T'avisarem al llançament.",
            denied: "Permís per a notificacions denegat.",
            error: "No s'ha pogut activar les notificacions. Torna a intentar-ho.",
            unsupported: "Les notificacions no són compatibles amb aquest navegador."
        },
        closeButton: "Tancar",
        musicPlayerTitle: "Reproductor de Música",
        playing: "Reproduir",
        paused: "Pausa",
        volume: "Volum",
        shuffle: "Barrejar",
        repeatOff: "Repetir desactivat",
        repeatOne: "Repetir una pista",
        repeatAll: "Repetir totes",
        showTrackList: "Mostrar llista de pistes",
        hideTrackList: "Amagar llista de pistes",
        welcomePopupTitle: "Benvingut!",
        welcomePopupMessage: "GarBotGPT: Felicitats al Barça, flamant campió de lliga! 🏆 Aquí tens una cançó que et farà vibrar!"
    }
};

// Tracks
const tracks = [
    { title: "Billie Jean - Michael Jackson", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Michael-Jackson-Billie-Jean-Official-Video.mp3" },
    { title: "You Rock My World - Michael Jackson", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Michael-Jackson-–-You-Rock-My-World-Lyrics_Sub-espanol.mp3" },
    { title: "Simon & Garfunkel - Kodachrome / Mabellene", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Simon-Garfunkel-Kodachrome-Mabellene-from-The-Concert-in-Central-Park.mp3" },
    { title: "Bohemian Rhapsody - Queen", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Queen-Bohemian-Rhapsody-Official-Video-Remastered.mp3" },
    { title: "Simon & Garfunkel - Mrs Robinson", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Simon-Garfunkel-Mrs-Robinson-Lyrics.mp3" },
    { title: "Hotel California - Eagles", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Eagles-Hotel-California-Official-Audio.mp3" },
    { title: "Imagine - John Lennon", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Imagine-John-Lennon-The-Plastic-Ono-Band-w-The-Flux-Fiddlers-Ultimate-Mix-2018-4K-REMASTER.mp3" },
    { title: "Creedence Clearwater Revival - Fortunate Son", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Creedence-Clearwater-Revival-Fortunate-Son-Official-Music-Video.mp3" },
    { title: "Dire Straits - Sultans Of Swing", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Dire-Straits-Sultans-Of-Swing-Official-Music-Video.mp3" },
    { title: "Viva La Vida - Coldplay", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Coldplay-Viva-la-Vida-Lyrics.mp3" },
    { title: "Elvis Presley - If I Can Dream", src: "https://tecnofgb.com/wp-content/uploads/2025/05/La-cancion-de-protesta-de-ELVIS-If-I-Can-Dream-Elvis-Presley-Subtitulada-Espanol-Lyrics.mp3" },
    { title: "Aretha Franklin - Think", src: "https://tecnofgb.com/wp-content/uploads/2025/05/The-Blues-Brothers-Aretha-Franklin-Think-Official-Audio.mp3" },
    { title: "Lose Yourself - Eminem", src: "https://tecnofgb.com/wp-content/uploads/2025/05/Eminem-Lose-Yourself-Lyrics.mp3" }
];

// DOM Elements
const musicPlayer = document.getElementById('musicPlayer');
const playPauseButton = document.getElementById('playPause');
const prevTrackButton = document.getElementById('prevTrack');
const nextTrackButton = document.getElementById('nextTrack');
const shuffleButton = document.getElementById('shuffleTrack');
const repeatButton = document.getElementById('repeatTrack');
const toggleTrackListButton = document.getElementById('toggleTrackList');
const trackProgress = document.getElementById('trackProgress');
const volumeControl = document.getElementById('volumeControl');
const trackTitle = document.getElementById('trackTitle');
const trackList = document.getElementById('trackList');
const currentTimeDisplay = document.getElementById('currentTime');
const totalDurationDisplay = document.getElementById('totalDuration');
const statusElement = document.querySelector('.status');
const countdownElement = document.querySelector('#countdown');
const clickSound = document.getElementById('clickSound');
const completeSound = document.getElementById('completeSound');
const popup = document.getElementById('popup');
const popupOverlay = document.getElementById('popupOverlay');
const popupTitle = document.getElementById('popupTitle');
const popupTime = document.getElementById('popupTime');
const popupMessage = document.getElementById('popupMessage');
const popupProgressContainer = document.getElementById('popupProgressContainer');
const popupProgress = document.getElementById('popupProgress');
const popupCloseButton = popup.querySelector('.close-button');
const welcomePopup = document.getElementById('welcomePopup');
const welcomePopupOverlay = document.getElementById('welcomePopupOverlay');
const welcomePopupCloseButton = welcomePopup.querySelector('.close-button');
const toggleThemeButton = document.getElementById('toggleTheme');
const toggleContrastButton = document.getElementById('toggleContrast');
const toggleLanguageButton = document.getElementById('toggleLanguage');

// State
let currentLang = localStorage.getItem('language') || 'es';
let currentTrackIndex = 0;
let isShuffling = false;
let repeatMode = 'off';
let isTrackListVisible = true;
let trackHistory = [];
let isHighContrast = localStorage.getItem('highContrast') === 'true';
let theme = localStorage.getItem('theme') || 'dark';

// Utility Functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getTranslation(lang, key) {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
        value = value[k];
    }
    return value;
}

function updateLanguage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key === 'status') return;
        if (key === 'countdown') {
            const currentText = element.textContent;
            const timePart = currentText.match(/\d{2}:\d{2}:\d{2}/) || ['Calculando...'];
            element.textContent = `${getTranslation(lang, key)}${timePart[0]}`;
        } else {
            element.textContent = getTranslation(lang, key);
        }
    });
    document.querySelector('.logo').setAttribute('alt', `GarBotGPT Logo (${lang === 'es' ? 'Español' : 'Català'})`);
    updatePlayerLabels();
    localStorage.setItem('language', lang);
}

function updatePlayerLabels() {
    const isPlaying = !musicPlayer.paused;
    playPauseButton.setAttribute('aria-label', getTranslation(currentLang, isPlaying ? 'paused' : 'playing'));
    playPauseButton.setAttribute('data-tooltip', getTranslation(currentLang, isPlaying ? 'paused' : 'playing'));
    shuffleButton.setAttribute('data-tooltip', getTranslation(currentLang, 'shuffle'));
    repeatButton.setAttribute('aria-label', getTranslation(currentLang, `repeat${repeatMode.charAt(0).toUpperCase() + repeatMode.slice(1)}`));
    repeatButton.setAttribute('data-tooltip', getTranslation(currentLang, `repeat${repeatMode.charAt(0).toUpperCase() + repeatMode.slice(1)}`));
    toggleTrackListButton.setAttribute('aria-label', getTranslation(currentLang, isTrackListVisible ? 'hideTrackList' : 'showTrackList'));
    toggleTrackListButton.setAttribute('data-tooltip', getTranslation(currentLang, isTrackListVisible ? 'hideTrackList' : 'showTrackList'));
}

// Popup Functions
function showPopup(title, message, time = null, progressPercent = null) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupTime.style.display = time ? 'block' : 'none';
    popupProgressContainer.style.display = progressPercent !== null ? 'block' : 'none';
    if (time) popupTime.textContent = time;
    if (progressPercent !== null) popupProgress.style.width = `${progressPercent}%`;

    popup.showModal();
    popup.classList.add('show');
    popupOverlay.classList.add('show');
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function hidePopup() {
    popup.classList.remove('show');
    popupOverlay.classList.remove('show');
    popup.close();
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function showWelcomePopup() {
    welcomePopup.showModal();
    welcomePopup.classList.add('show');
    welcomePopupOverlay.classList.add('show');
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    gtag('event', 'welcome_popup_shown', { event_category: 'Popup', event_label: 'Welcome Popup' });
}

function hideWelcomePopup() {
    welcomePopup.classList.remove('show');
    welcomePopupOverlay.classList.remove('show');
    welcomePopup.close();
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
    playVivaLaVida();
    gtag('event', 'welcome_popup_closed', { event_category: 'Popup', event_label: 'Welcome Popup Closed' });
}

// Music Player Functions
function loadTrack(index, crossfade = true) {
    if (index < 0 || index >= tracks.length) return;
    const previousVolume = musicPlayer.volume;
    if (crossfade && !musicPlayer.paused) {
        gsap.to(musicPlayer, {
            volume: 0,
            duration: 0.5,
            onComplete: () => {
                musicPlayer.src = tracks[index].src;
                musicPlayer.volume = 0;
                musicPlayer.play().then(() => {
                    gsap.to(musicPlayer, { volume: previousVolume, duration: 0.5 });
                });
            }
        });
    } else {
        musicPlayer.src = tracks[index].src;
        musicPlayer.play();
    }

    trackTitle.textContent = tracks[index].title;
    trackList.querySelectorAll('.track-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
        item.setAttribute('aria-selected', i === index);
    });
    currentTrackIndex = index;
    musicPlayer.play().then(() => {
        playPauseButton.querySelector('i').classList.remove('fa-play');
        playPauseButton.querySelector('i').classList.add('fa-pause');
        updatePlayerLabels();
        gtag('event', 'music_play', { event_category: 'Music', event_label: tracks[index].title });
    }).catch(err => {
        console.error('Error al reproducir pista:', err);
        showPopup('Error', 'No se pudo reproducir la pista. Verifica la URL del audio.');
    });
    updateTrackDuration();
}

function playVivaLaVida() {
    const vivaLaVidaIndex = tracks.findIndex(track => track.title === "Viva La Vida - Coldplay");
    if (vivaLaVidaIndex !== -1) {
        currentTrackIndex = vivaLaVidaIndex;
        trackHistory.push(currentTrackIndex);
        loadTrack(currentTrackIndex);
    }
}

function playPause() {
    if (musicPlayer.paused) {
        musicPlayer.play().then(() => {
            playPauseButton.querySelector('i').classList.remove('fa-play');
            playPauseButton.querySelector('i').classList.add('fa-pause');
            updatePlayerLabels();
            gtag('event', 'music_play', { event_category: 'Music', event_label: tracks[currentTrackIndex].title });
        }).catch(err => console.error('Error al reproducir pista:', err));
    } else {
        musicPlayer.pause();
        playPauseButton.querySelector('i').classList.remove('fa-pause');
        playPauseButton.querySelector('i').classList.add('fa-play');
        updatePlayerLabels();
        gtag('event', 'music_pause', { event_category: 'Music', event_label: tracks[currentTrackIndex].title });
    }
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function previousTrack() {
    let nextIndex;
    if (isShuffling && trackHistory.length > 1) {
        trackHistory.pop();
        nextIndex = trackHistory[trackHistory.length - 1];
    } else {
        nextIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    }
    loadTrack(nextIndex);
    gtag('event', 'music_change_track', { event_category: 'Music', event_label: tracks[nextIndex].title });
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function nextTrack() {
    let nextIndex;
    if (isShuffling) {
        nextIndex = Math.floor(Math.random() * tracks.length);
        while (nextIndex === currentTrackIndex && tracks.length > 1) {
            nextIndex = Math.floor(Math.random() * tracks.length);
        }
        trackHistory.push(currentTrackIndex);
    } else {
        nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    loadTrack(nextIndex);
    gtag('event', 'music_change_track', { event_category: 'Music', event_label: tracks[nextIndex].title });
    spawnParticles(window.innerWindow.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function toggleShuffle() {
    isShuffling = !isShuffling;
    shuffleButton.classList.toggle('active', isShuffling);
    trackHistory = [currentTrackIndex];
    updatePlayerLabels();
    gtag('event', 'music_shuffle', { event_category: 'Music', event_label: isShuffling ? 'Enabled' : 'Disabled' });
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function toggleRepeat() {
    if (repeatMode === 'off') {
        repeatMode = 'all';
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
    } else {
        repeatMode = 'off';
    }
    repeatButton.classList.toggle('active', repeatMode !== 'off');
    updatePlayerLabels();
    gtag('event', 'music_repeat', { event_category: 'Music', event_label: repeatMode });
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function toggleTrackList() {
    isTrackListVisible = !isTrackListVisible;
    trackList.classList.toggle('hidden', !isTrackListVisible);
    toggleTrackListButton.querySelector('i').classList.toggle('fa-list', isTrackListVisible);
    toggleTrackListButton.querySelector('i').classList.toggle('fa-list-alt', !isTrackListVisible);
    updatePlayerLabels();
    gtag('event', 'music_toggle_tracklist', { event_category: 'Music', event_label: isTrackListVisible ? 'Show' : 'Hide' });
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function updateProgress() {
    if (musicPlayer.duration) {
        const progressPercent = (musicPlayer.currentTime / musicPlayer.duration) * 100;
        trackProgress.value = progressPercent;
        currentTimeDisplay.textContent = formatTime(musicPlayer.currentTime);
    }
}

function setProgress() {
    if (musicPlayer.duration) {
        musicPlayer.currentTime = (trackProgress.value / 100) * musicPlayer.duration;
        gtag('event', 'music_seek', { event_category: 'Music', event_label: tracks[currentTrackIndex].title });
    }
}

function updateTrackDuration() {
    musicPlayer.onloadedmetadata = () => {
        totalDurationDisplay.textContent = formatTime(musicPlayer.duration);
    };
}

function setVolume() {
    musicPlayer.volume = volumeControl.value;
    gtag('event', 'music_volume', { event_category: 'Music', event_label: `Volume ${volumeControl.value}` });
}

function handleTrackEnd() {
    if (repeatMode === 'one') {
        loadTrack(currentTrackIndex);
    } else if (repeatMode === 'all' || tracks.length === 1) {
        nextTrack();
    } else {
        if (currentTrackIndex < tracks.length - 1) {
            nextTrack();
        } else {
            musicPlayer.pause();
            playPauseButton.querySelector('i').classList.remove('fa-pause');
            playPauseButton.querySelector('i').classList.add('fa-play');
            updatePlayerLabels();
        }
    }
}

// Accessibility and Theme Functions
function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    gtag('event', 'theme_toggle', { event_category: 'Accessibility', event_label: theme });
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function toggleContrast() {
    isHighContrast = !isHighContrast;
    document.documentElement.setAttribute('data-contrast', isHighContrast ? 'high' : 'normal');
    localStorage.setItem('highContrast', isHighContrast);
    gtag('event', 'contrast_toggle', { event_category: 'Accessibility', event_label: isHighContrast ? 'High' : 'Normal' });
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'ca' : 'es';
    updateLanguage(currentLang);
    updateStatus();
    gtag('event', 'language_toggle', { event_category: 'Accessibility', event_label: currentLang });
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
    clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
}

// Event Listeners
playPauseButton.addEventListener('click', playPause);
prevTrackButton.addEventListener('click', previousTrack);
nextTrackButton.addEventListener('click', nextTrack);
shuffleButton.addEventListener('click', toggleShuffle);
repeatButton.addEventListener('click', toggleRepeat);
toggleTrackListButton.addEventListener('click', toggleTrackList);
trackProgress.addEventListener('input', setProgress);
volumeControl.addEventListener('input', setVolume);
toggleThemeButton.addEventListener('click', toggleTheme);
toggleContrastButton.addEventListener('click', toggleContrast);
toggleLanguageButton.addEventListener('click', toggleLanguage);

trackList.querySelectorAll('.track-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        currentTrackIndex = index;
        trackHistory.push(currentTrackIndex);
        loadTrack(currentTrackIndex);
        gtag('event', 'music_select_track', { event_category: 'Music', event_label: tracks[currentTrackIndex].title });
        spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
        clickSound.play().catch(() => console.log('Error al reproducir sonido de clic'));
    });
});

musicPlayer.addEventListener('timeupdate', updateProgress);
musicPlayer.addEventListener('ended', handleTrackEnd);
musicPlayer.addEventListener('error', () => {
    showPopup('Error', 'No se pudo cargar la pista. Verifica la URL del audio.');
});

popupCloseButton.addEventListener('click', hidePopup);
popupOverlay.addEventListener('click', hidePopup);
welcomePopupCloseButton.addEventListener('click', hideWelcomePopup);
welcomePopupOverlay.addEventListener('click', hideWelcomePopup);

// FAQ Toggle
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const isExpanded = item.getAttribute('aria-expanded') === 'true';
        item.setAttribute('aria-expanded', !isExpanded);
        gtag('event', 'faq_toggle', { event_category: 'FAQ', event_label: item.querySelector('h3').textContent });
    });
});

// Initialize
document.documentElement.setAttribute('data-theme', theme);
document.documentElement.setAttribute('data-contrast', isHighContrast ? 'high' : 'normal');
loadTrack(currentTrackIndex);
window.addEventListener('load', () => {
    showWelcomePopup();
    updateLanguage(currentLang);
    updateStatus();
});

// Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Animations
document.querySelectorAll('[data-gsap="fade-up"]').forEach((element) => {
    gsap.fromTo(
        element,
        { opacity: 0, y: 80 },
        {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power4.out',
            delay: parseFloat(element.dataset.delay || 0),
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
            },
        }
    );
});

gsap.to('#progress', {
    width: '100%',
    duration: 5,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
    onUpdate: function () {
        const progress = this.progress();
        gsap.set('#progress', { backgroundPosition: `${progress * 400}% 0` });
    },
});

// Status Messages
let currentMessageIndex = 0;

function updateStatus() {
    gsap.to(statusElement, {
        opacity: 0,
        y: 40,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
            statusElement.textContent = translations[currentLang].status[currentMessageIndex];
            gsap.to(statusElement, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
            currentMessageIndex = (currentMessageIndex + 1) % translations[currentLang].status.length;
        },
    });
}

// Countdown Timer
let endTime;
const totalDuration = 20 * 60 * 1000;

if (localStorage.getItem('countdownEndTime')) {
    endTime = new Date(parseInt(localStorage.getItem('countdownEndTime')));
} else {
    endTime = new Date(Date.now() + totalDuration);
    localStorage.setItem('countdownEndTime', endTime.getTime());
}

function updateCountdown() {
    const now = new Date();
    const timeLeft = endTime - now;
    if (timeLeft <= 0) {
        countdownElement.textContent = currentLang === 'es' ? '¡Evolución Completada!' : 'Evolució Completada!';
        gsap.to(countdownElement, {
            scale: 1.15,
            duration: 0.4,
            yoyo: true,
            repeat: 5,
            onStart: () => {
                completeSound.play().catch(() => console.log('Error al reproducir sonido de completado'));
                gtag('event', 'timer_completed', { event_category: 'Timer', event_label: 'Evolution Completed' });
            },
        });
        localStorage.removeItem('countdownEndTime');
        return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    countdownElement.textContent = `${getTranslation(currentLang, 'countdown')}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

countdownElement.addEventListener('click', () => {
    const now = new Date();
    const timeLeft = endTime - now;
    if (timeLeft <= 0) return;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const messages = getTranslation(currentLang, 'countdownPopupMessages');
    const message = messages[Math.floor(Math.random() * messages.length)];
    const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

    showPopup(
        getTranslation(currentLang, 'countdownPopupTitle'),
        message,
        timeStr,
        progressPercent
    );
    gtag('event', 'timer_clicked', { event_category: 'Timer', event_label: 'Time Remaining' });
});

document.querySelector('.notify-button').addEventListener('click', async () => {
    const result = await requestPushPermission('notify');
    const messages = getTranslation(currentLang, 'notifyPopupMessages');
    showPopup(
        getTranslation(currentLang, 'notifyPopupTitle'),
        messages[result]
    );
    gtag('event', 'notify_clicked', { event_category: 'Button', event_label: 'Notify Me' });
});

document.querySelector('.push-notify').addEventListener('click', async () => {
    const result = await requestPushPermission('push');
    const messages = getTranslation(currentLang, 'notifyPopupMessages');
    showPopup(
        getTranslation(currentLang, 'notifyPopupTitle'),
        messages[result]
    );
    gtag('event', 'push_clicked', { event_category: 'Button', event_label: 'Push Notify' });
});

updateCountdown();
setInterval(updateCountdown, 1000);

// Particles
function spawnParticles(x, y) {
    const particleDiv = document.createElement('div');
    particleDiv.id = 'click-particles-' + Date.now();
    particleDiv.style.position = 'absolute';
    particleDiv.style.left = `${x}px`;
    particleDiv.style.top = `${y}px`;
    particleDiv.style.pointerEvents = 'none';
    particleDiv.style.zIndex = '1000';
    document.body.appendChild(particleDiv);

    particlesJS(particleDiv.id, {
        particles: {
            number: { value: 30, density: { enable: true, value_area: 1000 } },
            color: { value: ['#00f7ff', '#ff00ff', '#00ff88'] },
            shape: { type: 'circle' },
            opacity: { value: 0.9, random: true },
            size: { value: 6, random: true },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 8,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: { enable: false }
            }
        },
        interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false } } },
        retina_detect: true
    });

    setTimeout(() => particleDiv.remove(), 1200);
}

async function requestPushPermission(type) {
    if (!('Notification' in window)) {
        gtag('event', `${type}_permission_unsupported`, { event_category: 'Notifications', event_label: 'Push Unsupported' });
        return 'unsupported';
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            gtag('event', `${type}_permission_granted`, { event_category: 'Notifications', event_label: 'Push Enabled' });
            return 'granted';
        } else {
            gtag('event', `${type}_permission_denied`, { event_category: 'Notifications', event_label: 'Push Denied' });
            return 'denied';
        }
    } catch (error) {
        console.error('Error al solicitar permiso de notificaciones:', error);
        gtag('event', `${type}_permission_error`, { event_category: 'Notifications', event_label: 'Push Error' });
        return 'error';
    }
}

// Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('scene').appendChild(renderer.domElement);

const particles = new THREE.Group();
const particleCount = 500;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

    const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.8);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 3 + 1;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
});

const particleSystem = new THREE.Points(geometry, material);
particles.add(particleSystem);
scene.add(particles);
camera.position.z = 50;

function animateParticles() {
    const time = Date.now() * 0.001;
    particles.rotation.y = time * 0.1;

    const positions = particleSystem.geometry.attributes.position.array;
    const sizes = particleSystem.geometry.attributes.size.array;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Add gentle oscillation to y-position
        positions[i3 + 1] += Math.sin(time + i) * 0.02;
        // Add subtle pulsing to particle sizes
        sizes[i] = Math.abs(Math.sin(time + i * 0.1)) * 3 + 1;
        // Wrap particles around if they move too far
        if (positions[i3 + 1] > 60) positions[i3 + 1] -= 120;
        if (positions[i3 + 1] < -60) positions[i3 + 1] += 120;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.size.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animateParticles);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Start animation
animateParticles();

// Periodic status update
setInterval(updateStatus, 5000);