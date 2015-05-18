'use strict';

(function () {
	var domainName			= 'globexdesigns.brackets-jscs',
		configFiles			= ['.jscsrc', '.jscs.json'];

	// Setup NODE_PATH configuration
	// This is what allows us to import modules from the global namespace
	var oldNodePath = '';
	if (process.env.NODE_PATH) {
		oldNodePath = process.env.NODE_PATH + (process.platform === 'win32' ? ';' : ':');
	}

	if (process.platform === 'win32') {
		process.env.NODE_PATH = oldNodePath + process.env.APPDATA + '\\npm\\node_modules';
	} else if (process.platform === 'darwin') {
		process.env.NODE_PATH = oldNodePath + '/usr/local/lib/node_modules';
	} else {
		process.env.NODE_PATH = oldNodePath + '/usr/lib/node_modules';
	}

	require('module').Module._initPaths();

	// Load JSCS and dependencies
	var fs					= require('fs'),
		path				= require('path'),
		Checker				= require('jscs'),
		jscsConfig			= require('jscs/lib/cli-config'),
		findup				= require('findup');

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


	var _setConfig = function (cli, configPath) {
		var config = _getConfigFile(configPath);

		// Load JSCS configuration
		cli.registerDefaultRules();
		cli.configure(config);
	};


	var lintFile = function (fullPath, projectRoot, callback) {
		var cli = new Checker();

		return _findConfig(path.dirname(fullPath), function (result) {
			// If no config file found - let users know
			if (!result) {
				return callback([{
					message: "Unable to find a JSCS configuration file."
				}]);
			}

			// Set config file
			_setConfig(cli, result);

			// Run JSCS checker
			cli.checkPath(fullPath).then(function (response) {
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