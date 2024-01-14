/* recuperation des données sur le serveur */

/**
 * fonction qui retourne une promesse avec les donnees de l'url ou une alert si le serveur est tombé
 * @returns promise
 */
async function fetchWorks() {
    const r = await fetch("http://localhost:5678/api/works");
    return r.ok ? await r.json() : alert('Serveur introuvable');/* si r.ok return r.json() sino return alert */
}







/**
 * affiche toutes les categories dans la galerie
 */
async function displayTous()
    {   /* affichage de "Tous" */
        works_fetch.then(
            worksArray => {/* worksArray est l'objet (ici un tableau) resultat de la promesse */
                            worksArray.map((item) => 
                                {
                                    let gallery = document. querySelector(".gallery")
                                    let figure = document.  createElement("figure")
                                    gallery.appendChild (figure)/* ces deux  instructions creent les  balises figure */
                                    let img = document. createElement("img")
                                    img.src = item.imageUrl
                                    img.alt = item.title
                                    figure.appendChild(img)/* ces trois instructions ajoutent les images  */
                                    let figcaption =    document.createElement ("figcaption")/* les trois prochaines instructions ajoutent figcaption et son texte  */
                                    figcaption.innerText =  item.title
                                    figure.appendChild  (figcaption)
                                })
                        }
            )
        /* fin de la fonction d'affichage de "TOUS" */}
/**
 * fonction qui affiche des boutons avec les differentes categories dans la barre search_categories
 */
async function createDisplayCategories()
    {   let categoriesSet = new Set()
        works_fetch.then(worksArray =>worksArray.map(item => categoriesSet.add(item.category.name)))
        categoriesSet.forEach((value)=>console.log(value))
        /* voir  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener */
        
        
    }


    let works_fetch = fetchWorks()/* works_fetch est une promesse qui contient le tableau d'objets à traiter,elle doit etre appelée en premier pour chercher les données sur le serveur */


    displayTous()
    createDisplayCategories()


