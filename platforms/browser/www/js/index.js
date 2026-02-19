document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    initApp();
}

function initApp() {
    // Init Materialize
    M.AutoInit();

    // Botón buscar
    document.getElementById('btn-buscar').addEventListener('click', buscarAnime);

    // También buscar al pulsar Enter
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') buscarAnime();
    });

    // Botón top anime
    document.getElementById('btn-top').addEventListener('click', cargarTopAnime);
}

// ────────────────────────────────────────
// FUNCIÓN: Buscar anime por nombre
// ────────────────────────────────────────
function buscarAnime() {
    const query = document.getElementById('search-input').value.trim();

    if (!query) {
        M.toast({html: 'Escribe algo para buscar', classes: 'purple darken-3'});
        return;
    }

    const contenedor = document.getElementById('resultado-buscar');
    contenedor.innerHTML = '<div class="center" style="padding:20px;"><div class="preloader-wrapper active"><div class="spinner-layer spinner-purple-only"><div class="circle-clipper left"><div class="circle"></div></div></div></div></div>';

    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return response.json();
        })
        .then(data => {
            mostrarResultados(data.data, 'resultado-buscar');
        })
        .catch(error => {
            contenedor.innerHTML = `<div class="col s12"><p class="red-text center">Error: ${error.message}</p></div>`;
        });
}

// ────────────────────────────────────────
// FUNCIÓN: Cargar Top 10 Anime
// ────────────────────────────────────────
function cargarTopAnime() {
    const contenedor = document.getElementById('resultado-top');
    contenedor.innerHTML = '<div class="center" style="padding:20px;"><div class="preloader-wrapper active"><div class="spinner-layer spinner-purple-only"><div class="circle-clipper left"><div class="circle"></div></div></div></div></div>';

    const url = 'https://api.jikan.moe/v4/top/anime?limit=10';

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return response.json();
        })
        .then(data => {
            mostrarResultados(data.data, 'resultado-top');
        })
        .catch(error => {
            contenedor.innerHTML = `<div class="col s12"><p class="red-text center">Error: ${error.message}</p></div>`;
        });
}

// ────────────────────────────────────────
// FUNCIÓN: Renderizar tarjetas de anime
// ────────────────────────────────────────
function mostrarResultados(animes, contenedorId) {
    const contenedor = document.getElementById(contenedorId);

    if (!animes || animes.length === 0) {
        contenedor.innerHTML = '<div class="col s12"><p class="center">No se encontraron resultados.</p></div>';
        return;
    }

    let html = '';

    animes.forEach(anime => {
        const titulo = anime.title || 'Sin título';
        const imagen = anime.images?.jpg?.image_url || '';
        const score = anime.score ? `⭐ ${anime.score}` : 'Sin puntuación';
        const episodios = anime.episodes ? `${anime.episodes} eps.` : '? eps.';
        const estado = anime.status || '';
        const sinopsis = anime.synopsis
            ? anime.synopsis.substring(0, 100) + '...'
            : 'Sin sinopsis disponible.';

        html += `
        <div class="col s12 m6 l4">
            <div class="card hoverable anime-card">
                <div class="card-image">
                    <img src="${imagen}" alt="${titulo}" class="anime-img">
                    <span class="card-title anime-card-title">${titulo}</span>
                </div>
                <div class="card-content">
                    <p class="grey-text">${score} · ${episodios} · ${estado}</p>
                    <p>${sinopsis}</p>
                </div>
                <div class="card-action">
                    <a href="https://myanimelist.net/anime/${anime.mal_id}" 
                       target="_blank" class="purple-text darken-3">
                        Ver en MAL
                    </a>
                </div>
            </div>
        </div>`;
    });

    contenedor.innerHTML = html;
}