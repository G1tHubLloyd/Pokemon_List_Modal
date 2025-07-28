// Pokémon Repository IIFE
let pokemonRepository = (function () {
    let pokemonList = [];

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    function showLoadingMessage() {
        let loader = document.createElement('div');
        loader.id = 'loading-message';
        loader.textContent = 'Loading Pokémon data...';
        document.body.appendChild(loader);
    }

    function hideLoadingMessage() {
        let loader = document.querySelector('#loading-message');
        if (loader) {
            loader.remove();
        }
    }

    function loadList() {
        showLoadingMessage();
        return fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
            .then(response => response.json())
            .then(json => {
                hideLoadingMessage();
                json.results.forEach(item => {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
            })
            .catch(e => {
                console.error(e);
                hideLoadingMessage();
            });
    }

    function loadDetails(pokemon) {
        showLoadingMessage();
        return fetch(pokemon.detailsUrl)
            .then(response => response.json())
            .then(details => {
                hideLoadingMessage();
                pokemon.imgUrl = details.sprites.front_default;
                pokemon.height = details.height;
                return pokemon;
            })
            .catch(e => {
                console.error(e);
                hideLoadingMessage();
            });
    }

    return {
        add: add,
        getAll: getAll,
        loadList: loadList,
        loadDetails: loadDetails
    };
})();

// Modal Controller IIFE
let modalController = (function () {
    let modalContainer = document.querySelector('#modal-container');
    let modalClose = document.querySelector('.modal-close');

    function closeModal() {
        modalContainer.classList.add('hidden');
        document.removeEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    modalClose.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', function (event) {
        if (event.target === modalContainer) {
            closeModal();
        }
    });

    function showModal(pokemon) {
        document.querySelector('#modal-title').textContent = pokemon.name;
        document.querySelector('#modal-image').src = pokemon.imgUrl;
        document.querySelector('#modal-height').textContent = `Height: ${pokemon.height}`;
        modalContainer.classList.remove('hidden');
        document.querySelector('.modal-content').focus();
        document.addEventListener('keydown', handleKeyDown);
    }

    return {
        showModal: showModal
    };
})();

// Render Pokémon List
function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('#pokemon-list');
    let listItem = document.createElement('li');
    listItem.textContent = pokemon.name;
    listItem.addEventListener('click', function () {
        showDetails(pokemon);
    });
    pokemonListElement.appendChild(listItem);
}

// Display Details in Modal
function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function (updatedPokemon) {
        modalController.showModal(updatedPokemon);
    });
}

// Init
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        addListItem(pokemon);
    });
});
