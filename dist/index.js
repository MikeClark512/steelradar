async function fetchText(url) { 
    let response = await fetch(url);
    if (response.status < 200 || response.status > 200) {
        throw Error("fetchText status=" + response.status + " url=" + url);
    }
    let text = await response.text();
    return text;
}

async function fetchJson(url) { 
    let text = await fetchText(url);
    return JSON.parse(text);
}
 
async function main() {
    let data = await fetchJson("./data.json");
    console.log("json", data);
}

main();
