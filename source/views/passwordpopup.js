enyo.kind({
	name: "wxcafe.PasswordPopup",
	kind: "onyx.Popup",
	autoDismiss: false,
	centered: true,
	floating: true,
	modal: true,
	scrim: true,
	returnValue: null,

	published: {
		confirmPassword: false,
		confirmPasswordType: "admin",
		allowOperatorPassword: false,
		allowManagerPassword: false,
		popupTitle: $L("Password")
	},

	handlers: {
		onKeyUp: "handleKeyUp",
		onNumberTapped: "numberPressed",
	},
	
	events: {
		onClosePopup: "",
		onPasswordCorrect: "",
		onManagerPasswordCorrect: "",
		onOperatorPasswordCorrect: "",
		onPasswordCorrectWithReturnValue: "",
		onManagerPasswordCorrectWithReturnValue: "",
		onOperatorPasswordCorrectWithReturnValue: ""
	},

	components: [
		{kind: "onyx.IconButton", src: "assets/closeicon.png", style: "float: right; margin-right: -18px; margin-top: -18px;", ontap: "closeButtonTapped"},
		{name: "title", style: "margin: 3px; font-size: 18px"},
		{name: "passwordInputDecorator", kind: "onyx.InputDecorator", style: "background-color: white; margin: 3px", components: [
			{name: "passwordInput", kind: "onyx.Input", style: "width: 293px; font-size: 24px", attributes: {type: "password"}}
		]},
		{kind: "wxcafe.PasswordGrid", onBackTapped: "backPressed", onClearTapped: "clearPressed"},
		{kind: "enyo.FittableColumns", components:[
			{kind: "onyx.Button", classes: "onyx-affirmative button-text", content: $L("OKAY"), style: "margin: 3px; font-size: 36px; width: 312px", ontap: "okayButtonTapped"}
		]}
	],
	bindings: [
		{from: ".popupTitle", to: ".$.title.content"},
	],

	show: function(returnValue){
		this.returnValue = returnValue ? returnValue : null;
		this.$.passwordInputDecorator.applyStyle("background-color", "white");
		this.$.passwordInput.setValue("");
		this.inherited(arguments);
		
		setTimeout(enyo.bind(this, function(){
				if(wxcafe.preferences.get("touchMode") === false){
					this.$.passwordInput.focus();
				}
		}),80);
		
		
	},

	handleKeyUp: function(inSender, inEvent) {
		if (this.showing && inEvent.target.nodeName.toLowerCase() != "input")
		{
			switch(inEvent.keyCode)
			{
				case 49:
				case 97:
					this.numberPressed(inSender, 1);
					break;
				case 50:
				case 98:
					this.numberPressed(inSender, 2);
					break;
				case 51:
				case 99:
					this.numberPressed(inSender, 3);
					break;
				case 52:
				case 100:
					this.numberPressed(inSender, 4);
					break;
				case 53:
				case 101:
					this.numberPressed(inSender, 5);
					break;
				case 54:
				case 102:
					this.numberPressed(inSender, 6);
					break;
				case 55:
				case 103:
					this.numberPressed(inSender, 7);
					break;
				case 56:
				case 104:
					this.numberPressed(inSender, 8);
					break;
				case 57:
				case 105:
					this.numberPressed(inSender, 9);
					break;
				case 48:
				case 96:
					this.numberPressed(inSender, 0);
					break;
				case 8:
					this.backPressed();
					break;
				case 13:
					this.okayButtonTapped();
					break;
				case 27:
					this.closeButtonTapped();
					break;
			}
		}
		else if (this.showing)
		{
			switch(inEvent.keyCode)
			{
				case 8:
					this.backPressed();
					break;
				case 13:
					this.okayButtonTapped();
					break;
				case 27:
					this.closeButtonTapped();
					break;
			}

			return true;
		}
	},

	numberPressed: function(inSender, inEvent){
		//TODO: Password Length Limit?
		this.$.passwordInputDecorator.applyStyle("background-color", "white");
		var currentValue = this.$.passwordInput.getValue().toString();
		var selectionStart = this.$.passwordInput.hasNode().selectionStart;
		var selectionEnd = this.$.passwordInput.hasNode().selectionEnd;

		this.$.passwordInput.setValue(currentValue.substr(0, selectionStart) + inEvent + currentValue.substr(selectionEnd));
		setTimeout(enyo.bind(this, function(){
			if(wxcafe.preferences.get("touchMode") === false){
				this.$.passwordInput.focus();
				this.$.passwordInput.hasNode().setSelectionRange(selectionStart + inEvent.toString().length, selectionStart + inEvent.toString().length);
			}
		}),80);
		
		return true;
	},

	backPressed: function(inSender, inEvent){
		this.$.passwordInputDecorator.applyStyle("background-color", "white");
		var currentValue = this.$.passwordInput.getValue().toString();
		var selectionStart = this.$.passwordInput.hasNode().selectionStart;
		var selectionEnd = this.$.passwordInput.hasNode().selectionEnd;

		if (currentValue.length > 0)
		{
			if (wxcafe.preferences.get("touchMode") === true){
					this.$.passwordInput.setValue(currentValue.substr(0,  this.$.passwordInput.getValue().toString().length - 1));
			}
			
			//Case 1: Cursor is at begining of string (position 0)
			if (selectionStart === selectionEnd && selectionStart === 0)
			{
				// Do Nothing
			}
			//Case 2: A selection
			else if (selectionStart !== selectionEnd)
			{
				this.$.passwordInput.setValue(currentValue.substr(0, selectionStart) + currentValue.substr(selectionEnd));
				if(wxcafe.preferences.get("touchMode") === false){
					this.$.passwordInput.hasNode().setSelectionRange(selectionStart, selectionStart);
				}
			}
			//Case 3: Cursor at a non-zero position.
			else if (selectionStart === selectionEnd)
			{
				this.$.passwordInput.setValue(currentValue.substr(0, selectionStart - 1) + currentValue.substr(selectionEnd));
				if(wxcafe.preferences.get("touchMode") === false){
					this.$.passwordInput.hasNode().setSelectionRange(selectionStart - 1, selectionStart - 1);
				}
			}
		}

		return true;
	},

	clearPressed: function(inSender, inEvent){
		this.$.passwordInputDecorator.applyStyle("background-color", "white");
		this.$.passwordInput.setValue("");
		return true;
	},

	closeButtonTapped: function(inSender, inEvent){
		this.$.passwordInputDecorator.applyStyle("background-color", "white");
		this.doClosePopup();
		setTimeout(enyo.bind(this, function(){
			this.hide();
		}),80);
		return true;
	},

	okayButtonTapped: function(inSender, inEvent){
		var adminPasswordCorrect = this.$.passwordInput.getValue() == wxcafe.preferences.getPassword("adminPassword");
		var managerPasswordCorrect = this.$.passwordInput.getValue() == wxcafe.preferences.getPassword("managerPassword");
		var operatorPasswordCorrect = this.$.passwordInput.getValue() == wxcafe.preferences.getPassword("operatorPassword");
		var ownerPasswordCorrect = this.$.passwordInput.getValue() == wxcafe.preferences.getPassword("ownerPassword");

		if (this.get("confirmPassword"))
		{
			if (!this.returnValue || (this.returnValue && this.$.passwordInput.getValue() == this.returnValue))
			{
				switch (this.get("confirmPasswordType"))
				{
					case "admin":
						this.doPasswordCorrectWithReturnValue(this.$.passwordInput.getValue());
						break;
					case "manager":
						this.doManagerPasswordCorrectWithReturnValue(this.$.passwordInput.getValue());
						break;
					case "operator":
						this.doOperatorPasswordCorrectWithReturnValue(this.$.passwordInput.getValue());
						break;
					default:
						this.$.passwordInputDecorator.applyStyle("background-color", "#ff9999");
						return;
				}

				this.hide();
			}
			else
			{
				this.$.passwordInputDecorator.applyStyle("background-color", "#ff9999");
			}
		}
		else if (this.get("allowOperatorPassword") && operatorPasswordCorrect)
		{
			this.returnValue ? this.doOperatorPasswordCorrectWithReturnValue(this.returnValue) : this.doOperatorPasswordCorrect();
			this.hide();
		}
		else if (this.get("allowManagerPassword") && managerPasswordCorrect)
		{
			this.returnValue ? this.doManagerPasswordCorrectWithReturnValue(this.returnValue) : this.doManagerPasswordCorrect();
			this.hide();
		}
		else if (adminPasswordCorrect || ownerPasswordCorrect)
		{
			this.returnValue ? this.doPasswordCorrectWithReturnValue(this.returnValue) : this.doPasswordCorrect();
			this.hide();
		}
		else
		{
			this.$.passwordInputDecorator.applyStyle("background-color", "#ff9999");
			setTimeout(enyo.bind(this, function(){
				if(wxcafe.preferences.get("touchMode") === false){
					this.$.passwordInput.focus();
					this.$.passwordInput.hasNode().setSelectionRange(0, this.$.passwordInput.getValue().toString().length);
				}
			}),80);
		
		}
		
		return true;
	}
});

enyo.kind({
	name: "wxcafe.PasswordGrid",
	kind: "enyo.FittableRows",
	events: {
		onNumberTapped: "",
		onBackTapped: "",
		onClearTapped: ""
	},

	components: [
		{components:[
			{kind: "wxcafe.PasswordKey", content: $L("7"), value: "7", ontap: "numberButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("8"), value: "8", ontap: "numberButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("9"), value: "9", ontap: "numberButtonTapped"},
		]},
		{components:[
			{kind: "wxcafe.PasswordKey", content: $L("4"), value: "4", ontap: "numberButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("5"), value: "5", ontap: "numberButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("6"), value: "6", ontap: "numberButtonTapped"},
		]},
		{components:[
			{kind: "wxcafe.PasswordKey", content: $L("1"), value: "1", ontap: "numberButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("2"), value: "2", ontap: "numberButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("3"), value: "3", ontap: "numberButtonTapped"},
		]},
		{components:[
			{kind: "wxcafe.PasswordKey", content: $L("C"), style: "font-weight: normal", ontap: "clearButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("0"), value: "0", ontap: "numberButtonTapped"},
			{kind: "wxcafe.PasswordKey", content: $L("<<<"), style: "font-weight: normal", ontap: "backButtonTapped"},
		]},
	],

	numberButtonTapped: function(inSender, inEvent){
		this.doNumberTapped(inSender.getContent()); //inSender.getValue());
		return true;
	},

	backButtonTapped: function(inSender, inEvent){
		this.doBackTapped();
		return true;
	},

	clearButtonTapped: function(inSender, inEvent){
		this.doClearTapped();
		return true;
	}
});

enyo.kind({
	name: "wxcafe.PasswordKey",
	kind: "onyx.Button",
	classes: "button",
	style: "font-size: 36px; margin: 3px; width: 100px;"
});