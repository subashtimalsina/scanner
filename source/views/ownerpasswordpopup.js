enyo.kind({
	kind: "onyx.Popup",
	name: "wxcafe.OwnerPasswordPopup",

	autoDismiss: false,
	centered: true,
	floating: true,
	modal: true,
	scrim: true,
	style: "width: 350px; padding: 15px;",

	events: {
		onKitchenModeActivated: "",
		onCafeModeActivated: "",
		onPasswordCorrect: "",
		onSelfSignOnModeActivated: "",
		onTestModeActivated: ""
	},

	handlers: {
		onKeyUp: "handleKeyUp",
	},

	published: {
		allowModeSwitching: false,
		allowTestMode: false,
		showCloseButton: false
	},

	components: [
		{name: "closeButton", kind: "onyx.IconButton", src: "assets/closeicon.png", style: "float: right; margin-right: -32px; margin-top: -32px;", ontap: "cancelButtonTapped"},
		{kind: "enyo.FittableRows", components: [
			{style: "font-size: 20px;", content: "Enter Master Password subash:"},
			{kind: "onyx.InputDecorator", style: "width: 350px; margin-top: 10px;", alwaysLooksFocused: true, components: [
				{name: "passwordInput", style: "width: 100%", kind: "onyx.Input", attributes: {type: "password"}}
			]},
			{name: "loginFailedMessage", classes: "centered", style: "color: red; margin-top: 10px;", showing: false},
			{style: "text-align: center; margin-top: 10px;", components: [
				{kind: "onyx.Button", classes: "onyx-affirmative button-text", content: $L("Login"), ontap: "loginButtonTapped"},
			]}
		]},
		{name: "QRCodeScanner", kind: "onyx.Button", content: "QR Scanner", ontap:"QrScanner"},
		{name: "QrScannerCancle", kind:"onyx.Button", content: "Cancle", ontap: "QrCancle"}
		// {name: "QrScannerDisplay", showing: false, style: "height:300px; width:400px; color: red;"}
	],
	
	bindings: [
		{from: ".showCloseButton", to: ".$.closeButton.showing", transform: function(v) {
			
				return true;
			
		}}
	],

	show: function(){
		this.inherited(arguments);
		this.$.passwordInput.focus();
		this.$.passwordInput.hasNode().setSelectionRange(this.$.passwordInput.getValue().length, this.$.passwordInput.getValue().length);
	},

	loginButtonTapped: function(inSender, inEvent)
	{
		console.log(" i am hello world");
	},

	cancelButtonTapped: function(inSender, inEvent)
	{
		
	},
	QrScanner: function(inSender, inEvent){
		// this.$.QrScannerDisplay.setShowing(true);
		console.log("i am QrScanner");

		QRScanner.prepare(onDone);

		function onDone(err, status){
		  if (err) {
		   console.error(err);
		  }
		  if (status.authorized) {
		  	console.log("i have been authorized");
		  	console.log(QRScanner.scan(displayContents));

		  } else if (status.denied) {
		  	console.log("i have been denied");
		  } else {
		  	console.log("i have been not responded");
		  }
		}

		QRScanner.scan(displayContents);
		function displayContents(err, text){
		  if(err){
		  	console.log("i am scanning error");
		  } else {
		  	console.log("i am scanning text");
		    console.log(text);
		    QRScanner.show(showResults);
		  }
		}

		// QRScanner.show();
		QRScanner.show(showResults);
		function showResults(status){
 		 	console.log(status);
		}
	},
	QrCancle: function(inSender, inEvent){
		console.log(QRScanner);
		QRScanner.cancleScan();
		QRScanner.destroy();
	},

	handleKeyUp: function(inSender, inEvent) {
		if (this.showing)
		{
			switch(inEvent.keyCode)
			{
				case 13:
					this.loginButtonTapped();
					break;
				case 27:
					if (this.showCloseButton)
					{
						this.cancelButtonTapped();	
					}				
					break;
			}
			return true;
		}
    }
});