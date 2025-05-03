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
        title: "Xatejar amb GarBotGPT",
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
        'python|programación|codigo|coding|program': [
            { text: 'Explica un bucle for en Python', icon: 'bi-code-slash', score: 0.9 },
            { text: 'Escribe un script en Python para ordenar una lista', icon: 'bi-code', score: 0.8 },
            { text: '¿Qué es una clase en Python?', icon: 'bi-code-slash', score: 0.7 },
            { text: 'Dime cómo usar funciones lambda en Python', icon: 'bi-code', score: 0.6 }
        ],
        'ia|inteligencia artificial|machine learning|ai': [
            { text: 'Explica qué es la inteligencia artificial', icon: 'bi-robot', score: 0.9 },
            { text: 'Dime las aplicaciones de la IA en la medicina', icon: 'bi-heart-pulse', score: 0.8 },
            { text: '¿Cómo funciona una red neuronal?', icon: 'bi-diagram-3', score: 0.7 },
            { text: 'Cuéntame sobre el aprendizaje profundo', icon: 'bi-cpu', score: 0.6 }
        ],
        'poema|poesia|poetry': [
            { text: 'Escribe un poema corto sobre el amor', icon: 'bi-pen', score: 0.9 },
            { text: 'Crea un poema sobre la naturaleza', icon: 'bi-tree', score: 0.8 },
            { text: 'Escribe un haiku sobre el otoño', icon: 'bi-leaf', score: 0.7 },
            { text: 'Dime cómo escribir poesía lírica', icon: 'bi-book', score: 0.6 }
        ],
        'matemáticas|ecuación|calculo|math': [
            { text: 'Ayúdame con una ecuación cuadrática', icon: 'bi-calculator', score: 0.9 },
            { text: 'Explica el teorema de Pitágoras', icon: 'bi-rulers', score: 0.8 },
            { text: 'Resuelve una integral definida', icon: 'bi-graph-up', score: 0.7 },
            { text: 'Cuéntame sobre álgebra lineal', icon: 'bi-grid-3x3', score: 0.6 }
        ],
        'ciencia|science|física|química|physics|chemistry': [
            { text: 'Explica la teoría de la relatividad', icon: 'bi-speedometer', score: 0.9 },
            { text: 'Dime cómo funciona la fotosíntesis', icon: 'bi-flower1', score: 0.8 },
            { text: '¿Qué es la mecánica cuántica?', icon: 'bi-gear', score: 0.7 },
            { text: 'Cuéntame sobre la tabla periódica', icon: 'bi-table', score: 0.6 }
        ],
        'historia|history': [
            { text: 'Cuéntame sobre la Revolución Francesa', icon: 'bi-book', score: 0.9 },
            { text: 'Explica la Segunda Guerra Mundial', icon: 'bi-flag', score: 0.8 },
            { text: '¿Quién fue Cleopatra?', icon: 'bi-person', score: 0.7 },
            { text: 'Dime sobre la independencia de América Latina', icon: 'bi-globe', score: 0.6 }
        ],
        'creatividad|arte|diseño|art|design': [
            { text: 'Escribe una historia corta de ciencia ficción', icon: 'bi-book-half', score: 0.9 },
            { text: 'Dime cómo diseñar un logo creativo', icon: 'bi-brush', score: 0.8 },
            { text: 'Crea un guion para un cortometraje', icon: 'bi-film', score: 0.7 },
            { text: 'Explica técnicas de pintura al óleo', icon: 'bi-paint-bucket', score: 0.6 }
        ],
        'tecnología|technology|tech': [
            { text: 'Explica cómo funciona blockchain', icon: 'bi-link', score: 0.9 },
            { text: 'Dime sobre ciberseguridad', icon: 'bi-shield-lock', score: 0.8 },
            { text: '¿Qué es la computación en la nube?', icon: 'bi-cloud', score: 0.7 },
            { text: 'Cuéntame sobre 5G', icon: 'bi-wifi', score: 0.6 }
        ],
        'cultura|culture': [
            { text: 'Cuéntame sobre la cultura japonesa', icon: 'bi-globe-asia-australia', score: 0.9 },
            { text: 'Explica el significado del Día de Muertos', icon: 'bi-flower2', score: 0.8 },
            { text: 'Dime sobre la mitología griega', icon: 'bi-book', score: 0.7 },
            { text: '¿Qué es el flamenco?', icon: 'bi-music-note', score: 0.6 }
        ],
        'educación|education': [
            { text: 'Dime cómo mejorar mis habilidades de estudio', icon: 'bi-book', score: 0.9 },
            { text: 'Explica la importancia de la educación STEM', icon: 'bi-gear', score: 0.8 },
            { text: '¿Qué es el aprendizaje activo?', icon: 'bi-lightbulb', score: 0.7 },
            { text: 'Cuéntame sobre la historia de las universidades', icon: 'bi-mortarboard', score: 0.6 }
        ],
        'entretenimiento|entertainment': [
            { text: 'Recomienda una película de ciencia ficción', icon: 'bi-film', score: 0.9 },
            { text: 'Dime sobre la historia de los videojuegos', icon: 'bi-joystick', score: 0.8 },
            { text: '¿Quién es tu personaje favorito de Marvel?', icon: 'bi-star', score: 0.7 },
            { text: 'Cuéntame sobre los Oscar', icon: 'bi-award', score: 0.6 }
        ]
    };

    const matchedSuggestions = [];
    Object.keys(keywords).forEach(pattern => {
        if (new RegExp(pattern).test(input)) {
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
            { text: `Dime más sobre ${input}`, icon: 'bi-info-circle', score: 0.4 },
            { text: `¿Qué es ${input}?`, icon: 'bi-question-circle', score: 0.3 },
            { text: `Cuéntame algo interesante sobre ${input}`, icon: 'bi-lightbulb', score: 0.2 }
        );
    }

    return [...new Set(suggestions.map(s => JSON.stringify(s)))].map(s => JSON.parse(s)).slice(0, 6);
}

function updateLanguage(lang) {
    const t = translations[lang];
    document.querySelector('a.navbar-brand').textContent = `GarBotGPT v1.0`;
    if (document.body.dataset.authenticated === 'true') {
        const username = document.querySelector('.nav-link.user-welcome').textContent.split(', ')[1] || '';
        document.querySelector('.nav-link.user-welcome').innerHTML = `<i class="bi bi-person-circle me-2"></i>${t.welcome}${username}`;
    }
    document.querySelector('.chat-header h2').textContent = t.title;
    document.querySelector('#message').placeholder = t.placeholder;
    document.querySelector('.chat-footer button[onclick="sendMessage()"]').textContent = t.send;
    document.querySelector('#voice-btn').setAttribute('data-bs-original-title', t.voice);
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.textContent = t.copy;
        btn.setAttribute('data-bs-original-title', t.copy);
    });
    document.querySelector('#responding-indicator .message-content').innerHTML = `${t.responding}<span class="typing-dots"></span>`;
    document.querySelector('#clear-history').textContent = t.clear_history;
    document.querySelector('#clear-history').setAttribute('data-bs-original-title', t.clear_history);
    document.querySelector('a[href*="/export_history"]').textContent = t.export_history;
    document.querySelector('a[href*="/export_history"]').setAttribute('data-bs-original-title', t.export_history);
    document.querySelector('a[href*="/export_settings"]').textContent = t.export_settings;
    document.querySelector('a[href*="/export_settings"]').setAttribute('data-bs-original-title', t.export_settings);
    document.querySelector('#regenerate-response').textContent = t.regenerate;
    document.querySelector('#regenerate-response').setAttribute('data-bs-original-title', t.regenerate);
    document.querySelector('a[href*="/logout"]').textContent = t.logout;
    document.querySelector('a[href*="/logout"]').setAttribute('data-bs-original-title', t.logout);
    document.querySelector('#settingsHeading .accordion-button').innerHTML = `<i class="bi bi-gear-fill me-2"></i>${t.settings}`;
    document.querySelector('#settingsCollapse button').textContent = t.open_settings;
    document.querySelector('#settingsCollapse button').setAttribute('data-bs-original-title', t.open_settings);
    document.querySelector('#infoHeading .accordion-button').innerHTML = `<i class="bi bi-info-circle-fill me-2"></i>${t.info}`;
    document.querySelector('#infoCollapse button').textContent = t.open_info;
    document.querySelector('#infoCollapse button').setAttribute('data-bs-original-title', t.open_info);
    document.querySelector('#actionsHeading .accordion-button').innerHTML = `<i class="bi bi-tools me-2"></i>${t.actions}`;
    document.querySelector('#languageHeading .accordion-button').innerHTML = `<i class="bi bi-translate me-2"></i>${t.language}`;
    document.querySelector('#sidebarModalLabel').innerHTML = `<i class="bi bi-list me-2"></i>${t.open_menu}`;
    document.querySelector('#sidebar-toggle').innerHTML = `<i class="bi bi-list me-1"></i><span>${t.open_menu}</span>`;
    document.querySelector('#sidebar-toggle').setAttribute('data-bs-original-title', t.open_menu);
    document.querySelector('#settingsModalLabel').innerHTML = `<i class="bi bi-gear-fill me-2"></i>${t.settings}`;
    document.querySelector('#settingsModal .form-label[for="model"]').innerHTML = `<i class="bi bi-robot me-2"></i>${t.model}`;
    document.querySelector('#settingsModal .form-label[for="temperature"]').innerHTML = `<i class="bi bi-thermometer-half me-2"></i>${t.temperature}`;
    document.querySelector('#settingsModal .form-label[for="max_tokens"]').innerHTML = `<i class="bi bi-text-paragraph me-2"></i>${t.max_tokens}`;
    document.querySelector('#settingsModal .form-label[for="theme_color"]').innerHTML = `<i class="bi bi-palette-fill me-2"></i>${t.theme_color}`;
    document.querySelector('#settingsModal button[type="submit"]').textContent = t.save;
    document.querySelector('#infoModalLabel').innerHTML = `<i class="bi bi-info-circle-fill me-2"></i>${t.info}`;
    document.querySelector('#send-on-enter').nextElementSibling.textContent = t.send_on_enter;
    if (document.querySelector('.suggestions p')) {
        document.querySelector('.suggestions p').textContent = t.suggestions;
        const suggestionButtons = document.querySelectorAll('.suggestion-btn');
        if (suggestionButtons.length >= 5) {
            suggestionButtons[0].innerHTML = `<i class="bi bi-code-slash me-1"></i>${t.suggestion1}`;
            suggestionButtons[1].innerHTML = `<i class="bi bi-robot me-1"></i>${t.suggestion2}`;
            suggestionButtons[2].innerHTML = `<i class="bi bi-pen me-1"></i>${t.suggestion3}`;
            suggestionButtons[3].innerHTML = `<i class="bi bi-calculator me-1"></i>${t.suggestion4}`;
            suggestionButtons[4].innerHTML = `<i class="bi bi-book me-1"></i>${t.suggestion5}`;
        }
    }
    document.querySelector('#fullscreen-toggle').setAttribute('data-bs-original-title', t.toggle_fullscreen);

    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        bootstrap.Tooltip.getOrCreateInstance(el);
    });
}

async function sendMessage(regenerate = false, message = null) {
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
        suggestionsDropdown.classList.add('d-none');
    }

    respondingIndicator.classList.remove('d-none');

    try {
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
                'Procesando tu mensaje...',
                'Generando respuesta...',
                'Un momento, estoy pensando...'
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
                        hljs.highlightAll();
                        bootstrap.Tooltip.getOrCreateInstance(aiMessage.querySelector('.copy-btn'));
                    }
                }, 20);
            }, 2000);
        }
    } catch (error) {
        respondingIndicator.classList.add('d-none');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message ai-message text-danger animate__animated animate__fadeIn';
        errorMessage.innerHTML = `<strong>Error:</strong><div class="message-content">No se pudo conectar al servidor</div>`;
        chatMessages.appendChild(errorMessage);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    const html = document.getElementById('html-root');
    const savedTheme = localStorage.getItem('theme') || html.getAttribute('data-theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    const lang = document.documentElement.lang || 'es';
    updateLanguage(lang);

    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        console.log('Sidebar toggle button found, attached to modal');
        sidebarToggle.addEventListener('click', () => {
            console.log('Sidebar toggle clicked, opening modal');
            const modal = new bootstrap.Modal(document.getElementById('sidebarModal'));
            modal.show();
        });
    } else {
        console.error('Sidebar toggle button not found in DOM');
    }

    const messageInput = document.getElementById('message');
    const suggestionsDropdown = document.getElementById('suggestions-dropdown');
    messageInput.addEventListener('input', () => {
        const input = messageInput.value;
        const suggestions = generateSuggestions(input);
        suggestionsDropdown.innerHTML = '';
        if (suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'suggestion-item animate__animated animate__fadeIn';
                item.innerHTML = `<i class="${suggestion.icon}"></i>${suggestion.text}`;
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
    });

    messageInput.addEventListener('focus', () => {
        const input = messageInput.value;
        if (input) {
            const suggestions = generateSuggestions(input);
            suggestionsDropdown.innerHTML = '';
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'suggestion-item animate__animated animate__fadeIn';
                item.innerHTML = `<i class="${suggestion.icon}"></i>${suggestion.text}`;
                item.addEventListener('click', () => {
                    messageInput.value = suggestion.text;
                    suggestionsDropdown.classList.add('d-none');
                    sendMessage();
                });
                suggestionsDropdown.appendChild(item);
            });
            suggestionsDropdown.classList.remove('d-none');
        }
    });

    messageInput.addEventListener('blur', () => {
        setTimeout(() => suggestionsDropdown.classList.add('d-none'), 200);
    });

    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', () => {
            const chatContainer = document.getElementById('chat-container-main');
            const isReduced = chatContainer.classList.contains('reduced');
            chatContainer.classList.toggle('reduced');
            const icon = fullscreenToggle.querySelector('i');
            icon.className = isReduced ? 'bi bi-arrows-fullscreen' : 'bi bi-fullscreen-exit';
            bootstrap.Tooltip.getOrCreateInstance(fullscreenToggle).setContent({
                '.tooltip-inner': isReduced ? translations[lang].toggle_fullscreen : translations[lang].exit_fullscreen
            });
        });
    }
});

document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('send-on-enter').checked) {
        sendMessage();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-btn')) {
        const text = e.target.getAttribute('data-text');
        navigator.clipboard.writeText(text).then(() => {
            e.target.textContent = translations[document.documentElement.lang].copied;
            setTimeout(() => {
                e.target.textContent = translations[document.documentElement.lang].copy;
                bootstrap.Tooltip.getOrCreateInstance(e.target).setContent({ '.tooltip-inner': translations[document.documentElement.lang].copy });
            }, 2000);
        });
    }
});

document.getElementById('clear-history').addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres borrar tu historial de chat?')) {
        try {
            const response = await fetch('/clear_history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                document.getElementById('chat-messages').innerHTML = `
                    <div class="suggestions glass text-center animate__animated animate__fadeIn">
                        <p>${translations[document.documentElement.lang].suggestions}</p>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Explica un concepto de programación"><i class="bi bi-code-slash me-1"></i>${translations[document.documentElement.lang].suggestion1}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Cuéntame sobre inteligencia artificial"><i class="bi bi-robot me-1"></i>${translations[document.documentElement.lang].suggestion2}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Escribe un poema corto"><i class="bi bi-pen me-1"></i>${translations[document.documentElement.lang].suggestion3}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Ayúdame con una ecuación matemática"><i class="bi bi-calculator me-1"></i>${translations[document.documentElement.lang].suggestion4}</button>
                        <button class="btn btn-outline-primary btn-sm m-1 suggestion-btn" data-message="Cuéntame sobre la historia de Roma"><i class="bi bi-book me-1"></i>${translations[document.documentElement.lang].suggestion5}</button>
                    </div>
                    <div id="responding-indicator" class="message ai-message animate__animated animate__fadeIn glass d-none">
                        <strong>GarBotGPT:</strong>
                        <div class="message-content typing-effect">${translations[document.documentElement.lang].responding}<span class="typing-dots"></span></div>
                    </div>
                `;
            } else {
                alert('Error al borrar historial: ' + data.error);
            }
        } catch (error) {
            alert('Error al borrar historial: No se pudo conectar al servidor');
        }
    }
});

document.getElementById('regenerate-response').addEventListener('click', () => {
    sendMessage(true);
});

document.getElementById('chat-settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
        model: formData.get('model'),
        temperature: parseFloat(formData.get('temperature')),
        max_tokens: parseInt(formData.get('max_tokens')),
        theme_color: formData.get('theme_color')
    };

    try {
        const response = await fetch('/update_chat_settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        const data = await response.json();
        if (data.success) {
            alert('Configuración actualizada correctamente');
            bootstrap.Modal.getInstance(document.getElementById('settingsModal')).hide();
            document.documentElement.style.setProperty('--message-user-bg', settings.theme_color);
        } else {
            alert('Error al actualizar configuración: ' + data.error);
        }
    } catch (error) {
        alert('Error al actualizar configuración: No se pudo conectar al servidor');
    }
});

document.getElementById('language-select').addEventListener('change', async (e) => {
    const newLang = e.target.value;
    try {
        const response = await fetch('/update_language', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: newLang })
        });
        const data = await response.json();
        if (data.success) {
            document.documentElement.lang = newLang;
            updateLanguage(newLang);
            alert('Idioma actualizado correctamente');
        } else {
            alert('Error al actualizar idioma: ' + data.error);
        }
    } catch (error) {
        alert('Error al actualizar idioma: No se pudo conectar al servidor');
    }
});

const voiceBtn = document.getElementById('voice-btn');
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = document.documentElement.lang || 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.classList.add('recording');
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('message').value = transcript;
        sendMessage();
        voiceBtn.classList.remove('recording');
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('recording');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('recording');
        alert('Error en la entrada por voz: ' + event.error);
    };
} else {
    voiceBtn.style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-btn')) {
        const message = e.target.getAttribute('data-message');
        sendMessage(false, message);
    }
});