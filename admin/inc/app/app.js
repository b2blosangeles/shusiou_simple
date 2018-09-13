(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(__path, cbk) {
			var me = this;
			switch (__path) {
				case 'website':
					if (me.validation() === null) {
						cbk({module: 'website', data:config.website});
					} else if (me.validation() === true) {
						cbk({module: 'website', data:config.website});
					} else {
						cbk({module: 'website', data:config.website, err : 'err'});
					}
					break;
				case 'database':
					if (me.validation() === null) {
						cbk({module:'database', data:config.database});
					} else if (me.validation() === true) {
						cbk({module:'database', data:config.database});
					} else {
						cbk({module: 'website', data:config.website, err : 'err'});
					}	
					break;
				case '':
					cbk({module:null});
					break;
				default:
					cbk({module:'err', data:null});
					break;
			}
		};
		this.validation = function() {
			if (!req.body.appCmd)  return null;

			switch (req.body.appCmd) {
				case 'website':
					return 'success';
					break;
				case 'database':
					return 'success';
					break;	
				default: 
					return true;
			}
		}
	};
	module.exports = obj;
})();

