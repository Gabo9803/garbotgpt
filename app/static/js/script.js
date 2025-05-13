const translations = {
    es: {
        welcome: "Bienvenido, ",
        title: "Chatear con GarBotGPT",
        placeholder: "Escribe tu mensaje...",
        send: "Enviar",
        voice: "Entrada por voz",
        copy: "Copiar",
        copied: "¡Copiado!",
        responding: "Respondiendo",
        clear_history: "Borrar Historial",
        export_history: "Exportar Historial",
        export_settings: "Exportar Configuración",
        regenerate: "Regenerar Respuesta",
        logout: "Cerrar Sesión",
        settings: "Configuración",
        open_settings: "Abrir Configuración",
        info: "Información",
        open_info: "Ver Información",
        actions: "Acciones",
        language: "Idioma",
        model: "Modelo de IA",
        temperature: "Temperatura",
        max_tokens: "Máximo de Tokens",
        theme_color: "Color del Tema",
        save: "Guardar",
        send_on_enter: "Enviar con Enter",
        suggestions: "¡Empieza a chatear! Aquí tienes algunas sugerencias:",
        suggestion1: "Concepto de Programación",
        suggestion2: "Inteligencia Artificial",
        suggestion3: "Escribir Poema",
        suggestion4: "Ayuda Matemática",
        suggestion5: "Historia de Roma",
        toggle_fullscreen: "Alternar pantalla completa",
        exit_fullscreen: "Salir de pantalla completa",
        open_menu: "Menú"
    },
    en: {
        welcome: "Welcome, ",
        title: "Chat with GarBotGPT",
        placeholder: "Type your message...",
        send: "Send",
        voice: "Voice input",
        copy: "Copy",
        copied: "Copied!",
        responding: "Responding",
        clear_history: "Clear History",
        export_history: "Export History",
        export_settings: "Export Settings",
        regenerate: "Regenerate Response",
        logout: "Logout",
        settings: "Settings",
        open_settings: "Open Settings",
        info: "Information",
        open_info: "View Information",
        actions: "Actions",
        language: "Language",
        model: "AI Model",
        temperature: "Temperature",
        max_tokens: "Max Tokens",
        theme_color: "Theme Color",
        save: "Save",
        send_on_enter: "Send on Enter",
        suggestions: "Start chatting! Here are some suggestions:",
        suggestion1: "Programming Concept",
        suggestion2: "Artificial Intelligence",
        suggestion3: "Write a Poem",
        suggestion4: "Math Help",
        suggestion5: "History of Rome",
        toggle_fullscreen: "Toggle Fullscreen",
        exit_fullscreen: "Exit Fullscreen",
        open_menu: "Menu"
    },
    ca: {
        welcome: "Benvingut, ",
        title: "Xat amb GarBotGPT",
        placeholder: "Escriu el teu missatge...",
        send: "Enviar",
        voice: "Entrada per veu",
        copy: "Copiar",
        copied: "Copiat!",
        responding: "Responent",
        clear_history: "Esborrar Historial",
        export_history: "Exportar Historial",
        export_settings: "Exportar Configuració",
        regenerate: "Regenerar Resposta",
        logout: "Tancar Sessió",
        settings: "Configuració",
        open_settings: "Obrir Configuració",
        info: "Informació",
        open_info: "Veure Informació",
        actions: "Accions",
        language: "Idioma",
        model: "Model d'IA",
        temperature: "Temperatura",
        max_tokens: "Màxim de Tokens",
        theme_color: "Color del Tema",
        save: "Desar",
        send_on_enter: "Enviar amb Enter",
        suggestions: "Comença a xatejar! Aquí tens algunes suggerències:",
        suggestion1: "Concepte de Programació",
        suggestion2: "Intel·ligència Artificial",
        suggestion3: "Escriure un Poema",
        suggestion4: "Ajuda Matemàtica",
        suggestion5: "Història de Roma",
        toggle_fullscreen: "Alternar pantalla completa",
        exit_fullscreen: "Sortir de pantalla completa",
        open_menu: "Menú"
    }
};

function generateSuggestions(input) {
    const suggestions = [];
    input = input.toLowerCase().trim();
    if (!input) return suggestions;

    const keywords = {
        'python|programació|programacion|codi|coding|program': [
            { text: 'Explica un bucle for en Python', icon: 'bi-code-slash', score: 0.9 },
            { text: 'Escriu un script en Python per ordenar una llista', icon: 'bi-code', score: 0.8 },
            { text: 'Què és una classe en Python?', icon: 'bi-code-slash', score: 0.7 },
            { text: 'Com usar funcions lambda en Python', icon: 'bi-code', score: 0.6 }
        ],
        'ia|intel·ligència artificial|inteligencia artificial|machine learning|ai': [
            { text: 'Explica què és la intel·ligència artificial', icon: 'bi-robot', score: 0.9 },
            { text: 'Aplicacions de la IA en medicina', icon: 'bi-heart-pulse', score: 0.8 },
            { text: 'Com funciona una xarxa neuronal?', icon: 'bi-diagram-3', score: 0.7 },
            { text: 'Explica l’aprenentatge profund', icon: 'bi-cpu', score: 0.6 }
        ],
        'poema|poesia|poetry': [
            { text: 'Escriu un poema curt sobre l’amor', icon: 'bi-pen', score: 0.9 },
            { text: 'Crea un poema sobre la natura', icon: 'bi-tree', score: 0.8 },
            { text: 'Escriu un haiku sobre la tardor', icon: 'bi-leaf', score: 0.7 },
            { text: 'Com escriure poesia lírica', icon: 'bi-book', score: 0.6 }
        ],
        'matemàtiques|matematicas|equació|ecuacion|càlcul|calculo|math': [
            { text: 'Ajuda’m amb una equació quadràtica', icon: 'bi-calculator', score: 0.9 },
            { text: 'Explica el teorema de Pitàgores', icon: 'bi-rulers', score: 0.8 },
            { text: 'Resol una integral definida', icon: 'bi-graph-up', score: 0.7 },
            { text: 'Explica l’àlgebra lineal', icon: 'bi-grid-3x3', score: 0.6 }
        ],
        'ciència|ciencia|science|física|fisica|química|quimica|physics|chemistry': [
            { text: 'Explica la teoria de la relativitat', icon: 'bi-speedometer', score: 0.9 },
            { text: 'Com funciona la fotosíntesi', icon: 'bi-flower1', score: 0.8 },
            { text: 'Què és la mecànica quàntica?', icon: 'bi-gear', score: 0.7 },
            { text: 'Explica la taula periòdica', icon: 'bi-table', score: 0.6 }
        ],
        'història|historia|history': [
            { text: 'Explica la Revolució Francesa', icon: 'bi-book', score: 0.9 },
            { text: 'Explica la Segona Guerra Mundial', icon: 'bi-flag', score: 0.8 },
            { text: 'Qui va ser Cleòpatra?', icon: 'bi-person', score: 0.7 },
            { text: 'Explica la independència d’Amèrica Llatina', icon: 'bi-globe', score: 0.6 }
        ],
        'creativitat|creatividad|art|disseny|diseño|design': [
            { text: 'Escriu una història curta de ciència-ficció', icon: 'bi-book-half', score: 0.9 },
            { text: 'Com dissenyar un logotip creatiu', icon: 'bi-brush', score: 0.8 },
            { text: 'Crea un guió per a un curtmetratge', icon: 'bi-film', score: 0.7 },
            { text: 'Explica tècniques de pintura a l’oli', icon: 'bi-paint-bucket', score: 0.6 }
        ],
        'tecnologia|tecnología|technology|tech': [
            { text: 'Explica com funciona blockchain', icon: 'bi-link', score: 0.9 },
            { text: 'Explica la ciberseguretat', icon: 'bi-shield-lock', score: 0.8 },
            { text: 'Què és la computació al núvol?', icon: 'bi-cloud', score: 0.7 },
            { text: 'Explica la tecnologia 5G', icon: 'bi-wifi', score: 0.6 }
        ],
        'cultura|culture': [
            { text: 'Explica la cultura japonesa', icon: 'bi-globe-asia-australia', score: 0.9 },
            { text: 'Explica el significat del Dia de Morts', icon: 'bi-flower2', score: 0.8 },
            { text: 'Explica la mitologia grega', icon: 'bi-book', score: 0.7 },
            { text: 'Què és el flamenc?', icon: 'bi-music-note', score: 0.6 }
        ],
        'educació|educacion|education': [
            { text: 'Com millorar les meves habilitats d’estudi', icon: 'bi-book', score: 0.9 },
            { text: 'Explica la importància de l’educació STEM', icon: 'bi-gear', score: 0.8 },
            { text: 'Què és l’aprenentatge actiu?', icon: 'bi-lightbulb', score: 0.7 },
            { text: 'Explica la història de les universitats', icon: 'bi-mortarboard', score: 0.6 }
        ],
        'entreteniment|entretenimiento|entertainment': [
            { text: 'Recomana una pel·lícula de ciència-ficció', icon: 'bi-film', score: 0.9 },
            { text: 'Explica la història dels videojocs', icon: 'bi-joystick', score: 0.8 },
            { text: 'Qui és el teu personatge favorit de Marvel?', icon: 'bi-star', score: 0.7 },
            { text: 'Explica els premis Oscar', icon: 'bi-award', score: 0.6 }
        ]
    };

    const matchedSuggestions = [];
    Object.keys(keywords).forEach(pattern => {
        if (new RegExp(pattern, 'i').test(input)) {
            matchedSuggestions.push(...keywords[pattern].map(s => ({ ...s, categoryScore: s.score })));
        }
    });

    if (matchedSuggestions.length > 0) {
        matchedSuggestions.sort((a, b) => {
            const aScore = a.categoryScore + (input.includes(a.text.toLowerCase()) ? 0.2 : 0);
            const bScore = b.categoryScore + (input.includes(b.text.toLowerCase()) ? 0.2 : 0);
            return bScore - aScore;
        });
        suggestions.push(...matchedSuggestions.map(s => ({ text: s.text, icon: s.icon })));
    }

    if (suggestions.length < 3) {
        suggestions.push(
            { text: `Explica ${input}`, icon: 'bi-info-circle', score: 0.5 },
            { text: `Dóna’m més informació sobre ${input}`, icon: 'bi-info-circle', score: 0.4 },
            { text: `Què és ${input}?`, icon: 'bi-question-circle', score: 0.3 },
            { text: `Explica’m algo interessant sobre ${input}`, icon: 'bi-lightbulb', score: 0.2 }
        );
    }

    return [...new Set(suggestions.map(s => JSON.stringify(s)))].map(s => JSON.parse(s)).slice(0, 6);
}

// Función debounce para optimizar eventos de entrada
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function updateLanguage(lang) {
    try {
        const t = translations[lang] || translations['ca']; // Fallback al catalán
        const elements = [
            { selector: 'a.navbar-brand', text: `GarBotGPT v1.0` },
            { selector: '.chat-header h2', text: t.title },
            { selector: '#message', attr: 'placeholder', text: t.placeholder },
            { selector: '.chat-footer button[onclick="sendMessage()"]', text: t.send },
            { selector: '#voice-btn', attr: 'data-bs-original-title', text: t.voice },
            { selector: '#responding-indicator .message-content', html: `${t.responding}<span class="typing-dots"></span>` },
            { selector: '#clear-history', text: t.clear_history, attr: 'data-bs-original-title', attrText: t.clear_history },
            { selector: 'a[href*="/export_history"]', text: t.export_history, attr: 'data-bs-original-title', attrText: t.export_history },
            { selector: 'a[href*="/export_settings"]', text: t.export_settings, attr: 'data-bs-original-title', attrText: t.export_settings },
            { selector: '#regenerate-response', text: t.regenerate, attr: 'data-bs-original-title', attrText: t.regenerate },
            { selector: 'a[href*="/logout"]', text: t.logout, attr: 'data-bs-original-title', attrText: t.logout },
            { selector: '#settingsHeading .accordion-button', html: `<i class="bi bi-gear-fill me-2"></i>${t.settings}` },
            { selector: '#settingsCollapse button', text: t.open_settings, attr: 'data-bs-original-title', attrText: t.open_settings },
            { selector: '#infoHeading .accordion-button', html: `<i class="bi bi-info-circle-fill me-2"></i>${t.info}` },
            { selector: '#infoCollapse button', text: t.open_info, attr: 'data-bs-original-title', attrText: t.open_info },
            { selector: '#actionsHeading .accordion-button', html: `<i class="bi bi-tools me-2"></i>${t.actions}` },
            { selector: '#languageHeading .accordion-button', html: `<i class="bi bi-translate me-2"></i>${t.language}` },
            { selector: '#sidebarModalLabel', html: `<i class="bi bi-list me-2"></i>${t.open_menu}` },
            { selector: '#sidebar-toggle', html: `<i class="bi bi-list me-1"></i><span>${t.open_menu}</span>`, attr: 'data-bs-original-title', attrText: t.open_menu },
            { selector: '#settingsModalLabel', html: `<i class="bi bi-gear-fill me-2"></i>${t.settings}` },
            { selector: '#settingsModal .form-label[for="model"]', html: `<i class="bi bi-robot me-2"></i>${t.model}` },
            { selector: '#settingsModal .form-label[for="temperature"]', html: `<i class="bi bi-thermometer-half me-2"></i>${t.temperature}` },
            { selector: '#settingsModal .form-label[for="max_tokens"]', html: `<i class="bi bi-text-paragraph me-2"></i>${t.max_tokens}` },
            { selector: '#settingsModal .form-label[for="theme_color"]', html: `<i class="bi bi-palette-fill me-2"></i>${t.theme_color}` },
            { selector: '#settingsModal button[type="submit"]', text: t.save },
            { selector: '#infoModalLabel', html: `<i class="bi bi-info-circle-fill me-2"></i>${t.info}` },
            { selector: '#send-on-enter + label', text: t.send_on_enter },
            { selector: '#fullscreen-toggle', attr: 'data-bs-original-title', text: t.toggle_fullscreen }
        ];

        elements.forEach(({ selector, text, html, attr, attrText }) => {
            const element = document.querySelector(selector);
            if (element) {
                if (text) element.textContent = text;
                if (html) element.innerHTML = html;
                if (attr && attrText) element.setAttribute(attr, attrText);
            }
        });

        // Actualizar botones de copiar
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.textContent = t.copy;
            btn.setAttribute('data-bs-original-title', t.copy);
        });

        // Actualizar bienvenida de usuario
        if (document.body.dataset.authenticated === 'true') {
            const username = document.querySelector('.nav-link.user-welcome')?.textContent.split(', ')[1] || '';
            const welcomeElement = document.querySelector('.nav-link.user-welcome');
            if (welcomeElement) {
                welcomeElement.innerHTML = `<i class="bi bi-person-circle me-2"></i>${t.welcome}${username}`;
            }
        }

        // Actualizar sugerencias
        const suggestionsP = document.querySelector('.suggestions p');
        if (suggestionsP) {
            suggestionsP.textContent = t.suggestions;
            const suggestionButtons = document.querySelectorAll('.suggestion-btn');
            if (suggestionButtons.length >= 5) {
                suggestionButtons[0].innerHTML = `<i class="bi bi-code-slash me-1"></i>${t.suggestion1}`;
                suggestionButtons[1].innerHTML = `<i class="bi bi-robot me-1"></i>${t.suggestion2}`;
                suggestionButtons[2].innerHTML = `<i class="bi bi-pen me-1"></i>${t.suggestion3}`;
                suggestionButtons[3].innerHTML = `<i class="bi bi-calculator me-1"></i>${t.suggestion4}`;
                suggestionButtons[4].innerHTML = `<i class="bi bi-book me-1"></i>${t.suggestion5}`;
            }
        }

        // Re-inicializar tooltips
        if (typeof bootstrap !== 'undefined') {
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                bootstrap.Tooltip.getOrCreateInstance(el);
            });
        }
    } catch (error) {
        console.error('Error actualitzant idioma:', error);
    }
}

async function sendMessage(regenerate = false, message = null) {
    try {
        const messageInput = document.getElementById('message');
        const msg = message || (regenerate ? '' : messageInput.value.trim());
        const chatMessages = document.getElementById('chat-messages');
        const respondingIndicator = document.getElementById('responding-indicator');
        const suggestionsDropdown = document.getElementById('suggestions-dropdown');

        if (!msg && !regenerate) return;

        if (!regenerate && msg) {
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message animate__animated animate__fadeIn';
            userMessage.innerHTML = `<strong>Tú:</strong><div class="message-content">${msg}</div>`;
            chatMessages.appendChild(userMessage);
            messageInput.value = '';
            const suggestions = document.querySelector('.suggestions');
            if (suggestions) suggestions.remove();
            if (suggestionsDropdown) suggestionsDropdown.classList.add('d-none');
        }

        respondingIndicator.classList.remove('d-none');

        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, regenerate })
        });
        const data = await response.json();

        respondingIndicator.classList.add('d-none');

        if (data.error) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'message ai-message text-danger animate__animated animate__fadeIn';
            errorMessage.innerHTML = `<strong>Error:</strong><div class="message-content">${data.error}</div>`;
            chatMessages.appendChild(errorMessage);
        } else {
            const aiMessage = document.createElement('div');
            aiMessage.className = 'message ai-message animate__animated animate__fadeIn';
            const markdownContent = marked.parse(data.response);
            aiMessage.innerHTML = `
                <strong>GarBotGPT:</strong>
                <div class="message-content markdown-body"></div>
                <button class="copy-btn btn btn-sm btn-outline-secondary mt-1" data-bs-toggle="tooltip" title="${translations[document.documentElement.lang].copy}" data-text="${data.response}">${translations[document.documentElement.lang].copy}</button>
            `;
            chatMessages.appendChild(aiMessage);

            const contentDiv = aiMessage.querySelector('.message-content');
            const typingPhrases = [
                translations[document.documentElement.lang].responding + '...',
                translations[document.documentElement.lang].responding === 'Responent' ? 'Processant el teu missatge...' : 'Procesando tu mensaje...',
                translations[document.documentElement.lang].responding === 'Responent' ? 'Generant resposta...' : 'Generando respuesta...',
                translations[document.documentElement.lang].responding === 'Responent' ? 'Un moment, estic pensant...' : 'Un momento, estoy pensando...'
            ];
            let phraseIndex = 0;
            const typingInterval = setInterval(() => {
                contentDiv.textContent = typingPhrases[phraseIndex];
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            }, 1000);

            setTimeout(() => {
                clearInterval(typingInterval);
                let index = 0;
                const text = data.response;
                const finalInterval = setInterval(() => {
                    if (index < text.length) {
                        contentDiv.textContent = text.slice(0, index + 1);
                        index++;
                    } else {
                        clearInterval(finalInterval);
                        contentDiv.innerHTML = markdownContent;
                        if (typeof hljs !== 'undefined') {
                            hljs.highlightAll();
                        }
                        if (typeof bootstrap !== 'undefined') {
                            bootstrap.Tooltip.getOrCreateInstance(aiMessage.querySelector('.copy-btn'));
                        }
                    }
                }, 20);
            }, 2000);
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error enviant missatge:', error);
        const respondingIndicator = document.getElementById('responding-indicator');
        if (respondingIndicator) respondingIndicator.classList.add('d-none');
        const chatMessages = document.getElementById('chat-messages');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message ai-message text-danger animate__animated animate__fadeIn';
        errorMessage.innerHTML = `<strong>Error:</strong><div class="message-content">${translations[document.documentElement.lang].responding === 'Responent' ? 'No s’ha pogut connectar al servidor' : 'No se pudo conectar al servidor'}</div>`;
        chatMessages.appendChild(errorMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicialitzar tema
        const html = document.getElementById('html-root');
        const savedTheme = localStorage.getItem('theme') || html.getAttribute('data-theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        // Inicialitzar idioma
        const lang = document.documentElement.lang || 'ca';
        updateLanguage(lang);

        // Inicialitzar tooltips
        if (typeof bootstrap !== 'undefined') {
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                bootstrap.Tooltip.getOrCreateInstance(el);
            });
        }

        // Inicialitzar Highlight.js
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }

        // Configurar sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('sidebarModal'));
                modal.show();
            });
        }

        // Configurar entrada de suggeriments
        const messageInput = document.getElementById('message');
        const suggestionsDropdown = document.getElementById('suggestions-dropdown');
        if (messageInput && suggestionsDropdown) {
            const debouncedGenerateSuggestions = debounce(() => {
                const input = messageInput.value;
                const suggestions = generateSuggestions(input);
                suggestionsDropdown.innerHTML = '';
                if (suggestions.length > 0) {
                    suggestions.forEach(suggestion => {
                        const item = document.createElement('div');
                        item.className = 'suggestion-item animate__animated animate__fadeIn';
                        item.innerHTML = `<i class="${suggestion.icon} me-2"></i>${suggestion.text}`;
                        item.addEventListener('click', () => {
                            messageInput.value = suggestion.text;
                            suggestionsDropdown.classList.add('d-none');
                            sendMessage();
                        });
                        suggestionsDropdown.appendChild(item);
                    });
                    suggestionsDropdown.classList.remove('d-none');
                } else {
                    suggestionsDropdown.classList.add('d-none');
                }
            }, 300);

            messageInput.addEventListener('input', debouncedGenerateSuggestions);
            messageInput.addEventListener('focus', debouncedGenerateSuggestions);
            messageInput.addEventListener('blur', () => {
                setTimeout(() => suggestionsDropdown.classList.add('d-none'), 200);
            });
        }
    } catch (error) {
        console.error('Error en l’inicialització del DOM:', error);
    }
});

// Ocultar preloader
window.addEventListener('load', () => {
    try {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.transition = 'opacity 0.3s ease';
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }
    } catch (error) {
        console.error('Error amagant preloader:', error);
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
    }
});

// Timeout de seguretat per al preloader
setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
        preloader.style.display = 'none';
        console.warn('Preloader amagat per timeout');
    }
}, 5000);

// Manejar cambio de tema
document.getElementById('theme-toggle')?.addEventListener('click', async () => {
    try {
        const html = document.getElementById('html-root');
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        if (document.body.dataset.authenticated === 'true') {
            await fetch('/update_theme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme })
            });
        }
    } catch (error) {
        console.error('Error actualitzant tema:', error);
    }
});

// Manejar tecla Enter
document.getElementById('message')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('send-on-enter')?.checked) {
        sendMessage();
    }
});

// Manejar botones de copiar
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
        try {
            const text = e.target.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                e.target.textContent = translations[document.documentElement.lang].copied;
                setTimeout(() => {
                    e.target.textContent = translations[document.documentElement.lang].copy;
                    if (typeof bootstrap !== 'undefined') {
                        bootstrap.Tooltip.getOrCreateInstance(e.target).setContent({ '.tooltip-inner': translations[document.documentElement.lang].copy });
                    }
                }, 2000);
            });
        } catch (error) {
            console.error('Error copiant text:', error);
        }
    }
});

// Manejar limpiar historial
document.getElementById('clear-history')?.addEventListener('click', async () => {
    try {
        if (confirm(translations[document.documentElement.lang].responding === 'Responent' ? 'Estàs segur que vols esborrar l’historial de xat?' : '¿Estás seguro de que quieres borrar tu historial de chat?')) {
            const response = await fetch('/clear_history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                const chatMessages = document.getElementById('chat-messages');
                chatMessages.innerHTML = `
                    <div class="suggestions glass text-center animate__animated animate__fadeIn">
                        <p>${translations[document.documentElement.lang].suggestions}</p>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Explica un concepte de programació"><i class="bi bi-code-slash me-1"></i>${translations[document.documentElement.lang].suggestion1}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Explica’m sobre intel·ligència artificial"><i class="bi bi-robot me-1"></i>${translations[document.documentElement.lang].suggestion2}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Escriu un poema curt"><i class="bi bi-pen me-1"></i>${translations[document.documentElement.lang].suggestion3}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Ajuda’m amb una equació matemàtica"><i class="bi bi-calculator me-1"></i>${translations[document.documentElement.lang].suggestion4}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Explica’m sobre la història de Roma"><i class="bi bi-book me-1"></i>${translations[document.documentElement.lang].suggestion5}</button>
                    </div>
                    <div id="responding-indicator" class="message ai-message animate__animated animate__fadeIn glass d-none">
                        <strong>GarBotGPT:</strong>
                        <div class="message-content typing-effect">${translations[document.documentElement.lang].responding}<span class="typing-dots"></span></div>
                    </div>
                `;
            } else {
                alert(`${translations[document.documentElement.lang].responding === 'Responent' ? 'Error esborrant historial:' : 'Error al borrar historial:'} ${data.error}`);
            }
        }
    } catch (error) {
        alert(`${translations[document.documentElement.lang].responding === 'Responent' ? 'Error esborrant historial: No s’ha pogut connectar al servidor' : 'Error al borrar historial: No se pudo conectar al servidor'}`);
    }
});

// Manejar regenerar respuesta
document.getElementById('regenerate-response')?.addEventListener('click', () => {
    sendMessage(true);
});

// Manejar formulario de configuraciones
document.getElementById('chat-settings-form')?.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const formData = new FormData(e.target);
        const settings = {
            model: formData.get('model'),
            temperature: parseFloat(formData.get('temperature')),
            max_tokens: parseInt(formData.get('max_tokens')),
            theme_color: formData.get('theme_color')
        };

        const response = await fetch('/update_chat_settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        const data = await response.json();
        if (data.success) {
            alert(translations[document.documentElement.lang].responding === 'Responent' ? 'Configuració actualitzada correctament' : 'Configuración actualizada correctamente');
            bootstrap.Modal.getInstance(document.getElementById('settingsModal')).hide();
            document.documentElement.style.setProperty('--message-user-bg', settings.theme_color);
        } else {
            alert(`${translations[document.documentElement.lang].responding === 'Responent' ? 'Error actualitzant configuració:' : 'Error al actualizar configuración:'} ${data.error}`);
        }
    } catch (error) {
        alert(translations[document.documentElement.lang].responding === 'Responent' ? 'Error actualitzant configuració: No s’ha pogut connectar al servidor' : 'Error al actualizar configuración: No se pudo conectar al servidor');
    }
});

// Manejar cambio de idioma
document.getElementById('language-select')?.addEventListener('change', async (e) => {
    try {
        const newLang = e.target.value;
        const response = await fetch('/update_language', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: newLang })
        });
        const data = await response.json();
        if (data.success) {
            document.documentElement.lang = newLang;
            updateLanguage(newLang);
            alert(translations[document.documentElement.lang].responding === 'Responent' ? 'Idioma actualitzat correctament' : 'Idioma actualizado correctamente');
        } else {
            alert(`${translations[document.documentElement.lang].responding === 'Responent' ? 'Error actualitzant idioma:' : 'Error al actualizar idioma:'} ${data.error}`);
        }
    } catch (error) {
        alert(translations[document.documentElement.lang].responding === 'Responent' ? 'Error actualitzant idioma: No s’ha pogut connectar al servidor' : 'Error al actualizar idioma: No se pudo conectar al servidor');
    }
});

// Manejar entrada por voz
const voiceBtn = document.getElementById('voice-btn');
if (voiceBtn && 'webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = document.documentElement.lang === 'ca' ? 'ca-ES' : document.documentElement.lang === 'es' ? 'es-ES' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    voiceBtn.addEventListener('click', () => {
        try {
            recognition.start();
            voiceBtn.classList.add('recording');
        } catch (error) {
            console.error('Error iniciant reconeixement de veu:', error);
        }
    });

    recognition.onresult = (event) => {
        try {
            const transcript = event.results[0][0].transcript;
            document.getElementById('message').value = transcript;
            sendMessage();
            voiceBtn.classList.remove('recording');
        } catch (error) {
            console.error('Error processant veu:', error);
        }
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        console.error('Error en el reconeixement de veu:', event.error);
        voiceBtn.classList.remove('recording');
        alert(`${translations[document.documentElement.lang].responding === 'Responent' ? 'Error en l’entrada per veu:' : 'Error en la entrada por voz:'} ${event.error}`);
    };
} else if (voiceBtn) {
    voiceBtn.style.display = 'none';
}

// Manejar botones de sugerencias
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
        try {
            const message = e.target.getAttribute('data-message');
            sendMessage(false, message);
        } catch (error) {
            console.error('Error enviant suggeriment:', error);
        }
    }
});

// Manejar modo pantalla completa
document.getElementById('fullscreen-toggle')?.addEventListener('click', () => {
    try {
        const chatContainer = document.getElementById('chat-container-main');
        const isFullscreen = chatContainer.classList.contains('fullscreen');
        chatContainer.classList.toggle('fullscreen');
        const icon = document.querySelector('#fullscreen-toggle i');
        if (icon) {
            icon.className = isFullscreen ? 'bi bi-arrows-fullscreen' : 'bi bi-fullscreen-exit';
        }
        if (typeof bootstrap !== 'undefined') {
            bootstrap.Tooltip.getOrCreateInstance(document.getElementById('fullscreen-toggle')).setContent({
                '.tooltip-inner': isFullscreen ? translations[document.documentElement.lang].toggle_fullscreen : translations[document.documentElement.lang].exit_fullscreen
            });
        }
    } catch (error) {
        console.error('Error alternant pantalla completa:', error);
    }
    
});

hljs.highlightAll();
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Theme and contrast toggle
    const html = document.getElementById('html-root');
    const themeToggle = document.getElementById('theme-toggle');
    const contrastToggle = document.getElementById('contrast-toggle');
    themeToggle.addEventListener('click', () => {
        html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    });
    contrastToggle.addEventListener('click', () => {
        html.dataset.contrast = html.dataset.contrast === 'high' ? 'normal' : 'high';
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Chat demo animation
    const messages = document.querySelectorAll('#chat-demo-messages .message');
    messages.forEach((msg, index) => {
        gsap.fromTo(msg, { opacity: 0, y: 30 }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.4,
            ease: 'power2.out',
            onComplete: () => msg.classList.add('show')
        });
    });

    // Stats counter
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach(stat => {
        const target = parseFloat(stat.dataset.count);
        let current = 0;
        const increment = target / 100;
        const updateCount = () => {
            current += increment;
            stat.textContent = Math.round(current).toLocaleString();
            if (current < target) requestAnimationFrame(updateCount);
            else stat.textContent = target.toLocaleString();
        };
        updateCount();
    });

    // Scroll animations with GSAP
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('section').forEach(section => {
        gsap.from(section.children, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        gsap.fromTo(item, { opacity: 0, x: item.classList.contains('left') ? -30 : 30 }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                onEnter: () => item.classList.add('show')
            }
        });
    });

    // Placeholder for WebGL background
    const canvas = document.getElementById('webgl-bg');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});