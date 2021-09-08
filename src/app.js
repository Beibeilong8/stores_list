import { Stores } from "./data.js";

const storesList            = document.querySelector(".stores-list");
const storeDetailsHeader    = document.querySelector(".store-details__header");
const storeDetailsProduct   = document.querySelector(".store-details__products");
const storeDetailsFooter    = document.querySelector(".store-details__footer");
const storeDetailsHeading   = document.querySelector(".store-details__text");
const searchForm            = document.querySelector(".search-form");
const searchFormInput       = document.querySelector(".search-form__input");
const searchFormButton      = document.querySelector(".search-form__icons");
let iconDelete;
let storesAvailable;
let subStringSearch = "";

const createElement = (selectorStore, className, id, innerHtml) => {
    let elem = document.createElement(selectorStore);
    elem.classList.add(className);
    if(innerHtml){
        elem.innerHTML = innerHtml;
    }
    if(id){
        elem.dataset.id = id;
    }
    return elem;
}

const createImg = (classImg, url, altText) => {
    const image = createElement("img", classImg);
    image.src = url;
    image.alt = altText;
    return image;
}

window.onload = () => {

    storesAvailable = [];
    storesList.         innerHTML = "";
    storeDetailsHeader. innerHTML = "";
    storeDetailsProduct.innerHTML = "";
    storeDetailsFooter. innerHTML = "";
    storeDetailsHeading.innerHTML = "Store is not selected";

    const notSelectedStoreImage         = createElement("img", "not-selected-image");
    const notSelectedStoreHeading       = createElement("h3", "not-selected-heading", undefined, "The store is not selected");
    const notSelectedStoreSubHeading    = createElement("h4", "not-selected-sub-heading", undefined, "Please select the store to proceed");

    notSelectedStoreImage.src = "../images/store.svg";
    notSelectedStoreImage.alt = "Store is nor selected";

    storeDetailsHeading.classList.add("header__text_inactive");
    storeDetailsProduct.classList.add("store-details__products-inactive");

    storeDetailsProduct.append(notSelectedStoreImage);
    storeDetailsProduct.append(notSelectedStoreHeading);
    storeDetailsProduct.append(notSelectedStoreSubHeading);

    Stores.forEach(function(item, infex, array){

        const idStore = item.id;

        const store           = createElement("li", "stores-list__store", idStore);
        const divInfo         = createElement("div", "stores-list__info", idStore);
        const storeName       = createElement("h3", "store__name", idStore, item.Name);
        const divSquare       = createElement("div", "store__square", idStore);
        const squareValue     = createElement("span", "store__square-value", idStore, item.FloorArea);
        const squareUnits     = createElement("span", "store__square-units", idStore, "sq.m");
        const storeAddress    = createElement("div", "store__address", idStore, item.Address);

        storesList. append(store);
        store.      append(divInfo);
        store.      append(storeAddress);
        divInfo.    append(storeName);
        divInfo.    append(divSquare);
        divSquare.  append(squareValue);
        divSquare.  append(squareUnits);   

        storesAvailable.push(store);
    })
}

storesList.addEventListener("click", (event) => {

    
// **************************************** header store details *********************************************************************//
    
    storeDetailsHeading.innerHTML = "Store Details";
    storeDetailsHeading.classList.remove("header__text_inactive");
    storeDetailsProduct.classList.add("products");
    storeDetailsHeader. innerHTML = "";

// **************************************** contacts store *********************************************************************//

    const storeContacts           = createElement("section", "about-store");
    const divAboutStoreOne        = createElement("div", "about-store__block-one");
    const divAboutStoreTwo        = createElement("div", "about-store__block-two");
    const storeEmailTitle         = createElement("span", "about-store__title", undefined, "Email:");
    const storeEmail              = createElement("address", "about-store__info", undefined, Stores[event.target.dataset.id-1].Email);
    const storePhoneTitle         = createElement("span", "about-store__title", undefined, "Phone Number:");
    const storePhone              = createElement("address", "about-store__info", undefined, Stores[event.target.dataset.id-1].PhoneNumber);
    const storeAdressTitle        = createElement("span", "about-store__title", undefined, "Address:");
    const storeAdress             = createElement("address", "about-store__info", undefined, Stores[event.target.dataset.id-1].Address);
    const storeEstablishedTitle   = createElement("span", "about-store__title", undefined, "Established Date:");
    const storeEstablished        = createElement("address", "about-store__info", undefined, Stores[event.target.dataset.id-1].Established);
    const storeFlootAreaTitle     = createElement("span", "about-store__title", undefined, "Floot Area:");
    const storeFlootArea          = createElement("address", "about-store__info", undefined, Stores[event.target.dataset.id-1].FloorArea);

    storeContacts.classList.add("header__about-store");

    storeDetailsHeader. append(storeContacts);
    storeContacts.      append(divAboutStoreOne);
    storeContacts.      append(divAboutStoreTwo);
    divAboutStoreOne.   append(storeEmailTitle);
    divAboutStoreOne.   append(storeEmail);
    divAboutStoreOne.   append(storePhoneTitle);
    divAboutStoreOne.   append(storePhone);
    divAboutStoreOne.   append(storeAdressTitle);
    divAboutStoreOne.   append(storeAdress);
    divAboutStoreTwo.   append(storeEstablishedTitle);
    divAboutStoreTwo.   append(storeEstablished);
    divAboutStoreTwo.   append(storeFlootAreaTitle);
    divAboutStoreTwo.   append(storeFlootArea);
    
// **************************************** filters store *********************************************************************//
// **************************************** filter all ************************//

    const productStatuses         = createElement("section", "product-statuses");
    const productStatusesAll      = createElement("div", "product-statuses__all");
    const productStatusesSum      = createElement("div", "product-statuses__products-sum", undefined, "100");
    const productStatusesSunTitle = createElement("span", "product-statuses__all-text", undefined, "All");
    
    productStatusesAll. append(productStatusesSum);
    productStatusesAll. append(productStatusesSunTitle);
    productStatuses.    append(productStatusesAll);

// **************************************** filter choice ************************//

    const createFilter = (classFilter, url, text, sum) => {
        const name = createElement("figure", "filter");
        const filterSum = createElement("div", "filter__sum", undefined, sum);
        filterSum.classList.add(classFilter);
        const filterImage = createImg("filter__image", url, text);
        const filterTitle = createElement("span", "filter__about", undefined, "Ok");
        name.append(filterSum);
        name.append(filterImage);
        name.append(filterTitle);
        return name;
    }

    const productStatusesChoice   = createElement("div", "product-statuses__choice");
    const filterOne               = createFilter("sum_ok", "../images/check.svg",  "filter image 1", "50");
    const filterTwo               = createFilter("sum_storage", "../images/warning.svg",  "filter image 2", "30");
    const filterThree             = createFilter("sum_out", "../images/warning-2.svg",  "filter image 3", "20");

    productStatuses.classList.add("filters");

    storeDetailsHeader.     append(productStatuses);
    productStatusesChoice.  append(filterOne);
    productStatusesChoice.  append(filterTwo);
    productStatusesChoice.  append(filterThree);
    productStatuses.        append(productStatusesChoice);

// **************************************** products list *********************************************************************//

    storeDetailsProduct.innerHTML = "";
    storeDetailsProduct.classList.remove("store-details__products-inactive");

    const productsTable = createElement("table", "products-table");
    storeDetailsProduct.append(productsTable)
    
    // **************************************** caption ************************//

    const productsTableCaption = createElement("caption", "header-table__text", undefined, "Products");
    productsTableCaption.classList.add("header-table__row");
    productsTableCaption.classList.add("header-table");

    productsTable.append(productsTableCaption);

    // **************************************** table header *******************//

    const productsTableHeader = createElement("thead", "products-table__header");

    productsTableHeader.classList.add("header-table");

    const createTableRow = (selectorValue, classRow, classValue, className, productName, priceTitle, price, spec, supplier, country, company, rating, more) => {
        
        const row                           = createElement("tr", classRow);
        const productsTableHeaderName       = createElement(selectorValue, classValue, undefined, productName);
        const productsTableHeaderPrice      = createElement(selectorValue, classValue, undefined, priceTitle);
        const productsTableHeaderSpecs      = createElement(selectorValue, classValue, undefined, spec);
        const productsTableHeaderSupplier   = createElement(selectorValue, classValue, undefined, supplier);
        const productsTableHeaderCountry    = createElement(selectorValue, classValue, undefined, country);
        const productsTableHeaderProduct    = createElement(selectorValue, classValue, undefined, company);
        const productsTableHeaderRating     = createElement(selectorValue, classValue, undefined, "Rating");
        const productsTableHeaderEmpty      = createElement(selectorValue, classValue);

        productsTableHeaderName.classList.add(className)

        if(rating){
            productsTableHeaderRating.innerHTML = "";
                for(let i = 0; i < rating; i++){
                    const starCheck = createImg("star", "../images/star-check.svg", "star icon");
                    productsTableHeaderRating.append(starCheck);
                }
                for (let i = productsTableHeaderRating.children.length; i < "5"; i++){
                    const starNotCheck = createImg("star", "../images/star.svg", "star icon");
                    productsTableHeaderRating.append(starNotCheck);
                }
            
        }

        if(more){
            productsTableHeaderEmpty.classList.add("product__more");
            const more = createImg("star", "../images/more.svg", "more info");
            productsTableHeaderEmpty.append(more);
        }

        row.append(productsTableHeaderName);
        row.append(productsTableHeaderPrice);
        row.append(productsTableHeaderSpecs);
        row.append(productsTableHeaderSupplier);
        row.append(productsTableHeaderCountry);
        row.append(productsTableHeaderProduct);
        row.append(productsTableHeaderRating);
        row.append(productsTableHeaderEmpty);

        if(price){
            const priceSum      = createElement("div", "price__summ", undefined, price);
            const priceUnits    = createElement("div", "price__units", undefined, "USD");
            
            productsTableHeaderPrice.append(priceSum);
            productsTableHeaderPrice.append(priceUnits);
        }

        return row;
    }

    const productsTableHeaderRow = createTableRow("th", "header-table__row", "header-table__value", undefined, "Name", "Price", undefined, "Specs", "SupplierInfo", "Country of origin", "Prod. company", "", "");

    productsTableHeader.append(productsTableHeaderRow);
    productsTable.      append(productsTableHeader)

    // **************************************** table body *******************//

    const productsTableBody = createElement("tbody", "product-table__body");

    const products = Stores[event.target.dataset.id-1].rel_Products;

    products.forEach(function(item, infex, array){
        const productsTableBodyRow = createTableRow("td", "products-table__product", "product__value", "product__name", item.Name, undefined, item.Price, item.Specs, item.SupplierInfo, item.MadeIn, item.ProductionCompanyName, item.Rating, true);
        productsTableBodyRow.classList.add("product")

        productsTableBody.append(productsTableBodyRow)

    })

    productsTable.append(productsTableBody)

// **************************************** store footer *********************************************************************//
    if(!storeDetailsFooter.children.length){

        storeDetailsFooter.classList.add("footer");
        function createButtonFooter(classButton, buttonName, url, altText){
            const button = createElement("button", "footer__button", undefined, buttonName);
            button.classList.add(classButton);
            const image = createImg("button__image", url, altText);
            button.append(image);
            return button;
        }
        const buttonFooterCreate = createButtonFooter("button-create", "Create", "../images/add.svg", "Create");
        const buttonFooterDelete = createButtonFooter("button-delete", "Delete", "../images/delete.svg", "Delete");
        
        storeDetailsFooter.append(buttonFooterCreate);
        storeDetailsFooter.append(buttonFooterDelete);
    }    

})

// **************************************** find store *********************************************************************//

searchForm.addEventListener("click", (event) => {
    if (event.target.id === "search-icon"){
        const input = event.currentTarget.children[0];
        const subStringSearch = input.value.toLowerCase();
    
        for (let i = 0; i < storesAvailable.length; i++) {
            var check = 0;
            const li = storesAvailable[i];
            const divs = li.getElementsByTagName("div");
            for(let j = 0; j < divs.length; j++){
                const div = divs[j];
                const txtValue = div.textContent || div.innerText;
                if (txtValue.toLowerCase().indexOf(subStringSearch) === -1) {
                    check += 1;
                }
            }
            if (check === divs.length){
                storesAvailable[i].style.display = "none"
            } else{
                storesAvailable[i].style.display = "";
            }
        }
    } else if (event.target.id === "delete-icon"){
        input.value = ""
        iconDelete.style.display = "none"
    }
})


searchFormInput.addEventListener("keyup", (event) => {

    if (event.code === "Enter"){
        const subStringSearch = event.target.value.toLowerCase();
    
        for (let i = 0; i < storesAvailable.length; i++) {
            var check = 0;
            const li = storesAvailable[i];
            const divs = li.getElementsByTagName("div");
            for(let j = 0; j < divs.length; j++){
                const div = divs[j];
                const txtValue = div.textContent || div.innerText;
                if (txtValue.toLowerCase().indexOf(subStringSearch) === -1) {
                    check += 1;
                }
            }
            if (check === divs.length){
                storesAvailable[i].style.display = "none"
            } else{
                storesAvailable[i].style.display = "";
            }
        }
    }

    if (event.target.value !== "" && (iconDelete)){
        iconDelete = createImg("search-form__icons", "../images/close.svg", "close icon");
        iconDelete.id = "delete-icon";

        searchForm.append(iconDelete);
    }
    
})
