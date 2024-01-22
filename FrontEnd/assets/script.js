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
 * @param {number} arg 
 */
async function displayGallery(arg) {
    works_fetch.then(
        //promise of works_fetch accepted
        (worksArray) => {
            /* worksArray is the object (here an array) result of the promise */
            let gallery = document.querySelector(".gallery");
            gallery.innerHTML = ""; //erase the gallery before traitment,usefull in others parts of code
            worksArray.map((item) => {//iteration for each item
                
                /**
                 * displays images in the gallery for each item
                 */
                function display() {
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
                }/* end of function display */

                if (!arg) {display();} //select and display the correpondant content of argument
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
async function displayGallerySearch() {
    works_fetch.then((r) => {
        /* this first part of code allows you to fill search_categories with the buttons in the same order as the FIGMA model without using another HTML request
                        (http://localhost:5678/api/categories)+ GET */

        let array1 = r.map((item) => [item.category]); //make an array of arrays with categories and unordered id
        let datas = array1.map((item) => item[0]); //data is an array of OBJECTS with unordered categories and id
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
        }); //create the buttons of the DOM --->END

        /* this third part of code manages buttons on click */
        let buttons = document.querySelectorAll(".search_categories button");

        function change(value) {
            let val = Number(value); //transforms value into number
            buttons.forEach((v) => v.classList.remove("button_active")); //remove active class
            buttons[val].classList.add("button_active"); //add active class on the active button
        }
        for (let item of buttons) {
            item.addEventListener("click", () => {
                change(item.dataset.id);
                displayGallery(Number(item.dataset.id));
            });
        } //for each iteration => function change
    });
}

/**
 * swap main    main(hidden) <--->main vice versa + include fontweight toggle of login/logout on the header
 */
function main_toggle(){
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
function edition_mode_toggle(){
    const edition_mode = document.querySelector(".edition_mode");
    const header = document.getElementById("header");
    edition_mode.classList.contains("none") ? edition_mode.classList.remove("none") : edition_mode.classList.add("none")
    header.classList.contains("margin_top_100px") ? header.classList.remove("margin_top_100px") : header.classList.add("margin_top_100px")
}
/**
 * move on off and vice versa the display of this button
 */
function modify_button_toggle_display(){
    const modify_button = document.querySelector(".supervisor_access")
    modify_button.classList.contains("deleted") ? modify_button.classList.remove("deleted") : modify_button.classList.add("deleted")
}

function nav_log_out_in_toggle(){
    let nav_login = document.getElementById("nav_login");
    nav_login.innerText === "logout" ? nav_login.innerHTML = "login" : nav_login.innerHTML = "logout"
}
/**
 * used with event on click on the editor mode only, don't use it somewhere else 
 */
function return_to_basic_mode(){
    const nav_login = document.getElementById("nav_login");
    modify_button_toggle_display()
    edition_mode_toggle()
    nav_log_out_in_toggle()
    nav_login.removeEventListener("click",return_to_basic_mode)//remove effect on button login/logout 
    nav_login.addEventListener("click", main_toggle);//manages click on login/logout on the header of the website
}
/**
 * toggle display on search_categories
 */
function search_categories_toggle_deleted(){
    const search_categories = document.querySelector(".search_categories")
    search_categories.classList.toggle("deleted") 
}


/**
 * this fonction toggles displays of index_section and login_section,it manages click event to
 *
 */
async function loginListenenerAndToggle() {
    /* hidden code, mode editor */
    /* this listener manages the login window and opens the edition window for authentification */
    const nav_login = document.getElementById("nav_login");
    const mains = document.querySelectorAll("main"); //it is a nodelist with 2 tags main    
    

    nav_login.addEventListener("click", main_toggle);//manages click on login/logout on the header of the website
        
    /* manages click on submit for autenthication */
    document.forms["editor_form"].addEventListener("submit", function (event) {//manages click on form submit "se connecter"
        
        event.preventDefault();
        let server_request = autenthication_request(//call function autenthication_request with 2 parameters inside the form
            document.forms["editor_form"]["editor_email"]["value"],
            document.forms["editor_form"]["editor_password"]["value"]
        );

        server_request.catch((error) => {//treatment of error
            /* manages problems of network */
            alert(
                `${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`
            );
        });

        server_request.then(//treatment of api response
            /* response is an object with userid and token */
            /* in this part of code acces is confirmed so it can manage a new stage */
            (response) => {
                access_datas = response;//store userId and token on acces_datas
                console.log(access_datas);
                console.log(access_datas.token);
                console.log(access_datas.userId);

                /* this next code do modifications and return on the website in editor mode */
                modify_button_toggle_display()//--->move on display of this "button"
                nav_log_out_in_toggle()// --->login on the website page becomes logout                
                nav_login.removeEventListener("click",main_toggle)//remove effect on button login/logout               
                main_toggle()/* to return on the other main with editor mode */               
                edition_mode_toggle()// move on display of header edition mode
                search_categories_toggle_deleted()
                nav_login.addEventListener("click", return_to_basic_mode);//manages click on login/logout on the header of the website
            }
        );
    });
    
}

/* main code */

let works_fetch =
    fetchWorks(); /* works_fetch is a promise which contains the array of objects to be processed, it must be called first to fetch the data from the server and be able to use the functions */
let access_datas; // for hidden code
displayGallerySearch(); //call function to display search buttons,this function manage clicks on buttons too,there's no other way
displayGallery(); //displays all images
loginListenenerAndToggle(); //manages login if necessary



