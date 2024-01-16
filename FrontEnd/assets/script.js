 /* Ressources  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener */
    /* https://javascript.info/map-set#set */





/* recuperation des données sur le serveur */

/**
 * fonction qui retourne une promesse avec les donnees de l'url ou une alert si le serveur est tombé
 * @returns promise
 */
async function fetchWorks() {
    const r = await fetch("http://localhost:5678/api/works");
    return r.ok ? await r.json() : alert('Serveur introuvable');/* si r.ok return r.json() sinon return alert */
}

/**
 * fonction qui retourne une promesse avec les categories pour index.html ou affiche une alerte si le serveur est tombé
 * @returns promise
 */
async function fetchCategories() {
    const r = await fetch("http://localhost:5678/api/categories");
    return r.ok ? await r.json() : alert('Serveur introuvable');/* si r.ok return r.json() sinon return alert */
}

/**
 * affiche toutes les categories dans la galerie
 */
async function displayTous() {   /* affichage de "Tous" */
    works_fetch.then(
        worksArray => {/* worksArray est l'objet (ici un tableau) resultat de la promesse */
            worksArray.map((item) => {
                let gallery = document.querySelector(".gallery")
                let figure = document.createElement("figure")
                gallery.appendChild(figure)/* ces deux  instructions creent les  balises figure */
                let img = document.createElement("img")
                img.src = item.imageUrl
                img.alt = item.title
                figure.appendChild(img)/* ces trois instructions ajoutent les images  */
                let figcaption = document.createElement("figcaption")/* les trois prochaines instructions ajoutent figcaption et son texte  */
                figcaption.innerText = item.title
                figure.appendChild(figcaption)
            })
        }
    )    
}/* fin de la fonction d'affichage de "TOUS" */


/**
 * creer le DOM search_categrories sur index.html
 */
async function displayContentOfGallerySearch() {
    works_fetch.then(
        (r) => { 
            /* cette premiere partie de code permet de remplir search_categories avec les boutons dans le meme ordre que la maquette FIGMA sans utiliser une autre requete HTML
            (http://localhost:5678/api/categories)+ GET */

                let tableau = r.map(item => [item.category]); //recupere un tableau de tableaux avec les categories et id non ordonné
                let donnees = tableau.map(item => item[0]);//donnees est un tableau d'OBJETS avec les categories et id non ordonné
                delete tableau //liberation de la memoire
                /* console.log(donnees); */
                donnees.sort(function (a, b) {//tri du tableau avec id croissant
                    return a.id - b.id;
                });
                /* console.log(donnees); */                           
                let tab = [];//tableau provisoire pour traitement des données              
                for (let i of donnees) {tab.push(i.name)}//remplissage du tableau avec les noms (STRING) des categories ordonnées mais avec les doublons
                /* console.log(tab);  */           
                let set = new Set(tab); //ce set permet d'enlever tous les doublons car tab est un tableau de STRING,avec des objets ça marche pas
                console.log(set);

            /* cette deuxieme partie de code permet de creer les boutons dans search_categorie selon le contenu de l'API à l'exception de bouton "tous crée en HTML" */
            let gallery = document.querySelector(".search_categories"); 
        
            set.forEach((value)=>{//parcours du set et creation de la suite pour chaque iteration
              let button = document.createElement("button")//creation d'un bouton
              button.classList.add("button")//ajout de la classe sur le bouton pour les "settings" d'affichage
              button.innerText = value//ajout du texte de l'iteration de foreach
              gallery.appendChild(button)})//creation du bouton dans le DOM apres avoir defini tous les parametres
        }
    )  
}


 
/* programme principal */

let works_fetch = fetchWorks()/* works_fetch est une promesse qui contient le tableau d'objets à traiter,elle doit etre appelée en premier pour chercher les données sur le serveur et pouvoir utiliser les fonctions */
displayTous()
displayContentOfGallerySearch()




