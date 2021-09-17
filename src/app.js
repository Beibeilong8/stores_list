function Model() {
    var _productAddURL              = `http://localhost:3000/api/Products`,
        _storesUPL                  = `http://localhost:3000/api/Stores/`,
        _storeDeleteURL             = _storesUPL + storeId,
        _productsURLTemplate        = _storesUPL + "{STORE_ID}/rel_Products/",
        _productDeleteURL           = _productsURLTemplate + `{ID_PRODUCT}`,
        _productsURLfilter          = _productsURLTemplate + `?filter=%7B%22where%22%3A%20%7B%22Status%22%3A%20%22{FILTER}%22%7D%7D`,
        _productsURLsort            = _productsURLTemplate + `?filter=%7B%22order%22%3A%20%22{SORTING_FILT}%20{SORTING_DIRECTION}%22%7D`,
        _productsURLfilterAndSort   = _productsURLTemplate + `?filter=%7B%22where%22%3A%20%7B%22Status%22%3A%20%22{FILTER}%22%7D%2C%20%22order%22%3A%20%22{SORTING_FILT}%20{SORTING_DIRECTION}%22%7D`,
        bodyPostStore = {
            "Name": "string",
            "Email": "string",
            "PhoneNumber": "string",
            "Address": "string",
            "Established": "2021-09-12T07:36:08.058Z",
            "FloorArea": 0
        },
        _stores,
        storesAvailable = [],
        _products,
        _storeCheckedId,
        storeId,
        sortingField;


    this.fetchData = function (url) {
		return new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();

			req.open("GET", url, true);

			// listen to load event
			req.addEventListener("load", function () {
				if (req.status < 400) {
					resolve(JSON.parse(req.responseText));
				} else {
					reject(new Error("Request failed: " + req.statusText));
				}
			});

			// listen to error event
			req.addEventListener("error", function () {
				reject(new Error("Network error"));
			});

			req.send();
		});
	};
    this.deleteData = function (url){
        return new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();

			req.open("Delete", url, true);

			// listen to load event
			req.addEventListener("load", function () {
				if (req.status < 400) {
					resolve(JSON.parse(req.responseText));
				} else {
					reject(new Error("Request failed: " + req.statusText));
				}
			});

			// listen to error event
			req.addEventListener("error", function () {
				reject(new Error("Network error"));
			});

			req.send();
		});
    };
    this.createData = function (url, bodyPostRequest) {
		return new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();

			req.open("Post", url);

			// listen to load event
			req.addEventListener("load", function () {
				if (req.status < 400) {
					resolve(JSON.parse(req.responseText));
				} else {
					reject(new Error("Request failed: " + req.statusText));
				}
			});
            req.setRequestHeader("Content-type", "application/json")

			// listen to error event
			req.addEventListener("error", function () {
				reject(new Error("Network error"));
			});

			req.send(JSON.stringify(bodyPostRequest));
		});
	};

    this.fetchStores = function() {
		return this
			.fetchData(_storesUPL)
			.then(function (storesData) {
				_stores = storesData;
				return storesData;
			});
	};
    this.fetchProducts = function(storeId, filterValue, sortingField, sortDirection) {
        
        if(!storeId){storeId = _storeCheckedId}

        if(!filterValue && !sortingField){
            return this
			.fetchData(_productsURLTemplate.replace("{STORE_ID}", storeId))
			.then(function (productsData) {
				_products = productsData;
                _storeCheckedId = storeId;
				return productsData;
			});
        } else if(!filterValue && sortingField){
            return this.fetchProductsWithSort(sortingField, sortDirection)
        } else if(filterValue && sortingField){
            return this.fetchProductsWithFiltAndSort(filterValue, sortingField, sortDirection)
        } else {
            return this.fetchProductsWithFilt(storeId,filterValue)
        }
	};
    this.fetchProductsWithFilt = function(storeId, filterValue) {
		return this
			.fetchData(_productsURLfilter.replace("{STORE_ID}", storeId).replace("{FILTER}", filterValue))
			.then(function (productsData) {
				_products = productsData;
				return productsData;
			});
	};
    this.fetchProductsWithFiltAndSort = function(filterValue, sortingField, sortDirection) {
        return this
			.fetchData(_productsURLfilterAndSort.replace("{STORE_ID}", _storeCheckedId).replace("{FILTER}", filterValue).replace("{SORTING_FILT}", sortingField).replace("{SORTING_DIRECTION}", sortDirection))
			.then(function (productsData) {
				_products = productsData;
				return productsData;
			});
	};
    this.fetchProductsWithSort = function(sortingField, sortDirection) {
		return this
			.fetchData(_productsURLsort.replace("{STORE_ID}", _storeCheckedId).replace("{SORTING_FILT}", sortingField).replace("{SORTING_DIRECTION}", sortDirection))
			.then(function (productsData) {
				_products = productsData;
				return productsData;
			});
	};

    this.deleteProduct = function(idProduct) {
		return this
			.deleteData(_productDeleteURL.replace("{STORE_ID}", _storeCheckedId).replace("{ID_PRODUCT}", idProduct))
			.then(function (resolve) {
				// _stores = storesData;
				return resolve;
			});
	};


    this.fillStoresArray = function (storesData) {
        storesData.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
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
        });
        return this;
    };
    this.checkStore = function (id){
        var storeChekedArr = storesAvailable.filter( 
            (item) => { return item.id === id;}
            )
        var storeCheked = storeChekedArr[0]
        return storeCheked
    };
    this.assignId = function (item){
        return item.id;
    };
    this.parseDate = function (store){
        return new Date (store.Established).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    };
    this.checkFilterAll = function (productsData){
        return productsData.length;
    };
    this.checkFilterOk = function (productsData){
        return productsData.filter( (item) => item.Status === "OK").length;
    };   
    this.checkFilterStorage = function (productsData){
        return productsData.filter( (item) => item.Status === "STORAGE").length;
    };  
    this.checkFilterOut = function (productsData){
        return productsData.filter( (item) => item.Status === "OUT_OF_STOCK").length;
    };

    this.assignSortingField = function (id){
        switch(id){
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
        return sortingField;
    };
    this._assignParamtersStore = function (bodyForm){
        for(let i=0; i < bodyForm.children.length; i++){
            (bodyForm.children[i].id === "Name") ?
            bodyPostStore.Name = bodyForm.children[i].value
            :(bodyForm.children[i].id === "Email") ?
            bodyPostStore.Email = bodyForm.children[i].value
            :(bodyForm.children[i].id === "PhoneNumber") ?
            bodyPostStore.PhoneNumber = bodyForm.children[i].value
            :(bodyForm.children[i].id === "Address") ?
            bodyPostStore.Address = bodyForm.children[i].value
            :(bodyForm.children[i].id === "Established") ?
            bodyPostStore.Established = bodyForm.children[i].value
            : bodyPostStore.FloorArea = bodyForm.children[i].value
        }
        return bodyPostStore;
    }
    this.createStoreRequest = function (bodyForm){
        bodyPostStore = this._assignParamtersStore(bodyForm);
        return this
            .createData(_storesUPL, bodyPostStore)
            .then(function (request) {
                // _stores = storesData;
                return request;
            });
    }
}



function View() {
    var STORES_LIST_ID              = "storesList",
        STORES_LIST_FOOTER_ID       = "storesListFooter",
        STORE_DETAILS_HEADER_ID     = "storeDetailsHeader",
        STORE_DETAILS_PRODUCT_ID    = "storeDetailsProducts",
        STORE_DETAILS_FOOTER_ID     = "storeDetailsFooter",
        STORE_DETAILS_HEADING_ID    = "storeDetailsText",
        SEARCH_FORM_ID              = "searchForm",
        DELETE_STORE_BUTTON         = "delete-icon",
        FILTERS_INPUTS_CLASS        = "filter",
        FILTER_ALL_SUM_ID           = "sumAll",
        FILTER_OK_SUM_ID            = "OK",
        FILTER_STORAGE_SUM_ID       = "STORAGE",
        FILTER_OUT_SUM_ID           = "OUT_OF_STOCK",
        FILTER_ALL_ID               = "filterAll",
        FILTER_OK_ID                = "figureOk",
        FILTER_STORAGE_ID           = "figureStorage",
        FILTER_OUT_ID               = "figureOut",
        HEADER_TABLE_ID             = "headerTable",
        SORTING_IMAGES_CLASS        = "sorting__image",
        PRODUCT_TABLE_ID            = "productsTable",
        PRODUCT_TABLE_BODY_ID       = "productsTableBody",
        NOT_SELECTED_STORE_ID       = "notSelectedStore",
        STORE_DETAILS_IMAGES_ID     = "storeDetailsFooter",
        MAIN_ID                     = "main",
        _bodyForm,
        _createStoreForm,
        _createProductForm,
        _darkBack;
    
    this.fillStoresList = function (storesData) {
		storesList.innerHTML = "";
        storesData.forEach(function({ Name, FloorArea, Address, id }){
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
        })
		return this;
	};
    this.renderContacts = function( { Email, PhoneNumber, Address, FloorArea },  dateParse){
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
        return this;
    };
    this.renderFilters = function (item){
        item.innerHTML += `
            <section class="filters product-statuses">
                <div class="product-statuses__all filter" id="filterAll">
                    <div class="product-statuses__products-sum" id="sumAll"></div>
                    <span class="product-statuses__all-text">All</span>
                </div>
                <div class="product-statuses__choice">
                    <figure class="filter ok" id="figureOk">
                        <div class="filter__sum ok" id="OK"></div>
                        <img src="../images/check.svg" alt="filter image 1" class="filter__image ok">
                        <span class="filter__about ok">Ok</span>
                    </figure>
                    <figure class="filter storage" id="figureStorage">
                        <div class="filter__sum storage" id="STORAGE"></div>
                        <img src="../images/warning.svg" alt="filter image 2" class="filter__image storage">
                        <span class="filter__about storage">Storage</span>
                    </figure>
                    <figure class="filter out" id="figureOut">
                        <div class="filter__sum out" id="OUT_OF_STOCK"></div>
                        <img src="../images/warning-2.svg" alt="filter image 3" class="filter__image out">
                        <span class="filter__about out">Out of stock</span>
                    </figure>
                </div>
            </section>
        `
        return this;
    };
    this.renderProducts = function(productsData){
        var storeDetailsProduct = this.getStoreDetailsProduct(),
            productsTable = this.getProductsTable(),
            productsTableBody = this.getProductsTableBody(),
            notSelectedStoreInput = this.getNotSelectedStoreInput(),
            storeDetailsFooter = this.getStoreDetailsFooter();
        
        this.removeClassList(storeDetailsProduct, "store-details__products-inactive")
        .removeClassList(productsTable, "none")
        .addClassList(notSelectedStoreInput, "none")
        .innerHTMLToElement(productsTableBody, "")

        if(+productsData.length === 0){
            productsTableBody.innerHTML += `
            <tr class="">Doesn't have products for selected Store</tr>`
        }
        productsData.forEach(function(item, index){
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
            var product = productsTableBody.children[index];
            var productRating = product.children[6];

            for(let i = 0; i < item.Rating; i++){
                productRating.innerHTML += `<img src="../images/star-check.svg" alt="star icon" class="star">`;
            }
            for (let i = productRating.children.length; +i < 5; i++){
                productRating.innerHTML += `<img src="../images/star.svg" alt="star icon" class="star">`;
            }
        });

        if(!storeDetailsFooter.children.length){

            this.addClassList(storeDetailsFooter, "footer");

            var buttonFooterCreate = this._createButtonFooter("button-create", "productCreate", "Create", "../images/add.svg", "Create");
            var buttonFooterDelete = this._createButtonFooter("button-delete", "storesDelete", "Delete", "../images/delete.svg", "Delete");
            
            storeDetailsFooter.append(buttonFooterCreate, buttonFooterDelete);
        }  
        return this;
    };


    this.getStoresList = function () {
		return document.querySelector("#" + STORES_LIST_ID);
	};
    this.getStoresListFooter = function () {
		return document.querySelector("#" + STORES_LIST_FOOTER_ID);
	};
    this.getStoreDetailsHeader = function () {
		return document.querySelector("#" + STORE_DETAILS_HEADER_ID);
	};
    this.getStoreDetailsProduct = function () {
		return document.querySelector("#" + STORE_DETAILS_PRODUCT_ID);
	};
    this.getProductsTable = function () {
		return document.querySelector("#" + PRODUCT_TABLE_ID);
	};
    this.getProductsTableBody = function () {
		return document.querySelector("#" + PRODUCT_TABLE_BODY_ID);
	};
    this.getNotSelectedStoreInput = function () {
		return document.querySelector("#" + NOT_SELECTED_STORE_ID);
	};
    this.getStoreDetailsFooter = function () {
		return document.querySelector("#" + STORE_DETAILS_FOOTER_ID);
	};
    this.getStoreDetailsHeading = function () {
		return document.querySelector("#" + STORE_DETAILS_HEADING_ID);
	};
    this.getSearchForm = function () {
		return document.querySelector("#" + SEARCH_FORM_ID);
	};
    this.getDeleteStoreButton = function () {
		return document.querySelector("#" + DELETE_STORE_BUTTON);
	};
    this.getFiltersInputs = function () {
		return document.querySelectorAll("." + FILTERS_INPUTS_CLASS);
	};
    this.getFilterAll = function () {
        return document.querySelector("#" + FILTER_ALL_ID);
    };
    this.getFilterAllSumInput = function () {
		return document.querySelector("#" + FILTER_ALL_SUM_ID);
	};    
    this.getFilterOk = function () {
		return document.querySelector("#" + FILTER_OK_ID);
	};
    this.getFilterOkSumInput = function () {
		return document.querySelector("#" + FILTER_OK_SUM_ID);
	};
    this.getFilterStorage = function () {
		return document.querySelector("#" + FILTER_STORAGE_ID);
	};
    this.getFilterStorageSumInput = function () {
		return document.querySelector("#" + FILTER_STORAGE_SUM_ID);
	};    
    this.getFilterOut = function () {
		return document.querySelector("#" + FILTER_OUT_ID);
	};
    this.getFilterOutSumInput = function () {
		return document.querySelector("#" + FILTER_OUT_SUM_ID);
	};
    this.getHeaderTable = function () {
        return document.querySelector("#" + HEADER_TABLE_ID);
	};
    this._getSortingImages = function () {
		return document.querySelectorAll("." + SORTING_IMAGES_CLASS);
	};
    this.getStoreDetailsFooter = function (){
        return document.querySelector("#" + STORE_DETAILS_IMAGES_ID);
    };
    this.getMain = function (){
        return document.querySelector("#" + MAIN_ID);
    };
    this.getBodyForm = function (){
        return _bodyForm;
    }


 
    this.createProductsTableBody = function (){
		return this._createElement("tbody", "product-table__body");
    };
    this.createProductsTable = function (){
		return this._createElement("table", "products-table");
    };
    this._createFormElement = function (bodyForm, inputId, inputType, labelText, inputValue){
        const elemName = this._createElement("input", "form__store-value");
        elemName.id = inputId;
        elemName.type = inputType;
        elemName.required = true;
        elemName.placeholder = inputValue;
        const labelName = this._createElement("label", "form__label");
        labelName.for = elemName;
        this.innerHTMLToElement(labelName, labelText);
        return bodyForm.append(labelName, elemName)
    };
    this.formStore = function (){
        var createStoreForm = this._createElement("form", "create-store"),
            bodyForm        = this._createElement("div", "form__store-body"),
            nameForm        = this._createElement("div", "form__store-header"),
            footerForm      = this._createElement("div", "form__store-footer"),
            storeSubmit     = this._createElement("input", "form__store-submit"),
            storeCanel      = this._createElement("input", "form__store-cancel"),
            darkBack        = this._createElement("div", "dark"),
            main            = this.getMain();

        _bodyForm = bodyForm;
        _createStoreForm = createStoreForm;
        _darkBack = darkBack;


        this.innerHTMLToElement(nameForm, "Create new store")

        this._createFormElement(bodyForm, "Name", "text", "Name:", "Enter name");
        this._createFormElement(bodyForm, "Email", "email", "Email:", "Enter email");
        this._createFormElement(bodyForm, "PhoneNumber", "tel", "Phone Number:", "Enter phone number");
        this._createFormElement(bodyForm, "Address", "text", "Address:", "Enter address");
        this._createFormElement(bodyForm, "Established", "date", "Established Date:", "MMM, d, y");
        this._createFormElement(bodyForm, "FloorArea", "number", "Floor Area:", "Enter floor area (in sq.m.)");


        storeSubmit.id = "submitForm";
        storeCanel. id = "resetForm";

        storeSubmit .type = "button";
        storeCanel  .type = "button";

        storeSubmit .value = "Create";
        storeCanel  .value = "Cancel";

        footerForm      .append(storeSubmit, storeCanel);
        createStoreForm .append(nameForm);
        createStoreForm .append(bodyForm);
        createStoreForm .append(footerForm)

        main.append(darkBack)
        main.append(createStoreForm);
        this.removeClassList(createStoreForm, "none");

    };

    this.formProduct = function (){
        var createProductForm   = this._createElement("form", "create-product"),
            nameForm            = this._createElement("div", "form__store-header"),
            bodyForm            = this._createElement("div", "form__store-body"),
            footerForm          = this._createElement("div", "form__store-footer"),
            darkBack            = this._createElement("div", "dark"),
            main                = this.getMain();;

        _bodyForm           = bodyForm;
        _createProductForm  = createProductForm;
        _darkBack = darkBack;

        this.innerHTMLToElement(nameForm, "Create new product")

        this._createFormElement(bodyForm, "Name", "text", "Name:", "Enter name");
        this._createFormElement(bodyForm, "Price", "number", "Price:", "Enter price");
        this._createFormElement(bodyForm, "Specs", "text", "Specs:", "Enter specs");
        this._createFormElement(bodyForm, "Rating", "number", "Rating:", "Enter rating 1..5");
        this._createFormElement(bodyForm, "SupplierInfo", "text", "Supplier info:", "Enter supplier info");
        this._createFormElement(bodyForm, "MadeIn", "text", "Made in:", "Enter origin country");
        this._createFormElement(bodyForm, "ProductionCompanyName", "text", "Production company name:", "Enter manufactur name");
        
        var ChoiceStatus          = this._createElement("select", "form__store-value"),
            ChoiceStatusLabel     = this._createElement("label", "form__label"),
            choiceStatusOk        = this._createElement("option", "form__store-value"),
            choiceStatusOut       = this._createElement("option", "form__store-value"),
            choiceStatusStorage   = this._createElement("option", "form__store-value");

        ChoiceStatusLabel.for = ChoiceStatus;

        choiceStatusOk.     value = "OK";
        choiceStatusOut.    value = "OUT_OF_STOCK";
        choiceStatusStorage.value = "STORAGE";
        
        this.innerHTMLToElement(ChoiceStatusLabel, "Status")
        this.innerHTMLToElement(choiceStatusOk, "Ok")
        this.innerHTMLToElement(choiceStatusOut, "Out of stock")
        this.innerHTMLToElement(choiceStatusStorage, "Storage")

        ChoiceStatusLabel.  innerHTML = "Status:";
        choiceStatusOk.     innerHTML = "Ok";
        choiceStatusOut.    innerHTML = "Out of stock";
        choiceStatusStorage.innerHTML = "Storage";
        
        ChoiceStatus.id = "Status";
        ChoiceStatus.placeholder = "Enter your status";

        ChoiceStatus.   append(choiceStatusOk, choiceStatusOut, choiceStatusStorage)
        bodyForm.       append(ChoiceStatusLabel, ChoiceStatus)

        var storeSubmit   = this._createElement("input", "form__store-submit"),
            storeCanel    = this._createElement("input", "form__store-cancel");

        storeSubmit.id = "submitForm";
        storeCanel. id = "resetForm";

        storeSubmit .type = "button";
        storeCanel  .type = "button";

        storeSubmit .value = "Create";
        storeCanel  .value = "Cancel";

        footerForm          .append(storeSubmit, storeCanel);
        createProductForm   .append(nameForm);
        createProductForm   .append(bodyForm);
        createProductForm   .append(footerForm)

        main.append(darkBack)
        main.append(createProductForm);
        this.removeClassList(createProductForm, "none")
    };
    this.reserForm = function (){
        if(_createStoreForm){
            this.addClassList(_createStoreForm, "none")
        }
        if(_createProductForm){
            this.addClassList(_createProductForm, "none")
        }
        this.addClassList(_darkBack, "none")
        for(let i=0; i < _bodyForm.children.length; i++){
            _bodyForm.children[i].value = "";
        }
        return this
    };
    this.changeSortingImages = function (src){
        var sortingImages = this._getSortingImages(); 
        return sortingImages.forEach((item) => {
            item.src = src;
        });
    };
    this.getSortingDirection = function (item){
        if(this.checkClassList(item,"not-selected") 
        || this.checkClassList(item,"from-less")){
            this.removeClassList(item,"not-selected")
                .removeClassList(item, "from-less")
                .addClassList(item, "from-more");
            item.src = "../images/sort-from-more.svg";
            return "DESC";
        } else if (item.classList.contains("from-more")){
            this.removeClassList(item,"from-more")
                .addClassList(item, "from-less");
            item.src = "../images/sort-from-less.svg";
            return "ASC";
        };
    };
    this.cleanSortAndFilters = function (_filterValue,_sortingField,_sortingDirection){
        _filterValue = "";
        _sortingField = "";
        _sortingDirection = "";
        this.changeSortingImages("../images/sort-not-selected.svg");
    };

    this.addClassList = function (elem, className) {
        elem.classList.add(className);
        return this;
    };
    this.removeClassList = function (elem, className){
        elem.classList.remove(className);
        return this;
    };
    this.checkClassList = function (elem, className) {
        return elem.classList.contains(className);
    };

    this.innerHTMLToElement = function (elem, text){
        elem.innerHTML = text;
        return this;
    };
    this._createImg = (classImg, url, altText) => {
        return `<img src=${url} alt=${altText} class=${classImg}>`;
    };
    this._createElement = (selectorStore, className, innerHtml) => {
        let elem = document.createElement(selectorStore);
        elem.classList.add(className);
        if (innerHtml) elem.innerHTML = innerHtml;
        return elem;
    };
    this._createButtonFooter = function (classButton, idButton, buttonName, url, altText){
        var button = this._createElement("button", "footer__button");
        button.classList.add(classButton);
        button.id = idButton;
        var image = this._createImg("button__image", url, altText);
        button.innerHTML += image;
        button.innerHTML += buttonName;
        return button;
    };
}



function Controller(view, model) {
    var _filterValue,
        _sortingField,
        _sortingDirection,
        _storeCheckedId;
    this.init = function() {
        var storesList          = view.getStoresList(),
            headerTable         = view.getHeaderTable(),
            productsTableBody   = view.getProductsTableBody(),
            storeDetailsFooter  = view.getStoreDetailsFooter(),
            storesListFooter    = view.getStoresListFooter(),
            main                = view.getMain();
        window.onload = () => {
            this._onLoadStores();
        }
        storesList.         addEventListener("click", this._onLoadStoreInfoClick);
        storeDetailsHeader. addEventListener("click", this._onFiltersClick);
        headerTable.        addEventListener("click", this._onSortingClick);
        productsTableBody.  addEventListener("click", this._onDeleteProduct);
        storeDetailsFooter. addEventListener("click", this._onStoreDetailsFooterClick);
        storesListFooter.   addEventListener("click", this._onStoresListFooterClick);
        main.               addEventListener("click", this._onMainClick);

	};
    this._onLoadStores = function(){
        model
            .fetchStores()
            .then(function(storesData){
                view
                    .fillStoresList(storesData)
                    // .addClassList(darkBack, "none");
                model.fillStoresArray(storesData)
            });
    };
    this._onLoadStoreInfoClick = function(event){
        for(let i=0; i<storesList.children.length; i++){
            view.removeClassList(storesList.children[i], "active-storage")
            if(storesList.children[i].dataset.id === event.target.dataset.id){
                view.addClassList(storesList.children[i], "active-storage")
                var storeChecked = model.checkStore(event.target.dataset.id);
                _storeCheckedId = storeChecked.id;
            }
        }
        var storeCheckedId      = model.assignId(storeChecked),
            dateParse           = model.parseDate(storeChecked),
            storeDetailsHeader  = view.getStoreDetailsHeader(),
            storeDetailsHeading = view.getStoreDetailsHeading(),
            storeDetailsProduct = view.getStoreDetailsProduct();
    
        view
            .innerHTMLToElement(storeDetailsHeader, "")
            .innerHTMLToElement(storeDetailsHeading, "Store Details")
            .removeClassList(storeDetailsHeading, "header__text_inactive")
            .addClassList(storeDetailsProduct, "products")
            .renderContacts(storeChecked, dateParse)
            .renderFilters(storeDetailsHeader);
        model
            .fetchProducts(storeCheckedId)
            .then(function(productsData){
                var productsSum             = model.checkFilterAll(productsData),
                    filterOkSum             = model.checkFilterOk(productsData),
                    filterStorageSum        = model.checkFilterStorage(productsData),
                    filterOutSum            = model.checkFilterOut(productsData),
                    productsSumInput        = view.getFilterAllSumInput(),
                    filterOkSumInput        = view.getFilterOkSumInput(),
                    filterStorageSumInput   = view.getFilterStorageSumInput(),
                    filterOutSumInput       = view.getFilterOutSumInput();
                    
                view
                    .innerHTMLToElement(productsSumInput, productsSum)
                    .innerHTMLToElement(filterOkSumInput, filterOkSum)
                    .innerHTMLToElement(filterStorageSumInput, filterStorageSum)
                    .innerHTMLToElement(filterOutSumInput, filterOutSum)
                    .renderProducts(productsData);
                
                var headerTable = view.getHeaderTable();
            });
            view.cleanSortAndFilters(_filterValue,_sortingField,_sortingDirection);
    };
    this._onFiltersClick = function (event){
        var filtersInputs = view.getFiltersInputs();
        filtersInputs.forEach((item) => {
            view.removeClassList(item, "active-filter")
        })
        
        if(view.checkClassList(event.target, "ok")){
            filterValue = "OK",
            filter = view.getFilterOk();
        } else if(view.checkClassList(event.target, "storage")){
            var filterValue = "STORAGE",
                filter = view.getFilterStorage();
        } else if(view.checkClassList(event.target, "out")){
            var filterValue = "OUT_OF_STOCK",
                filter = view.getFilterOut();
        } else {
            var filterValue = undefined,
                filter = view.getFilterAll();
        }
        view.addClassList(filter, "active-filter")

        model.fetchProducts(undefined, filterValue, _sortingField, _sortingDirection)
            .then(function(productsData){
                view.renderProducts(productsData)
            });
        _filterValue = filterValue
    };
    this._onSortingClick = function (event){
        view.changeSortingImages("../images/sort-not-selected.svg");
        var sortingField = model.assignSortingField(event.target.id);
        var sortingDirection = view.getSortingDirection(event.target);
        model.fetchProducts(undefined, _filterValue, sortingField, sortingDirection)
            .then(function(productsData){
                view.renderProducts(productsData)
            });
        _sortingField = sortingField;
        _sortingDirection = sortingDirection;
    };
    this._onDeleteProduct = function (event){
        if(view.checkClassList(event.target, "product-delete")){
            if(confirm("Are you really want to delete the product store?")){
                model
                    .deleteProduct(event.target.dataset.id)
                    .then(function(){
                        // const ProductDeleteDone = createElement("div", "store-delete", "The product was successfully delete");
                        // main.append(ProductDeleteDone);
                        model.fetchProducts(_storeCheckedId)
                            .then(function(productsData){
                            view.renderProducts(productsData);
                        })
                    })
            }
        }
    };
    this._onStoreDetailsFooterClick = function (event){
        if(event.target.id === "productCreate"){
            view.formProduct();
        }
        if(event.target.id === "resetForm"){
            view.reserForm();
        }
    }
    this._onStoresListFooterClick = function (event){
        if(event.target.id === "storesCreate"){
            view.formStore();
        }
    }
    this._onMainClick = function (event){
        if(event.target.id === "resetForm"){
            view.reserForm();
        }
        if(event.target.id === "submitForm"){
            var bodyForm = view.getBodyForm();
            model
                .createStoreRequest(bodyForm)
                .then(function(){
                    model.fetchStores(_storeCheckedId)
                    .then(function(storesData){
                        view
                            .fillStoresList(storesData)
                            // .addClassList(darkBack, "none");
                        model.fillStoresArray(storesData)
                    });
                })             
        }
    }
}

(new Controller(new View(), new Model())).init();




// const main                  = document.querySelector("#main");
// const storesList            = document.querySelector("#storesList");
// const storesListFooter      = document.querySelector("#storesListFooter");
// const storeDetailsHeader    = document.querySelector("#storeDetailsHeader");
// const storeDetailsProduct   = document.querySelector("#storeDetailsProducts");
// const storeDetailsFooter    = document.querySelector("#storeDetailsFooter");
// const storeDetailsHeading   = document.querySelector("#storeDetailsText");
// const searchForm            = document.querySelector("#searchForm");
// const deleteButton          = document.querySelector("#delete-icon");
// const getRequest            = new XMLHttpRequest();
// const postStore             = new XMLHttpRequest();
// const deleteRequest         = new XMLHttpRequest();
// const filtersArray          = [];

// // let sortingImages;
// let productsTableBody;
// // let sortingField;
// // let sortingDirection;
// // let filt;
// // let Stores; //
// // let products;
// // let storeId;
// // let headerTable;
// let storeCheked;

// // let storesAvailable = [];
// let subStringSearch             = "";
// const COUNT_ELEM_TO_CHECK       = 3;

// storeDetailsFooter.addEventListener("click", () => {
//     let deleteStoreUrl = `http://localhost:3000/api/Stores/${storeId}`;
//     let createProductForm;
//     let bodyForm;
//     let darkBack = createElement("div", "dark");

//     if(event.target.id === "prosuctCreate"){

    
//     if(event.target.id === "storesDelete"){
//         if(confirm("Are you really want to delete the store?")){
//             deleteRequest.open("Delete", deleteStoreUrl);
//             deleteRequest.responseType = "json";
//             deleteRequest.send();
//             deleteRequest.onload = function(){
//                 const StoreDeleteDone = createElement("div", "store-delete", "The store was successfully delete");
//                 main.append(StoreDeleteDone);
//                 storesList.innerHTML = "";
//                 getRequest.onload = function(){
//                     Stores = getRequest.response;
//                     Stores.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
//                         const store = `
//                             <li class="stores-list__store" data-id="${id}">
//                                 <div class="stores-list__info" data-id="${id}">
//                                     <h3 class="store__name" data-id="${id}">${Name}</h3>
//                                     <div class="store__square" data-id="${id}">
//                                         <span class="store__square-value" data-id="${id}">${FloorArea}</span>
//                                         <span class="store__square-units" data-id="${id}">sq.m</span>
//                                     </div>
//                                 </div>
//                                 <div class="store__address" data-id="${id}">${Address}</div>
//                             </li>
//                         `;
//                         storesList.innerHTML += store;
//                         const storeInArray = {
//                             id: `${id}`,
//                             name: `${Name}`,
//                             FloorArea: `${FloorArea}`,
//                             Address: `${Address}`,
//                             Established: `${Established}`,
//                             PhoneNumber: `${PhoneNumber}`,
//                             Email:`${Email}`,
//                         }
//                         storesAvailable.push(storeInArray);
//                     })
//                 }                
//             }
//         }
//     }    

//     createProductForm.addEventListener("click", () => {
//         if(event.target.id === "submitForm"){
//             let productAddUrl = `http://localhost:3000/api/Products`;
//             let bodyPostRequest = {
//                 "Name": "string",
//                 "Price": 0,
//                 "Specs": "string",
//                 "Rating": 0,
//                 "SupplierInfo": "string",
//                 "MadeIn": "string",
//                 "ProductionCompanyName": "string",
//                 "Status": "string",
//                 "StoreId": `${storeId}`
//             }
//             for(let i=0; i < bodyForm.children.length; i++){
//                 switch(bodyForm.children[i].id){
//                     case "Name": 
//                         bodyPostRequest.Name = bodyForm.children[i].value
//                         break;
//                     case "Price": 
//                         bodyPostRequest.Price = bodyForm.children[i].value
//                         break;
//                     case "Specs": 
//                         bodyPostRequest.Specs = bodyForm.children[i].value
//                         break;
//                     case "Rating": 
//                         bodyPostRequest.Rating = bodyForm.children[i].value
//                         break;
//                     case "MadeIn": 
//                         bodyPostRequest.MadeIn = bodyForm.children[i].value
//                         break;
//                     case "ProductionCompanyName": 
//                         bodyPostRequest.ProductionCompanyName = bodyForm.children[i].value
//                         break;
//                     case "Status": 
//                         bodyPostRequest.Status = bodyForm.children[i].value
//                         break;
//                     case "SupplierInfo": 
//                         bodyPostRequest.SupplierInfo = bodyForm.children[i].value
//                         break;

//                 }
//             }
//             postStore.open("Post", productAddUrl);
//             postStore.setRequestHeader("Content-type", "application/json")
//             postStore.onreadystatechange = function(){
//                 if(postStore.status < "400") {
//                     const StoreAddDone = createElement("div", "store-add", "The product was successfully added");
//                     main.append(StoreAddDone);
//                 } 
//             }
//             postStore.send(JSON.stringify(bodyPostRequest))
//             storesList.innerHTML = "";
//             getRequest.onload = function(){
//                 Stores = getRequest.response;
//                 Stores.forEach(function({ Name, FloorArea, Address, id, Established, PhoneNumber, Email }){
//                     const store = `
//                         <li class="stores-list__store" data-id="${id}">
//                             <div class="stores-list__info" data-id="${id}">
//                                 <h3 class="store__name" data-id="${id}">${Name}</h3>
//                                 <div class="store__square" data-id="${id}">
//                                     <span class="store__square-value" data-id="${id}">${FloorArea}</span>
//                                     <span class="store__square-units" data-id="${id}">sq.m</span>
//                                 </div>
//                             </div>
//                             <div class="store__address" data-id="${id}">${Address}</div>
//                         </li>
//                     `;
//                     storesList.innerHTML += store;
//                     const storeInArray = {
//                         id: `${id}`,
//                         name: `${Name}`,
//                         FloorArea: `${FloorArea}`,
//                         Address: `${Address}`,
//                         Established: `${Established}`,
//                         PhoneNumber: `${PhoneNumber}`,
//                         Email:`${Email}`,
//                     }
//                     storesAvailable.push(storeInArray);
//                     darkBack.classList.add("none");
//                 })
//             }                
//         }
//         if(event.target.id === "resetForm"){
//             for(let i=0; i < bodyForm.children.length; i++){
//                 bodyForm.children[i].value = "";
//                 createProductForm.classList.add("none");
//                 darkBack.classList.add("none");
//             }
//         }  
//     })

// })
// storesListFooter.addEventListener("click", () => {
//    
//     createStoreForm.addEventListener("click", () => {
//         
//           
//     })
    

// })
// // **************************************** find store *********************************************************************//

// searchForm.addEventListener("click", (event) => {
//     if (event.target.id === "search-icon"){

//         const input = event.currentTarget.children[0];
//         subStringSearch = input.value.toLowerCase();
    
//         for (let i = 0; i < storesAvailable.length; i++) {
//             var check = 0;
//             const storeInstance = storesAvailable[i];

//             check += (storeInstance.Address.    toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;
//             check += (storeInstance.name.       toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;
//             check += (storeInstance.FloorArea.  toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;

//             (check === COUNT_ELEM_TO_CHECK) ? storesList.children[i].classList.add("none")
//                                             : storesList.children[i].classList.remove("none");
//         }
//     } else if (event.target.id === "delete-icon"){
//         event.currentTarget.children[0].value = ""
//         event.target.classList.add("none")
//         subStringSearch = "";

//         for (let i = 0; i < storesAvailable.length; i++) {
//             storesList.children[i].classList.remove("none");
//         }
//     }
// })
// searchForm.addEventListener("keyup", (event) => {

//     if (event.code === "Enter"){
//         subStringSearch = event.target.value.toLowerCase();
    
//         for (let i = 0; i < storesAvailable.length; i++) {
//             var check = 0;
//             const storeInstance = storesAvailable[i];

//             check += (storeInstance.Address.    toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;
//             check += (storeInstance.name.       toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;
//             check += (storeInstance.FloorArea.  toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;

//             (check === COUNT_ELEM_TO_CHECK) ? storesList.children[i].classList.add("none")
//                                             : storesList.children[i].classList.remove("none");
//         }
//     }
//     if (event.target.value !== "" && deleteButton.classList.contains("none")){
//         deleteButton.classList.remove("none");
//     }
    
// })




