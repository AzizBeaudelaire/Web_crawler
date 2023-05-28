fetch('http://localhost:8080/api')
    .then(data => data.json())
    .then(data => {
        data = data[0]
        console.log(data)
        const title = document.querySelector("h2#pokemon-name");
        title.innerHTML = data.tag.split(" ")[3].split("\n")[0];

})