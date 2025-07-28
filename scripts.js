(function () {
    let modalContainer = document.querySelector('#modal-container');
    let pokemonList = document.querySelector('#pokemon-list');

    // 🧠 Show modal with content and close button
    function showModal(title, text, imageUrl) {
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        // Close button (top right)
        let closeButton = document.createElement('button');
        closeButton.innerText = '×';
        closeButton.classList.add('modal-close');
        closeButton.addEventListener('click', hideModal);

        // Title and content
        let nameElement = document.createElement('h1');
        nameElement.innerText = title;

        let contentElement = document.createElement('p');
        contentElement.innerText = text;

        let imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.alt = `${title} image`;
        imageElement.classList.add('pokemon-img');

        // Append to modal
        modal.appendChild(closeButton);
        modal.appendChild(nameElement);
        modal.appendChild(contentElement);
        modal.appendChild(imageElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    // 🔐 Hide modal
    function hideModal() {
        modalContainer.classList.remove('is-visible');
    }

    // Close modal with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    // Close modal by clicking background
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            hideModal();
        }
    });

    // 🌐 Load Pokémon details from API
    function loadDetails(pokemon) {
        return fetch(pokemon.detailsUrl)
            .then(response => response.json())
            .then(details => {
                pokemon.height = details.height;
                pokemon.imageUrl = details.sprites.front_default;
                return pokemon;
            });
    }

    // 🖼 Trigger modal display on button click
    function showDetails(pokemon) {
        loadDetails(pokemon).then(() => {
            showModal(pokemon.name, `Height: ${pokemon.height}`, pokemon.imageUrl);
        });
    }

    // 📝 Example Pokémon list
    let pokemonRepository = [
        {
            name: 'Bulbasaur',
            detailsUrl: 'https://pokeapi.co/api/v2/pokemon/bulbasaur'
        },
        {
            name: 'Charmander',
            detailsUrl: 'https://pokeapi.co/api/v2/pokemon/charmander'
        }
    ];

    // Render Pokémon buttons
    pokemonRepository.forEach(pokemon => {
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('pokemon-button');
        button.addEventListener('click', () => showDetails(pokemon));
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
    });
})();
