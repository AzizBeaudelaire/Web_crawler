const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = 8080;

app.use(cors());

async function scrapePokemon() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://www.pokepedia.fr/Liste_des_Pok%C3%A9mon_dans_l%27ordre_du_Pok%C3%A9dex_National');

  const pokemonData = await page.evaluate(() => {
    const pokemonList = [];
    const rows = document.querySelectorAll('#Liste_des_Pokémon_dans_lordre_du_Pokédex_National tr:not(:first-child)');
    rows.forEach(row => {
      const data = {};
      const columns = row.querySelectorAll('td');

      data['numero'] = columns[0].textContent.trim();
      data['nom'] = columns[1].textContent.trim();
      data['types'] = columns[2].textContent.trim().split(' / ');
      data['total'] = parseInt(columns[3].textContent.trim(), 10);
      data['pv'] = parseInt(columns[4].textContent.trim(), 10);
      data['attaque'] = parseInt(columns[5].textContent.trim(), 10);
      data['defense'] = parseInt(columns[6].textContent.trim(), 10);
      data['attaque_spe'] = parseInt(columns[7].textContent.trim(), 10);
      data['defense_spe'] = parseInt(columns[8].textContent.trim(), 10);
      data['vitesse'] = parseInt(columns[9].textContent.trim(), 10);

      pokemonList.push(data);
    });

    return pokemonList;
  });

  await browser.close();

  return pokemonData;
}

app.get('/', async (req, res) => {
  const pokemonData = await scrapePokemon();
  res.json(pokemonData);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
