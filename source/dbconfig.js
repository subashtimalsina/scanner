enyo.singleton(
{
	kind: 'enyo.Object',
	name: 'wxcafe.RemoteDatabaseConfigSingleton',

	_activeConfig: 'main',

	_configs: {
		dev: {
			remote: '',
			port: ''
		},
		main: {
			remote: '',
			port: ''
		}
	},

	getRemoteURL: function()
	{
		return this._configs[this._activeConfig].remote;
	},

	getRemotePort: function()
	{
		return this._configs[this._activeConfig].port;
	}
});
