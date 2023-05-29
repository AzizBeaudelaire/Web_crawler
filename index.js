const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 8080;
const listePokemon = ["bulbizarre","herbizarre","florizarre","salameche","reptincel","dracaufeu","carapuce","carabaffe","tortank","chenipan","chrysacier","papilusion","aspicot","coconfort","dardargnan","roucool","roucoups","roucarnage","rattata","rattatac","piafabec","rapasdepic","abo","arbok","pikachu","raichu","sabelette","sablaireau","nidoran","nidorina","nidoqueen","nirodan","nidorino","nidoking","melofee","melodelfe","goupix","feunard","rondoudou","grodoudou","nosferapti","nosferalto","mystherbe","ortide","rafflesia","paras","parasect","mimitoss","aeromite","taupiqueur","triopikeur","miaouss","persian","psykokwak","akwakwak","ferosinge","colossinge","caninos","arcanin","ptitard","tetarte","tartard","abra","kadabra","alakazam","machoc","machopeur","mackogneur","chetiflor","boustiflor","empiflor","tentacool","tentacruel","racaillou","gravalanch","grolem","ponyta","galopa","ramoloss","flagadoss","magneti","magneton","canarticho","doduo","dodrio","otaria","lamantine","tadmorv","grotadmorv","kokiyas","crustabri","fantominus","spectrum","ectoplasma","onix","soporifik","hypnomade","krabby","krabboss","voltorbe","electrode","noeunoeuf","noadkoko","osselait","ossatueur","kicklee","tygnon","excelangue","smogo","smogogo","rhinocorne","rhinoferos","leveinard","saquedeneu","kangourex","hypotrempe","hypocean","poissirene","poissoroy","stari","staross","mime","insecateur","lippoutou","elektek","magmar","scarabrute","tauros","magicarpe","leviator","lokhlass","metamorph","evoli","aquali","voltali","pyroli","porygon","amonita","amonistar","kabuto","kabutops","ptera","ronflex","artikodin","electhor","sulfura","minidraco","draco","dracolosse"]

app.use(express.static(path.join(__dirname, '/templates')));

// Route pour récupérer les informations spécifiques d'un Pokémon en fonction de son ID
app.get('/api/:pokemonId', async (req, res) => {
  const pokemonId = req.params.pokemonId;
  let i = 0;
  for(i; i < listePokemon.length - 1; i++) {
    if(pokemonId.toLowerCase() === listePokemon[i].toLowerCase()) {
      break;
    }
  };

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Accéder à la page du Pokémon en utilisant l'ID fourni
    await page.goto(`https://eternia.fr/fr/pokedex/pokemon/${i+1}`);

    // Extraction des informations du Pokémon de la page
    const pokemonData = await page.evaluate(() => {
      const name = document.querySelector('#content > h1').innerText;
      const number = document.querySelector('#content > div.bloc_infos_generales > div.column_infos_g > table > tbody > tr:nth-child(1) > td').innerText.trim();
      const types = document.querySelector('#content > div.bloc_infos_generales > div.column_infos_g > table > tbody > tr:nth-child(2) > td').innerText.trim().split('\n');
      const height = document.querySelector('#content > div.bloc_infos_generales > div.column_infos_g > table > tbody > tr:nth-child(4) > td').innerText.trim();
      const weight = document.querySelector('#content > div.bloc_infos_generales > div.column_infos_g > table > tbody > tr:nth-child(5) > td').innerText.trim();
      const hp = parseInt(document.querySelector('#content > div.bloc_infos_generales > div.column_infos_d > table.tab_statsB > tbody > tr:nth-child(1) > td.statNb').innerText.trim(), 10);
      const attack = parseInt(document.querySelector('#content > div.bloc_infos_generales > div.column_infos_d > table.tab_statsB > tbody > tr:nth-child(2) > td.statNb').innerText.trim(), 10);
      const defense = parseInt(document.querySelector('#content > div.bloc_infos_generales > div.column_infos_d > table.tab_statsB > tbody > tr:nth-child(3) > td.statNb').innerText.trim(), 10);
      const spAttack = parseInt(document.querySelector('#content > div.bloc_infos_generales > div.column_infos_d > table.tab_statsB > tbody > tr:nth-child(4) > td.statNb').innerText.trim(), 10);
      const spDefense = parseInt(document.querySelector('#content > div.bloc_infos_generales > div.column_infos_d > table.tab_statsB > tbody > tr:nth-child(5) > td.statNb').innerText.trim(), 10);
      const speed = parseInt(document.querySelector('#content > div.bloc_infos_generales > div.column_infos_d > table.tab_statsB > tbody > tr:nth-child(6) > td.statNb').innerText.trim(), 10);
      const image = document.querySelector('#content > div.bloc_infos_generales > div.ImgSuivPrec > div.artwork_off > img').src

      // Retourner les informations du Pokémon
      return {
        name,
        number,
        types,
        height,
        weight,
        hp,
        attack,
        defense,
        spAttack,
        spDefense,
        speed,
        image,
      };
    });

    await browser.close();

    // Renvoyer les données du Pokémon au format JSON
    res.json(pokemonData);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred');
  }
});

// Route pour la page d'accueil
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/html/index.html'));
});

// Route pour la page de chaque Pokémon
app.get('/:pokemon', async (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/html/pokemon.html'));
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
