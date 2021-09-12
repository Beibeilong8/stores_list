const main                  = document.querySelector("#main");
const storesList            = document.querySelector("#storesList");
const storesListFooter      = document.querySelector("#storesListFooter");
const storeDetailsHeader    = document.querySelector("#storeDetailsHeader");
const storeDetailsProduct   = document.querySelector("#storeDetailsProducts");
const storeDetailsFooter    = document.querySelector("#storeDetailsFooter");
const storeDetailsHeading   = document.querySelector("#storeDetailsText");
const searchForm            = document.querySelector("#searchForm");
const deleteButton          = document.querySelector("#delete-icon");
const getRequest            = new XMLHttpRequest();
const postStore             = new XMLHttpRequest();
const deleteRequest         = new XMLHttpRequest();
const filtersArray          = [];

let sortingImages;
let productsTableBody;
let sortingField;
let sortingDirection;
let filt;
let Stores;
let products;
let storeId;
let headerTable;
let storesListArr = [];
let storeCheked;

let storesAvailable;
let subStringSearch             = "";
const COUNT_ELEM_TO_CHECK       = 7;
const GET_STORES_URL            = "http://localhost:3000/api/Stores";


const createElement = (selectorStore, className, innerHtml) => {
    let elem = document.createElement(selectorStore);
    elem.classList.add(className);
    if (innerHtml) elem.innerHTML = innerHtml;
    return elem;
}


const createImg = (classImg, url, altText) => {
    return `<img src=${url} alt=${altText} class=${classImg}>`;
}

window.onload = () => {

    getRequest.open("Get", GET_STORES_URL);
    getRequest.responseType = "json";
    getRequest.send();

    storesAvailable = [];
    storesList.         innerHTML = "";
    storeDetailsHeader. innerHTML = "";
    storeDetailsFooter. innerHTML = "";
    storeDetailsHeading.innerHTML = "Store is not selected";
    storeDetailsProduct.innerHTML = `
        <img src="../images/store.svg" alt="Store is nor selected" class="not-selected-image" id="search-icon">
        <h3 class="not-selected-heading">The store is not selected</h3>
        <h4 class="not-selected-sub-heading">Please select the store to proceed</h4>
    `
    storeDetailsHeading.classList.add("header__text_inactive");
    storeDetailsProduct.classList.add("store-details__products-inactive");

    getRequest.onload = function(){
        Stores = getRequest.response;
        Stores.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
            const store = `
                <li class="stores-list__store" data-id="${id}">
                    <div class="stores-list__info" data-id="${id}">
                        <h3 class="store__name" data-id="${id}">${Name}</h3>
                        <div class="store__square" data-id="${id}">
                            <span class="store__square-value" data-id="${id}">${FloorArea}</span>
                            <span class="store__square-units" data-id="${id}">sq.m</span>
                        </div>
                    </div>
                    <div class="store__address" data-id="${id}">${Address}</div>
                </li>
            `;
            storesList.innerHTML += store;
            storesListArr.push(store);
            const storeInArray = {
                id: `${id}`,
                name: `${Name}`,
                FloorArea: `${FloorArea}`,
                Address: `${Address}`,
                Established: `${Established}`,
                PhoneNumber: `${PhoneNumber}`,
                Email:`${Email}`,
            }
            storesAvailable.push(storeInArray);
        })
    }                
}

storesList.addEventListener("click", (event) => {

    // let storeCheked;
    //  = storesAvailable.filter( (item) => {
    //    return item.id === event.target.dataset.id
    // })
    // storeId = storeCheked[0].id;


    for(let i=0; i<storesList.children.length; i++){
        storesList.children[i].classList.remove("active-storage");
        if(storesList.children[i].dataset.id === event.target.dataset.id){
            storesList.children[i].classList.add("active-storage")
            storeCheked = storesAvailable.filter( (item) => {
                   return item.id === event.target.dataset.id
                })[0]
        }
    }
    storeId = storeCheked.id;

    const GET_PRODUCTS_FOR_ID_URL   = `http://localhost:3000/api/Stores/${storeId}/rel_Products`; 
    getRequest.open("Get", GET_PRODUCTS_FOR_ID_URL);
    getRequest.responseType = "json";
    getRequest.send();

// **************************************** header store details *********************************************************************//
    
    storeDetailsHeader. innerHTML = "";    
    storeDetailsHeading.innerHTML = "Store Details";
    storeDetailsHeading.classList.remove("header__text_inactive");
    storeDetailsProduct.classList.add("products");

// **************************************** contacts store *********************************************************************//

    const dateParse = new Date (storeCheked.Established).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })

    const createContacts = function( { Email, PhoneNumber, Address, FloorArea } ){
        storeDetailsHeader.innerHTML += `
            <section class="header__about-store about-store">
                <div class="about-store__block-one">
                    <span class="about-store__title">Email:</span>
                    <address class="about-store__info">${Email}</address>
                    <span class="about-store__title">Phone Number:</span>
                    <address class="about-store__info">${PhoneNumber}</address>
                    <span class="about-store__title">Address:</span>
                    <address class="about-store__info">${Address}k</address>
                </div>
                <div class="about-store__block-two">
                    <span class="about-store__title">Established Date:</span>
                    <address class="about-store__info">${dateParse}</address>
                    <span class="about-store__title">Floot Area:</span>
                    <address class="about-store__info">${FloorArea}</address> 
                </div>
            </section>
        `;
    };
    createContacts(storeCheked);
    
// **************************************** filters store *********************************************************************//

    const createFilters = function ({ }){
        storeDetailsHeader.innerHTML += `
        <section class="filters product-statuses">
            <div class="product-statuses__all" id="filterAll">
                <div class="product-statuses__products-sum" id="sumAll"></div>
                <span class="product-statuses__all-text">All</span>
            </div>
            <div class="product-statuses__choice">
                <figure class="filter ok" id="figureOk">
                    <div class="filter__sum ok" id="sumOk"></div>
                    <img src="../images/check.svg" alt="filter image 1" class="filter__image ok">
                    <span class="filter__about ok">Ok</span>
                </figure>
                <figure class="filter storage" id="figureStorage">
                    <div class="filter__sum storage" id="sumStorage"></div>
                    <img src="../images/warning.svg" alt="filter image 2" class="filter__image storage">
                    <span class="filter__about storage">Storage</span>
                </figure>
                <figure class="filter out" id="figureOut">
                    <div class="filter__sum out" id="sumOut"></div>
                    <img src="../images/warning-2.svg" alt="filter image 3" class="filter__image out">
                    <span class="filter__about out">Out of stock</span>
                </figure>
            </div>
        </section>
        `
    }

    createFilters(storeCheked);
    getRequest.onload = function(){

    const sumAll        = storeDetailsHeader.querySelector("#sumAll");
    const sumOk         = storeDetailsHeader.querySelector("#sumOk");
    const sumStorage    = storeDetailsHeader.querySelector("#sumStorage");
    const sumOut        = storeDetailsHeader.querySelector("#sumOut");

    products = getRequest.response;
    sumAll.     innerHTML = products.length;
    sumOk.      innerHTML = products.filter( (item) => item.Status === "OK").length;
    sumStorage. innerHTML = products.filter( (item) => item.Status === "STORAGE").length;
    sumOut.     innerHTML = products.filter( (item) => item.Status === "OUT_OF_STOCK").length;

    storeDetailsHeader.addEventListener("click", (event) => {

        storeDetailsHeader.querySelectorAll(".filter").forEach((item) => {
            item.classList.remove("active-filter")
        })
        storeDetailsHeader.querySelector("#filterAll").classList.remove("active-filter");

        if(event.target.classList.contains("ok")){
            filt = "OK";
            storeDetailsHeader.querySelector("#figureOk").classList.add("active-filter");
        } else if(event.target.classList.contains("storage")){
            filt = "STORAGE";
            storeDetailsHeader.querySelector("#figureStorage").classList.add("active-filter");
        } else if(event.target.classList.contains("out")){
            filt = "OUT_OF_STOCK";
            storeDetailsHeader.querySelector("#figureOut").classList.add("active-filter");
        } else {
            filt = undefined;
            storeDetailsHeader.querySelector("#filterAll").classList.add("active-filter");
        }

        productsTableBody.innerHTML = "";
        let filtUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products?filter=%7B%22where%22%3A%20%7B%22Status%22%3A%20%22${filt}%22%7D%7D`
        if(!filt && !sortingField){
            filtUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products`;
        }
        if(!filt && sortingField){
            filtUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products?filter=%7B%22order%22%3A%20%22${sortingField}%20${sortingDirection}%22%7D`
        } else if(filt && sortingField){
            filtUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products?filter=%7B%22where%22%3A%20%7B%22Status%22%3A%20%22${filt}%22%7D%2C%20%22order%22%3A%20%22${sortingField}%20${sortingDirection}%22%7D`
        }
        getRequest.open("Get", filtUrl);
        getRequest.responseType = "json";
        getRequest.send();
        getRequest.onload = function(){
            products = getRequest.response;
            products.forEach(renderProducts);
        }
    })


// **************************************** products list *********************************************************************//

    storeDetailsProduct.innerHTML = "";
    storeDetailsProduct.classList.remove("store-details__products-inactive");

    const productsTable = createElement("table", "products-table");

    // **************************************** caption ************************//

    productsTable.innerHTML += `<caption class ="header-table__text header-table__row header-table">Products</caption>`;

    // **************************************** table header *******************//

    productsTable.innerHTML += `
        <thead class="header-table products-table__header" id="headerTable">
            <tr class="header-table__row">
                <th class="header-table__value">
                    <img src="../images/sort-not-selected.svg" alt="sorting icon" class="sorting__image not-selected" id="sortingName">    
                    <span>Name</span>
                </th>
                <th class="header-table__value">
                    <img src="../images/sort-not-selected.svg" alt="sorting icon" class="sorting__image not-selected" id="sortingPrice">    
                    <span>Price</span>
                </th>
                <th class="header-table__value">
                    <img src="../images/sort-not-selected.svg" alt="sorting icon" class="sorting__image not-selected" id="sortingSpecs"> 
                    <span>Specs</span>
                </th>
                <th class="header-table__value">
                    <img src="../images/sort-not-selected.svg" alt="sorting icon" class="sorting__image not-selected" id="sortingSupplier"> 
                    <span>SupplierInfo</span>
                </th>
                <th class="header-table__value">
                    <img src="../images/sort-not-selected.svg" alt="sorting icon" class="sorting__image not-selected" id="sortingCountry"> 
                    <span>Country of origin</span>
                </th>
                <th class="header-table__value">
                    <img src="../images/sort-not-selected.svg" alt="sorting icon" class="sorting__image not-selected" id="sortingCompany"> 
                    <span>Prod. company</span>
                </th>
                <th class="header-table__value">
                    <img src="../images/sort-not-selected.svg" alt="sorting icon" class="sorting__image not-selected" id="sortingRating"> 
                    <span>Rating</span>
                </th>
                <th class="header-table__value"></th>
            </tr>
        </thead>
    `;
    headerTable     = productsTable.querySelector("#headerTable")
    sortingImages   = productsTable.querySelectorAll(".sorting__image")

    // **************************************** table body *******************//

    productsTableBody = createElement("tbody", "product-table__body");

    productsTable       .append(productsTableBody)
    storeDetailsProduct .append(productsTable);

    products.forEach(renderProducts);

    headerTable.addEventListener("click", (event) => {
        sortingImages.forEach((item) => {
            item.src = "../images/sort-not-selected.svg";
        })
        switch(event.target.id){
            case "sortingName": 
                sortingField = "Name";
                break;
            case "sortingPrice": 
                sortingField = "Price";
                break;
            case "sortingSpecs": 
                sortingField = "Specs";
                break;
            case "sortingSupplier": 
                sortingField = "SupplierInfo";
                break;
            case "sortingCountry": 
                sortingField = "MadeIn";
                break;
            case "sortingCompany": 
                sortingField = "ProductionCompanyName";
                break;
            case "sortingRating": 
                sortingField = "Rating";
                break;
            default:
                sortingField = undefined;
        } 
        if(event.target.classList.contains("not-selected") || event.target.classList.contains("from-less")){
            event.target.classList.remove("not-selected");
            event.target.classList.remove("from-less");
            event.target.classList.add("from-more");
            event.target.src = "../images/sort-from-more.svg";
            sortingDirection = "ASC";
        } else if (event.target.classList.contains("from-more")){
            event.target.classList.remove("from-more");
            event.target.classList.add("from-less");
            event.target.src = "../images/sort-from-less.svg";
            sortingDirection = "DESC";
        }
        let sortUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products?filter=%7B%22order%22%3A%20%22${sortingField}%20${sortingDirection}%22%7D`
        if (!sortingField){
            sortUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products`;
        }
        if(filt){
            sortUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products?filter=%7B%22where%22%3A%20%7B%22Status%22%3A%20%22${filt}%22%7D%2C%20%22order%22%3A%20%22${sortingField}%20${sortingDirection}%22%7D`
        }
        getRequest.open("Get", sortUrl);
        getRequest.responseType = "json";
        getRequest.send();
        getRequest.onload = function(){
            productsTableBody.innerHTML = "";
            products = getRequest.response;
            products.forEach(renderProducts);
        }
    })

    productsTableBody.addEventListener("click", (event) => {
        if(event.target.classList.contains("product-delete")){
            const deleteProductUrl = `http://localhost:3000/api/Stores/${storeId}/rel_Products/${event.target.dataset.id}`
            // event.target.dataset.id
            if(confirm("Are you really want to delete the product store?")){
                deleteRequest.open("Delete", deleteProductUrl);
                deleteRequest.responseType = "json";
                deleteRequest.send();
                deleteRequest.onload = function(){
                    const ProductDeleteDone = createElement("div", "store-delete", "The product was successfully delete");
                    main.append(ProductDeleteDone);
                    storesList.innerHTML = "";
                    getRequest.onload = function(){
                        Stores = getRequest.response;
                        Stores.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
                            const store = `
                                <li class="stores-list__store" data-id="${id}">
                                    <div class="stores-list__info" data-id="${id}">
                                        <h3 class="store__name" data-id="${id}">${Name}</h3>
                                        <div class="store__square" data-id="${id}">
                                            <span class="store__square-value" data-id="${id}">${FloorArea}</span>
                                            <span class="store__square-units" data-id="${id}">sq.m</span>
                                        </div>
                                    </div>
                                    <div class="store__address" data-id="${id}">${Address}</div>
                                </li>
                            `;
                            storesList.innerHTML += store;
                            storesListArr.push(store);
                            const storeInArray = {
                                id: `${id}`,
                                name: `${Name}`,
                                FloorArea: `${FloorArea}`,
                                Address: `${Address}`,
                                Established: `${Established}`,
                                PhoneNumber: `${PhoneNumber}`,
                                Email:`${Email}`,
                            }
                            storesAvailable.push(storeInArray);
                        })
                    }                
                }
            }
    
        }
    })

}
// **************************************** store footer *********************************************************************//
    if(!storeDetailsFooter.children.length){

        storeDetailsFooter.classList.add("footer");
        function createButtonFooter(classButton, idButton, buttonName, url, altText){
            const button = createElement("button", "footer__button");
            button.classList.add(classButton);
            button.id = idButton;
            const image = createImg("button__image", url, altText);
            button.innerHTML += image;
            button.innerHTML += buttonName;
            return button;
        }
        const buttonFooterCreate = createButtonFooter("button-create", "prosuctCreate", "Create", "../images/add.svg", "Create");
        const buttonFooterDelete = createButtonFooter("button-delete", "storesDelete", "Delete", "../images/delete.svg", "Delete");
        
        storeDetailsFooter.append(buttonFooterCreate);
        storeDetailsFooter.append(buttonFooterDelete);
    }  
})


storeDetailsFooter.addEventListener("click", () => {
    let deleteStoreUrl = `http://localhost:3000/api/Stores/${storeId}`;
    let createProductForm;
    let bodyForm;
    let darkBack = createElement("div", "dark");

    if(event.target.id === "prosuctCreate"){
        createProductForm = createElement("form", "create-product");
        const nameForm    = createElement("div", "form__store-header");
        bodyForm          = createElement("div", "form__store-body");
        const footerForm  = createElement("div", "form__store-footer");

// **************************************** form name *******************//
        nameForm.innerHTML = "Create new product"
// **************************************** form body *******************//

        const createFormElement = function(inputId, inputType, labelText, inputValue){
            const elemName = createElement("input", "form__store-value");
            elemName.id = inputId;
            elemName.type = inputType;
            elemName.required = true;
            elemName.placeholder = inputValue;
            const labelName = createElement("label", "form__label");
            labelName.for = elemName;
            labelName.innerHTML = labelText;
            return bodyForm.append(labelName, elemName)
        }

        createFormElement("Name", "text", "Name:", "Enter name");
        createFormElement("Price", "number", "Price:", "Enter price");
        createFormElement("Specs", "text", "Specs:", "Enter specs");
        createFormElement("Rating", "number", "Rating:", "Enter rating 1..5");
        createFormElement("SupplierInfo", "text", "Supplier info:", "Enter supplier info");
        createFormElement("MadeIn", "text", "Made in:", "Enter origin country");
        createFormElement("ProductionCompanyName", "text", "Production company name:", "Enter manufactur name");
        createFormElement("Status", "text", "Status:", "Enter status");

// **************************************** form button *******************//
        
        const storeSubmit   = createElement("input", "form__store-submit");
        const storeCanel    = createElement("input", "form__store-cancel");

        storeSubmit.id = "submitForm";
        storeCanel.id = "resetForm";

        storeSubmit .type = "button";
        storeCanel  .type = "button";

        storeSubmit .value = "Create";
        storeCanel  .value = "Cancel";

// **************************************** form button end ***************//

        footerForm          .append(storeSubmit, storeCanel);
        createProductForm   .append(nameForm);
        createProductForm   .append(bodyForm);
        createProductForm   .append(footerForm)

        main.append(darkBack)
        main.append(createProductForm);
        createProductForm.classList.remove("none")
    }
    
    if(event.target.id === "storesDelete"){
        if(confirm("Are you really want to delete the store?")){
            deleteRequest.open("Delete", deleteStoreUrl);
            deleteRequest.responseType = "json";
            deleteRequest.send();
            deleteRequest.onload = function(){
                const StoreDeleteDone = createElement("div", "store-delete", "The store was successfully delete");
                main.append(StoreDeleteDone);
                storesList.innerHTML = "";
                getRequest.onload = function(){
                    Stores = getRequest.response;
                    Stores.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
                        const store = `
                            <li class="stores-list__store" data-id="${id}">
                                <div class="stores-list__info" data-id="${id}">
                                    <h3 class="store__name" data-id="${id}">${Name}</h3>
                                    <div class="store__square" data-id="${id}">
                                        <span class="store__square-value" data-id="${id}">${FloorArea}</span>
                                        <span class="store__square-units" data-id="${id}">sq.m</span>
                                    </div>
                                </div>
                                <div class="store__address" data-id="${id}">${Address}</div>
                            </li>
                        `;
                        storesList.innerHTML += store;
                        storesListArr.push(store);
                        const storeInArray = {
                            id: `${id}`,
                            name: `${Name}`,
                            FloorArea: `${FloorArea}`,
                            Address: `${Address}`,
                            Established: `${Established}`,
                            PhoneNumber: `${PhoneNumber}`,
                            Email:`${Email}`,
                        }
                        storesAvailable.push(storeInArray);
                    })
                }                
            }
        }
    }    

    createProductForm.addEventListener("click", () => {
        // if(event.target.id === "submitForm"){
        //     let productAddUrl = ``;
        //     let bodyPostRequest = {
        //         "Name": "string",
        //         "Price": 0,
        //         "Specs": "string",
        //         "Rating": 0,
        //         "SupplierInfo": "string",
        //         "MadeIn": "string",
        //         "ProductionCompanyName": "string",
        //         "Status": "string",
        //         "StoreId": 0
        //     }
        //     for(let i=0; i < bodyForm.children.length; i++){
        //         (bodyForm.children[i].id === "Name") ?
        //         bodyPostRequest.Name = bodyForm.children[i].value
        //         :(bodyForm.children[i].id === "Price") ?
        //         bodyPostRequest.Price = bodyForm.children[i].value
        //         :(bodyForm.children[i].id === "Specs") ?
        //         bodyPostRequest.Specs = bodyForm.children[i].value
        //         :(bodyForm.children[i].id === "Rating") ?
        //         bodyPostRequest.Rating = bodyForm.children[i].value
        //         :(bodyForm.children[i].id === "MadeIn") ?
        //         bodyPostRequest.MadeIn = bodyForm.children[i].value
        //         :(bodyForm.children[i].id === "ProductionCompanyName") ?
        //         bodyPostRequest.ProductionCompanyName = bodyForm.children[i].value
        //         :(bodyForm.children[i].id === "Status") ?
        //         bodyPostRequest.Status = bodyForm.children[i].value
        //         : bodyPostRequest.SupplierInfo = bodyForm.children[i].value
        //     }
        //     postStore.open("Post", productAddUrl);
        //     postStore.setRequestHeader("Content-type", "application/json")
        //     postStore.onreadystatechange = function(){
        //         if(postStore.status < "400") {
        //             const StoreAddDone = createElement("div", "store-add", "The product was successfully added");
        //             main.append(StoreAddDone);
        //         } 
        //     }
        //     postStore.send(JSON.stringify(bodyPostRequest))
        //     storesList.innerHTML = "";
        //     getRequest.onload = function(){
        //         Stores = getRequest.response;
        //         Stores.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
        //             const store = `
        //                 <li class="stores-list__store" data-id="${id}">
        //                     <div class="stores-list__info" data-id="${id}">
        //                         <h3 class="store__name" data-id="${id}">${Name}</h3>
        //                         <div class="store__square" data-id="${id}">
        //                             <span class="store__square-value" data-id="${id}">${FloorArea}</span>
        //                             <span class="store__square-units" data-id="${id}">sq.m</span>
        //                         </div>
        //                     </div>
        //                     <div class="store__address" data-id="${id}">${Address}</div>
        //                 </li>
        //             `;
        //             storesList.innerHTML += store;
        //             storesListArr.push(store);
        //             const storeInArray = {
        //                 id: `${id}`,
        //                 name: `${Name}`,
        //                 FloorArea: `${FloorArea}`,
        //                 Address: `${Address}`,
        //                 Established: `${Established}`,
        //                 PhoneNumber: `${PhoneNumber}`,
        //                 Email:`${Email}`,
        //             }
        //             storesAvailable.push(storeInArray);
        //             darkBack.classList.add("none");
        //         })
        //     }                
        // }
        if(event.target.id === "resetForm"){
            for(let i=0; i < bodyForm.children.length; i++){
                bodyForm.children[i].value = "";
                createProductForm.classList.add("none");
                darkBack.classList.add("none");
            }
        }  
    })

})
storesListFooter.addEventListener("click", () => {
    let createStoreForm;
    let bodyForm;
    let darkBack = createElement("div", "dark");

    if(event.target.id === "storesCreate"){
        createStoreForm   = createElement("form", "create-store");
        const nameForm    = createElement("div", "form__store-header");
        bodyForm          = createElement("div", "form__store-body");
        const footerForm  = createElement("div", "form__store-footer");

// **************************************** form name *******************//
        nameForm.innerHTML = "Create new store"
// **************************************** form body *******************//

        const createFormElement = function(inputId, inputType, labelText, inputValue){
            const elemName = createElement("input", "form__store-value");
            elemName.id = inputId;
            elemName.type = inputType;
            elemName.required = true;
            elemName.placeholder = inputValue;
            const labelName = createElement("label", "form__label");
            labelName.for = elemName;
            labelName.innerHTML = labelText;
            return bodyForm.append(labelName, elemName)
        }

        createFormElement("Name", "text", "Name:", "Enter name");
        createFormElement("Email", "email", "Email:", "Enter email");
        createFormElement("PhoneNumber", "tel", "Phone Number:", "Enter phone number");
        createFormElement("Address", "text", "Address:", "Enter address");
        createFormElement("Established", "date", "Established Date:", "MMM, d, y");
        createFormElement("FloorArea", "number", "Floor Area:", "Enter floor area (in sq.m.)");

// **************************************** form button *******************//
        
        const storeSubmit   = createElement("input", "form__store-submit");
        const storeCanel    = createElement("input", "form__store-cancel");

        storeSubmit.id = "submitForm";
        storeCanel. id = "resetForm";

        storeSubmit .type = "button";
        storeCanel  .type = "button";

        storeSubmit .value = "Create";
        storeCanel  .value = "Cancel";

// **************************************** form button end ***************//

        footerForm      .append(storeSubmit, storeCanel);
        createStoreForm .append(nameForm);
        createStoreForm .append(bodyForm);
        createStoreForm .append(footerForm)

        main.append(darkBack)
        main.append(createStoreForm);
        createStoreForm.classList.remove("none")
    }

    createStoreForm.addEventListener("click", () => {
        if(event.target.id === "submitForm"){
            let bodyPostRequest = {
                "Name": "string",
                "Email": "string",
                "PhoneNumber": "string",
                "Address": "string",
                "Established": "2021-09-12T07:36:08.058Z",
                "FloorArea": 0
            }
            for(let i=0; i < bodyForm.children.length; i++){
                (bodyForm.children[i].id === "Name") ?
                bodyPostRequest.Name = bodyForm.children[i].value
                :(bodyForm.children[i].id === "Email") ?
                bodyPostRequest.Email = bodyForm.children[i].value
                :(bodyForm.children[i].id === "PhoneNumber") ?
                bodyPostRequest.PhoneNumber = bodyForm.children[i].value
                :(bodyForm.children[i].id === "Address") ?
                bodyPostRequest.Address = bodyForm.children[i].value
                :(bodyForm.children[i].id === "Established") ?
                bodyPostRequest.Established = bodyForm.children[i].value
                : bodyPostRequest.FloorArea = bodyForm.children[i].value
            }
            postStore.open("Post", GET_STORES_URL);
            postStore.setRequestHeader("Content-type", "application/json")
            postStore.onreadystatechange = function(){
                if(postStore.status < "400") {
                    const StoreAddDone = createElement("div", "store-add", "The store was successfully added");
                    main.append(StoreAddDone);
                } 
            }
            postStore.send(JSON.stringify(bodyPostRequest))
            storesList.innerHTML = "";
            getRequest.onload = function(){
                Stores = getRequest.response;
                Stores.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
                    const store = `
                        <li class="stores-list__store" data-id="${id}">
                            <div class="stores-list__info" data-id="${id}">
                                <h3 class="store__name" data-id="${id}">${Name}</h3>
                                <div class="store__square" data-id="${id}">
                                    <span class="store__square-value" data-id="${id}">${FloorArea}</span>
                                    <span class="store__square-units" data-id="${id}">sq.m</span>
                                </div>
                            </div>
                            <div class="store__address" data-id="${id}">${Address}</div>
                        </li>
                    `;
                    storesList.innerHTML += store;
                    storesListArr.push(store);
                    const storeInArray = {
                        id: `${id}`,
                        name: `${Name}`,
                        FloorArea: `${FloorArea}`,
                        Address: `${Address}`,
                        Established: `${Established}`,
                        PhoneNumber: `${PhoneNumber}`,
                        Email:`${Email}`,
                    }
                    storesAvailable.push(storeInArray);
                    darkBack.classList.add("none");
                })
            }                
        }
        if(event.target.id === "resetForm"){
            for(let i=0; i < bodyForm.children.length; i++){
                bodyForm.children[i].value = "";
                createStoreForm.classList.add("none");
                darkBack.classList.add("none");
            }
        }  
    })
    

})

const renderProducts = function(item, infex, array) {
        
    productsTableBody.innerHTML += `
    <tr class="products-table__product product">
        <td class="product__value product__name">${item.Name}</td>
        <td class="product__value price">
            <div class="price__summ">${item.Price}</div>
            <div class="price__units">USD</div>
        </td>
        <td class="product__value" title="Phasellus varius ex id urna tempor sodales.">${item.Specs}</td>
        <td class="product__value" title="In finibus neque non semper consectetur.">${item.SupplierInfo}</td>
        <td class="product__value" title="Zambia">${item.MadeIn}</td>
        <td class="product__value" title="Gottlieb, O'Conner and Langwith">${item.ProductionCompanyName}</td>
        <td class="product__value" data-id="${item.id}"></td> 
        <td class="product__more product__value">
            <figure>
                <img src="../images/close.svg" alt="delete product" class="product-delete" data-id="${item.id}">
                <img src="../images/more.svg" alt="more info" class="more">
            </figure>
        </td> 
    </tr>
    `
    let product = productsTableBody.children[infex];
    let productRating = product.children[6];

    for(let i = 0; i < item.Rating; i++){
        const starCheck = createImg("star", "../images/star-check.svg", "star icon");
        productRating.innerHTML += starCheck;
    }
    for (let i = productRating.children.length; +i < 5; i++){
        const starNotCheck = createImg("star", "../images/star.svg", "star icon");
        productRating.innerHTML += starNotCheck;
    }
}

// **************************************** find store *********************************************************************//

searchForm.addEventListener("click", (event) => {
    if (event.target.id === "search-icon"){

        const input = event.currentTarget.children[0];
        subStringSearch = input.value.toLowerCase();
    
        for (let i = 0; i < storesAvailable.length; i++) {
            var check = 0;
            const storeInstance = storesAvailable[i];
            for(let key in storeInstance){
                storeInstance[key]
                if (storeInstance[key].toLowerCase().indexOf(subStringSearch) === -1) {
                    check += 1;
                }
            }
            if (check === COUNT_ELEM_TO_CHECK){
                storesList.children[i].classList.add("none");
            } else{
                storesList.children[i].classList.remove("none");
            }
        }
    } else if (event.target.id === "delete-icon"){
        event.currentTarget.children[0].value = ""
        event.target.classList.add("none")
        subStringSearch = "";

        for (let i = 0; i < storesAvailable.length; i++) {
            storesList.children[i].classList.remove("none");
        }
    }
})


searchForm.addEventListener("keyup", (event) => {

    if (event.code === "Enter"){
        subStringSearch = event.target.value.toLowerCase();
    
        for (let i = 0; i < storesAvailable.length; i++) {
            var check = 0;
            const storeInstance = storesAvailable[i];
            for(let key in storeInstance){
                storeInstance[key]
                if (storeInstance[key].toLowerCase().indexOf(subStringSearch) === -1) {
                    check += 1;
                }
            }
            if (check === COUNT_ELEM_TO_CHECK){
                storesList.children[i].classList.add("none");
            } else{
                storesList.children[i].classList.remove("none");
            }
        }
    }
    if (event.target.value !== "" && deleteButton.classList.contains("none")){
        deleteButton.classList.remove("none");
    }
    
})
