(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(__path, cbk) {
			var me = this;
			cbk({module:__path});
		};	
	};
	module.exports = obj;
})();

