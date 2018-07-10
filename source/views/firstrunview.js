enyo.kind({
	name: "wxcafe.FirstRunView",
	kind: "FittableRows",

	events:{
		onModeSwitch: "",
	},

	components: [
		{kind: enyo.Signals, onkeyup: "handleKeyUp"}
	],

	rendered: function(){
		this.inherited(arguments);
		// this.setTheme(wxcafe.preferences.get("theme"));

		// wxcafe.preferences.set('pouchDBRemote', wxcafe.remoteDatabaseConfig.getRemoteURL());
		// wxcafe.preferences.set("pouchDBPath", "");
		// wxcafe.preferences.set('pouchDBRemotePort', wxcafe.remoteDatabaseConfig.getRemotePort());
		// wxcafe.preferences.set("pouchDBUseInsecureConnection", false);
		
		// //wxcafe.preferences.commit();
		// if (wxcafe.preferences.get("firstRunComplete"))
		// {
		// 	this.doModeSwitch(wxcafe.preferences.get("mode"));
		// }
		// else
		// {
			if (this.$.ownerPasswordPopup) this.$.ownerPasswordPopup.hide();
			if (this.$.ownerPasswordPopup) this.$.ownerPasswordPopup.destroy();
			this.createComponent({
				name: "ownerPasswordPopup", 
				kind: "wxcafe.OwnerPasswordPopup", 
				classes: "theme-"+"-dialog", 
				allowTestMode: true, 
				allowModeSwitching: true,
				scrim: false,
				onPasswordCorrect: "handleOwnerPasswordCorrect",
				onKitchenModeActivated: "handleKitchenModeActivated",
				onCafeModeActivated: "handleCafeModeActivated",
				onSelfSignOnModeActivated: "handleSelfSignOnModeActivated",
				onTestModeActivated: "handleTestModeActivated",
				onHide: "handlePopupHidden"}, 
			{owner:this});
			this.$.ownerPasswordPopup.show();
		//}
	},

	handleKeyUp: function(inSender, inEvent)
	{
		//pass it down the chain
		inEvent.delegate = null;
		this.waterfallDown("onKeyUp", inEvent, inSender);
	},

	handleOwnerPasswordCorrect: function(inSender, inEvent)
	{
		this.doModeSwitch("cafe");
		return true;
	},

	handlePopupHidden: function(inSender, inEvent)
	{
		inEvent.originator.destroy();
		return true;
	},

	handleTestModeActivated: function(inSender, inEvent)
	{
		wxcafe.preferences.set("testModeActive", true);
		wxcafe.preferences.set("testModeStarted", moment());
		this.handleOwnerPasswordCorrect();
		return true;
	},

	handleKitchenModeActivated: function(inSender, inEvent)
	{
		this.doModeSwitch("kitchen");
		return true;
	},
	
	handleCafeModeActivated: function(inSender, inEvent)
	{
		this.doModeSwitch("cafe");
		return true;
	},
	

	handleSelfSignOnModeActivated: function(inSender, inEvent)
	{
		this.doModeSwitch("sso");
		return true;
	},

	setTheme: function(themeName) {
		this.removeClass("theme-light");
		this.removeClass("theme-dark");

		this.addClass("theme-" + themeName);
		return true;
	},


});