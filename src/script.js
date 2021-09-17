/**
 * Model class. Knows everything about API endpoint and data structure. Can format/map data to any structure.
 *
 * @constructor
 */
function Model() {
	var _apiPrefix = "http://services.odata.org/V2/Northwind/Northwind.svc";

	/**
	 * URL template for getting the orders from OData service.
	 * @type {string}
	 *
	 * @example _ordersURLTemplate.replace("{ORDER}", orderId);
	 *
	 * @private
	 */
	var _ordersURLTemplate = _apiPrefix + "/Orders({ORDER})?$format=JSON";

	/**
	 * URL template for getting the employee data from OData service.
	 * @type {string}
	 *
	 * @example _ordersURLTemplate.replace("{EMPLOYEE_ID}", employeeId);
	 *
	 * @private
	 */
	var _employeeURLTemplate = _apiPrefix + "/Employees({EMPLOYEE_ID})?$format=JSON";

	/**
	 * URL template for getting the territories of a certain employee from OData service.
	 * @type {string}
	 *
	 * @example _ordersURLTemplate.replace("{EMPLOYEE_ID}", employeeId);
	 *
	 * @private
	 */
	var _employeeTerritoriesURLTemplate	= _apiPrefix + "/Employees({EMPLOYEE_ID})/Territories?$format=JSON";

	/**
	 * The link to the currently selected order object.
	 * @type {Object}
	 * @private
	 */
	var _currentOrder = null;

	/**
	 * Fetch the order object by id.
	 *
	 * @param {String} orderId the order id.
	 *
	 * @returns {Promise} the promise object will be resolved once the Order object gets loaded.
	 *
	 * @public
	 */
	this.fetchOrderById = function(orderId) {
		return this
			.fetchData(_ordersURLTemplate.replace("{ORDER}", orderId))
			.then(function (orderData) {
				_currentOrder = orderData;
				return orderData;
			});
	};

	/**
	 * Fetch the employee of the currently active order.
	 *
	 * @returns {Promise} the promise object will be resolved once the Employee object gets loaded.
	 *
	 * @public
	 */
	this.fetchEmployee = function() {
		var that = this;

		return this
			.fetchData(_employeeURLTemplate.replace("{EMPLOYEE_ID}", _currentOrder.EmployeeID))
			.then(function (employeeData) {
				employeeData.Photo = that.convertPhoto(employeeData.Photo);
				_currentOrder.employee = employeeData;
				return employeeData;
			});
	};

	/**
	 * Fetch the employee territories of the currently active order.
	 *
	 * @returns {Promise} the promise object will be resolved once the territories object gets loaded.
	 *
	 * @public
	 */
	this.fetchTerritories = function() {
		return this.
			fetchData(_employeeTerritoriesURLTemplate.replace("{EMPLOYEE_ID}", _currentOrder.EmployeeID))
			.then(function (territoriesData) {
				_currentOrder.employee.territories = territoriesData.results;
				return territoriesData.results;
			});
	};

	/**
	 * Coverts photo from the "corrupted" state (heritage of northwind) to the correct one (by cutting the first
	 * 104 characters).
	 *
	 * @link https://blogs.sap.com/2017/02/08/displaying-images-in-sapui5-received-from-the-northwind-odata-service/
	 *
	 * @param {string} photo base64 encoded string.
	 *
	 * @returns {string} correct photo string in base64 format.
	 *
	 * @public
	 */
	this.convertPhoto = function (photo) {
		return 'data:image/jpeg;base64,' + photo.substr(104);
	};

	/**
	 * Common method which "promisifies" the XHR calls.
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
					resolve(JSON.parse(req.responseText).d);
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
	}
}

/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function View() {
	/**
	 * ID of the "search" button DOM element'
	 * @constant
	 * @type {string}
	 */
	var ORDER_SEARCH_BUTTON_ID = "OrderSearchButton";

	/**
	 * ID of the "load employee" button DOM element.
	 * @constant
	 * @type {string}
	 */
	var LOAD_EMPLOYEE_BUTTON_ID	= "LoadEmployeeButton";

	/**
	 * ID of the "load employee territories" button DOM element.
	 * @constant
	 * @type {string}
	 */
	var LOAD_EMPLOYEE_TERRITORIES_BUTTON_ID	= "LoadEmployeeTerritoriesButton";

	/**
	 * Helper for setting the value to the input element.
	 *
	 * @param {HTMLFormElement} form the form element.
	 * @param {string} dataProperty the name of the data-property attribute.
	 * @param {string|number} value the actual value to be set.
	 *
	 * @return {View} self object.
	 *
	 * @public
	 */
	this.setValueToInput = function(form, dataProperty, value) {
		var input = form.querySelector("[data-property=" + dataProperty + "]");
		input.value = value;

		return this;
	};

	/**
	 * Fill the data into order form.
	 *
	 * @param {Object} orderData the order data object.
	 *
	 * @returns {View} self object.
	 */
	this.fillOrderForm = function (orderData) {
		var form = document.querySelector("#OrderForm");

		this
			.setValueToInput(form, "ship-address", orderData.ShipAddress)
			.setValueToInput(form, "ship-city", orderData.ShipCity)
			.setValueToInput(form, "ship-country", orderData.ShipCountry);

		return this;
	};

	/**
	 * Fill the data into employee form.
	 *
	 * @param {Object} employeeData the employee data object.
	 *
	 * @returns {View} selft object.
	 *
	 * @public
	 */
	this.fillEmployeeForm = function (employeeData) {
		var form = document.querySelector("#EmployeeForm");

		this
			.setValueToInput(form, "employee-title", employeeData.Title)
			.setValueToInput(form, "employee-first-name", employeeData.FirstName)
			.setValueToInput(form, "employee-last-name", employeeData.LastName);

		form.querySelector("img").src = employeeData.Photo;

		return this;
	};

	/**
	 * Fill the data into territories list (dynamically create the list items to represent a territory).
	 *
	 * @param {Object[]} territories the array of territories to be filled.
	 *
	 * @return {View} self object.
	 */
	this.fillTerritoriesList = function (territories) {
		var territoriesList = document.querySelector("#EmployeeTerritories");
		territoriesList.innerHTML = "";

		territories.forEach(function (territory) {
			var li = document.createElement("li");
			li.textContent = territory.TerritoryDescription;

			territoriesList.appendChild(li);
		});

		return this;
	};

	/**
	 * Returns currently entered order id.
	 *
	 * @returns {string} order id.
	 *
	 * @public
	 */
	this.getCurrentOrderId = function () {
		var orderIdInput = document.querySelector("#OrderIdInput");
		return orderIdInput.value;
	};

	/**
	 * Returns the order search button.
	 *
	 * @returns {HTMLButtonElement} the button element.
	 */
	this.getOrderSearchButton = function () {
		return document.querySelector("#" + ORDER_SEARCH_BUTTON_ID);
	};

	/**
	 * Returns the load employee button.
	 *
	 * @returns {HTMLButtonElement} the button element.
	 *
	 * @public
	 */
	this.getLoadEmployeeButton = function () {
		return document.querySelector("#" + LOAD_EMPLOYEE_BUTTON_ID);
	};

	/**
	 * Returns the load territories button.
	 *
	 * @returns {HTMLButtonElement} the button element.
	 *
	 * @public
	 */
	this.getLoadTerritoriesButton = function () {
		return document.querySelector("#" + LOAD_EMPLOYEE_TERRITORIES_BUTTON_ID);
	};
}

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
	 * Initialize controller.
	 *
	 * @public
	 */
	this.init = function() {
		var orderSearchButton		= view.getOrderSearchButton();
		var loadEmployeeInfoButton	= view.getLoadEmployeeButton();
		var loadTerritoriesButton	= view.getLoadTerritoriesButton();

		orderSearchButton.addEventListener("click", this._onSearchOrderClick);
		loadEmployeeInfoButton.addEventListener("click", this._onLoadEmployeeInfoClick);
		loadTerritoriesButton.addEventListener("click", this._onLoadTerritoriesClick);
	};

	/**
	 * Search order button click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
	this._onSearchOrderClick = function(e) {
		var orderId = view.getCurrentOrderId();

		model
			.fetchOrderById(orderId)
			.then(function (orderData) {
				view.fillOrderForm(orderData);
			});
	};

	/**
	 * Load employee info button click event handler.
	 *
	 * @listens click
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
	this._onLoadEmployeeInfoClick = function(e) {
		model
			.fetchEmployee()
			.then(function (employeeDate) {
				view.fillEmployeeForm(employeeDate);
			});
	};

	/**
	 * Load territories button click event handler.
	 *
	 * @param {Event} e the DOM event object.
	 *
	 * @private
	 */
	this._onLoadTerritoriesClick = function (e) {
		model
			.fetchTerritories()
			.then(function (territoriesData) {
				view.fillTerritoriesList(territoriesData);
			});
	}
}

(new Controller(new View(), new Model())).init();