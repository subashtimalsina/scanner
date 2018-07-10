enyo.kind(
{
	name: 'wxcafe.tests.QRCodeScannerPopup',
	kind: "onyx.Popup",
	autoDismiss: false,
	centered: true,
	floating: true,
	modal: true,
	scrim: true,
	_cameras: null,
	_camerasOriginal: null,
	_scans: null,
	_scanner: null,

	published: {
		activeCamera: null,
		activeScan: null
	},

	handlers: {
		onHide: "handleHide",
		onKeyUp: "handleKeyUp"
	},

	events: {
		onScanSelected: '',
		onClosePopup: ''
	},

	style: 'width: 600px; height 500px; padding: 15px 10px 15px 10px',

	components: [
		{
			kind: "onyx.IconButton",
			src: "assets/closeicon.png",
			style: "float: right; margin-right: -22px; margin-top: -28px",
			ontap: "closeButtonTapped"
		},
		{
			kind: "enyo.FittableRows",
			components: [
				{
					style: "text-align: center; font-size: 20px; font-weight: bold",
					content: $L('QR Code Scanner')
				},
				{
					kind: 'enyo.FittableColumns',
					style: 'height: 100%; width: 100%; margin-top: 15px',
					components: [
						{
							kind: 'enyo.FittableRows',
							style: 'height: 100%; width: 33%; margin-left: 5px',
							components: [
								{
									classes: 'list-header-item',
									style: "text-align: center; font-size: 16px; font-weight: bold; background-color: grey",
									content: $L('Cameras')
								},
								{
									name: 'camerasList',
									kind: 'List',
									count: 0,
									multiSelect: false,
									touch: true,
									touchOverscroll: false,
									style: 'height: 165px; width: 100%; background-color: white',
									onSetupItem: 'setupCameraItem',
									components: [
										{
											name: 'cameraName',
											classes: 'list-item-cell',
											style: 'color: black',
											ontap: 'selectCamera'
										}
									]
								},
								{
									classes: 'list-header-item',
									style: "text-align: center; font-size: 16px; font-weight: bold; background-color: grey; margin-top: 15px",
									content: $L('Scans')
								},
								{
									name: 'scansList',
									kind: 'List',
									count: 0,
									multiSelect: false,
									touch: true,
									touchOverscroll: false,
									style: 'height: 160px; width: 100%; background-color: white',
									onSetupItem: 'setupScanItem',
									components: [
										{
											name: 'scanName',
											classes: 'list-item-cell',
											style: 'color: black',
											ontap: 'selectScan'
										}
									]
								},
							]
						},
						{
							kind: 'enyo.FittableRows',
							style: 'width: 375px; height: 410px; margin-left: 15px',
							components: [
								{
									tag: 'video',
									name: 'preview',
									style: 'width: 100%; min-height: 50% !important; max-height: 405px !important; background-color: white; padding: 5px',
									showing: false
								},
								{
									kind: 'enyo.FittableRows',
									name: 'scanView',
									style: 'width: 100%; height: 100%',
									showing: false,
									components: [
										{
											name: 'scanContent',
											style: 'width: 375px; text-align: center; font-size: 16px; font-weight: bold; white-space: -moz-pre-wrap !important; white-space: -webkit-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word; word-break: break-all; white-space: normal',
											content: ''
										},
										{
											name: 'scanImage',
											kind: 'enyo.Image',
											style: 'width: 375px; margin-top: 15px; max-height: 355px !important; background-color: white; padding: 5px',
											src: ''
										}
									]
								}
							]
						}
					]
				},
				{
					style: "text-align: center; margin-top: 15px; height: 50px",
					components: [
						{
							name: 'selectButton',
							kind: 'onyx.Button',
							classes: "onyx-affirmative button-text",
							content: $L("Select"),
							style: "width: 150px; height: 50px; font-weight: bold",
							disabled: true,
							ontap: 'selectButtonTapped'
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

		this.setupScanner();
		this.setupCamerasList();
		this.setupScansList();
	},

	setupScanner: function()
	{
		this._scanner = new Instascan.Scanner(
		{
			video: this.$.preview.hasNode(),
			scanPeriod: 5,
			mirror: false,
			captureImage: true
		});

		this._scanner.addListener('scan', enyo.bind(this, function(content, image)
		{
			this.updateScansList(
			{
				content: content,
				image: image
			});
		}));
	},

	setupCamerasList: function()
	{
		Instascan.Camera.getCameras().then(enyo.bind(this, function(cameras)
		{
			this._cameras = new enyo.Collection();

			if (cameras.length === 0)
			{
				this._cameras.add(
				{
					id: null,
					name: 'No Cameras Found'
				});

				console.info('No Cameras Found');
			}
			else
			{
				for (var i = 0; i < cameras.length; i++)
				{
					if (!cameras[i].name)
					{
						if (enyo.platform.platformName === 'ios' && i === 0)
						{
							cameras[i].name = 'Rear Camera';
						}
						else if (enyo.platform.platformName === 'ios' && i === 1)
						{
							cameras[i].name = 'Front Camera';
						}
						else
						{
							cameras[i].name = 'Camera ' + (i + 1);
						}
					}

					this._cameras.add(cameras[i]);

					if (enyo.platform.platformName !== 'ios')
					{
						this._cameras.add($.extend(true, 
						{
							mirror: true
						}, cameras[i],
						{
							id: cameras[i].id + '1',
							name: cameras[i].name + ' (mirrored)'
						}));
					}
				}

				this._camerasOriginal = cameras;
			}

			this.$.camerasList.setCount(this._cameras.length);
			this.$.camerasList.reset();
		})).catch(function(e)
		{
			enyo.error(e);
		});
	},

	setupScansList: function()
	{
		this._scans = new enyo.Collection();

		this.updateScansList();
	},

	updateScansList: function(scan)
	{
		if (!scan && this._scans.length < 1)
		{
			this._scans.add(
			{
				content: 'No Scans Yet'
			});
		}
		else
		{
			if (this._scans.at(0).get('content') === 'No Scans Yet')
			{
				this._scans.remove(this._scans.at(0));
			}

			this._scans.add(
			{
				date: moment().valueOf(),
				content: scan.content,
				image: scan.image
			});
		}

		this.$.scansList.setCount(this._scans.length);
		this.$.scansList.reset();
	},

	selectCamera: function(inSender, inEvent)
	{
		if (this._cameras.at(inEvent.index).get('id') === null)
		{
			return true;
		}

		var selection = this.$.camerasList.getSelection();

		this.set('activeCamera', this._cameras.at(inEvent.index));

		if (selection !== null)
		{
			this.$.scanView.setShowing(false);
			this.$.preview.setShowing(true);

			this.$.scansList.select(-1);
			this.$.scansList.refresh();

			this.$.camerasList.select(inEvent.index);
			this.$.camerasList.renderRow(inEvent.index);

			this.$.selectButton.setDisabled(true);

			this._scanner.stop();
			this._scanner.mirror = false;

			if (enyo.platform.platformName === 'ios' && inEvent.index === 0)
			{
				this._scanner.start(this._camerasOriginal[inEvent.index], 'environment');
			}
			else
			{
				if (this.get('activeCamera').get('mirror') === true)
				{
					this._scanner.mirror = true;
					this._scanner.start(this._camerasOriginal[inEvent.index - 1]);
				}
				else
				{
					this._scanner.start(this._camerasOriginal[inEvent.index]);
				}
			}
		}
	},

	selectScan: function(inSender, inEvent)
	{
		if (this._scans.at(inEvent.index).get('content') === 'No Scans Yet')
		{
			return true;
		}

		var selection = this.$.scansList.getSelection();

		this.set('activeScan', this._scans.at(inEvent.index));

		if (selection !== null)
		{
			this.$.scanView.setShowing(true);
			this.$.preview.setShowing(false);

			this.$.camerasList.select(-1);
			this.$.camerasList.refresh();

			this.$.scansList.select(inEvent.index);
			this.$.scansList.renderRow(inEvent.index);

			this.$.selectButton.setDisabled(false);
		}
	},

	setupCameraItem: function(inSender, inEvent)
	{
		var i = inEvent.index;
		var item = this._cameras.at(i);

		this.$.cameraName.setContent(item.get('name'));

		this.$.cameraName.addRemoveClass('list-item-selected', inSender.isSelected(i));

		if (inSender.isSelected(i))
		{
			this.set('activeCamera', this._cameras.at(i))
		}
	},

	setupScanItem: function(inSender, inEvent)
	{
		var i = inEvent.index;
		var item = this._scans.at(i);

		this.$.scanName.setContent(item.get('content'));

		this.$.scanName.addRemoveClass('list-item-selected', inSender.isSelected(i));

		if (inSender.isSelected(i))
		{
			this.set('activeScan', this._scans.at(i));

			this.$.scanContent.setContent(item.get('content'));
			this.$.scanImage.set('src', item.get('image'));
		}
	},

	selectButtonTapped: function(inSender, inEvent)
	{
		this._scanner.stop();

		this.doScanSelected(this.get('activeScan').raw());
		this.doClosePopup();
		this.hide();

		return true;
	},

	closeButtonTapped: function(inSender, inEvent)
	{
		this._scanner.stop();

		this.doClosePopup();
		this.hide();

		return true;
	},

	handleKeyUp: function(inSender, inEvent)
	{
		switch (inEvent.keyCode)
		{
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
