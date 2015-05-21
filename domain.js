'use strict';

(function () {
	var fs					= require('fs'),
		path				= require('path'),
		findup				= require('findup'),
		domainName			= 'globexdesigns.brackets-jscs',
		configFiles			= ['.jscsrc', '.jscs.json'],
		Checker,
		jscsConfig;

	// Wait for global packages to load
	require('enable-global-packages').on('ready', function () {
		// Then load JSCS
		Checker		= require('jscs');
		jscsConfig	= require('jscs/lib/cli-config');
	});

	var _findConfig = function (fullPath, callback) {
		findup(fullPath, function (dir, cb) {
			var found = false,
				configpath;

			for (var i = 0, l = configFiles.length; i < l; i++) {
				configpath = path.join(dir, configFiles[i]);
				if (fs.existsSync(configpath)) {
					found = true;
					break;
				}
			}

			cb(found);
		}, function (err, dir) {
			if (err) return callback(null);
			callback(dir);
		});
	};

	var _getConfigFile = function (fullPath) {
		var config = null,
			configpath;

		for (var i = 0, l = configFiles.length; i < l; i++) {
			configpath = path.join(fullPath, configFiles[i]);
			if (fs.existsSync(configpath)) {
				config = jscsConfig.load(configpath);
				break;
			}
		}

		return config || {};
	};


	var _setConfig = function (JSCS, configPath) {
		var config = _getConfigFile(configPath);

		// Load JSCS configuration
		JSCS.registerDefaultRules();
		JSCS.configure(config);
	};


	var lintFile = function (fullPath, projectRoot, callback) {
		// If the JSCS module isn't loaded yet -- wait...
		if (!Checker) {
			// Retry again in a bit
			return setTimeout(function () {
				lintFile.apply(arguments);
			}, 100);
		}

		// Initialize JSCS
		var JSCS = new Checker();

		return _findConfig(path.dirname(fullPath), function (result) {
			// If no config file found - let users know
			if (!result) {
				return callback([{
					message: "Unable to find a JSCS configuration file."
				}]);
			}

			// Set config file
			_setConfig(JSCS, result);

			// Run JSCS checker
			JSCS.checkPath(fullPath).then(function (response) {
				callback(response[0]._errorList);
			});
		});
	};


	exports.init = function (domainManager) {
		if (!domainManager.hasDomain(domainName)) {
			domainManager.registerDomain(domainName, {
				major: 0,
				minor: 1
			});
		}

		domainManager.registerCommand(
			domainName,
			'lintFile',
			lintFile,
			true,
			'Returns the results of linting the given file with JSCS',
			[{
				name: 'fullPath',
				type: 'string'
			}, {
				name: 'projectRoot',
				type: 'string'
			}], [{
				name: "errors",
				type: "array"
			}]
		);
	};
}());