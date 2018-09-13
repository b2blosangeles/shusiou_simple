(function () { 
	var obj =  function (res, req, env, pkg, config) {
		this.loadApp = function(cbk) {
			var me = this;
			cbk({module:'db'});
		};	
	};
	module.exports = obj;
})();

