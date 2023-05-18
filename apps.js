const form = document.querySelector('.search-form');
const resultsContainer = document.querySelector('.results');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const searchInput = form.querySelector('input[name="search"]');
  const searchTerm = searchInput.value.trim().toLowerCase();

  const response = await fetch(`http://localhost:8080/?search=${searchTerm}`);
  const pokemonData = await response.json();

  renderResults(pokemonData);
});

function renderResults(pokemonData) {
  resultsContainer.innerHTML = '';

  if (pokemonData.length === 0) {
    resultsContainer.innerHTML = '<p>No results found</p>';
    return;
  }

  pokemonData.forEach(pokemon => {
    const card = document.createElement('div');
    card.classList.add('card');

    const cardImage = document.createElement('img');
    cardImage.src = pokemon.image;
    cardImage.alt = pokemon.name;
    card.appendChild(cardImage);

    const cardName = document.createElement('h3');
    cardName.textContent = pokemon.name;
    card.appendChild(cardName);

    const cardTypes = document.createElement('p');
    cardTypes.textContent = `Type: ${pokemon.types.join(', ')}`;
    card.appendChild(cardTypes);

    const cardAbilities = document.createElement('p');
    cardAbilities.textContent = `Abilities: ${pokemon.abilities.join(', ')}`;
    card.appendChild(cardAbilities);

    resultsContainer.appendChild(card);
  });
}
