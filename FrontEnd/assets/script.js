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
/* https://www.youtube.com/watch?v=oh6Wtys98ig */
/* https://grafikart.fr/tutoriels/javascript-templates-2076 */
/* https://nouvelle-techno.fr/articles/utiliser-les-datasets-en-javascript-vanilla */
/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file */
/* https://css-tricks.com/snippets/css/custom-file-input-styling-webkitblink/ */
/* https://www.youtube.com/watch?v=jU8avTWJy9s */

/* https://www.youtube.com/watch?v=Vv9cVSt5nWE */
/* https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test */
/* https://developer.mozilla.org/fr/docs/Web/API/FileReader */
/* https://devdoc.net/web/developer.mozilla.org/en-US/docs/Mozilla_event_reference.1.html */
/* https://developer.mozilla.org/fr/docs/Web/API/HTML_Drag_and_Drop_API */




/* concern the API of the server */
/**
 * function that returns a promise with url data or an alert if the server is down
 * @returns promise
 */
async function fetchWorks() {
    /* for main code */
    const r = await fetch("http://localhost:5678/api/works");
    return r.ok ? r.json() : alert("Serveur injoignable"); /* si r.ok return r.json() else return alert */
}
/**
 * put autenthicaton data to get a tocken end a user id
 * @param {string} mail
 * @param {string} password
 * @returns {promise} 
 */
async function autenthicationRequest(mail, password) {
    /* to used hidden main code */

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
                `ERREUR : ${r.status} \nVERIFIER EMAIL ET MOT DE PASSE`
            );
    }
}
/**
 * 
 * @returns a promise with an object json
 */
async function fetchCategories() {
    const r = await fetch("http://localhost:5678/api/categories");
    return r.ok ? await r.json() : alert("Serveur injoignable"); /* if r.ok return r.json() else return alert */
}
/**
 * 
 * @param {formdata} formData with an picture(jpeg,png),a title(string), category(number)
 * @returns 
 */
async function sendWorkToServer(formData) {
    /* to use hidden main code */
    const token = sessionStorage.getItem("token")


    const r = await fetch("http://localhost:5678/api/works", {

        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, },
        body: formData,
    });

    return r.ok ? null : alert(`ERREUR : ${r.status}`)

}
/**
 * delete a work on the API by id
 * @param {number} id 
 * @returns 
 */
async function deleteWork(id) {
    /* to use hidden main code */
    const token = sessionStorage.getItem("token")
    const r = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, },
    });
    return r.ok ? null : alert(`ERREUR : ${r.status}`)
}
/* all functions */

/**
 * 
displays images in the gallery according to the category of the "arg" parameter (0=all) (1..3 for others categories),selectedTag is the tag on which function must be performed
 * @param {number} arg categorie to be display on selectedTag
 */
function displayGallery(arg, selectedTag = '.gallery', trash = false) {
    works_fetch.then(
        //promise of works_fetch accepted
        (worksArray) => {
            /* worksArray is the object (here an array) result of the promise */
            let gallery = document.querySelector(selectedTag);
            gallery.innerHTML = ""; //erase the gallery before traitment,usefull in others parts of code

            worksArray.map((item) => {//iteration for each item
                if (!arg) { display(trash); } //select and display the correpondant content of argument
                else {
                    item.categoryId === arg ? display() : null;//if arg = categoryID-->diplay()
                }
                /**
                  * displays images in the gallery for each item
                  */
                function display(trash = false) {

                    //internal function available only here which is used to optimise code
                    let figure = document.createElement("figure");
                    gallery.appendChild(figure); /* these instructions create the tags figure */
                    let img = document.createElement("img"); //create tag img
                    img.src = item.imageUrl; //path of img
                    img.alt = item.title; //alternative text of img
                    figure.appendChild(img); /* these instructions add images in figure */
                    let figcaption = document.createElement("figcaption"); /* the next three instructions add figcaption and its text  */
                    figcaption.innerText = item.title;
                    figure.appendChild(figcaption);
                    if (trash === true) {//add trash bin on image
                        let logo = document.createElement("img")
                        logo.src = "./assets/icons/trash-can-solid.svg"
                        logo.classList.add("trash_img")
                        let div = document.createElement("div")
                        div.classList.add("trash")
                        div.setAttribute("data-id", item.id)
                        figure.appendChild(div)
                        div.appendChild(logo)
                    }
                }/* end of function display */
            });
            (trash === true) ? manageTrashbin() : null//to put trashes active on click

        }
    );
}
/**
 * create the search_categrories DOM on index.html and manages buttons (very big function)
 */
function displayCategoryButtonsBar() {

    //treatment of errors
    works_fetch.catch((error) => {
        /* manages problems of network */
        alert(`${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`);
    });

    works_fetch.then((r) => {
        /* this first part of code allows you to fill search_categories with the buttons in the same order as the FIGMA model without using another HTML request
        (http://localhost:5678/api/categories)+ GET */

        let array1 = r.map((item) => [item.category]); //make an array of ARRAYS with categories and unordered id
        let datas = array1.map((item) => item[0]); //datas is an array of OBJECTS with unordered categories and id
        /* console.log(array1) */
        datas.sort(function (a, b) {
            //sorting array with ascending id
            return a.id - b.id;
        });
        /* console.log(datas); */
        let tab = []; //provisional array for data processing
        for (let i of datas) {
            tab.push(i.name);
        } //filling the table with the names (STRING) of the ordered categories but with duplicates
        console.log(tab);
        let set = new Set(tab); //this set remove all duplicates (because tab is an array of STRINGs, with objects it doesn't work)
        console.log(set);

        /* this second part of code creates the buttons in search_categorie  */
        let gallerySearch = document.querySelector(".search_categories");
        let i = 1; //usefull to create a data-set after (further)
        set.forEach((value) => {
            //creates sequence for each iteration
            let button = document.createElement("button"); //create a button
            button.classList.add("button"); //add class on the button
            button.innerText = value; //add txt on the button
            button.setAttribute("data-id", i);//add a dataset id on the button
            gallerySearch.appendChild(button);//create the button in the DOM
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
 * swap main    main(hidden) <--->main vice versa + include fontweight toggle of login/logout on the header,toggle font weight 400<--->600 and vice versa on navlogin/logout
 */
function toggleMain() {
    const mains = document.querySelectorAll("main"); //it is a nodelist with 2 tags main
    mains.forEach((main) => main.toggleAttribute("hidden")); //toggles the attribte hidden

    const nav_login = document.getElementById("nav_login");
    nav_login.classList.contains("li_logout") ? nav_login.classList.remove("li_logout") : nav_login.classList.add("li_logout")
}
/**
 * toggle display of edition mode in the header (opacity 0 <---> 1)
 */
function toggleModeEditionBar() {
    const edition_mode = document.querySelector(".edition_mode");
    const header = document.getElementById("header");
    edition_mode.classList.contains("none") ? edition_mode.classList.remove("none") : edition_mode.classList.add("none")
    header.classList.contains("margin_top_100px") ? header.classList.remove("margin_top_100px") : header.classList.add("margin_top_100px")
}
/**
 * toggle logout/login text on the header and vice versa
 */
function toggleNavLogin() {
    let nav_login = document.getElementById("nav_login");
    nav_login.innerText === "logout" ? nav_login.innerHTML = "login" : nav_login.innerHTML = "logout"
}
/**
 * toggle class deleted on logo supervisor_access used in editor mode
 */
function toggleSupervisorAccess() {
    const supervisor_access_image = document.querySelector(".supervisor_access")
    supervisor_access_image.classList.toggle("deleted")
}
/**
 * used with event on click on the editor mode only, don't use it somewhere else 
 */
function returnToBasicMode() {
    const nav_login = document.getElementById("nav_login");//necessary for the two last line of code

    toggleModeEditionBar()//display off the edition mode bar on the header
    toggleNavLogin() //display login on the header (logout--->login)
    ToggleButtonBarClassDisplay()//move the gallery_search_categories on
    toggleSupervisorAccess()//manage button "modifier" (delete it)

    nav_login.removeEventListener("click", returnToBasicMode)//remove effect on button login/logout 
    nav_login.addEventListener("click", toggleMain);//get ready click to toggle main
}
/**
 * toggle display on search_categories
 */
function ToggleButtonBarClassDisplay() {
    const search_categories = document.querySelector(".search_categories")
    search_categories.classList.toggle("deleted")
}
/**
 * move display modal on
 */
function showModalGaleryPhoto() {
    const body = document.querySelector("body") //get the first main tag
    const cover_page = document.createElement("div")
    const modal = document.querySelector(".modal")
    cover_page.classList.add("cover_page")
    body.appendChild(cover_page)//create a new page over index.html
    modal.classList.remove("no_visible") // display on modal
    const modal_close1 = document.querySelector(".close")
    const modal_close2 = document.querySelector(".cover_page")
    const button_add_picture = document.querySelector('.modal_button')
    modal_close1.addEventListener("click", hideModalGaleryPhoto) //make the click active on button 'close'   
    modal_close2.addEventListener("click", hideModalGaleryPhoto)//make the click active 
    button_add_picture.addEventListener("click", showModalAddPhoto)

}
/**
 * move display modal off
 */
function hideModalGaleryPhoto() {
    /* const body = document.querySelector("body") //get the first main tag */
    const cover_page = document.querySelector(".cover_page")
    const modal = document.querySelector(".modal")
    cover_page.remove()//delete page over index.html
    modal.classList.add("no_visible") // display off modal 
}
/**
 * displays end manages the modal "AddPhoto"
 */
function showModalAddPhoto() {
    /* https://www.youtube.com/watch?v=oh6Wtys98ig */
    /* https://grafikart.fr/tutoriels/javascript-templates-2076 */
    /* https://developer.mozilla.org/fr/docs/Web/API/Node/cloneNode */
    formData = new FormData()
    /* this next code create a new modal (modal2 ) using template */
    const main = document.querySelector("main")
    const template = document.getElementById("modal2")// get template from the DOM
    let modal2 = template.content.cloneNode(true) // make a clone of the template
    main.append(modal2)//create a new section with the clone on main
    /* end of modal 2 */

    /* next code manages the arrow and the cross and the cover page click to, in order to remove modal2 by click*/
    modal2 = document.querySelector(".modal2")
    const arrow2 = document.getElementById("modal2_arrow_left")
    const cross2 = document.getElementById("cross2")
    const cover_page = document.querySelector(".cover_page")
    /* console.log(modal2) */
    cross2.addEventListener("click", () => {
        modal2.remove()
        hideModalGaleryPhoto()
    })
    cover_page.addEventListener("click", () => modal2.remove())

    arrow2.addEventListener("click", () => modal2.remove())
    /* end of arrow and cross */

    /* next code manages the content of "catégories input form*/

    categories.then((reponse) => {
        let category_tag = document.getElementById("category")//get the input category
        /* console.log(reponse) */

        for (let item of reponse) {//set option on the input category
            /* console.log(item) */
            let option = document.createElement("option")
            option.innerText = `${item.name}`
            option.setAttribute("data-id", item.id)//set data in the tag in order to be used by JS
            option.setAttribute("data-name", item.name)//set data in the tag in order to be used by JS           
            category_tag.appendChild(option)
        }

    })

    /* next code manages the file to add on the canva when you click on button inside the canva*/
    const load_file = document.getElementById("addPhotos")//get the button addphoto
    load_file.addEventListener("change", function (event) {
        formData.append("image", this.files[0])//add to formdata in order to be sent to the serveur
        previewFile(this.files[0])
    })//listen on load_file, execute previewFile


    /* drag and drop option when you drag a file on the canva */

    const drop_file = document.querySelector(".modal2_get_photo_canva")


    drop_file.addEventListener('dragover', e => {//dragover and preventDefault allows to drop a file on drop-file
        e.preventDefault()
        drop_file.classList.add("dragover")//add a blur around drop-file when drag file is over
    })
    drop_file.addEventListener('dragleave', e => {
        e.preventDefault()
        drop_file.classList.toggle("dragover")//remove blur when dreg file leave drop_file

    })


    drop_file.addEventListener('drop', processData)

    /**
     * this function add the image which you have dropped on the canva in formdata
     * @param {ImageData} event 
     */
    function processData(event) {
        event.preventDefault()
        drop_file.classList.toggle("dragover")//toggle blur when file is dropped
        let file = event.dataTransfer.files[0] //file = transferered file 0 https://www.youtube.com/watch?v=9WHqGNgAtI8 from 53mn
        formData.append("image", file)//add file to formdata in order to be sent to the serveur
        // Process the data …
        /*   console.log ("transfert ok")
         console.log ("event.dataTransfer = ",event.dataTransfer)
         console.log ("event.dataTransfer.getData('path') = ",event.dataTransfer.getData('name') )
         console.log("file=",file)
         console.log("filename=",file.name)  */

        previewFile(file)

    }


    /*
    * internal function which manages the format and the size of the file to upload and display
    */
    function previewFile(arg = 0) {
        const file_extension_regex = /\.(jpg|jpeg|png)$/i //decaration of the regex
        let file = arg
        if (!file_extension_regex.test(file.name)) {//if test regex is false on the name ...
            alert("le fichier n'est pas au format demandé")
            return
        }
        if (file.size > 4000000) {//if image is too big ...
            alert("le fichier est superieur à 4 MO")
            return
        }

        const file_reader = new FileReader()//https://fr.javascript.info/file
        file_reader.readAsDataURL(file)//https://developer.mozilla.org/fr/docs/Web/API/FileReader
        file_reader.addEventListener("load", (event) => imageAndForm_manage(event, file))
        /* console.log (file) */


        /**
        * display image chosen on the canva,set dat-id attribute , manages the others form fields
        * @param {event} event 
        * @param {img} file 
        */
        function imageAndForm_manage(event, file) {
            /* console.log (file_reader.result) */
            sessionStorage.setItem("file_reader", file_reader.result.toString())//store file_reader on session storage    
            let canva = document.querySelector(".modal2_get_photo_canva")
            canva.innerHTML = ""//erase content of canva
            const img = document.createElement("img")
            img.classList.add("preview_img")
            img.src = event.target.result
            /* console.log("RRRR",img.src) */
            /* sessionStorage.setItem("image3",event.target.result) */
            img.setAttribute("data-id", true)
            canva.appendChild(img)// display img on canva
            /* console.log(img.dataset.id) */
            const title = document.getElementById("title")
            const category = document.getElementById("category")
            title.addEventListener("input", compare)
            category.addEventListener("input", compare)
            title.value = ''//empty the field before entering the photo
            category.value = ''//empty the field before entering the photo
            /**
             * manage informations in form and the photo on the canva
             * @returns nothing
             */
            function compare() {
                let button = document.querySelector(".modal2 button")
                const valider = document.querySelector(".modal2 .modal_button")
                if (!title.value || !category.value) {
                    button.classList.contains("button_active") ? button.classList.remove("button_active") : null
                    button.classList.contains("button") ? button.classList.remove("button") : null
                    button.classList.add("passive_modal_button")
                    valider.removeEventListener('click', sendToServer)
                    return
                }
                button.classList.remove("passive_modal_button")
                button.classList.add("button_active")
                button.classList.add("button")
                valider.addEventListener('click', sendToServer)
                validationCondition = (title.value && category.value && valider.classList.contains("button_active"))
                validationCondition ? valider.addEventListener('click', sendToServer) : valider.removeEventListener('click', sendToServer)
            }
            function sendToServer() {
                formData.append("title", title.value)
                const option = category.querySelectorAll("#category option")
                const optionArray = Array.from(option)
                optionArray.forEach((item) => {
                    /* console.log(item.index)
                    console.log(item.value) */
                    item.value === category.value ? formData.append("category", item.index) : null
                })

                if (confirm("Etes vous sûre de vouloir envoyer ?")) {
                    const send = sendWorkToServer(formData)
                    send.then(res => {
                        /*  console.log("ok") */
                        fetchWorks().then(() => {
                            works_fetch = fetchWorks()//mandatory to upload the new work
                            /* console.log(works_fetch) */
                            displayGallery()//display gallery with the new work
                            displayGallery(0, tag, true)//gallery display in modal
                            /* console.log ("display ok") */
                        }).then(() => {
                            /*  console.log ("modal2.remove ok") */
                            modal2.remove()
                        })
                    })
                    //treatment of errors
                    send.catch((error) => {
                        /* manages problems of network */
                        alert(`${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`)
                        modal2.remove()
                    });

                }
                else { modal2.remove() }
            }
        }

    }

}
/**
 * this fonction is used to be ready to go to the editor mode whith a click on login,only used when the editor mode is running
 */
function goToEditorMode() {
    const nav_login = document.getElementById("nav_login");
    const supervisor_access = document.querySelector(".supervisor_access")
    /* this next code do modifications and return on the website in editor mode */

    toggleNavLogin()// --->login on the website-page-header becomes logout                
    nav_login.removeEventListener("click", toggleMain)//remove action of the  login/logout button of the header              
    toggleMain()/* go to the editor-main-mode */
    toggleModeEditionBar()// move on display of header edition mode
    ToggleButtonBarClassDisplay()//delete display of gallery search
    toggleSupervisorAccess()//move on display of the button "modifier"
    nav_login.addEventListener("click", returnToBasicMode);//manages click on login/logout on the header of the website
    supervisor_access.addEventListener("click", showModalGaleryPhoto);//manages click to move modal on

}
/**
 * manages submit button to get autenthication,manages login button to return to the website before submit if necessary,goes to editor mode if autenthication is successfull
 *
 */
function goToLoginModal() {

    const nav_login = document.getElementById("nav_login");
    nav_login.addEventListener("click", toggleMain);//manages click on login/logout on the header of the website

    /* manages click on submit for autenthication */
    /* https://developer.mozilla.org/en-US/docs/Web/API/Document/forms */
    document.forms["editor_form"].addEventListener("submit", function (event) {//manages click on form submit "se connecter"        
        event.preventDefault();
        let serverAutenthicationRequest = autenthicationRequest(//call function autenthicationRequest with 2 parameters inside the form
            document.forms["editor_form"]["editor_email"]["value"],
            document.forms["editor_form"]["editor_password"]["value"]
        );

        //treatment of errors
        serverAutenthicationRequest.catch((error) => {
            /* manages problems of network */
            alert(`${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`);
        });
        //treatment of api response
        serverAutenthicationRequest.then(/* response is an object with userid and token */
            response => {/* in this part of code acces is confirmed so it can manage a new stage */
                sessionStorage.setItem("token", response.token)//store token on session storage

                goToEditorMode()//display editor mode                                
            }
        );
    });
}

/**
 * this function adds an event "click" on the buttons with a trash on them,deletes correspondant work and refresh the displays of galleries ,it can be used only where trashes are defined
 * @param {} id 
 */
function manageTrashbin() {
    let allTrashes = document.querySelectorAll('.trash')//nodeList
    allTrashes = Array.from(allTrashes)
    /* console.log("trashes=",allTrashes)   */
    allTrashes.forEach((trash) => {
        /* console.log("trash=",trash.dataset.id) */
        /* trash.addEventListener("click",event=>console.log(trash.dataset.id)) */
        trash.addEventListener("click", event => {
            if (confirm("Voulez vous supprimer ce contenu ?")) {
                /* console.log(trash.dataset.id) */
                const del = deleteWork(trash.dataset.id)//deleteWork return a promise
                del.then(res => {
                    /*  console.log("ok") */
                    works_fetch = fetchWorks() //mandatory to upload the new work                           
                    works_fetch.then(() => {
                        displayGallery()//display gallery with the new work
                        displayGallery(0, tag, true)//gallery display in modal                                                  
                    }).then(hideModalGaleryPhoto).then(showModalGaleryPhoto)//refresh of modal
                })
                 //treatment of errors
                 del.catch((error) => {
                    /* manages problems of network */
                    alert(`${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`)                    
                });
            }
        })
    })
}
/* main code */
let works_fetch = fetchWorks(); /* works_fetch is a promise which contains the array of objects to be processed, it must be called first to fetch the data from the server and be able to use the functions */
const categories = fetchCategories()//promise which contains datas categories from the api
/* works_fetch.then(response => console.log(response)) */
//treatment of errors manages problems of network 
categories.catch((error) => alert(`${error} \n\n SERVEUR INACCESSIBLE \n VEUILLEZ VERIFIER VOTRE CONNEXION AU RESEAU`))
displayCategoryButtonsBar(); //call function to display search buttons,this function manage clicks on buttons to
displayGallery(); //displays all images
goToLoginModal(); //manages login if necessary
/* let datas_store =JSON.parse(sessionStorage.getItem("datas").toString()) //datas obtaessentialined from the session store */
/* works_fetch.then(r=>console.log("in main code works_fetch.then()",r))//fonctionne ici */
let tag = ".gallery_photos"
displayGallery(0, tag, true)//gallery display in modal





