(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(__path, cbk) {
			var me = this;
			// req.body.appCmd
			switch (__path) {
				case 'website':
					cbk({module:__path, data:config.website});
					break;
				case 'database':
					cbk({module:__path, data:config.database});
					break;
				case '':
					cbk({module:null});
					break;
				default:
					cbk({module:'err', data:null});
					break;
			}
		};	
	};
	module.exports = obj;
})();

