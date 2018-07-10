/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "wxcafe.Application",
	kind: "enyo.Application",
	view: "wxcafe.FirstRunView",

	handlers: {
		onModeSwitch: "handleModeSwitch"
	},

    create: function() {
        enyo.dispatcher.listen(window, "contextmenu");
        enyo.dispatcher.listen(window, "paste");
        this.inherited(arguments);
        console.log("i am create function");
    },

    handleModeSwitch: function(inSender, inEvent) {
    	console.log("i am handleModeSwitch");
    	wxcafe.preferences.set("mode", inEvent);
    	wxcafe.preferences.commit({success: enyo.bind(this, function(){
    		switch(inEvent){
    			case "cafe":
    				this.set("view", new wxcafe.MainView());
    				break;
    			case "kitchen":
    				this.set("view", new wxcafe.KitchenView());
    				break;
    			case "sso":
					this.set("view", new wxcafe.SelfSignInView());
    				break;
    			default:
					this.set("view", new wxcafe.MainView());
    		}
    		this.render();
    	})});
    }
});

wxcafe.fixShim = function()
{
	//This works around a bug where the shim is sometimes not shown correctly the first time that we have a dialog over a dialog.
	var loadingPopup = new wxcafe.LoadingPopup();
	loadingPopup.show($L("Loading"));
	loadingPopup.hide();
	loadingPopup.destroy();
};

wxcafe.log = function(minimumLogLevel, message, data)
{
	if (wxcafe.preferences.get("logLevel") > minimumLogLevel)
	{
		if (data)
		{
			console.log(message, data);
		}
		else
		{
			console.log(message);
		}
	}
};

wxcafe.loadingPopup = function(message)
{
	var loadingPopup = new wxcafe.LoadingPopup();
	loadingPopup.show($L(message));
			
};

wxcafe.keyCodeLookup = {
	kc32: " ",
	kc48: 0,
	kc49: 1,
	kc50: 2,
	kc51: 3,
	kc52: 4,
	kc53: 5,
	kc54: 6,
	kc55: 7,
	kc56: 8,
	kc57: 9,
	kc65: "a",
	kc66: "b",
	kc67: "c",
	kc68: "d",
	kc69: "e",
	kc70: "f",
	kc71: "g",
	kc72: "h",
	kc73: "i",
	kc74: "j",
	kc75: "k",
	kc76: "l",
	kc77: "m",
	kc78: "n",
	kc79: "o",
	kc80: "p",
	kc81: "q",
	kc82: "r",
	kc83: "s",
	kc84: "t",
	kc85: "u",
	kc86: "v",
	kc87: "w",
	kc88: "x",
	kc89: "y",
	kc90: "z",
	shift32: " ",	
	shift65: "A",
	shift66: "B",
	shift67: "C",
	shift68: "D",
	shift69: "E",
	shift70: "F",
	shift71: "G",
	shift72: "H",
	shift73: "I",
	shift74: "J",
	shift75: "K",
	shift76: "L",
	shift77: "M",
	shift78: "N",
	shift79: "O",
	shift80: "P",
	shift81: "Q",
	shift82: "R",
	shift83: "S",
	shift84: "T",
	shift85: "U",
	shift86: "V",
	shift87: "W",
	shift88: "X",
	shift89: "Y",
	shift90: "Z",
	kc96: 0,
	kc97: 1,
	kc98: 2,
	kc99: 3,
	kc100: 4,
	kc101: 5,
	kc102: 6,
	kc103: 7,
	kc104: 8,
	kc105: 9
};

wxcafe.isMobile = function()
{
	if (enyo.platform.android ||
		enyo.platform.androidChrome ||
		enyo.platform.androidFirefox ||
		enyo.platform.ios ||
		enyo.platform.webos ||
		enyo.platform.windowsPhone ||
		enyo.platform.tizen ||
		enyo.platform.firefoxOS)
	{
		return true;
	}
	else
	{
		return false;
	}
};

/*
*	Profiling Logic
*/

wxcafe.profile_time = {};

wxcafe.profile_start = function(name)
{
	wxcafe.profile_time[name] = new Date().getTime();
};

wxcafe.profile_stop = function(name)
{
	var delta_time = new Date().getTime() - wxcafe.profile_time[name];
	wxcafe.log(1, name + " Time: " + delta_time + "ms");
};

wxcafe.restartApp = function() {
	if (window.chrome && chrome.app && chrome.app.runtime)
	{
		chrome.runtime.reload();
	}
	else
	{
		window.location.reload(true);
	}
};

wxcafe.getTerminalIdentifier = function()
{
	var terminalName = wxcafe.preferences.get('terminalName');

	if (!terminalName || terminalName === '')
	{
		return wxcafe.preferences.get('terminalID').slice(-12);
	}

	return terminalName;
};

wxcafe.setupHelpers = function()
{
	wxcafe.transactionHelper = wxcafe.TransactionHelperSingleton;
	wxcafe.qrCodeTrfmHelper = wxcafe.QRCodeTransformationHelperSingleton;
};

wxcafe.noCountItems = [];

enyo.ready(function ()
{
	console.log("i am from ready function");
	console.log(enyo.platform);
	console.log(cordova);
	console.log(cordova.plugins);
	console.log(cordova.plugins.permissions);



	document.addEventListener('deviceready', function()
	{
		if (enyo.platform.ios && cordova && cordova.plugins && cordova.plugins.iosrtc)
		{
			cordova.plugins.iosrtc.registerGlobals();
		}

		if ((enyo.platform.android || enyo.platform.androidChrome || enyo.platform.androidFirefox) &&
			cordova && cordova.plugins && cordova.plugins.permissions)
		// if (cordova && cordova.plugins && cordova.plugins.permissions)
		{
			var permissions = cordova.plugins.permissions;

			var errorCallback = function()
			{
				console.warn('Camera permission is not available or was denied.');
			};

			permissions.requestPermissions(permissions.CAMERA, function(status)
			{
				if (status.hasPermission)
				{
					console.info('Camera permission has been granted.');
				}
				else
				{
					errorCallback();
				}
			}, errorCallback);
		}
	});

	wxcafe.remoteDatabaseConfig = wxcafe.RemoteDatabaseConfigSingleton;

    //wxcafe.preferences = new wxcafe.PreferencesModel();
    //wxcafe.setupHelpers();

    if (!(window.chrome && chrome.app && chrome.app.runtime))
    {
		window.onbeforeunload = function()
		{
			
			return;
		};
	}
	var version = "1.4.4.1**";
	$.getJSON("manifest.json", function(manifestData)
	{
		version = manifestData.version;
	}).always(function()
	{
		//wxcafe.preferences.fetch(
		//{
	    //	success: function()
	    //	{
	    		//$.extend(true, alertify.defaults, wxcafe.preferences.get('alertifyDefaults'));
	    		new wxcafe.Application({name: "app", version: version});
	    //	}
	    //});
	});
});
