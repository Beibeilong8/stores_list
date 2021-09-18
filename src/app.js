/**
 * Model class. Knows everything about API endpoint and data structure. Can format/map data to any structure.
 *
 * @constructor
 */
function Model() {
    /**
	 * URL template for adding the products from API service.
	 * @type {string}
	 *
	 * @example this.editData(_productAddURL, bodyPostRequest)
	 *
	 * @private
	 */
    var _productAddURL = `http://localhost:3000/api/Products/`;

    /**
	 * URL template for adding the stores from API service.
	 * @type {string}
	 *
	 * @example this.fetchData(_storesUPL)
	 *
	 * @private
	 */
    var _storesUPL = `http://localhost:3000/api/Stores/`;

    /**
	 * URL template for getting the product from API service.
	 * @type {string}
	 *
	 * @example _productURL.replace("{PRODUCT_ID}", productId)
	 *
	 * @private
	 */
    var _productURL = _productAddURL + "{PRODUCT_ID}";

    /**
	 * URL template for deleting the stores from API service.
	 * @type {string}
	 *
	 * @example _storeDeleteURL.replace("{STORE_ID}", _storeCheckedId)
	 *
	 * @private
	 */
    var _storeDeleteURL = _storesUPL + "{STORE_ID}";

    /**
	 * URL template for getting the products from API service.
	 * @type {string}
	 *
	 * @example _productsURLTemplate.replace("{STORE_ID}", storeId)
	 *
	 * @private
	 */
    var _productsURLTemplate = _storesUPL + "{STORE_ID}/rel_Products/";

    /**
	 * URL template for deleting the product from API service.
	 * @type {string}
	 *
	 * @example _productDeleteURL.replace("{STORE_ID}", _storeCheckedId).replace("{ID_PRODUCT}", idProduct)
	 *
	 * @private
	 */
    var _productDeleteURL = _productsURLTemplate + `{ID_PRODUCT}`;

    /**
	 * URL template for adding the products with filter from API service.
	 * @type {string}
	 *
	 * @example _productsURLfilter.replace("{STORE_ID}", storeId).replace("{FILTER}", filterValue)
	 *
	 * @private
	 */
    var _productsURLfilter = _productsURLTemplate + `?filter=%7B%22where%22%3A%20%7B%22Status%22%3A%20%22{FILTER}%22%7D%7D`;

    /**
	 * URL template for adding the products with sorting from API service.
	 * @type {string}
	 *
	 * @example _productsURLsort.replace("{STORE_ID}", _storeCheckedId).replace("{SORTING_FILT}", sortingField).replace("{SORTING_DIRECTION}", sortDirection)
	 *
	 * @private
	 */
    var _productsURLsort = _productsURLTemplate + `?filter=%7B%22order%22%3A%20%22{SORTING_FILT}%20{SORTING_DIRECTION}%22%7D`;

    /**
	 * URL template for adding the products with sorting and filter from API service.
	 * @type {string}
	 *
	 * @example _productsURLfilterAndSort.replace("{STORE_ID}", _storeCheckedId).replace("{FILTER}", filterValue).replace("{SORTING_FILT}", sortingField).replace("{SORTING_DIRECTION}", sortDirection)
	 *
	 * @private
	 */
    var _productsURLfilterAndSort = _productsURLTemplate + `?filter=%7B%22where%22%3A%20%7B%22Status%22%3A%20%22{FILTER}%22%7D%2C%20%22order%22%3A%20%22{SORTING_FILT}%20{SORTING_DIRECTION}%22%7D`;

    /**
	 * The link to the pattern body add store request.
     * 
	 * @type {Object}
     * 
	 * @public
	 */
    var bodyPostStore = {
            "Name": "string",
            "Email": "string",
            "PhoneNumber": "string",
            "Address": "string",
            "Established": "2021-09-12T07:36:08.058Z",
            "FloorArea": 0
    };

    /**
	 * The link to the pattern body add product request.
     * 
	 * @type {Object}
     * 
	 * @public
	 */
    var bodyPostRequest = {
            "Name": "string",
            "Price": 0,
            "Specs": "string",
            "Rating": 0,
            "SupplierInfo": "string",
            "MadeIn": "string",
            "ProductionCompanyName": "string",
            "Status": "string",
            "StoreId": `${storeId}`
    };

    /**
    * The available stores array for check store and to use for search.
    * 
    * @type {Object[]}
    * 
    * @public
    */
    var storesAvailable = [];

    /**
    * The checked stores id for get products.
    * 
    * @type {number}
    * 
    * @private
    */
    var _storeCheckedId;

    /**
    * The checked stores id for get products.
    * 
    * @type {number}
    * 
    * @public
    */
    var storeId;

    /**
    * The sorting rield for get products for sorting.
    * 
    * @type {string}
    * 
    * @public
    */
    var sortingField;

    /**
    * The not validations fields array for adding error-message.
    * 
    * @type {Object[]}
    * 
    * @public
    */
    var parametersArr = [];

	/**
	 * Common method which "promisifies" the XHR-get calls.
	 *
	 * @param {string} url the URL address to fetch.
	 *
	 * @return {Promise} the promise object will be resolved once XHR gets loaded/failed.
	 *
	 * @public
	 */
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

	/**
	 * Common method which "promisifies" the XHR-delete calls.
	 *
	 * @param {string} url the URL address to fetch.
	 *
	 * @return {Promise} the promise object will be resolved once XHR gets loaded/failed.
	 *
	 * @public
	 */
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

    /**
	 * Common method which "promisifies" the XHR-create calls.
	 *
	 * @param {string} url the URL address to fetch.
	 *
	 * @return {Promise} the promise object will be resolved once XHR gets loaded/failed.
	 *
	 * @public
	 */
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

    /**
	 * Common method which "promisifies" the XHR-put calls.
	 *
	 * @param {string} url the URL address to fetch.
	 *
	 * @return {Promise} the promise object will be resolved once XHR gets loaded/failed.
	 *
	 * @public
	 */
    this.editData = function (url, bodyPostRequest){
		return new Promise(function (resolve, reject) {
			var req = new XMLHttpRequest();

			req.open("Put", url);

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

	/**
	 * Fetch the stores list.
	 *
	 * @returns {Promise} the promise object will be resolved once the Stores List Object gets loaded.
	 *
	 * @public
	 */
    this.fetchStores = function() {
		return this
			.fetchData(_storesUPL)
			.then(function (storesData) {
				return storesData;
			});
	};

    /**
	 * Fetch the products list.
	 *
     * @param {String} storeId the checked store id.
     * @param {String} filterValue the value filter.
     * @param {String} sortingField the sorting field.
     * @param {String} sortDirection the sorting direction.
     * 
	 * @returns {Promise} the promise object will be resolved once the products Object gets loaded.
	 *
	 * @public
	 */
    this.fetchProducts = function(storeId, filterValue, sortingField, sortDirection) {
        
        if(!storeId){storeId = _storeCheckedId}

        if(!filterValue && !sortingField){
            return this
			.fetchData(_productsURLTemplate.replace("{STORE_ID}", storeId))
			.then(function (productsData) {
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

    /**
	 * Fetch the product by id.
	 *
     * @param {String} productId the checked product id.
     * 
	 * @returns {Promise} the promise object will be resolved once the product Object gets loaded.
	 *
	 * @public
	 */
    this.fetchProduct = function (productId){
        return this
        .fetchData(_productURL.replace("{PRODUCT_ID}", productId))
        .then(function (productData) {
            return productData;
        });
    };

    /**
	 * Fetch the products list with filter.
	 *
     * @param {String} storeId the checked store id.
     * @param {String} filterValue the value filter.
     * 
	 * @returns {Promise} the promise object will be resolved once the products Object gets loaded.
	 *
	 * @public
	 */
    this.fetchProductsWithFilt = function(storeId, filterValue) {
		return this
			.fetchData(_productsURLfilter.replace("{STORE_ID}", storeId).replace("{FILTER}", filterValue))
			.then(function (productsData) {
				return productsData;
			});
	};

    /**
	 * Fetch the products list with filter, sorting.
	 *
     * @param {String} filterValue the value filter.
     * @param {String} sortingField the sorting field.
     * @param {String} sortDirection the sorting direction.
     * 
	 * @returns {Promise} the promise object will be resolved once the products Object gets loaded.
	 *
	 * @public
	 */
    this.fetchProductsWithFiltAndSort = function(filterValue, sortingField, sortDirection) {
        return this
			.fetchData(_productsURLfilterAndSort.replace("{STORE_ID}", _storeCheckedId).replace("{FILTER}", filterValue).replace("{SORTING_FILT}", sortingField).replace("{SORTING_DIRECTION}", sortDirection))
			.then(function (productsData) {
				return productsData;
			});
	};

    /**
	 * Fetch the products list with sorting.
	 *
     * @param {String} sortingField the sorting field.
     * @param {String} sortDirection the sorting direction.
     * 
	 * @returns {Promise} the promise object will be resolved once the products Object gets loaded.
	 *
	 * @public
	 */
    this.fetchProductsWithSort = function(sortingField, sortDirection) {
		return this
			.fetchData(_productsURLsort.replace("{STORE_ID}", _storeCheckedId).replace("{SORTING_FILT}", sortingField).replace("{SORTING_DIRECTION}", sortDirection))
			.then(function (productsData) {
				return productsData;
			});
	};

    /**
	 * Delete the product by id.
	 *
     * @param {String} idProduct the checked product id.
     * 
	 * @returns {Promise} the promise object will be resolved once the product Object delete loaded.
	 *
	 * @public
	 */
    this.deleteProduct = function(idProduct) {
		return this
			.deleteData(_productDeleteURL.replace("{STORE_ID}", _storeCheckedId).replace("{ID_PRODUCT}", idProduct))
            .then(function (productsData) {
				return productsData;
			});
	};

    /**
	 * Delete the Store by id.
     * 
	 * @returns {Promise} the promise object will be resolved once the store Object delete loaded.
	 *
	 * @public
	 */
    this.deleteStore = function() {
		return this
			.deleteData(_storeDeleteURL.replace("{STORE_ID}", _storeCheckedId))
            .then(function (productsData) {
				return productsData;
			});
	};

    /**
	 * Create store by id.
	 *
     * @param {Object} bodyForm the body of post-request.
     * 
	 * @returns {Promise} the promise object will be resolved once the store Object create loaded.
	 *
	 * @public
	 */
    this.createStoreRequest = function (bodyForm){
        bodyPostStore = this._assignParamtersStore(bodyForm);
        return this
            .createData(_storesUPL, bodyPostStore)
            .then(function (request) {
                return request;
            });
    };

    /**
	 * Create store by id.
	 *
     * @param {Object} bodyForm the body of post-request.
     * 
	 * @returns {Promise} the promise object will be resolved once the store Object create loaded.
	 *
	 * @public
	 */
    this.createProductRequest = function (bodyForm){
        bodyPostRequest = this._assignParamtersProduct(bodyForm);
        return this
            .editData(_productAddURL, bodyPostRequest)
            .then(function (request) {
                return request;
            });
    };

    /**
	 * Edite product by id.
     * 
	 * @param {String} productId the checked product id.
     * @param {Object} bodyForm the body of put-request.
     * 
	 * @returns {Promise} the promise object will be resolved once the product Object edits loaded.
	 *
	 * @public
	 */
    this.editeProductRequest = function (productId, bodyForm){
        bodyPostRequest = this._assignParamtersProduct(bodyForm);
        return this
            .editData(_productURL.replace("{PRODUCT_ID}", productId), bodyPostRequest)
            .then(function (request) {
                return request;
            });
    };

    /**
	 * Fill the storess array for checked.
     * 
     * @param {Object} storesData the body of get-request.
     * 
	 * @returns {Object[]} the stores array for necessary structure.
	 *
	 * @public
	 */
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
        return storesAvailable;
    };

    /**
	 * Return the checked store.
     * 
     * @param {String} id the checked store id.
     * 
	 * @returns {Object} the checked store.
	 *
	 * @public
	 */
    this.checkStore = function (id){
        var storeChekedArr = storesAvailable.filter( 
            (item) => { return item.id === id;}
            )
        var storeCheked = storeChekedArr[0]
        return storeCheked
    };

    /**
	 * Return the checked store id.
     * 
     * @param {Object} item the store id.
     * 
	 * @returns {String} the checked store id.
	 *
	 * @public
	 */
    this.assignId = function (item){
        return item.id;
    };

    /**
	 * Return the date for necessary structure.
     * 
     * @param {Object} store the object store.
     * 
	 * @returns {Object} the established date store.
	 *
	 * @public
	 */ 
    this.parseDate = function (store){
        return new Date (store.Established).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    };

    /**
	 * Return sum products.
     * 
     * @param {Object} productsData the products.
     * 
	 * @returns {number} the sum products.
	 *
	 * @public
	 */ 
    this.checkFilterAll = function (productsData){
        return productsData.length;
    };

    /**
	 * Return sum products for filter Ok.
     * 
     * @param {Object} productsData the products.
     * 
	 * @returns {number} the sum products for filter.
	 *
	 * @public
	 */ 
    this.checkFilterOk = function (productsData){
        return productsData.filter( (item) => item.Status === "OK").length;
    };   

    /**
	 * Return sum products for filter Storage.
     * 
     * @param {Object} productsData the products.
     * 
	 * @returns {number} the sum products for filter.
	 *
	 * @public
	 */ 
    this.checkFilterStorage = function (productsData){
        return productsData.filter( (item) => item.Status === "STORAGE").length;
    };  

    /**
	 * Return sum products for filter OUT_OF_STOCK.
     * 
     * @param {Object} productsData the products.
     * 
	 * @returns {number} the sum products for filter.
	 *
	 * @public
	 */ 
    this.checkFilterOut = function (productsData){
        return productsData.filter( (item) => item.Status === "OUT_OF_STOCK").length;
    };

    /**
	 * Count sum input, which passed the check.
     * 
     * @param {string} subStringSearch substring for check.
     * @param {Object} storeInstance the store for check.
     * 
	 * @returns {number} the sum input.
	 *
	 * @public
	 */ 
    this.searchString = function (subStringSearch, storeInstance){
        var check = 0;

        check += (storeInstance.Address.    toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;
        check += (storeInstance.name.       toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;
        check += (storeInstance.FloorArea.  toLowerCase().indexOf(subStringSearch) === -1) ? 1 : 0;
        return check
    };

    /**
	 * Return array for invalid inputs form
     * 
     * @param {Object} bodyForm the body for form.
     * @param {string} paramForm the param, indicating for type form.
     * 
	 * @returns {Object[]} The not validations fields array for adding error-message. .
	 *
	 * @public
	 */ 
    this.validationForm = function (bodyForm, paramForm){
        parametersArr = [];
        if(paramForm === "Store"){
            bodyPostStore = this._assignParamtersStore(bodyForm);
        }
        if(paramForm === "Product"){
            bodyPostStore = this._assignParamtersProduct(bodyForm);
        }
        for(let key in bodyPostStore){
            if (bodyPostStore[key] === "" || bodyPostStore[key] === undefined || bodyPostStore[key] === null) {
                parametersArr.push(this._checkParamtersNotValidare(key, bodyForm)) 
            };
        };
        return parametersArr;
    };

    /**
	 * Returns modificated value
     * 
     * @param {HTMLElement} elem the paramfor modificated.
     * 
	 * @returns {HTMLElement} the modificated element
	 */
    this.getValueToLowerCase = function (elem){
        return elem.value.toLowerCase();
    };

    /**
	 * Assign sorting field for sorting
     * 
     * @param {string} id the checked image id.
     * 
	 * @returns {string} The sorting field.
	 *
	 * @public
	 */ 
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

    /**
	 * Assign parameters store for object
     * 
     * @param {Object} bodyForm the body for form.
     * 
	 * @returns {Object} The object filled in values.
	 *
	 * @private
	 */ 
    this._assignParamtersStore = function (bodyForm){
        for(let i=0; i < bodyForm.children.length; i++){
            switch(bodyForm.children[i].id){
                case "Name": 
                    bodyPostStore.Name = bodyForm.children[i].value
                    break;
                case "Email": 
                    bodyPostStore.Email = bodyForm.children[i].value
                    break;
                case "PhoneNumber": 
                    bodyPostStore.PhoneNumber = bodyForm.children[i].value
                    break;
                case "Address": 
                    bodyPostStore.Address = bodyForm.children[i].value
                    break;
                case "Established": 
                    bodyPostStore.Established = bodyForm.children[i].value
                    break;
                case "FloorArea": 
                    bodyPostStore.FloorArea = bodyForm.children[i].value
                    break;
            };
        }
        return bodyPostStore;
    };

    /**
	 * Assign parameters product for object
     * 
     * @param {Object} bodyForm the body for form.
     * 
	 * @returns {Object} The object filled in values.
	 *
	 * @private
	 */ 
    this._assignParamtersProduct = function (bodyForm){
        for(let i=0; i < bodyForm.children.length; i++){
            switch(bodyForm.children[i].id){
                case "Name": 
                    bodyPostRequest.Name = bodyForm.children[i].value
                    break;
                case "Price": 
                    bodyPostRequest.Price = bodyForm.children[i].value
                    break;
                case "Specs": 
                    bodyPostRequest.Specs = bodyForm.children[i].value
                    break;
                case "Rating": 
                    bodyPostRequest.Rating = bodyForm.children[i].value
                    break;
                case "MadeIn": 
                    bodyPostRequest.MadeIn = bodyForm.children[i].value
                    break;
                case "ProductionCompanyName": 
                    bodyPostRequest.ProductionCompanyName = bodyForm.children[i].value
                    break;
                case "Status": 
                    bodyPostRequest.Status = bodyForm.children[i].value
                    break;
                case "SupplierInfo": 
                    bodyPostRequest.SupplierInfo = bodyForm.children[i].value
                    break;
            }
        }
        bodyPostRequest.StoreId = _storeCheckedId;
        return bodyPostRequest;
    };

    /**
	 * Fill parameters product for object
     * 
     * @param {Object} bodyPostRequest the body for request.
     * @param {Object} bodyForm the body for form.
     * 
	 * @returns {Object} The object body for form filled in values.
	 *
	 * @private
	 */ 
    this._fillParametersProduct = function (bodyPostRequest, bodyForm){
        for(let i=0; i < bodyForm.children.length; i++){
            switch(bodyForm.children[i].id){
                case "Name": 
                    bodyForm.children[i].value = bodyPostRequest.Name
                    break;
                case "Price": 
                    bodyForm.children[i].value = bodyPostRequest.Price
                    break;
                case "Specs": 
                    bodyForm.children[i].value = bodyPostRequest.Specs
                    break;
                case "Rating": 
                    bodyForm.children[i].value = bodyPostRequest.Rating
                    break;
                case "MadeIn": 
                    bodyForm.children[i].value = bodyPostRequest.MadeIn
                    break;
                case "ProductionCompanyName": 
                    bodyForm.children[i].value = bodyPostRequest.ProductionCompanyName
                    break;
                case "Status": 
                    bodyForm.children[i].value = bodyPostRequest.Status
                    break;
                case "SupplierInfo": 
                    bodyForm.children[i].value = bodyPostRequest.SupplierInfo
                    break;
            }
        }
        return bodyForm;
    };

    /**
	 * Check parameters product for object
     * 
     * @param {string} key the not validate key.
     * @param {Object} bodyForm the body for form.
     * 
	 * @returns {string} Return the value for bodyForm wich id = key.
	 *
	 * @private
	 */ 
    this._checkParamtersNotValidare = function (key, bodyForm){
        for(let i=0; i < bodyForm.children.length; i++){
            if(bodyForm.children[i].id === key){
                return bodyForm.children[i]
            }
        }
    };
};

/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function View() {

    /**
	 * ID of the "Stores List" ul DOM element'
	 * @constant
	 * @type {string}
	 */
    var STORES_LIST_ID = "storesList";

    /**
	 * ID of the "Stores List" footer DOM element'
	 * @constant
	 * @type {string}
	 */
    var STORES_LIST_FOOTER_ID = "storesListFooter";

    /**
	 * ID of the "Stores Details" header DOM element'
	 * @constant
	 * @type {string}
	 */
    var STORE_DETAILS_HEADER_ID = "storeDetailsHeader";

    /**
	 * ID of the "Stores Prosucts" section DOM element'
	 * @constant
	 * @type {string}
	 */
    var STORE_DETAILS_PRODUCT_ID = "storeDetailsProducts";

    /**
	 * ID of the "Stores Details" footer DOM element'
	 * @constant
	 * @type {string}
	 */
    var STORE_DETAILS_FOOTER_ID = "storeDetailsFooter";

    /**
	 * ID of the "Stores Details Heading" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var STORE_DETAILS_HEADING_ID = "storeDetailsText";

    /**
	 * ID of the "Search" form DOM element'
	 * @constant
	 * @type {string}
	 */
    var SEARCH_FORM_ID = "searchForm";

    /**
	 * ID of the "Clean dearch form" button DOM element'
	 * @constant
	 * @type {string}
	 */
    var CLEAN_SEARCH_FIELD_BUTTON = "delete-icon";

    /**
	 * Class of the "Filters" divs DOM elements'
	 * @constant
	 * @type {string}
	 */
    var FILTERS_INPUTS_CLASS = "filter";

    /**
	 * ID of the "Filter All sum" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_ALL_SUM_ID = "sumAll";

    /**
	 * ID of the "Filter Ok sum" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_OK_SUM_ID = "OK";

    /**
	 * ID of the "Filter Storage sum" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_STORAGE_SUM_ID = "STORAGE";

    /**
	 * ID of the "Filter Out of stock sum" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_OUT_SUM_ID = "OUT_OF_STOCK";

    /**
	 * ID of the "Filter All" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_ALL_ID = "filterAll";

    /**
	 * ID of the "Filter Ok" figure DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_OK_ID = "figureOk";

    /**
	 * ID of the "Filter Storage" figure DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_STORAGE_ID = "figureStorage";

    /**
	 * ID of the "Filter Out of Stock" figure DOM element'
	 * @constant
	 * @type {string}
	 */
    var FILTER_OUT_ID = "figureOut";

    /**
	 * ID of the "products table" header DOM element'
	 * @constant
	 * @type {string}
	 */
    var HEADER_TABLE_ID = "headerTable";

    /**
	 * Class of the "Sorting" images DOM element'
	 * @constant
	 * @type {string}
	 */
    var SORTING_IMAGES_CLASS = "sorting__image";

    /**
	 * ID of the "Products" table DOM element'
	 * @constant
	 * @type {string}
	 */
    var PRODUCT_TABLE_ID = "productsTable";

    /**
	 * ID of the "products table body" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var PRODUCT_TABLE_BODY_ID = "productsTableBody";

    /**
	 * ID of the "Not delected Store" div DOM element'
	 * @constant
	 * @type {string}
	 */
    var NOT_SELECTED_STORE_ID = "notSelectedStore";

    /**
	 * ID of the "Store details" footer DOM element'
	 * @constant
	 * @type {string}
	 */
    var PRODUCTS_FOOTER_ID = "storeDetailsFooter";

    /**
	 * ID of the main DOM element'
	 * @constant
	 * @type {string}
	 */
    var MAIN_ID = "main";

    /**
    * The body form for reset form.
    * 
    * @type {string}
    * 
    * @private
    */
    var _bodyForm = "";

    /**
    * The create store form for reset form.
    * 
    * @type {Object}
    * 
    * @private
    */ 
    var _createStoreForm;

    /**
    * The product store form for reset form.
    * 
    * @type {Object}
    * 
    * @private
    */
    var _createProductForm;

    /**
    * The dark back form for reset form.
    * 
    * @type {Object}
    * 
    * @private
    */
    var _darkBack;

    /**
	 * Render the data into stores list 
     * 
     * @param {Object} storesData the array of stores to be filled.
	 *
	 * @return {View} self object.
	 */
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

    /**
	 * Render the data into contacts about store
     * 
     * @param {Object} store the date of checked store to be filled.
     * @param {Object} dateParse the parse date of checked store to be filled.
	 *
	 * @return {View} self object.
	 */
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

    /**
	 * Render the data into filters products
     * 
     * @param {Object} item store details header, wich one date of checked store to be filled.
	 *
	 * @return {View} self object.
	 */
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

    /**
	 * Render the data into products table
     * 
     * @param {Object} productsData the array of products to be filled.
	 *
	 * @return {View} self object.
	 */
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
                        <img src="../images/edit.png" alt="edit product" class="product-edit" data-id="${item.id}">
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

    /**
	 * Returns the stores list ul.
     * 
	 * @returns {HTMLElement} the ul element.
	 */
    this.getStoresList = function () {
		return document.querySelector("#" + STORES_LIST_ID);
	};

    /**
	 * Returns the stores list footer.
     * 
	 * @returns {HTMLElement} the footer element.
	 */
    this.getStoresListFooter = function () {
		return document.querySelector("#" + STORES_LIST_FOOTER_ID);
	};

    /**
	 * Returns the store details header.
     * 
	 * @returns {HTMLElement} the header element.
	 */
    this.getStoreDetailsHeader = function () {
		return document.querySelector("#" + STORE_DETAILS_HEADER_ID);
	};

    /**
	 * Returns the stores details products section.
     * 
	 * @returns {HTMLElement} the section element.
	 */
    this.getStoreDetailsProduct = function () {
		return document.querySelector("#" + STORE_DETAILS_PRODUCT_ID);
	};

    /**
	 * Returns the products table.
     * 
	 * @returns {HTMLElement} the table element.
	 */
    this.getProductsTable = function () {
		return document.querySelector("#" + PRODUCT_TABLE_ID);
	};

    /**
	 * Returns the products tablebody.
     * 
	 * @returns {HTMLElement} the tbody element.
	 */
    this.getProductsTableBody = function () {
		return document.querySelector("#" + PRODUCT_TABLE_BODY_ID);
	};

    /**
	 * Returns the div for product with not-delected store.
     * 
	 * @returns {HTMLElement} the div element.
	 */
    this.getNotSelectedStoreInput = function () {
		return document.querySelector("#" + NOT_SELECTED_STORE_ID);
	};

    /**
	 * Returns the stores details footer.
     * 
	 * @returns {HTMLElement} the footer element.
	 */
    this.getStoreDetailsFooter = function () {
		return document.querySelector("#" + STORE_DETAILS_FOOTER_ID);
	};

    /**
	 * Returns the stores details heading.
     * 
	 * @returns {HTMLElement} the h3 element.
	 */
    this.getStoreDetailsHeading = function () {
		return document.querySelector("#" + STORE_DETAILS_HEADING_ID);
	};

    /**
	 * Returns the search form store
     * 
	 * @returns {HTMLElement} the form element.
	 */
    this.getSearchForm = function () {
		return document.querySelector("#" + SEARCH_FORM_ID);
	};

    /**
	 * Returns the clean search form store
     * 
	 * @returns {HTMLElement} the image element.
	 */
    this.getCleanSearchButton = function () {
		return document.querySelector("#" + CLEAN_SEARCH_FIELD_BUTTON);
	};

    /**
	 * Returns the array with filters inputs
     * 
	 * @returns {HTMLElement[]} the array element.
	 */
    this.getFiltersInputs = function () {
		return document.querySelectorAll("." + FILTERS_INPUTS_CLASS);
	};

    /**
	 * Returns the filter All products
     * 
	 * @returns {HTMLElement} the div element.
	 */
    this.getFilterAll = function () {
        return document.querySelector("#" + FILTER_ALL_ID);
    };

    /**
	 * Returns the filter All products sum
     * 
	 * @returns {HTMLElement} the div element.
	 */
    this.getFilterAllSumInput = function () {
		return document.querySelector("#" + FILTER_ALL_SUM_ID);
	};  
    
    /**
	 * Returns the filter Ok products
     * 
	 * @returns {HTMLElement} the figure element.
	 */
    this.getFilterOk = function () {
		return document.querySelector("#" + FILTER_OK_ID);
	};

    /**
	 * Returns the filter Ok products sum
     * 
	 * @returns {HTMLElement} the div element.
	 */
    this.getFilterOkSumInput = function () {
		return document.querySelector("#" + FILTER_OK_SUM_ID);
	};

    /**
	 * Returns the filter Storage products
     * 
	 * @returns {HTMLElement} the figure element.
	 */
    this.getFilterStorage = function () {
		return document.querySelector("#" + FILTER_STORAGE_ID);
	};

    /**
	 * Returns the filter Storage products sum
     * 
	 * @returns {HTMLElement} the div element.
	 */
    this.getFilterStorageSumInput = function () {
		return document.querySelector("#" + FILTER_STORAGE_SUM_ID);
	};    

    /**
	 * Returns the filter Out of stock products
     * 
	 * @returns {HTMLElement} the figure element.
	 */
    this.getFilterOut = function () {
		return document.querySelector("#" + FILTER_OUT_ID);
	};

    /**
	 * Returns the filter Out of stock products sum
     * 
	 * @returns {HTMLElement} the div element.
	 */
    this.getFilterOutSumInput = function () {
		return document.querySelector("#" + FILTER_OUT_SUM_ID);
	};

    /**
	 * Returns the header table products
     * 
	 * @returns {HTMLElement} the thead element.
	 */
    this.getHeaderTable = function () {
        return document.querySelector("#" + HEADER_TABLE_ID);
	};

    /**
	 * Returns the store details footer
     * 
	 * @returns {HTMLElement} the footer element.
	 */
    this.getStoreDetailsFooter = function (){
        return document.querySelector("#" + PRODUCTS_FOOTER_ID);
    };

    /**
	 * Returns the all content of site
     * 
	 * @returns {HTMLElement} the main element.
	 */
    this.getMain = function (){
        return document.querySelector("#" + MAIN_ID);
    };

    /**
	 * Returns the body form of private variable
     * 
	 * @returns {HTMLElement} the button element.
	 */
    this.getBodyForm = function (){
        return _bodyForm;
    };

    /**
	 * Clear the data into search field
     * 
     * @param {Event} event the DOM event object.
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.clearSearchField = function (event){
        event.currentTarget.children[0].value = ""
        this.addClassList(event.target, "none")
        return this;
    }

     /**
	 * Create the product table body
     * 
	 * @returns {HTMLElement} the tbody element.
	 */
    this.createProductsTableBody = function (){
		return this._createElement("tbody", "product-table__body");
    };

    /**
	 * Create the product table
     * 
	 * @returns {HTMLElement} the table element.
	 */
    this.createProductsTable = function (){
		return this._createElement("table", "products-table");
    };

    /**
	 * Create the form to create store
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.formStore = function (){
        var createStoreForm = this._createElement("form", "create-store"),
            bodyForm        = this._createElement("div", "form__store-body"),
            nameForm        = this._createElement("div", "form__store-header"),
            footerForm      = this._createElement("div", "form__store-footer"),
            storeSubmit     = this._createElement("input", "form__store-submit"),
            storeCanel      = this._createElement("input", "form__store-cancel"),
            darkBack        = this._createElement("div", "dark"),
            main            = this.getMain();

        _bodyForm           = bodyForm;
        _createStoreForm    = createStoreForm;
        _darkBack           = darkBack;


        this.innerHTMLToElement(nameForm, "Create new store")

        this._createFormElement(bodyForm, "Name", "text", "Name:", "Enter name");
        this._createFormElement(bodyForm, "Email", "email", "Email:", "Enter email");
        this._createFormElement(bodyForm, "PhoneNumber", "tel", "Phone Number:", "Enter phone number");
        this._createFormElement(bodyForm, "Address", "text", "Address:", "Enter address");
        this._createFormElement(bodyForm, "Established", "date", "Established Date:", "MMM, d, y");
        this._createFormElement(bodyForm, "FloorArea", "number", "Floor Area:", "Enter floor area (in sq.m.)");


        storeSubmit.id = "submitFormStore";
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
        return this;
    };

    /**
	 * Create the form to create product
     * 
	 * @returns {HTMLElement} the div element.
     * 
     * @public
	 */
     this.createProductForm = function (){
        return this._formProduct("Create new product", "submit")
    }

    /**
	 * Create the form to edite product
     * 
	 * @returns {HTMLElement} the div element.
     * 
     * @public
	 */
     this.editProductForm = function (){
        return this._formProduct("Edit product", "save")
    };

    /**
	 * Resete and invise the form
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
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
        _bodyForm = "";
        return this;
    };

    /**
	 * Change sorting images
     * 
     * @param {string} src the Url for image
     * 
	 * @return {Object[]}} array for sorting images with right Url
     * 
     * @public
	 */
    this.changeSortingImages = function (src){
        var sortingImages = this._getSortingImages(); 
        return sortingImages.forEach((item) => {
            item.src = src;
        });
    };

    /**
	 * Change sorting elements after click
     * 
     * @param {HTMLElement} item for changes
     * 
	 * @return {string}} sorting direction
     * 
     * @public
	 */
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

    /**
	 * Clear sorting and filter elements
     * 
     * @param {string} _filterValue value filter
     * @param {string} _sortingField sorting field
     * @param {string} _sortingDirection sorting direction
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.cleanSortAndFilters = function (_filterValue,_sortingField,_sortingDirection){
        _filterValue = "";
        _sortingField = "";
        _sortingDirection = "";
        this.changeSortingImages("../images/sort-not-selected.svg");
        return this;
    };

    /**
	 * Add class to element
     * 
     * @param {HTMLElement} elem to be changed
     * @param {string} className to be added
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.addClassList = function (elem, className) {
        elem.classList.add(className);
        return this;
    };

    /**
	 * Remove class to element
     * 
     * @param {HTMLElement} elem to be changed
     * @param {string} className to be removed
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.removeClassList = function (elem, className){
        elem.classList.remove(className);
        return this;
    };

    /**
	 * Check class to element
     * 
     * @param {HTMLElement} elem to be checked
     * @param {string} className to be used for check
     * 
	 * @return {Boolean} for availability class
     * 
     * @public
	 */
    this.checkClassList = function (elem, className) {
        return elem.classList.contains(className);
    };

    /**
	 * Added inner HTML to element
     * 
     * @param {HTMLElement} elem to be changed
     * @param {string} text to be added to elem
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.innerHTMLToElement = function (elem, text){
        elem.innerHTML = text;
        return this;
    };

    /**
	 * Added error message to elements
     * 
     * @param {HTMLElement[]} array elements, which to be changet
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.addError = function (array){
        array.forEach(function(item){
            item.classList.add("error");
            item.nextElementSibling.classList.remove("noneVisible");
        })
        return this;
    };

    /**
	 * Clear validations input
     * 
     * @param {HTMLElement[]} array inputs for validation form
     * 
	 * @return {View} self object.
     * 
     * @public
	 */
    this.cleanValidation = function (array){
        for(let i=0; i < array.length; i++){
            this.removeClassList(array[i], "error");
            if(this.checkClassList(array[i], "error-message")){
                this.addClassList(array[i], "noneVisible")
            }
        }
        return this;
    };

    /**
	 * Returns the sorting images
     * 
	 * @returns {HTMLElement[]} the array for images.
	 */
     this._getSortingImages = function () {
		return document.querySelectorAll("." + SORTING_IMAGES_CLASS);
	};

    /**
	 * Create the image
     * 
     * @param {string} classImg which added to image
     * @param {string} url which added to image
     * @param {string} altText which added to image
     * 
	 * @returns {HTMLElement} the img element.
     * 
     * @private
	 */
    this._createImg = (classImg, url, altText) => {
        return `<img src=${url} alt=${altText} class=${classImg}>`;
    };

    /**
	 * Create the HTML element
     * 
     * @param {string} selector which created 
     * @param {string} className which added to element
     * @param {string} innerHtml which added to element
     * 
	 * @returns {HTMLElement} the HTML element.
     * 
     * @private
	 */
    this._createElement = (selector, className, innerHtml) => {
        let elem = document.createElement(selector);
        elem.classList.add(className);
        if (innerHtml) elem.innerHTML = innerHtml;
        return elem;
    };

    /**
	 * Create the Button element for Footer
     * 
     * @param {string} classButton which added to button
     * @param {string} idButton which added to button
     * @param {string} buttonName which added to button
     * @param {string} url which added to button image
     * @param {string} altText which added to button image
     * 
	 * @returns {HTMLElement} the button element.
     * 
     * @private
	 */
    this._createButtonFooter = function (classButton, idButton, buttonName, url, altText){
        var button = this._createElement("button", "footer__button");
        button.classList.add(classButton);
        button.id = idButton;
        var image = this._createImg("button__image", url, altText);
        button.innerHTML += image;
        button.innerHTML += buttonName;
        return button;
    };

    /**
	 * Create the Form element
     * 
     * @param {HTMLElement[]} bodyForm where the element added
     * @param {string} inputId which added to element
     * @param {string} inputType which added to element
     * @param {string} labelText which added to label
     * @param {string} inputValue which added to element placeholder
     * 
	 * @returns {HTMLElement} the form element.
     * 
     * @private
	 */
    this._createFormElement = function (bodyForm, inputId, inputType, labelText, inputValue){
        var elemName = this._createElement("input", "form__store-value");
        if(inputId === "Rating"){
            elemName.max = 5;
            elemName.min = 0;
        }
        elemName.id = inputId;
        elemName.type = inputType;
        elemName.required = "required";
        elemName.placeholder = inputValue;
        var labelName = this._createElement("label", "form__label");
        labelName.for = elemName;
        this.innerHTMLToElement(labelName, labelText);
        bodyForm.append(labelName, elemName);
        var errorMessage = this._createElement("div", "error-message", "The field is required");
        this.addClassList(errorMessage, "noneVisible")
        return bodyForm.append(errorMessage);
    };

    /**
	 * Create the Form product
     * 
     * @param {string} nameFormValue which added to name Form
     * @param {string} buttonValue which added to button value
     * 
	 * @returns {HTMLElement[]} the form element.
     * 
     * @private
	 */
    this._formProduct = function (nameFormValue, buttonValue){
        var createProductForm   = this._createElement("form", "create-product"),
            nameForm            = this._createElement("div", "form__store-header"),
            bodyForm            = this._createElement("div", "form__store-body"),
            footerForm          = this._createElement("div", "form__store-footer"),
            darkBack            = this._createElement("div", "dark"),
            main                = this.getMain();

        _bodyForm           = bodyForm;
        _createProductForm  = createProductForm;
        _darkBack           = darkBack;

        this.innerHTMLToElement(nameForm, nameFormValue);

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
        
        ChoiceStatus.id = "Status";
        ChoiceStatus.placeholder = "Enter your status";

        ChoiceStatus.   append(choiceStatusOk, choiceStatusOut, choiceStatusStorage)
        bodyForm.       append(ChoiceStatusLabel, ChoiceStatus)

        var storeSubmit   = this._createElement("input", `form__store-${buttonValue}`),
            storeCanel    = this._createElement("input", "form__store-cancel");

        storeSubmit.id = `${buttonValue}FormProduct`;
        storeCanel. id = "resetForm";

        storeSubmit .type = "button";
        storeCanel  .type = "button";

        storeSubmit .value = buttonValue;
        storeCanel  .value = "cancel";

        footerForm          .append(storeSubmit, storeCanel);
        createProductForm   .append(nameForm);
        createProductForm   .append(bodyForm);
        createProductForm   .append(footerForm)

        main.append(darkBack)
        main.append(createProductForm);
        this.removeClassList(createProductForm, "none");
        return bodyForm;
    };
};

/**
 * Controller class. Orchestrates the model and view objects. A "glue" between them.
 *
 * @param {View} view view instance.
 * @param {Model} model model instance.
 *
 * @constructor
 */
function Controller(view, model) {

    /**
	 * The value for filter products
     * 
	 * @type {string}
     * 
	 * @private
	 */
    var _filterValue;

    /**
	 * The value for sorting field products
     * 
	 * @type {string}
     * 
	 * @private
	 */
    var _sortingField;

    /**
	 * The value for sorting direction products
     * 
	 * @type {string}
     * 
	 * @private
	 */
    var _sortingDirection;

    /**
	 * The value for checked store Id for renders products
     * 
	 * @type {string}
     * 
	 * @private
	 */
    var _storeCheckedId;

    /**
	 * The value for checked product Id for edit
     * 
	 * @type {string}
     * 
	 * @private
	 */
    var _activeProductId;

    /**
    * The available stores array for check store and to use for search.
    * 
    * @type {Object[]}
    * 
    * @public
    */
    var storesAvailable;

    /**
	 * Initialize controller.
	 *
	 * @public
	 */
    this.init = function() {
        var storesList          = view.getStoresList(),
            headerTable         = view.getHeaderTable(),
            productsTableBody   = view.getProductsTableBody(),
            main                = view.getMain(),
            searchForm          = view.getSearchForm();

        this._onLoadStores();

        storesList.         addEventListener("click", this._onLoadStoreInfoClick);
        storeDetailsHeader. addEventListener("click", this._onFiltersClick);
        headerTable.        addEventListener("click", this._onSortingClick);
        productsTableBody.  addEventListener("click", this._onProductClick);
        main.               addEventListener("click", this._onMainClick);
        searchForm.         addEventListener("click", this._onSearchStoreClick)
        searchForm.         addEventListener("keyup", this._onSearchStore);

	};

    /**
	 * Windows Load
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
    this._onLoadStores = function(){
        model
            .fetchStores()
            .then(function(storesData){
                view
                    .fillStoresList(storesData)
                storesAvailable = model.fillStoresArray(storesData)
            });
    };

	/**
	 * Load Store click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
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

    /**
	 * Load Filter products click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
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

    /**
	 * Load sorting products click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
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

    /**
	 * Load Product click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
    this._onProductClick = function (event){
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
        if(view.checkClassList(event.target, "product-edit")){
            var bodyForm = view.editProductForm();
            model.fetchProduct(event.target.dataset.id)
                .then(function(productDate){
                    model._fillParametersProduct(productDate, bodyForm)
                    _activeProductId = event.target.dataset.id;
            //     // const ProductDeleteDone = createElement("div", "store-delete", "The product was successfully delete");
            //     // main.append(ProductDeleteDone);
            //     // model
            //     // model.fetchProducts(_storeCheckedId)
            //     //     .then(function(productsData){
            //     //     view.renderProducts(productsData);
            //     //     })
                })
        }
    };

    /**
	 * Form click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
    this._onMainClick = function (event){
        if(event.target.id === "storesCreate"){
            view.formStore();
        };
        if(event.target.id === "productCreate"){
            view.createProductForm();
        };
        if(event.target.id === "submitFormStore"){
            var bodyForm = view.getBodyForm();
            view.cleanValidation(bodyForm.children);

            var notValidationInputArr = model.validationForm(bodyForm, "Store");
            if(notValidationInputArr.length !== 0){
                view.addError(notValidationInputArr);
            } else {
                model               
                .createStoreRequest(bodyForm)
                .then(function(){
                    model.fetchStores()
                    .then(function(storesData){
                        view
                            .fillStoresList(storesData)
                            // .addClassList(darkBack, "none");
                        model.fillStoresArray(storesData)
                    });
                })  ; 
            };          
        };
        if(event.target.id === "submitFormProduct"){
            var bodyForm = view.getBodyForm();
            view.cleanValidation(bodyForm.children);

            var notValidationInputArr = model.validationForm(bodyForm, "Product");
            if(notValidationInputArr.length !== 0){
                view.addError(notValidationInputArr);
            } else {
                model
                .createProductRequest(bodyForm)
                .then(function(){
                    model.fetchProducts(_storeCheckedId)
                    .then(function(productsData){
                        view.renderProducts(productsData);
                    });
                });
            };  
                   
        };
        if(event.target.id === "saveFormProduct"){
            var bodyForm = view.getBodyForm();
            view.cleanValidation(bodyForm.children);

            var notValidationInputArr = model.validationForm(bodyForm, "Product");
            if(notValidationInputArr.length !== 0){
                view.addError(notValidationInputArr);
            } else {
            model
                .editeProductRequest(_activeProductId, bodyForm)
                .then(function(){
                    model.fetchProducts(_storeCheckedId)
                    .then(function(productsData){
                        view.renderProducts(productsData);
                    });
                });
            };
        };
        if(event.target.id === "resetForm"){
            view.reserForm();
        };
        if(event.target.id === "storesDelete"){
            if(confirm("Are you really want to delete the product store?")){
                model
                    .deleteStore()
                    // .then(function(){
                        // const ProductDeleteDone = createElement("div", "store-delete", "The product was successfully delete");
                        // main.append(ProductDeleteDone);
                        // model
                        .fetchStores()
                        .then(function(storesData){
                            view
                                .fillStoresList(storesData)
                            model.fillStoresArray(storesData)
                        });
                    // })
            }
        };
    };

    /**
	 * Load Product click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
    this._onSearchStoreClick = function (event){
        if (event.target.id === "search-icon"){
            var subStringSearch = model.getValueToLowerCase(event.currentTarget.children[0])   
            for (let i = 0; i < storesAvailable.length; i++) {
                var check = model.searchString(subStringSearch, storesAvailable[i]);
                (check === 3) ? view.addClassList(storesList.children[i], "none")
                            : view.removeClassList(storesList.children[i], "none")
            };
        } else if (event.target.id === "delete-icon"){
            view.clearSearchField(event);
    
            for (let i = 0; i < storesAvailable.length; i++) {
                view.removeClassList(storesList.children[i], "none")
            }
        }
        
    };

    /**
	 * Search store keyup event handler.
	 *
	 * @listens keyup
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
    this._onSearchStore = function (event){
        var clearSearchFieldButton = view.getCleanSearchButton();
        if (event.code === "Enter"){
            var subStringSearch = model.getValueToLowerCase(event.target)   
            for (let i = 0; i < storesAvailable.length; i++) {
                var check = model.searchString(subStringSearch, storesAvailable[i]);
                (check === 3) ? view.addClassList(storesList.children[i], "none")
                            : view.removeClassList(storesList.children[i], "none")
            };
        };
        if (event.target.value !== "" && view.checkClassList(clearSearchFieldButton, "none")){
            view.removeClassList(clearSearchFieldButton, "none");
        };
    };
};

(new Controller(new View(), new Model())).init();




