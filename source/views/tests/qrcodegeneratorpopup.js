enyo.kind(
{
	name: 'wxcafe.tests.QRCodeGeneratorPopup',
	kind: "onyx.Popup",
	autoDismiss: false,
	centered: true,
	floating: true,
	modal: true,
	scrim: true,
	_qrCode: null,

	handlers: {
		onHide: "handleHide",
		onKeyUp: "handleKeyUp"
	},

	events: {
		onClosePopup: ''
	},

	style: 'width: 550px; height 600px; padding: 15px 10px 15px 10px',

	components: [
		{
			kind: "onyx.IconButton",
			src: "assets/closeicon.png",
			style: "float: right; margin-right: -22px; margin-top: -28px",
			ontap: "closeButtonTapped"
		},
		{
			kind: "enyo.FittableRows",
			fit: true,
			components: [
				{
					style: "text-align: center; font-size: 20px; font-weight: bold",
					content: $L('QR Code Generator')
				},
				{
					kind: "enyo.FittableColumns",
					style: 'margin-top: 15px',
					components: [
						{
							classes: "add-customer-basic-title",
							content: $L('Input Text:')
						},
						{
							kind: "onyx.InputDecorator",
							classes: "add-customer-basic-content",
							alwaysLooksFocused: true,
							fit: true,
							components: [
								{
									name: 'textInput',
									classes: 'full-width',
									kind: 'onyx.Input',
									value: 'https://www.google.com'
								}
							]
						}
					]
				},
				{
					style: "text-align: center; margin-top: 15px",
					components: [
						{
							name: "generateButton",
							kind: "onyx.Button",
							classes: "onyx-affirmative button-text",
							content: $L("Generate QR Code"),
							style: "width: 250px; height: 50px; font-weight: bold",
							ontap: "generateButtonTapped"
						}
					]
				},
				{
					style: 'width: 512px; height: 512px; margin-top: 15px; margin-left: auto; margin-right: auto; background-color: white;',
					components: [
						{
							name: 'qrCode',
							style: 'width: 450px; height: 450px; margin: auto; padding-top: 32px'
						}
					]
				}
			]
		}
	],

	show: function()
	{
		this.inherited(arguments);
		wxcafe.fixShim();

		this._qrCode = new QRCode(this.$.qrCode.hasNode(),
		{
			width: 450,
			height: 450
		});

		this.generateButtonTapped();
	},

	generateButtonTapped: function(inSender, inEvent)
	{
		if (!this.$.textInput.getValue())
		{
			this.$.textInput.focus();
			return;
		}

		this._qrCode.makeCode(this.$.textInput.getValue());

		return true;
	},

	closeButtonTapped: function(inSender, inEvent)
	{
		this.doClosePopup();
		this.hide();

		return true;
	},

	handleKeyUp: function(inSender, inEvent)
	{
		switch (inEvent.keyCode)
		{
			case 13:
				this.generateButtonTapped();
				break;
			case 27:
				this.closeButtonTapped();
				break;
		}

		return true;
	},

	handleHide: function(inSender, inEvent)
	{
		if (inEvent.originator !== this) return true;
	}
});
