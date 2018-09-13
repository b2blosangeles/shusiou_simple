(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(__path, cbk) {
			var me = this;
			switch (req.body.appCmd) {
				case 'website':
					cbk({module:__path, data:config.website});
					break;
				case 'database':
					cbk({module:__path, data:config.database});
					break;
				default:
					cbk({module:null, data:null});
					break;
			}
		};	
	};
	module.exports = obj;
})();

