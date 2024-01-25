/* some Ressources used */ 
/* https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener */
/* https://javascript.info/map-set#set */
/* https://developer.mozilla.org/fr/docs/Web/API/DOMTokenList/toggle */
/* https://www.alsacreations.com/actu/lire/1776-element-main-html5.html */
/* https://www.youtube.com/watch?v=I_UnFEkJsC8 */
/* https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/hidden */
/* https://stackoverflow.com/questions/58031311/toggle-text-in-button-onclick */
/* ressources https://www.youtube.com/watch?v=arjtn3uNiK4 */ /* 16mn */
/* https://developer.mozilla.org/fr/docs/Web/API/Element/children */
/* https://developer.mozilla.org/fr/docs/Web/API/Node/childNodes */
/* https://www.youtube.com/watch?v=PmrHg7q5raw */
/* https://openclassrooms.com/fr/courses/7697016-creez-des-pages-web-dynamiques-avec-javascript/7911201-sauvegardez-les-donnees-dans-le-localstorage */
/* https://www.youtube.com/watch?v=3MUmRP9013I */

/* get data from the server */

/**
 * function that returns a promise with url data or an alert if the server is down
 * @returns promise
 */
async function fetchWorks() {
    /* for main code */
    const r = await fetch("http://localhost:5678/api/works");
    return r.ok
        ? await r.json()
        : alert(
            "Serveur injoignable"
        ); /* si r.ok return r.json() else return alert */
        
}

/**
 * put autenthicaton data to get a tocken end a user id
 * @param {string} mail
 * @param {stringtring} password
 * @returns {promise} 
 */
async function autenthication_request(mail, password) {
    /* for hidden code */

    const r = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: JSON.stringify({
            email: mail,
            password: password,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    if (r.ok) {
        return await r.json();
    } else {
        Number(r.status) === 401
            ? alert(`ERREUR : ${r.status} \nVERIFIER EMAIL ET MOT DE PASSE`)
            : alert(
                `ERREUR : ${r.status} \nProblème de réseau,veuillez réessayer ulterieurement`
            );
    }
}

/**
 * 
displays images in the gallery according to the category of the "arg" parameter (0=all) (for main code)
 * @param {number} arg categorie to be display on gallery
 */
function displayGallery(arg,arg2='.gallery',arg3 = 0) {
    works_fetch.then(
        //promise of works_fetch accepted
        (worksArray) => {
            /* worksArray is the object (here an array) result of the promise */
            let gallery = document.querySelector(arg2);
            gallery.innerHTML = ""; //erase the gallery before traitment,usefull in others parts of code
            worksArray.map((item) => {//iteration for each item
                
                /**
                 * displays images in the gallery for each item
                 */
                function display(arg3) {
                    
                    //internal function available only here which is used to optimise code
                    let figure = document.createElement("figure");
                    gallery.appendChild(figure); /* these instructions create the tags figure */
                    let img = document.createElement("img"); //create tag img
                    img.src = item.imageUrl; //path of img
                    img.alt = item.title; //alternative text of img
                    figure.appendChild(img); /* these instructions add images in figure */
                    let figcaption =document.createElement("figcaption"); /* the next three instructions add figcaption and its text  */
                    figcaption.innerText = item.title;
                    figure.appendChild(figcaption);
                    if (arg3===1) {
                        let logo = document.createElement("img")
                        logo.src="./assets/icons/trash-can-solid.svg"
                        logo.classList.add("trash_img")
                        let div = document.createElement("div")
                        div.classList.add("trash")
                        div.setAttribute("data-id", item.id)
                        figure.appendChild(div)
                        div.appendChild(logo)
                    }
                }/* end of function display */

                if (!arg) {display(arg3);} //select and display the correpondant content of argument
                else {
                    item.categoryId === arg ? display() : null;
                }
            });
        }
    );
}
/**
 * create the search_categrories DOM on index.htm (for main code) (very big function)
 */
function displayGallerySearch() {      
    
    //treatment of errors
    works_fetch.catch((error) => {
        /* manages problems of network */
        alert(`${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`);
    });
    
    works_fetch.then((r) => {
        /* this first part of code allows you to fill search_categories with the buttons in the same order as the FIGMA model without using another HTML request
        (http://localhost:5678/api/categories)+ GET */

        let array1 = r.map((item) => [item.category]); //make an array of arrays with categories and unordered id
        let datas = array1.map((item) => item[0]); //data is an array of OBJECTS with unordered categories and id
        sessionStorage.setItem("datas",JSON.stringify(datas))//store datas on session storage, delete further if don't used
        /* console.log(datas); */
        datas.sort(function (a, b) {
            //sorting array with ascending id
            return a.id - b.id;
        });
        /* console.log(datas); */
        let tab = []; //provisional array for data processing
        for (let i of datas) {
            tab.push(i.name);
        } //filling the table with the names (STRING) of the ordered categories but with duplicates
        /* console.log(tab);  */
        let set = new Set(tab); //this set remove all duplicates (because tab is an array of STRINGs, with objects it doesn't work)
        /* console.log(set); */

        /* this second part of code creates the buttons in search_categorie  */
        let gallerySearch = document.querySelector(".search_categories");
        let i = 1; //usefull to create a data-set after (further)
        set.forEach((value) => {
            //creates sequence for each iteration
            let button = document.createElement("button"); //create a button
            button.classList.add("button"); //add class on the button
            button.innerText = value; //add txt on the button
            button.setAttribute("data-id", i);
            gallerySearch.appendChild(button);
            i++;
        }); //create the buttons in the gallery-categorie-search-bar

        /* this third part of code manages buttons on click */
        let buttons = document.querySelectorAll(".search_categories button");
        /**
         * remove class button_active on all buttons and put active_class on the correspondant value of function change(value)
         * @param {number} value is a dataset id
         */
        function change(value) {
            let val = Number(value); //transforms value into number
            buttons.forEach((v) => v.classList.remove("button_active")); //remove active class
            buttons[val].classList.add("button_active"); //add active class on the active button
        }
        for (let item of buttons) {//iterates all buttons to put an event on each button
            item.addEventListener("click", () => {
                change(item.dataset.id);// put class button_active on the button which was clicked
                displayGallery(Number(item.dataset.id));//display the gallery of the correspondant button clicked
            });
        } 
    });
}

/**
 * swap main    main(hidden) <--->main vice versa + include fontweight toggle of login/logout on the header
 */
function main_hiddenmain_toggle(){
    const mains = document.querySelectorAll("main"); //it is a nodelist with 2 tags main
    mains.forEach((main) => main.toggleAttribute("hidden")); //toggles the attribte hidden
    nav_login_weight_toggle()
}
/**
 * toggle font weight 400<--->600 and vice versa on navlogin/logout
 */
function nav_login_weight_toggle(){
    const nav_login = document.getElementById("nav_login");
    nav_login.classList.contains("li_logout") ? nav_login.classList.remove("li_logout") : nav_login.classList.add("li_logout")
}

/**
 * toggle display of edition mode in the header (opacity 0 <---> 1)
 */
function header_edition_mode_bar_toggle(){
    const edition_mode = document.querySelector(".edition_mode");
    const header = document.getElementById("header");
    edition_mode.classList.contains("none") ? edition_mode.classList.remove("none") : edition_mode.classList.add("none")
    header.classList.contains("margin_top_100px") ? header.classList.remove("margin_top_100px") : header.classList.add("margin_top_100px")
}

/**
 * toggle logout/login text on the header and vice versa
 */
function nav_log_out_in_toggle(){
    let nav_login = document.getElementById("nav_login");
    nav_login.innerText === "logout" ? nav_login.innerHTML = "login" : nav_login.innerHTML = "logout"
}
/**
 * toggle class deleted on logo supervisor_access used in editor mode
 */
function supervisor_access_toggle(){
    const supervisor_access_image = document.querySelector(".supervisor_access")
    supervisor_access_image.classList.toggle("deleted")
}
/**
 * used with event on click on the editor mode only, don't use it somewhere else 
 */
function return_to_basic_mode(){
    const nav_login = document.getElementById("nav_login");//necessary for the two last line of code
   
    header_edition_mode_bar_toggle()//display off the edition mode bar on the header
    nav_log_out_in_toggle() //display login on the header (logout--->login)
    gallery_search_categories_toggle_deleted()//move the gallery_search_categories on
    supervisor_access_toggle()//manage button "modifier" (delete it)

    nav_login.removeEventListener("click",return_to_basic_mode)//remove effect on button login/logout 
    nav_login.addEventListener("click", main_hiddenmain_toggle);//get ready click to toggle main
}
/**
 * toggle display on search_categories
 */
function gallery_search_categories_toggle_deleted(){
    const search_categories = document.querySelector(".search_categories")
    search_categories.classList.toggle("deleted") 
}
/**
 * move display modal on
 */
function modal_on(){
    console.log("modal ok")
    const body = document.querySelector("body") //get the first main tag
    const cover_page = document.createElement("div")
    const modal = document.querySelector(".modal")
    cover_page.classList.add("cover_page")
    body.appendChild(cover_page)//create a new page over index.html
    modal.classList.remove("no_visible") // display on modal
    const modal_close1 = document.querySelector(".close")     
    const modal_close2 = document.querySelector(".cover_page") 
    modal_close1.addEventListener("click",modal_off)    
    modal_close2.addEventListener("click",modal_off)
    }

function modal_off(){
    const body = document.querySelector("body") //get the first main tag
    const cover_page = document.querySelector(".cover_page")
    const modal = document.querySelector(".modal")
    cover_page.remove()//delete page over index.html
    modal.classList.add("no_visible") // display off modal 

}

/**
 * this fonction is used to be ready to go to the editor mode whith a click on login,only used when the editor mode is running
 */
function go_to_editor_mode(){
    const nav_login = document.getElementById("nav_login");
    const supervisor_access = document.querySelector(".supervisor_access")
      /* this next code do modifications and return on the website in editor mode */
      
      nav_log_out_in_toggle()// --->login on the website-page-header becomes logout                
      nav_login.removeEventListener("click",main_hiddenmain_toggle)//remove action of the  login/logout button of the header              
      main_hiddenmain_toggle()/* go to the editor-main-mode */               
      header_edition_mode_bar_toggle()// move on display of header edition mode
      gallery_search_categories_toggle_deleted()//delete display og gallery search
      supervisor_access_toggle()//move on dosplay of the button "modifier"
      nav_login.addEventListener("click", return_to_basic_mode);//manages click on login/logout on the header of the website
      supervisor_access.addEventListener("click", modal_on);//manages click to move modal on
    
}


/**
 * manages submit button to get autenthication,manages login button to return to the website before submit if necessary,goes to editor mode if autenthication is successfull
 *
 */
function go_to_autenthication_editor() {
    
    const nav_login = document.getElementById("nav_login");   
    nav_login.addEventListener("click", main_hiddenmain_toggle);//manages click on login/logout on the header of the website
        
    /* manages click on submit for autenthication */
    document.forms["editor_form"].addEventListener("submit", function (event) {//manages click on form submit "se connecter"        
        event.preventDefault();
        let server_autenthication_request = autenthication_request(//call function autenthication_request with 2 parameters inside the form
            document.forms["editor_form"]["editor_email"]["value"],
            document.forms["editor_form"]["editor_password"]["value"]
        );

        //treatment of errors
        server_autenthication_request.catch((error) => {
            /* manages problems of network */
            alert(`${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`);
        });
        //treatment of api response
        server_autenthication_request.then(/* response is an object with userid and token */           
                response => {/* in this part of code acces is confirmed so it can manage a new stage */
                                        
                    sessionStorage.setItem("userId",response.userId)//store userId on session storage
                    sessionStorage.setItem("token",response.token)//store token on session storage
                    console.log("userId : ",sessionStorage.getItem("userId"))
                    console.log("token : ",sessionStorage.getItem("token"))
                    works_fetch.then(r=>console.log("in autenthication_to_editor_mode works_fetch.then()",r))//fonctionne,   pas besoin du storage
                    
                    
                    
                    
                    go_to_editor_mode()//display editor mode
                                
                }
            );
    });    
}

/* main code */

let works_fetch = fetchWorks(); /* works_fetch is a promise which contains the array of objects to be processed, it must be called first to fetch the data from the server and be able to use the functions */
displayGallerySearch(); //call function to display search buttons,this function manage clicks on buttons too,there's no other way
displayGallery(); //displays all images
go_to_autenthication_editor(); //manages login if necessary
/* let datas_store =JSON.parse(sessionStorage.getItem("datas").toString()) //datas obtained from the session store */
/* works_fetch.then(r=>console.log("in main code works_fetch.then()",r))//fonctionne ici */
let tag = ".gallery_photos"
displayGallery( 0, tag , 1 )//gallery display in modal






/* let g = document.querySelector(".gallery_photos")
console.log(g.childNodes)
let p= g.childNodes
q=Array.from(p)
console.log(q)//node list 
for (let i of q){console.log(i)}//tableau vide

let y =g.children
console.log(y)
console.log(y[0])// undefined
console.log(y.firstElementChild)// undefined
 */
