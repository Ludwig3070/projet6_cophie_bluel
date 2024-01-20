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
            let gallery = document.querySelector(".gallery") 
            gallery.innerHTML=''//erase the gallery before traitment,usefull in others parts of code
            worksArray.map((item) => {//iteration for each item
                /**
               * displays images in the gallery for each item 
               */
                function display() {//internal function available only here which is used to optimise code 
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

            /* this second part of code creates the buttons in search_categorie  */
            let gallerySearch = document.querySelector(".search_categories");
            let i =1//usefull to create a data-set after
            set.forEach((value) => {//creates sequence for each iteration
                let button = document.createElement("button")//create a button
                button.classList.add("button")//add class on the button             
                button.innerText = value//add txt on the button
                button.setAttribute('data-id',i)
                gallerySearch.appendChild(button)                
                i++
            })//create the buttons of the DOM --->END

            /* this third part of code manages buttons on click */
            let buttons = document.querySelectorAll(".search_categories button")
            
            function change(value){
                let val=Number(value)//transforms value into number
                /* console.log(val)               //to erase
                console.log(buttons[val])  */               
                buttons.forEach(v => v.classList.remove("button_active"))//remove active class              
                buttons[val].classList.add("button_active")//add active class on the active button                               
            }                   
            for(let item of buttons){ item.addEventListener("click",() =>{
                change(item.dataset.id)
                displayGallery(Number(item.dataset.id))
                })}//for each iteration => function change                
        }
    )
}



/**
 * this fonction toggles displays of index_section and login_section
 * @param {Array} index_section 
 * @param {string} login_section 
 */
async function displayLogin(){
    const index_section=[introduction,portfolio,contact]
    const Login_section=[login]
    for(let i of index_section){
        let a = document.getElementById(`${i}`)
       /*  a.classList.add("none") */
       console.log(a)
    }
   
    const login_section = document.getElementById("login")
    /* login_section.classList.remove("none") */

    

}


/* main code */

let works_fetch = fetchWorks()/* works_fetch is a promise which contains the array of objects to be processed, it must be called first to fetch the data from the server and be able to use the functions */



displayGallerySearch()//call function to display search buttons,this function manage clicks on buttons too,there's no other way  
displayGallery()//displays all images

const login_button = document.getElementById("nav_login")

login_button.addEventListener ("click",displayLogin())




/* click management on buttons */
/* pimple recovery */
/* voir hicham */

/* https://developer.mozilla.org/fr/docs/Web/API/Element/children */

/* https://developer.mozilla.org/fr/docs/Web/API/Node/childNodes */
  
/* let sc = document.querySelector(".search_categories")
  console.log(sc.children[0])
  console.log(sc.children[1])//undefined
  console.log(sc)
  console.log(sc.childNodes)
  console.log("********************")
  console.log(sc.childNodes[2])
  console.log("********************")
  console.log(sc.children)
  console.log(sc.children[0].nextElementSibling)//null
  
  
 let but = sc.querySelectorAll(".button")
 console.log(but)
 console.log(but.nextSibling)


 console.log(sc.childNodes.entries())
 arr =Array.from(sc.childNodes.entries)
 console.log(arr)

console.log("li ********************")
let li = sc.childNodes

console.log(li)
console.log(li[3])//undefined ?
console.log(li[2].nextSibling)//undefined ?

li.forEach(v=>console.log(v))//pourquoi pas tous les elements
console.log('***********************1')
console.log(sc.innerHTML)
console.log('***********************2')

let p = sc.children
console.log(p)
console.log(p[1]) //undefined ?
console.log(p[0].nextElementSibling) //null ?
console.log(p[0].nextSibling.nextElementSibling) //null ? chelou


let r = Array.from(p)
console.log(r)// dingue les elements dynamiques ont disparu
console.log('**************************************************')
console.log('**************************************************')
console.log('**************************************************')
 */