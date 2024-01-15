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
 * creer le DOM search_categrories sur indx.html
 */
async function displayContentOfGallerySearch() {
    works_fetch.then(
        r => {/* r est l'objet (ici un tableau) resultat de la promesse */
            console.log(r)
            
            let gallery = document.querySelector(".search_categories")           
            
            //selection des objets dans l'ordre
            let tableau = r.map(item => [item.category.id,item.category.name])//recupere un tableau avec des tableaux
            /* console.log(tableau) */
            let tabId=tableau.map(item=>item[0])
            let tabName=tableau.map(item=>item[1])
            /* console.log(tabId)
            console.log(tabName) */
            let setId = new Set(tabId)
            let setName = new Set(tabName)
            /* console.log(setId)
            console.log(setName) */
            tabId= Array.from(setId)
            tabName= Array.from(setName)
          /*   console.log(tabId)
            console.log(tabName) */
            tableau=[]
            tableau=tabId.map((el,index) =>[el,tabName[index]])//syntaxe de ouf
            console.log(tableau)
            console.log("***********************************************")
            tableau = r.map(item => [item.category])//recupere un tableau avec des tableaux
            console.log(tableau)
            for(i of tableau){console.log(i[0])}
            let donnees =tableau.map(item =>item[0])
            console.log(donnees)

            donnees.sort(function (a, b) {
                return a.id - b.id;
              });
              console.log(donnees)
              console.log("**********************************************************")

            let tab=[]
            let donnees3
            for(let i in donnees){console.log(donnees[i])}
            console.log("**********************************************************")
            for(let i of donnees){
                console.log(i.name)
                tab.push(i.name)
            }
            console.log("**********************************************************")
             console.log(tab)

             let set = new Set (tab)
             console.log(set)
             
            
            
        
            

            
            
           
            
            


            
           
           /*  let tab2 = Array.from(setCategory)
            let setTab2= new Set(tab2) */
            
            
            
           
          /*   set.forEach((value)=>{
                let button = document.createElement("button")
                button.classList.add("button")
                button.innerText = value
                gallery.appendChild(button) 

            })*/
        }
    )  
}


 


let works_fetch = fetchWorks()/* works_fetch est une promesse qui contient le tableau d'objets à traiter,elle doit etre appelée en premier pour chercher les données sur le serveur */
displayTous()
displayContentOfGallerySearch()




