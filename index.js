const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(cors());

async function scrapePokemonDetails(pokemonURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pokemonURL);

    const pokemonData = await page.evaluate(() => {
        const data = {};

        data['numero'] = document.querySelector('.block-pokemon-detail-id').textContent.trim();
        data['nom'] = document.querySelector('.block-pokemon-detail-title').textContent.trim();
        data['types'] = Array.from(document.querySelectorAll('.block-pokemon-detail-types a')).map(typeElement => typeElement.textContent.trim());
        data['taille'] = document.querySelector('.block-pokemon-detail-data-list').children[0].querySelector('.block-pokemon-detail-data-value').textContent.trim();
        data['poids'] = document.querySelector('.block-pokemon-detail-data-list').children[1].querySelector('.block-pokemon-detail-data-value').textContent.trim();
        data['pv'] = document.querySelector('.block-pokemon-detail-data-list').children[2].querySelector('.block-pokemon-detail-data-value').textContent.trim();
        data['attaque'] = document.querySelector('.block-pokemon-detail-data-list').children[3].querySelector('.block-pokemon-detail-data-value').textContent.trim();
        data['defense'] = document.querySelector('.block-pokemon-detail-data-list').children[4].querySelector('.block-pokemon-detail-data-value').textContent.trim();
        data['attaque_spe'] = document.querySelector('.block-pokemon-detail-data-list').children[5].querySelector('.block-pokemon-detail-data-value').textContent.trim();
        data['defense_spe'] = document.querySelector('.block-pokemon-detail-data-list').children[6].querySelector('.block-pokemon-detail-data-value').textContent.trim();
        data['vitesse'] = document.querySelector('.block-pokemon-detail-data-list').children[7].querySelector('.block-pokemon-detail-data-value').textContent.trim();

        return data;
    });

    await browser.close();

    return pokemonData;
}

app.get('/pokemon', async (req, res) => {
    const pokemonName = req.query.search;
    const pokemonURL = `https://eternia.fr/fr/pokedex/liste-pokemon/${pokemonName}`;

    try {
      const pokemonData = await scrapePokemonDetails(pokemonURL);
      res.json(pokemonData);
    } catch (error) {
    res.status(500).json({ error: 'An error occurred while scraping the Pokémon data.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
