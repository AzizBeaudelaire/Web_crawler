const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 8080;

app.get('/', async (req, res) => {
  const searchTerm = req.query.search;
  
  if (!searchTerm) {
    res.send('Please provide a search term.');
    return;
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://eternia.fr/fr/pokedex/liste-pokemon/`);
    await page.waitForSelector('.liste_pokemon');
    
    const links = await page.$$eval('.liste_pokemon a', (anchors) => {
      return anchors.map((anchor) => anchor.href);
    });

    const pokemonData = [];
    
    for (const link of links) {
      await page.goto(link);
      await page.waitForSelector('.content_fiche');
      
      const data = await page.evaluate(() => {
        const number = document.querySelector('.fiche_titre span').innerText;
        const name = document.querySelector('.fiche_titre h1').innerText;
        const types = Array.from(document.querySelectorAll('.fiche_texte .type')).map((type) => type.innerText);
        const height = document.querySelector('.fiche_texte .taille strong').innerText;
        const weight = document.querySelector('.fiche_texte .poids strong').innerText;
        const hp = document.querySelector('.fiche_texte .statistiques .pv strong').innerText;
        const attack = document.querySelector('.fiche_texte .statistiques .attaque strong').innerText;
        const defense = document.querySelector('.fiche_texte .statistiques .defense strong').innerText;
        const spAttack = document.querySelector('.fiche_texte .statistiques .attaque_spe strong').innerText;
        const spDefense = document.querySelector('.fiche_texte .statistiques .defense_spe strong').innerText;
        const speed = document.querySelector('.fiche_texte .statistiques .vitesse strong').innerText;

        return {
          number,
          name,
          types,
          height,
          weight,
          hp,
          attack,
          defense,
          spAttack,
          spDefense,
          speed
        };
      });

      pokemonData.push(data);
    }

    await browser.close();

    res.json(pokemonData);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
