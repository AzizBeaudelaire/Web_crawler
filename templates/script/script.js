fetch('http://localhost:8080/api')
    .then(data => data.json())
    .then(data => {
        data = data[0]
        const title = document.querySelector("h2#pokemon-name");
        title.innerHTML = data.tag;
})