/* Ressources  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener */
/* https://javascript.info/map-set#set */





/* get data from the server */

/**
 * function that returns a promise with url data or an alert if the server is down
 * @returns promise
 */
async function fetchWorks() {
    const r = await fetch("http://localhost:5678/api/works");
    return r.ok ? await r.json() : alert('Serveur injoignable');/* si r.ok return r.json() else return alert */
}

/**
 * 
displays images in the gallery according to the category of the "arg" parameter (0=all)
 * @param {number} arg 
 */
async function displayGallery(arg) {
    works_fetch.then(//promise of works_fetch accepted
        (worksArray) => {/* worksArray is the object (here an array) result of the promise */
            worksArray.map((item) => {//iteration for each item
                /**
               * displays images in the gallery for each item 
               */
                function display() {//internal function available only here which is used to optimise code 
                    let gallery = document.querySelector(".gallery")
                    let figure = document.createElement("figure")
                    gallery.appendChild(figure)/* these instructions create the tags figure */
                    let img = document.createElement("img")//create tag img
                    img.src = item.imageUrl //path of img
                    img.alt = item.title //alternative text of img
                    figure.appendChild(img)/* these instructions add images in figure */
                    let figcaption = document.createElement("figcaption")/* the next three instructions add figcaption and its text  */
                    figcaption.innerText = item.title
                    figure.appendChild(figcaption)
                }
                /* end of function display */
                if (!arg) { display() }//select and display the correpondant content of argument
                else { item.categoryId === arg ? display() : null }
            })
        }
    )
}


/**
 * create the search_categrories DOM on index.htm
 */
async function displayGallerySearch() {
    works_fetch.then(
        (r) => {
            /* this first part of code allows you to fill search_categories with the buttons in the same order as the FIGMA model without using another HTML request
            (http://localhost:5678/api/categories)+ GET */

            let array1 = r.map(item => [item.category]); //make an array of arrays with categories and unordered id
            let datas = array1.map(item => item[0]);//data is an array of OBJECTS with unordered categories and id
            /* console.log(datas); */
            datas.sort(function (a, b) {//sorting array with ascending id
                return a.id - b.id;
            });
            /* console.log(datas); */
            let tab = [];//provisional array for data processing             
            for (let i of datas) { tab.push(i.name) }//filling the table with the names (STRING) of the ordered categories but with duplicates
            /* console.log(tab);  */
            let set = new Set(tab); //this set remove all duplicates (because tab is an array of STRINGs, with objects it doesn't work)
            /* console.log(set); */

            /* this second part of code create the buttons in search_categorie  */
            let gallerySearch = document.querySelector(".search_categories");

            set.forEach((value) => {//create sequence for each iteration
                let button = document.createElement("button")//create a button
                button.classList.add("button")//add class on the button             
                button.innerText = value//add txt on the button
                gallerySearch.appendChild(button)
            })//create the button of the DOM
        }
    )
}




/* programme principal */

let works_fetch = fetchWorks()/* works_fetch is a promise which contains the array of objects to be processed, it must be called first to fetch the data from the server and be able to use the functions */

displayGallerySearch()//call function to display search buttons
displayGallery()//displays all images




/* click management on buttons */
/* pimple recovery */
let buttons = document.querySelectorAll(".button")
console.log(buttons)
buttons.forEach(v=>console.log(v))


