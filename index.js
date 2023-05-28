const express = require('express');
const puppeteer = require('puppeteer');
const path = require("path");

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname,"/templates")))

app.get('/api/', async (req, res) => {
  /*
  const searchTerm = req.query.search;
  
  if (!searchTerm) {
    res.send('Please provide a search term.');
    return;
  }
  */

  try {
    const browser = await puppeteer.launch(
      {headless: false}
    );
    const page = await browser.newPage();

    await page.goto(`https://eternia.fr/fr/pokedex/liste-pokemon/`);
    await page.waitForSelector('table');
    
    //const links = await page.$$eval('td a', (anchors) => {
    //  return anchors.map((anchor) => anchor.href);
    //});
    //console.log(links)
    const pokemonData = [];

    let links = []
    for (let i = 1; i < 150; i++) {
      links.push("https://eternia.fr/fr/pokedex/pokemon/" + i)
    }

    for (const link of links) {
      await page.goto(link);


      //await page.waitForSelector('.content_fiche');
      await page.waitForSelector('.pokedex');

      const data = await page.evaluate(() => {
        //const number = document.getElementsByClassName('.fiche_titre span').innerText;
        const tag = document.getElementsByClassName('pokedex')[0].innerText;
        const description = document.getElementsByClassName('tab_infoG')[0].innerText;
        const stat = document.getElementsByClassName('tab_statsB')[0].innerText;
        //const height = document.querySelector('.fiche_texte .taille strong').innerText;
        //const weight = document.querySelector('.fiche_texte .poids strong').innerText;
        //const hp = document.querySelector('.fiche_texte .statistiques .pv strong').innerText;
        //const attack = document.querySelector('.fiche_texte .statistiques .attaque strong').innerText;
        //const defense = document.querySelector('.fiche_texte .statistiques .defense strong').innerText;
        //const spAttack = document.querySelector('.fiche_texte .statistiques .attaque_spe strong').innerText;
        //const spDefense = document.querySelector('.fiche_texte .statistiques .defense_spe strong').innerText;
        //const speed = document.querySelector('.fiche_texte .statistiques .vitesse strong').innerText;

        console.log(tag);
        console.log(description);
        console.log(stat);
        
        return {
          //number,
          tag,
          description,
          stat,
          //height,
          //weight,
          //hp,
          //attack,
          //defense,
          //spAttack,
          //spDefense,
          //speed
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

app.get('/', async (req, res) => {

    res.sendFile(__dirname+"/templates/html/index.html");

});

app.get('/:pokemon', async (req, res) => {

    res.sendFile(__dirname+"/templates/html/pokemon.html");

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
