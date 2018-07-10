enyo.kind({
	name: "wxcafe.FirstRunPopup",
	kind: "onyx.Popup",
	autoDismiss: false,
	centered: true,
	floating: true,
	modal: true,
	scrim: true,
	passwordToConfirm: null,
	downloadedFromSQL: false,
	needsContactBalanceCalculation: false,

	style: "width: 510px; height 90%; padding: 25px;",

	published: {
		storeInfoModel: null,
		storeInfoCollection: null,
		sqlStoreInfoCollection: null,
		testingStoreInfo: false
	},

	handlers: {
		onKeyUp: "handleKeyUp",
		onHide: "handleHide",
		onPasswordCorrectWithReturnValue: "handlePasswordCorrectWithReturnValue",
		onManagerPasswordCorrectWithReturnValue: "handleManagerPasswordCorrectWithReturnValue",
		onOperatorPasswordCorrectWithReturnValue: "handleOperatorPasswordCorrectWithReturnValue",
		onSQLDownloadFailed: "handleSQLDownloadFailed",
		onSQLDownloadSuccess: "handleSQLDownloadSuccess",
	},

	events: {
		onFirstRunComplete: "",
		onDownloadFromSQL: ""
	},

	components: [
		{name: "closeButton", kind: "onyx.IconButton", src: "assets/closeicon.png", style: "float: right; margin-right: -40px; margin-top: -40px;", ontap: "cancelButtonTapped"},
		{kind: "enyo.FittableRows", style: "width: 100%;", components: [
			{name: "firstRunPanels", kind: "enyo.Panels", style: "height: 550px;", draggable: false, observers: {handlePanelsIndexChanged: ["index"]}, events: {onPanelsIndexChanged: "handlePanelsIndexChanged"}, components: [
				{name: "introPanel", components: [
					{style: "font-size: 22px; text-align: center;", content: $L("Setup Wizard - Introduction")},
					{style: "margin-top: 20px;", content: $L("This wizard will walk you through the process of setting up your WellnessXperts Cafe System. You will go through the following steps:")},
					{tag: "ol", components:[
						{tag: "li", content: $L("Setting admin, manager and operator passwords")},
						{tag: "li", content: $L("Setting up the connection to your CouchDB Server")},
						{tag: "li", content: $L("Downloading data from SQL")},
						{tag: "li", content: $L("Setting up your store information (Optional)")}
					]}
				]},
				{name: "passwordPanel", components: [
					{style: "font-size: 22px; text-align: center;", content: $L("Setup Wizard - Step 1: Admin, Manager and Operator Passwords")},
					{style: "margin-top: 20px;", content: $L("The Admin password is used to access administrative functions, including:")},
					{tag: "ul", components:[
						{tag: "li", content: $L("Adding meals to a customer's account")},
						{tag: "li", content: $L("Editing items")},
						{tag: "li", content: $L("Editing order information, such as quantities, NC, and referer")}
					]},
					{style: "text-align:center; margin-top: 20px;", components: [
						{style: "width: 300px; height; 70px; font-size: 18px;", kind: "onyx.Button", classes: "onyx-affirmative button-text", content: $L("Set Admin Password"), ontap: "setAdminPasswordButtonTapped"},
					]},
					{style: "text-align:center; margin-top: 20px;", components: [
						{style: "width: 300px; height; 70px; font-size: 18px;", kind: "onyx.Button", classes: "onyx-affirmative button-text", content: $L("Set Manager Password"), ontap: "setManagerPasswordButtonTapped"},
					]},
					{style: "text-align:center; margin-top: 20px;", components: [
						{style: "width: 300px; height; 70px; font-size: 18px;", kind: "onyx.Button", classes: "onyx-affirmative button-text", content: $L("Set Operator Password"), ontap: "setOperatorPasswordButtonTapped"},
					]},
					{style: "margin-top: 20px;", allowHtml: true, content: $L("If you do not set the passwords here, the system will use the default Admin password of 123, the default Manager password of 1111 and the default Operator password of 0000. <b>These are not secure, and should be changed as soon as possible.</b>")},
					{name: "passwordSuccessLabel", style: "margin-top: 30px; text-align: center; color: green;", content: $L("Password Set Successfully")}
				]},
				{name: "couchDBPanel", components: [
					{style: "font-size: 22px; text-align: center;", content: $L("Setup Wizard - Step 2: CouchDB Setup")},
					{style: "margin-top: 20px;", content: $L("This application uses a remote CouchDB server to back up and synchronize data. You can set up and test that connection here.")},
					{name: "remoteDatabasePreference", components: [
						{style: "margin-top: 10px;", content: $L("If you choose not to use a remote server, the application will still store data locally using a PouchDB instance.")},
						{style: "margin-top: 20px;", kind: "enyo.FittableColumns", components:[
							{classes: "preferences-item-text", content: $L("Use Remote Database")},
							{fit: true, style: "text-align: right; padding-right: 20px;", components: [
								{name: "useRemoteDatabaseToggleButton", kind: "onyx.ToggleButton", onContent: $L("Yes"), offContent: $L("No"), onChange: "toggleDatabasePrefs"}
							]}
						]}
					]},
					{name: "databasePreferences", components: [
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components:[
							{classes: "preferences-item-text-input", content: $L("Database Location")},
							{fit: true, style: "text-align: center;", components: [
								{name: "databaseLocationInputDecorator", kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
									{name: "databaseLocationInput", kind: "onyx.Input"}
								]}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components:[
							{classes: "preferences-item-text-input", content: $L("Database Port (Optional)")},
							{fit: true, style: "text-align: center;", components: [
								{kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
									{name: "databasePortInput", kind: "onyx.Input"}
								]}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components:[
							{classes: "preferences-item-text", content: $L("Use Insecure (HTTP) Connection")},
							{fit: true, style: "text-align: right; padding-right: 20px;", components: [
								{name: "useInsecureConnectionToggleButton", kind: "onyx.ToggleButton", onContent: $L("Yes"), offContent: $L("No")}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components:[
							{classes: "preferences-item-text-input", content: $L("Database Username")},
							{fit: true, style: "text-align: center;", components: [
								{kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
									{name: "databaseUsernameInput", kind: "onyx.Input"}
								]}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components:[
							{classes: "preferences-item-text-input", content: $L("Database Password")},
							{fit: true, style: "text-align: center;", components: [
								{kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
									{name: "databasePasswordInput", kind: "onyx.Input", type: "password"}
								]}
							]}
						]},
						{classes: "centered", style:"margin-top: 10px;" , components: [
							{kind: "onyx.Button", style: "text-align: center; width: 250px;", classes: "button", content: $L("Test Connection"), ontap: "testConnection"}
						]},
						{name: "connectionFailedMessage", classes: "centered", style:"margin-top: 10px; color: red;", showing: false, content: $L("Connection Failed!")},
						{name: "connectionSucceededMessage", classes: "centered", style:"margin-top: 10px; color: green;", showing: false, content: $L("Connection Succeeded!")},
					]}
				]},
				{name: "sqlPanel", components: [
					{style: "font-size: 22px; text-align: center;", content: $L("Setup Wizard - Step 3: Import Data From SQL")},
					{style: "margin-top: 20px;", content: $L("This application can import data from an existing SQL server.")},
					{style: "margin-top: 10px;", allowHtml: true, content: $L("This should only be done when adding the first terminal to a system. If you already have a system set up, you <b>probably</b> do not need to do this.")},
					{style: "margin-top: 20px;", kind: "enyo.FittableColumns", components:[
						{classes: "preferences-item-text", content: $L("Import From SQL")},
						{fit: true, style: "text-align: right;", components: [
							{name: "downloadFromSQLToggleButton", kind: "onyx.ToggleButton", onContent: $L("Yes"), offContent: $L("No"), onChange: "toggleSQLPrefs"}
						]}
					]},
					{name: "sqlPreferences", components: [
						{style: "color: red; margin-top: 8px;", content: $L("WARNING: This operation will wipe out all data in the application and replace it with data from SQL!")},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components:[
							{classes: "preferences-item-text-input", content: $L("SQL Connection String")},
							{fit: true, style: "text-align: left;", components: [
								{kind: "onyx.InputDecorator", style: "width: 350px;", alwaysLooksFocused: true, components: [
									{name: "connectionStringInput", style: "width: 100%;", kind: "onyx.Input"}
								]}
							]}
						]},
						{classes: "centered", style:"margin-top: 10px;" , components: [
							{kind: "onyx.Button", style: "text-align: center; width: 250px;", classes: "button", content: $L("Test Connection"), ontap: "testSQLConnection"}
						]},
						{name: "sqlConnectionFailedMessage", classes: "centered", style:"margin-top: 10px; color: red;", showing: false, content: $L("Connection Failed!")},
						{name: "sqlConnectionSucceededMessage", classes: "centered", style:"margin-top: 10px; color: green;", showing: false, content: $L("Connection Succeeded!")},
					]}
				]},
				{name: "storeInfoPanel", components: [
					{style: "font-size: 22px; text-align: center;", content: $L("Setup Wizard - Step 4: Set Store Information")},
					{kind: "enyo.FittableColumns", style: "margin-top: 20px;", components: [
						{classes: "add-customer-basic-title", content: $L("Choose Store")},
						{name: "storeIDPickerDecorator", kind: 'onyx.PickerDecorator', classes: "add-customer-basic-content", components: [
							{name: "storeIDPickerButton", content: "---", classes:"full-width",},
							{name: "storeIDPicker", kind: 'wxcafe.SearchPicker'}
						]}
					]},
					{name: "storeInfoSetupPanel", components: [
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components: [
							{classes: "add-customer-basic-title", style: "font-size: 18px;", content: $L("Store Name")},
							{name: "storeNameInputDecorator", kind: "onyx.InputDecorator", classes: "add-customer-basic-content", alwaysLooksFocused: true, components: [
									{name: "storeNameInput", classes:"full-width", kind: "onyx.Input"}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components: [
							{classes: "add-customer-basic-title", style: "font-size: 18px;", content: $L("IP Address")},
							{name: "ipAddressInputDecorator", kind: "onyx.InputDecorator", classes: "add-customer-basic-content", alwaysLooksFocused: true, components: [
									{name: "ipAddressInput", classes:"full-width", kind: "onyx.Input"}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components: [
							{classes: "add-customer-basic-title", style: "font-size: 18px;", content: $L("Store URL")},
							{name: "storeURLInputDecorator", kind: "onyx.InputDecorator", classes: "add-customer-basic-content", alwaysLooksFocused: true, components: [
									{name: "storeURLInput", classes:"full-width", kind: "onyx.Input"}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components: [
							{classes: "add-customer-basic-title", style: "font-size: 18px;", content: $L("Store Address")},
							{name: "storeAddressInputDecorator", kind: "onyx.InputDecorator", classes: "add-customer-basic-content", alwaysLooksFocused: true, components: [
									{name: "storeAddressInput", classes:"full-width", kind: "onyx.Input"}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components: [
							{classes: "add-customer-basic-title", style: "font-size: 18px;", content: $L("Contact Person")},
							{name: "contactPersonInputDecorator", kind: "onyx.InputDecorator", classes: "add-customer-basic-content", alwaysLooksFocused: true, components: [
									{name: "contactPersonInput", classes:"full-width", kind: "onyx.Input"}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components: [
							{classes: "add-customer-basic-title", style: "font-size: 18px;", content: $L("Store Owned")},
							{name: "ownedPickerDecorator", kind: 'onyx.PickerDecorator', classes: "add-customer-basic-content", components: [
								{name: "ownedPickerButton", style: "min-width: 40px"},
								{name: "ownedPicker", kind: 'onyx.Picker', components: [
									{name: "ownedPickerYes", value: "true", content: $L("Yes")},
									{name: "ownedPickerNo", value: "false", content: $L("No")}
								]}
							]}
						]},
						{kind: "enyo.FittableColumns", style: "margin-top: 10px;", components: [
							{classes: "add-customer-basic-title", style: "font-size: 18px;", content: $L("Rental Cost")},
							{name: "rentalCostInputDecorator", kind: "onyx.InputDecorator", classes: "add-customer-basic-content", alwaysLooksFocused: true, components: [
									{name: "rentalCostInput", classes:"full-width", kind: "onyx.Input"}
							]}
						]}
					]}
				]},
				{name: "finishPanel", components: [
					{style: "font-size: 22px; text-align: center;", content: $L("Setup Complete!")},
					{style: "margin-top: 30px;", content: $L("Your WellnessXperts Cafe System is now setup! Press Finish to begin using it.")},
					{name: "sqlImportInfo", showing: false, style: "margin-top: 20px; padding: 15px; color: green; text-align: center; border: 1px solid white;", components: [
						{style: "font-weight: bold; color: white;", content: $L("SQL Import Info:")},
						{name: "contactBankBaseItemsImportInfo", style: "margin-top: 10px;"},
						{name: "cafePOSItemsImportInfo", style: "margin-top: 10px;"},
						{name: "contactBankImportInfo", style: "margin-top: 10px;"},
						{name: "contactsImportInfo", style: "margin-top: 10px;"},
						{name: "customerGroupsImportInfo", style: "margin-top: 10px;"},
						{name: "marketingPlansImportInfo", style: "margin-top: 10px;"},
						{name: "menusImportInfo", style: "margin-top: 10px;"},
					]}
				]}
			],
			handlePanelsIndexChanged: function(inSender, inEvent) {
				this.doPanelsIndexChanged();
			}
			},
			{style: "text-align: center; margin-top: 20px;", components: [
				{name: "previousButton", kind: "onyx.Button", classes:"button", content: $L("Previous"), style: "float: left; width: 200px; height: 50px; font-weight: bold;", ontap: "previousButtonTapped"},
				{name: "nextButton", kind: "onyx.Button", classes:"button", content: $L("Next"), style: "float: right; width: 200px; height: 50px; font-weight: bold;", ontap: "nextButtonTapped"}
			]}
		]}
	],

	bindings: [
		//General
		{from: ".$.firstRunPanels.index", to: ".$.previousButton.disabled", transform: function(v){
			return this.$.firstRunPanels.get("index") === 0;
		}},
		{from: ".$.firstRunPanels.index", to: ".$.nextButton.content", transform: function(v){
			return this.$.firstRunPanels.get("index") < this.$.firstRunPanels.components.length - 1 ? $L("Next") : $L("Finish");
		}},
		{from: ".$.firstRunPanels.index", to: ".$.nextButton.classes", transform: function(v){
			return this.$.firstRunPanels.get("index") < this.$.firstRunPanels.components.length - 1 ? "onyx-button button" : "onyx-button onyx-affirmative button-text";
		}},
		//Page 2 - Database
		{from: "^wxcafe.preferences.testModeActive", to: ".$.remoteDatabasePreference.showing"},
		{from: "^wxcafe.preferences.pouchDBUseRemoteServer", to: ".$.useRemoteDatabaseToggleButton.value"},
		{from: "^wxcafe.preferences.pouchDBUseInsecureConnection", to: ".$.useInsecureConnectionToggleButton.value"},
		{from: "^wxcafe.preferences.pouchDBUsername", to: ".$.databaseUsernameInput.value"},
		{from: "^wxcafe.preferences.pouchDBPassword", to: ".$.databasePasswordInput.value"},
		{from: "^wxcafe.preferences.pouchDBRemote", to: ".$.databaseLocationInput.value"},
		{from: "^wxcafe.preferences.pouchDBRemotePort", to: ".$.databasePortInput.value"},
		//{from: ".$.useRemoteDatabaseToggleButton.value", to: ".$.databasePreferences.showing"},
		//Page 3 - SQL
		{from: ".$.downloadFromSQLToggleButton.value", to: ".$.sqlPreferences.showing"},
		{from: "^wxcafe.preferences.sqlDatabaseHost", to: ".$.connectionStringInput.value"},
		//Page 4 - Store Info
		{from: ".storeInfoModel", to: ".$.storeIDInput.value", transform: function(v){
			if (!v) return "";
			return v.get("storeID") !== null && v.get("storeID") !== undefined ? v.get("storeID") : "";
		}},
		{from: ".storeInfoModel", to: ".$.storeNameInput.value", transform: function(v){
			if (!v) return "";
			return v.get("name") !== null && v.get("name") !== undefined ? v.get("name") : "";
		}},
		{from: ".storeInfoModel", to: ".$.ipAddressInput.value", transform: function(v){
			if (!v) return "";
			return v.get("ip") !== null && v.get("ip") !== undefined ? v.get("ip") : "";
		}},
		{from: ".storeInfoModel", to: ".$.storeURLInput.value", transform: function(v){
			if (!v) return "";
			return v.get("url") !== null && v.get("url") !== undefined ? v.get("url") : "";
		}},
		{from: ".storeInfoModel", to: ".$.storeAddressInput.value", transform: function(v){
			if (!v) return "";
			return v.get("storeAddress") !== null && v.get("storeAddress") !== undefined ? v.get("storeAddress") : "";
		}},
		{from: ".storeInfoModel", to: ".$.contactPersonInput.value", transform: function(v){
			if (!v) return "";
			return v.get("contactPerson") !== null && v.get("contactPerson") !== undefined ? v.get("contactPerson") : "";
		}},
		{from: ".storeInfoModel", to: ".$.ownedPicker.selected", transform: function(v){
			if (!v) return this.$.ownedPickerYes;
			var returnValue = this.$.ownedPickerYes;

			switch(v.get("isOwned").toString().toLowerCase())
			{
				case "true":
					returnValue = this.$.ownedPickerYes;
					break;
				case "false":
					returnValue = this.$.ownedPickerNo;
					break;
				default:
					break;
			}

			return returnValue;
		}},
		{from: ".storeInfoModel", to: ".$.rentalCostInput.value", transform: function(v){
			if (!v) return "";
			return v.get("rental") !== null && v.get("rental") !== undefined ? v.get("rental") : "";
		}},
		{from: ".$.storeIDPicker.selected", to: ".$.storeInfoSetupPanel.showing", transform: function(v){
			if (!v) return false;
			return v.content == $L("New Store");
		}},
		{from: ".$.storeIDPicker.selected", to: ".storeInfoModel", transform: function(v){
			if (!v) return null;
			return v.model;
		}},
		{from: "~window", to: ".$.closeButton.showing", transform: function(v){
			return window.chrome && chrome.app && chrome.app.runtime;
		}}
	],

	show: function()
	{
		this.inherited(arguments);
		wxcafe.fixShim();
	},

	handleHide: function(inSender, inEvent)
	{
		//Stop the hide event from propigating only for other things that generate it. Ie. Menus.
		if (inEvent.originator !== this) return true;
	},

	/*
	*	Support Functions
	*/

	clearStoreInfoErrorState: function()
	{
		this.$.storeIDPickerDecorator.applyStyle("border", null);
		this.$.storeNameInputDecorator.applyStyle("border", null);
		this.$.ipAddressInputDecorator.applyStyle("border", null);
		this.$.storeURLInputDecorator.applyStyle("border", null);
		this.$.storeAddressInputDecorator.applyStyle("border", null);
		this.$.contactPersonInputDecorator.applyStyle("border", null);
		this.$.ownedPickerButton.applyStyle("border", null);
		this.$.rentalCostInputDecorator.applyStyle("border", null);
	},

	// clearStoreInfoInputs: function()
	// {
	// 	this.$.storeIDInput.set("value", "");
	// 	this.$.storeNameInput.set("value", "");
	// 	this.$.ipAddressInput.set("value", "");
	// 	this.$.storeURLInput.set("value", "");
	// 	this.$.storeAddressInput.set("value", "");
	// 	this.$.contactPersonInput.set("value", "");
	// 	this.$.ownedPicker.set("selected", this.$.ownedPickerYes);
	// 	this.$.rentalCostInput.set("value", "");
	// },

	downloadSQLData: function()
	{
		return true;
	},

	validateStoreInfoInputs: function()
	{
		var validated = true;

		//Store ID must be a number and cannot be null.
		if (!this.get("storeInfoModel")){
			validated = false;
			this.$.storeIDPickerDecorator.applyStyle("border", "2px solid red");
		}

		//No restrictions on store name at this time
		//this.$.storeNameInputDecorator.applyStyle("border", "2px solid red");

		//No restrictions on ip address at this time
		//this.$.ipAddressInputDecorator.applyStyle("border", "2px solid red");

		//No restrictions on store URL at this time
		//this.$.storeURLInputDecorator.applyStyle("border", "2px solid red");

		//No restrictions on store address at this time
		//this.$.storeAddressInputDecorator.applyStyle("border", "2px solid red");

		//No restrictions on contact person at this time
		//this.$.contactPersonInputDecorator.applyStyle("border", "2px solid red");

		//Owned picker must have *something* selected
		if(this.$.ownedPicker.get("selected") === null)
		{
			validated = false;
			this.$.enablePickerButton.applyStyle("border", "2px solid red");
		}

		//No restrictions on rental cost at this time
		//this.$.rentalCostInputDecorator.applyStyle("border", "2px solid red");

		return validated;
	},

	storeInfoCollectionChanged: function(){
		if (!this.get("storeInfoCollection")) return;
		this.$.storeIDPicker.destroyClientControls();
		this.set("storeInfoModel", null);

		var storeIDs = [];

		var sortByID = function(a, b)
		{
			return a.storeID - b.storeID;
		};

		var populatePickersFunction = function(value, index, array){
			storeIDs.push({storeID: value.get("storeID"), content: value.get("storeID") + " - " + value.get("name"), model: value});
		};

		this.get("storeInfoCollection").forEach(populatePickersFunction);

		storeIDs.sort(sortByID);

		storeIDs.push({storeID: this.get("storeInfoCollection").getNextID(), content: $L("New Store"), model: new wxcafe.StoreInfoModel({storeID: this.get("storeInfoCollection").getNextID()})});

		this.$.storeIDPicker.createComponents(storeIDs);
		this.$.storeIDPicker.render();
	},

	/*
	*	Button Handlers
	*/

	getStoreInfo: function(){
		if (this.$.loadingPopup) this.$.loadingPopup.destroy();
		this.createComponent({name: "loadingPopup", kind: "wxcafe.LoadingPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", onHide: "handlePopupHidden"} , {owner:this});
		this.$.loadingPopup.show($L("Loading"));
		var connectionInfo = wxcafe.preferences.getConnectionInfo();
		var db = new PouchDB(connectionInfo.connectionString + "storeinfodb", {skipSetup: true});
		var that = this;

		var ajaxOpts = {
			ajax: {
				headers: {
					Authorization: 'Basic ' + window.btoa(connectionInfo.username + ':' + connectionInfo.password)
				}
			}
		};
		db.login(connectionInfo.username, connectionInfo.password, ajaxOpts, function (err, response) {
			db.info(function(err, info) {
			  if (err) { 
			  	that.set("storeInfoCollection", wxcafe.storeInfo);
			  	that.$.loadingPopup.hide();
			  	if (that.$.loadingPopup) that.$.loadingPopup.destroy();
			  	return; 
			  }
			  else
			  {
			  	var results = [];
		  		db.allDocs({include_docs: true}, function(err, response){
					if (err) {
						opts.error(err);
					  	that.$.loadingPopup.hide();
			  			if (that.$.loadingPopup) that.$.loadingPopup.destroy();
						return;
					}

					var rows = response.rows;

					for (var i = 0; i < rows.length; i++) {
						results.push(rows[i].doc);
					}
				
					wxcafe.storeInfo.add(results);
					that.set("storeInfoCollection", wxcafe.storeInfo);
				  	that.$.loadingPopup.hide();
		  			if (that.$.loadingPopup) that.$.loadingPopup.destroy();
				});
			  }
			});
		});
	},

	nextButtonTapped: function(){
		//Page 0: Introduction - No action necessary.
		//Page 1: Set password - No action necessary. Password is managed by wxcafe.preferences, which already exists.
		//Page 2: Database - Nuke the collections/databases if they already exist (without nuking the remote ones) - Create new collections/databases - Sync to remote ones if applicable.
		//Page 3: SQL - Invoke the collections' download methods (nuke databases, download, etc.)
		//Page 4: Store info - Pick store id - add new one if necessary. Otherwise, go to SQL.
		//Page 5: Finish - Commit preferences.

		//Most of these, especially SQL will have some timing issues, mostly dealing with callbacks triggering other methods. But, its nothing that we haven't already solved.

		if (this.$.firstRunPanels.get("index") === 2)
		{
			if (wxcafe.preferences.get("testModeActive") && !this.$.useRemoteDatabaseToggleButton.value)
			{
				wxcafe.preferences.set("pouchDBUseRemoteServer", false);
				wxcafe.preferences.set("pouchDBUseInsecureConnection", false);
				wxcafe.preferences.set("pouchDBUsername", "");
				wxcafe.preferences.setPassword("pouchDBPassword", "");
				wxcafe.preferences.set("pouchDBRemote", "");
				wxcafe.preferences.set("pouchDBRemotePort", "");
				this.rebuildDatabase(false);
				return true;
			}
			else
			{
				this.testConnection({}, {}, true);
				return true;
			}
		}

		if (this.$.firstRunPanels.get("index") === 3)
		{
			if (!this.$.downloadFromSQLToggleButton.value)
			{
				if (this.downloadedFromSQL)
				{
					this.rebuildDatabase(wxcafe.preferences.get("testModeActive") ? this.$.useRemoteDatabaseToggleButton.value : true, true);
					this.downloadedFromSQL = false;
				}
				this.$.firstRunPanels.setIndexDirect(this.$.firstRunPanels.get("index") + 1);
				return true;
			}
			else
			{
				if (this.downloadedFromSQL)
				{
					//Nuke local data if we have already downloaded from SQL
					wxcafe.log(1, "Already downloaded from SQL, nuking local data!");
					this.downloadedFromSQL = false;
					wxcafe.customerGroups.empty();
					wxcafe.marketingPlans.empty();
					wxcafe.menus.empty();
					wxcafe.contactBankBaseItems.empty();
					wxcafe.cafePOSItems.empty();
					wxcafe.contacts.empty();
					wxcafe.contactBank.empty();
					wxcafe.preferences.set("storeID", "0");
					wxcafe.storeInfo.empty();
					this.testSQLConnection({}, {}, true);

					return true;
				}
				else
				{
					this.testSQLConnection({}, {}, true);
					return true;
				}
			}
		}

		if (this.$.firstRunPanels.get("index") === 4)
		{
			this.clearStoreInfoErrorState();
			var validated = this.validateStoreInfoInputs();

			if (validated)
			{
				this.get("storeInfoModel").set("name", this.$.storeNameInput.get("value"));
				this.get("storeInfoModel").set("ip", this.$.ipAddressInput.get("value"));
				this.get("storeInfoModel").set("url", this.$.storeURLInput.get("value"));
				this.get("storeInfoModel").set("storeAddress", this.$.storeAddressInput.get("value"));
				this.get("storeInfoModel").set("contactPerson", this.$.contactPersonInput.get("value"));
				this.get("storeInfoModel").set("isOwned", this.$.ownedPicker.get("selected") === this.$.ownedPickerYes);
				this.get("storeInfoModel").set("rental", this.$.rentalCostInput.get("value"));
				wxcafe.preferences.set("storeID", this.get("storeInfoModel").get("storeID"));
			}
			else
			{
				return true;
			}		
		}

		if (this.$.firstRunPanels.get("index") < this.$.firstRunPanels.components.length - 1)
		{
			this.$.firstRunPanels.setIndexDirect(this.$.firstRunPanels.get("index") + 1);
		}
		else
		{
			if (this.$.loadingPopup) this.$.loadingPopup.destroy();
			this.createComponent({name: "loadingPopup", kind: "wxcafe.LoadingPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", onHide: "handlePopupHidden"} , {owner:this});
			this.$.loadingPopup.show($L("Configuring"));
			var currentModel = this.get("storeInfoModel");
			var findStoreInfoModel = function(value, index, array)
			{
				return value === currentModel;
			};

			var syncCompleteFunction = function(target) {
				var that = target;

				wxcafe.preferences.set("firstRunComplete", true);
				wxcafe.preferences.commit({success: enyo.bind(this, function(){
					if (that.$.loadingPopup) that.$.loadingPopup.hide();
					if (that.$.loadingPopup) that.$.loadingPopup.destroy();
					that.doFirstRunComplete();
					that.hide();
				})});
			};

			if(!wxcafe.storeInfo.find(findStoreInfoModel))
			{
				this.get("storeInfoModel").set("isDirty", true);
				wxcafe.storeInfo.add(this.get("storeInfoModel"));
				if (!this.$.downloadFromSQLToggleButton.value){
					wxcafe.contacts.addDefaultData();
					wxcafe.customerGroups.addDefaultData();
					wxcafe.marketingPlans.addDefaultData();
					wxcafe.menus.addDefaultData();
					wxcafe.contactBankBaseItems.addDefaultData();
					wxcafe.cafePOSItems.addDefaultData();
        		}
			}

			this.get("storeInfoModel").set("hasCalculatedContactBalances", !this.needsContactBalanceCalculation);
			
			this.handleFirstSync(syncCompleteFunction);
		}
	},

	handleFirstSync: function(complete) {
		//First commit all collections, then sync them
		wxcafe.contactBank.commit({success: enyo.bind(this, function(){
			wxcafe.contacts.commit({success: enyo.bind(this, function(){
				wxcafe.customerGroups.commit({success: enyo.bind(this, function(){
					wxcafe.marketingPlans.commit({success: enyo.bind(this, function(){
						wxcafe.menus.commit({success: enyo.bind(this, function(){
							wxcafe.contactBankBaseItems.commit({success: enyo.bind(this, function(){
								wxcafe.cafePOSItems.commit({success: enyo.bind(this, function(){
									wxcafe.storeInfo.commit({success: enyo.bind(this, function(){
										wxcafe.contactBank.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){
											wxcafe.contacts.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){
												wxcafe.customerGroups.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){
													wxcafe.marketingPlans.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){
														wxcafe.menus.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){
															wxcafe.contactBankBaseItems.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){
																wxcafe.cafePOSItems.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){
																	wxcafe.storeInfo.sync(wxcafe.preferences.getConnectionInfo(), false, enyo.bind(this, function(){complete(this);}));
																}));
															}));
														}));
													}));
												}));
											}));
										}));
									})});
								})});
							})});
						})});
					})});
				})});
			})});
		})});
	},

	previousButtonTapped: function(){
		this.$.sqlImportInfo.hide();
		if (this.downloadedFromSQL && this.get("storeInfoModel") && this.$.firstRunPanels.get("index") === 5)
		{
			this.$.firstRunPanels.setIndexDirect(this.$.firstRunPanels.get("index") - 2);
		}
		else
		{
			this.$.firstRunPanels.setIndexDirect(this.$.firstRunPanels.get("index") - 1);
		}
	},

	rebuildDatabase: function(sync, preserveStoreInfo){
		if (this.$.loadingPopup) this.$.loadingPopup.destroy();
		this.createComponent({name: "loadingPopup", kind: "wxcafe.LoadingPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", onHide: "handlePopupHidden"} , {owner:this});
		this.$.loadingPopup.show($L("Loading"));

		var that = this;

		//Check collections - create new ones to make sure that any remaining data in the database is removed.
		if (!wxcafe.contacts)
		{
			wxcafe.contacts = new wxcafe.ContactCollection();
		}

		if (!wxcafe.contactBank)
		{
			wxcafe.contactBank = new wxcafe.ContactBankCollection();
		}        

		if (!wxcafe.customerGroups)
		{
			wxcafe.customerGroups = new wxcafe.CustomerGroupCollection();
		}
        
		if (!wxcafe.cafePOSItems)
		{
			wxcafe.cafePOSItems = new wxcafe.ContactBankCafePOSItemCollection();
		}
        
        if (!wxcafe.marketingPlans)
		{
			wxcafe.marketingPlans = new wxcafe.MarketingPlanCollection();
		}
        
        if (!wxcafe.menus)
		{
			wxcafe.menus = new wxcafe.MenuCollection();
		}
        
        if (!wxcafe.contactBankBaseItems)
		{
			wxcafe.contactBankBaseItems = new wxcafe.ContactBankBaseItemCollection();
		}

		if (!wxcafe.storeInfo)
		{
			wxcafe.storeInfo = new wxcafe.StoreInfoCollection();
		}

		var rebuildCollections = function(){
			//Create collections
	        wxcafe.contacts = new wxcafe.ContactCollection();
	        wxcafe.contactBank = new wxcafe.ContactBankCollection();
	        wxcafe.customerGroups = new wxcafe.CustomerGroupCollection();
	        wxcafe.cafePOSItems = new wxcafe.ContactBankCafePOSItemCollection();
	        wxcafe.marketingPlans = new wxcafe.MarketingPlanCollection();
	        wxcafe.menus = new wxcafe.MenuCollection();
	        wxcafe.contactBankBaseItems = new wxcafe.ContactBankBaseItemCollection();

			that.$.loadingPopup.hide();
			that.$.loadingPopup.destroy();
			if (!preserveStoreInfo) that.set("storeInfoCollection", null);
			that.$.firstRunPanels.setIndexDirect(that.$.firstRunPanels.get("index") + 1);
			
			if (!preserveStoreInfo)
			{
				if(sync)
				{
					that.getStoreInfo();
				}
				else
				{
					that.set("storeInfoCollection", wxcafe.storeInfo);
				}
			}
		};

		wxcafe.customerGroups.nukeLocalDatabase({success: enyo.bind(this, function(){
			wxcafe.customerGroups.destroy();
			wxcafe.marketingPlans.nukeLocalDatabase({success: enyo.bind(this, function(){
				wxcafe.marketingPlans.destroy();
				wxcafe.menus.nukeLocalDatabase({success: enyo.bind(this, function(){
					wxcafe.menus.destroy();
					wxcafe.contactBankBaseItems.nukeLocalDatabase({success: enyo.bind(this, function(){
						wxcafe.contactBankBaseItems.destroy();
						wxcafe.cafePOSItems.nukeLocalDatabase({success: enyo.bind(this, function(){
							wxcafe.cafePOSItems.destroy();
							wxcafe.contacts.nukeLocalDatabase({success: enyo.bind(this, function(){
								wxcafe.contacts.destroy();
								wxcafe.contactBank.nukeLocalDatabase({success: enyo.bind(this, function(){
									wxcafe.contactBank.destroy();
									//Handle Store Info DB
							        if (!preserveStoreInfo)
							        {
								        if (wxcafe.storeInfo)
										{
											wxcafe.preferences.set("storeID", "0");
											wxcafe.storeInfo.nukeLocalDatabase({success: enyo.bind(this, function(){
												wxcafe.storeInfo.destroy();
												wxcafe.storeInfo = new wxcafe.StoreInfoCollection();
												rebuildCollections();
											})});
										}
								        else
								        {
								        	wxcafe.storeInfo = new wxcafe.StoreInfoCollection();
								        	rebuildCollections();
								        }
							    	}
							    	else
							    	{
							    		rebuildCollections();
							    	}
								})});
							})});
						})});
					})});
				})});
			})});
		})});
	},

	setAdminPasswordButtonTapped: function(){
		this.$.passwordSuccessLabel.hide();
		if (this.$.passwordPopup) this.$.passwordPopup.destroy();
		this.createComponent({name: "passwordPopup", kind: "wxcafe.PasswordPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", popupTitle: $L("New Password"), confirmPassword: true, onHide: "handlePasswordPopupHidden", onClosePopup: "handlePasswordPopupClosed"});
		this.$.passwordPopup.show();
	},

	setManagerPasswordButtonTapped: function(){
		this.$.passwordSuccessLabel.hide();
		if (this.$.passwordPopup) this.$.passwordPopup.destroy();
		this.createComponent({name: "passwordPopup", kind: "wxcafe.PasswordPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", popupTitle: $L("New Password"), confirmPassword: true, confirmPasswordType: "manager", onHide: "handlePasswordPopupHidden", onClosePopup: "handlePasswordPopupClosed"});
		this.$.passwordPopup.show();
	},

	setOperatorPasswordButtonTapped: function(){
		this.$.passwordSuccessLabel.hide();
		if (this.$.passwordPopup) this.$.passwordPopup.destroy();
		this.createComponent({name: "passwordPopup", kind: "wxcafe.PasswordPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", popupTitle: $L("New Password"), confirmPassword: true, confirmPasswordType: "operator", onHide: "handlePasswordPopupHidden", onClosePopup: "handlePasswordPopupClosed"});
		this.$.passwordPopup.show();
	},

	testConnection: function(inSender, inEvent, saveSettings)
	{
		//Hide results messages.
		this.$.connectionFailedMessage.hide();
		this.$.connectionSucceededMessage.hide();
		
		//Construct connection string.
		var prefix = this.$.useInsecureConnectionToggleButton.value ? "http://" : "https://";
		var remoteDB = this.$.databasePortInput.getValue() !== "" ? this.$.databaseLocationInput.getValue() + ":" + this.$.databasePortInput.getValue() : this.$.databaseLocationInput.getValue();
		
		if (remoteDB !== "")
		{
			if (this.$.databaseUsernameInput.getValue() === "")
			{
				this.$.connectionFailedMessage.setContent($L("Missing Username!"));
				this.$.connectionFailedMessage.show();
				return;
			}

			if (this.$.databasePasswordInput.getValue() === "")
			{
				this.$.connectionFailedMessage.setContent($L("Missing Password!"));
				this.$.connectionFailedMessage.show();
				return;
			}

			var connectionString = prefix + remoteDB + "/_users";
			var db = new PouchDB(connectionString, {skipSetup: true});
			var that = this;

			if (this.$.testConnectionLoadingPopup) this.$.testConnectionLoadingPopup.destroy();
			this.createComponent({name: "testConnectionLoadingPopup", kind: "wxcafe.LoadingPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", onHide: "handlePopupHidden"} , {owner:this});
			this.$.testConnectionLoadingPopup.show($L("Testing"));

			var databasePassword = this.$.databasePasswordInput.getValue() !== "********" ? this.$.databasePasswordInput.getValue() : wxcafe.preferences.getPassword("pouchDBPassword");
			var ajaxOpts = {
				ajax: {
					headers: {
						Authorization: 'Basic ' + window.btoa(this.$.databaseUsernameInput.getValue() + ':' + databasePassword)
					}
				}
			};
			db.login(this.$.databaseUsernameInput.getValue(), databasePassword, ajaxOpts, function (err, response) {
				that.$.testConnectionLoadingPopup.hide();
				if (that.$.testConnectionLoadingPopup) that.$.testConnectionLoadingPopup.destroy();
				if (err) {
					if (err.name === 'unauthorized') {
		  				that.$.connectionFailedMessage.setContent($L("Bad Username/Password"));
						that.$.connectionFailedMessage.show();
					} else {
		  				that.$.connectionFailedMessage.setContent($L("Connection Failed!"));
						that.$.connectionFailedMessage.show();
					}
				}
	  			else
	  			{
					if (saveSettings)
					{
						wxcafe.preferences.set("pouchDBUseRemoteServer", wxcafe.preferences.get("testModeActive") ? that.$.useRemoteDatabaseToggleButton.value : true);
						wxcafe.preferences.set("pouchDBUseInsecureConnection", that.$.useInsecureConnectionToggleButton.value);
						wxcafe.preferences.set("pouchDBUsername", that.$.databaseUsernameInput.getValue());
						wxcafe.preferences.setPassword("pouchDBPassword", that.$.databasePasswordInput.getValue());
						wxcafe.preferences.set("pouchDBRemote", that.$.databaseLocationInput.getValue());
						wxcafe.preferences.set("pouchDBRemotePort", that.$.databasePortInput.getValue());
						that.rebuildDatabase(true);
					}
					else
					{
						that.$.connectionSucceededMessage.show();
					}
	  			}
			});
		}
		else
		{
			this.$.connectionFailedMessage.setContent($L("Invalid Connection String"));
			this.$.connectionFailedMessage.show();
		}
	},

	testSQLConnection: function(inSender, inEvent, saveSettings)
	{
		//Hide results messages.
		this.$.sqlConnectionFailedMessage.hide();
		this.$.sqlConnectionSucceededMessage.hide();
		this.$.sqlImportInfo.hide();
		this.set("testingStoreInfo", false);

		connectionString = this.$.connectionStringInput.getValue();

		//Test the connection string to make sure that we have a valid one
		if(connectionString !== "" && (connectionString.substr(0, 7) == "http://" || connectionString.substr(0, 8) == "https://") && connectionString.substr(connectionString.length - 1, 1) == "/")
		{
			var connection = new enyo.Ajax({url: connectionString});

			connection.response(this, function(inSender, inResponse) {
				this.$.testConnectionLoadingPopup.hide();
				this.$.testConnectionLoadingPopup.destroy();
				
				if (saveSettings && wxcafe.preferences.get("pouchDBUseRemoteServer"))
				{
					//If we are using a remote couch server, then we need to check and see if the store ID has been set up already
					wxcafe.preferences.set("sqlDatabaseHost", connectionString);
					this.sqlStoreInfoCollection = new wxcafe.StoreInfoCollection();
					this.set("testingStoreInfo", true);
					if (this.$.testConnectionLoadingPopup) this.$.testConnectionLoadingPopup.destroy();
					this.createComponent({name: "testConnectionLoadingPopup", kind: "wxcafe.LoadingPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", onHide: "handlePopupHidden"} , {owner:this});
					this.$.testConnectionLoadingPopup.show($L("Testing"));
					this.sqlStoreInfoCollection.download(false, "", true);
					return true;
				}
				else if (saveSettings && !wxcafe.preferences.get("pouchDBUseRemoteServer"))
				{
					//If we're not using a remote server, there is no need to preserve data.
					wxcafe.preferences.set("sqlDatabaseHost", connectionString);
					this.needsContactBalanceCalculation = true;
					this.downloadedFromSQL = true;
					this.doDownloadFromSQL();
				}
				else {
					this.$.sqlConnectionSucceededMessage.show();
				}
			});

			connection.error(this, function(inSender, inResponse) {
				this.$.testConnectionLoadingPopup.hide();
				this.$.testConnectionLoadingPopup.destroy();
				this.$.connectionFailedMessage.setContent($L("Connection Failed"));
				this.$.connectionFailedMessage.show();
			});

			if (this.$.testConnectionLoadingPopup) this.$.testConnectionLoadingPopup.destroy();
			this.createComponent({name: "testConnectionLoadingPopup", kind: "wxcafe.LoadingPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", onHide: "handlePopupHidden"} , {owner:this});
			this.$.testConnectionLoadingPopup.show($L("Testing"));
			connection.go();
		}
		else
		{
			this.$.connectionFailedMessage.setContent($L("Invalid Connection String"));
			this.$.connectionFailedMessage.show();
		}
	},

	testStoreIDs: function() {
		if (this.$.testConnectionLoadingPopup) this.$.testConnectionLoadingPopup.hide();
		if (this.$.testConnectionLoadingPopup) this.$.testConnectionLoadingPopup.destroy();

		this.set("testingStoreInfo", false);
		var match = false;

		if(this.get("storeInfoCollection") && this.get("storeInfoCollection").length > 0)
		{
			for (var i = 0; i < this.get("storeInfoCollection").length; i++)
			{
				for (var j = 0; j < this.get("sqlStoreInfoCollection").length; j++)
				{
					if (this.get("sqlStoreInfoCollection").at(j).get("storeID").toString() === this.get("storeInfoCollection").at(i).get("storeID").toString())
					{
						match = true;
					}
				}
			}
		}

		if (match)
		{
			this.$.sqlConnectionFailedMessage.setContent($L("Store Already Exists!"));
			this.$.sqlConnectionFailedMessage.show();
			return;
		}
		else
		{
			this.set("storeInfoModel", this.get("sqlStoreInfoCollection").at(0)); //NOTE: For import from SQL, there should always be exactly one store info entry.
			wxcafe.preferences.set("storeID", this.get("storeInfoModel").get("storeID"));
			this.downloadedFromSQL = true;
			this.doDownloadFromSQL();
		}
	},

	/*
	*	Event Handlers
	*/
	cancelButtonTapped: function(inSender, inEvent){
		window.close();
	},

	handleKeyUp: function(inSender, inEvent) {
		if (this.showing && inEvent.target.nodeName.toLowerCase() != "input")
		{
			switch(inEvent.keyCode)
			{
				case 13:
					this.submitButtonTapped();
					break;
			}
		}
    },
	
	handlePanelsIndexChanged: function(inSender, inEvent) {
		switch (this.$.firstRunPanels.get("index")) {
			case 0: //First Panel
				//Do nothing
				break;
			case 1: //Password Panel
				this.$.passwordSuccessLabel.hide();
				break;
			case 2: //PouchDB Connection Panel
				this.$.connectionFailedMessage.hide();
				this.$.connectionSucceededMessage.hide();
				this.toggleDatabasePrefs();
				break;
			case 3: //SQL Connection Panel
				this.$.sqlConnectionFailedMessage.hide();
				this.$.sqlConnectionSucceededMessage.hide();
				break;
			case 4: //Store Info Panel
				this.clearStoreInfoErrorState();
				break;
			default:
				break;
		}
	},

	handleOperatorPasswordCorrectWithReturnValue: function(inSender, inEvent){
		this.$.passwordPopup.destroy();
		if (this.passwordToConfirm && inEvent === this.passwordToConfirm)
		{
			this.$.passwordSuccessLabel.show();
			if (this.passwordToConfirm !== null) wxcafe.preferences.setPassword("operatorPassword", this.passwordToConfirm.toString());
		}
		else
		{
			this.passwordToConfirm = inEvent;
			this.createComponent({name: "passwordPopup", kind: "wxcafe.PasswordPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", popupTitle: $L("Confirm Password"), confirmPassword: true, confirmPasswordType: "operator", onHide: "handlePasswordPopupHidden", onClosePopup: "handlePasswordPopupClosed"});
			this.$.passwordPopup.show(this.passwordToConfirm);
		}
		return true;
	},

	handleManagerPasswordCorrectWithReturnValue: function(inSender, inEvent){
		this.$.passwordPopup.destroy();
		if (this.passwordToConfirm && inEvent === this.passwordToConfirm)
		{
			this.$.passwordSuccessLabel.show();
			if (this.passwordToConfirm !== null) wxcafe.preferences.setPassword("managerPassword", this.passwordToConfirm.toString());
		}
		else
		{
			this.passwordToConfirm = inEvent;
			this.createComponent({name: "passwordPopup", kind: "wxcafe.PasswordPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", popupTitle: $L("Confirm Password"), confirmPassword: true, confirmPasswordType: "manager", onHide: "handlePasswordPopupHidden", onClosePopup: "handlePasswordPopupClosed"});
			this.$.passwordPopup.show(this.passwordToConfirm);
		}
		return true;
	},

	handlePasswordCorrectWithReturnValue: function(inSender, inEvent){
		this.$.passwordPopup.destroy();
		if (this.passwordToConfirm && inEvent === this.passwordToConfirm)
		{
			this.$.passwordSuccessLabel.show();
			if (this.passwordToConfirm !== null) wxcafe.preferences.setPassword("adminPassword", this.passwordToConfirm.toString());
		}
		else
		{
			this.passwordToConfirm = inEvent;
			this.createComponent({name: "passwordPopup", kind: "wxcafe.PasswordPopup", classes: "theme-" + wxcafe.preferences.get("theme") + "-dialog", popupTitle: $L("Confirm Password"), confirmPassword: true, onHide: "handlePasswordPopupHidden", onClosePopup: "handlePasswordPopupClosed"});
			this.$.passwordPopup.show(this.passwordToConfirm);
		}
		return true;
	},

	handlePasswordPopupClosed: function(){
		this.passwordToConfirm = null;
		this.$.passwordPopup.destroy();
	},

	handleSQLDownloadFailed: function(){
		this.set("testingStoreInfo", false);
		this.$.connectionFailedMessage.setContent($L("Download Failed"));
		this.$.connectionFailedMessage.show();
		return true;
	},

	handleSQLDownloadSuccess: function(inSender, inEvent){
		this.set("testingStoreInfo", false);

		this.$.contactBankBaseItemsImportInfo.setContent($L("Base Items: ") + wxcafe.contactBankBaseItems.length + $L(" records imported."));
		this.$.cafePOSItemsImportInfo.setContent($L("Cafe POS Items: ") + wxcafe.cafePOSItems.length + $L(" records imported."));
		this.$.contactBankImportInfo.setContent($L("Contact Bank: ") + wxcafe.contactBank.length + $L(" records imported."));
		this.$.contactsImportInfo.setContent($L("Contacts: ") + wxcafe.contacts.length + $L(" records imported."));
		this.$.customerGroupsImportInfo.setContent($L("Customer Groups: ") + wxcafe.customerGroups.length + $L(" records imported."));
		this.$.marketingPlansImportInfo.setContent($L("Marketing Plans: ") + wxcafe.marketingPlans.length + $L(" records imported."));
		this.$.menusImportInfo.setContent($L("Menu Items: ") + wxcafe.menus.length + $L(" records imported."));

		this.$.sqlImportInfo.show();

		if (this.get("storeInfoModel"))
		{
			this.$.firstRunPanels.setIndexDirect(this.$.firstRunPanels.get("index") + 2);
		}
		else
		{
			this.$.firstRunPanels.setIndexDirect(this.$.firstRunPanels.get("index") + 1);
		}
		return true;
	},

	handlePasswordPopupHidden: function(){
		return true;
	},

	toggleDatabasePrefs: function()
	{
		this.$.databasePreferences.set("showing", wxcafe.preferences.get("testModeActive") ? this.$.useRemoteDatabaseToggleButton.value : true);
	}
});