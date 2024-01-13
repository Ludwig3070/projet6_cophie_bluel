/* recuperation des données sur le serveur */


async function fetchWorks (){
    const r = await fetch("http://localhost:5678/api/works");
    return r.ok ?   r.json() : alert ('Serveur introuvable');
}

let works
works= fetchWorks()/* works contient le tableau d'objets à traiter */
console.log (works)
