enyo.kind(
{
	name: "wxcafe.PreferencesModel",
	kind: "enyo.Model",
	options: { parse: true },
	attributes: {
		id: "wxcafePreferencesModel",
		//Pouch/Couch Database
		pouchDBUseRemoteServer: true,
		pouchDBUsername: "",
		pouchDBPassword: "",

		pouchDBRemote: null,
		pouchDBPath: "",
		pouchDBRemotePort: null,
		pouchDBUseInsecureConnection: false,
		
		//SQL
		sqlDatabaseHost: "http://localhost/wxcafe/",
		
		//Theme
		theme: "dark",

		//Column Display
		columnsShowRevenue: true,
		columnsShowExpiry: false,
		columnsShowNC: true,
		columnsShowReferrer: false,
		columnsShowPassType: true,
		splitRevenueDisplay: "00:00",
		instantRedeemPanel: false,
		
		//other settings
		cafePaymentOptions: false,
		opColumn: false,
		touchMode: false,
		redeemOptions: false,
		viewportWidth: 1100,
		retryDelays: [5, 10, 20, 30],
		resetConfirmed: false, // Should always be false unless reset function initiated (and confirmed with password entry)
		screenWidth: 1800,
		recentQRCamera: null,
		
		//POS Options Chris Added
		enablePOS: false, 

		

		//Advanced Configuration Settings
		storeID: "0",
		firstRunComplete: false,
		testModeActive: false,
		storeInfo: null,
		mode: "cafe",

		//default operator and referrer
		defaultOperator: null,
		defaultReferrer: null,
		
		//Multi-terminal
		terminalID: uuid(),
		isMasterTerminal: true,
		mobileDragPanel: false,
		mobileView: false,
		multiTerminalFirstRunComplete: false,
		loginDateTime: null,

		//Self Sign In Settings
		ssiMinimumBalance: 0,
		ssiCafeItemID: 1,
		ssiGuestRegister: false,
		ssiGuestID: -1,
		ssiGuestInstantCafeItemID: -1,
		
		//new self sign in options 15th June 2016
		ssiPurchaseMode: false,
		ssiPurchaseCafeItemIDs: {},
		ssiFastMode: false,
		ssiNoNumberMode: false, // false 1- add as remark, 2- create temp contact,

		ssiTerminalFirstRunComplete: false,
		ssiAddCustomerHideReferrer: false,
		ssiAddCustomerHideOperator: false,
		ssiAddCustomerHideCoach: false,

		//Timebomb
		testModeStarted: moment(),

		//Loglevel
		logLevel: 42, //0 is off. We can use levels to generate more or less detailed logging information to console.

		//Queue DB Info
		writeQueueDBSequenceNumber: 0,

		// Alertify Default Overrides - see http://alertifyjs.com/guide.html for full list
		alertifyDefaults:
		{
			notifier:
			{
				delay: 10 // seconds
			}
		}
	},
	
	computed: {


		minimumBalanceAllowed: ["storeInfo"], //READ ONLY!! This is here as a convenience attribute, to work around binding issues.
		countryCode: ["storeInfo"],
		otherCharges: ["storeInfo"],
		posTax: ["storeInfo"],
		lastExpiry: ["storeInfo"],
		retailItemDecimal: ["storeInfo"],
		retailItemRounding:["storeInfo"],
		retailTotalDecimal:["storeInfo"],
		retailTotalRounding:["storeInfo"],
		memberItemDecimal:["storeInfo"],
		memberItemRounding: ["storeInfo"],
		memberTotalDecimal: ["storeInfo"],
		memberTotalRounding: ["storeInfo"],
		hasCalculatedContactBalances: ["storeInfo"],
		dbVersion: ["storeInfo"],
		reportMode: ["storeInfo"], // 0 deposit rev and cost, 1 depost and withdraw rev and cost.
		adminEmails: ["storeInfo"], 

	},
	
	primaryKey: "id",

	constructor: function(attrs, props, opts){
		if (window.chrome && chrome.app && chrome.app.runtime)
		{
			//Running as a packaged Chrome app. We test by seeing if the Chrome APIs are available to us.
			this.source = enyo.ChromeStorageSource.create();
		}
		else
		{
			this.source = enyo.LocalStorageSource.create();
		}

		this.inherited(arguments);

		//this.set('pouchDBRemote', wxcafe.remoteDatabaseConfig.getRemoteURL());
		//this.set('pouchDBRemotePort', wxcafe.remoteDatabaseConfig.getRemotePort());
	},

});