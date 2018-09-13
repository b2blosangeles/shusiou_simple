(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(__path, cbk) {
			var me = this;
			// req.body.appCmd
			switch (__path) {
				case 'website':
					if (me.validation() === true) {
						cbk({module: 'website', data:config.website});
					}
					break;
				case 'database':
					if (me.validation() === true) {
						me.cbk({module:'database', data:config.database});
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
			if (!req.body.appCmd) return true;
			else {
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
		}
	};
	module.exports = obj;
})();

