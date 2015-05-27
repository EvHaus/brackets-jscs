'use strict';

(function () {
	var fs					= require('fs'),
		path				= require('path'),
		findup				= require('findup'),
		domainName			= 'globexdesigns.brackets-jscs',
		configFiles			= ['.jscsrc', '.jscs.json'],
		Checker				= require('jscs'),
		jscsConfig			= require('jscs/lib/cli-config');

	/**
	 * Does a recursive scan of the directories at and above the given
	 * fullPath until it finds a valid JSCS config file.
	 *
	 * @param	{string}	fullPath		- The full path to the directory where to start the scan
	 * @param	{function}	callback		- Callback (returns the full path to the directory where
	 * 										the configuration file was found, or null)
	 *
	 */
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

	/**
	 * Given a directory, returns the value of the JSCS configuration file found in that
	 * directory. Will first look for a .jscsrc file, if not found, will try .jscs.json
	 *
	 * @param	{string}	fullPath		- The full path to the directory where the config
	 * 										file should be
	 *
	 * @returns {object} A valid JSCS configuration object
	 */
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

	/**
	 * Given a JSCS object and a path to the directory where the configuration file is,
	 * sets up the JSCS instance with the given configuration
	 *
	 * @param	{object}	JSCS		- Instance of the JSCS checker
	 * @param	{string}	configPath	- The full path to the directory where the config
	 * 									file should be
	 */
	var _setConfig = function (JSCS, configPath) {
		var config = _getConfigFile(configPath);

		// Load JSCS configuration
		JSCS.registerDefaultRules();
		JSCS.configure(config);
	};

	/**
	 * Given the path to the current file, executes the callback onces a JSCS instance has been
	 * loaded and setup using the correct configuration file. The callback will return an
	 * instance of the JSCS checker.
	 *
	 * @param	{string}	fullPath		- Path to the current file
	 * @param	{function}	callback		- Callback method which returns a JSCS instance
	 *
	 * @returns {void}
	 */
	var _prepareJSCS = function (fullPath, callback) {
		// Initialize JSCS
		var JSCS = new Checker();

		_findConfig(path.dirname(fullPath), function (result) {
			// If no config file found - let users know
			if (!result) {
				return callback(null, [{
					message: "Unable to find a JSCS configuration file."
				}]);
			}

			// Set config filea
			_setConfig(JSCS, result);

			callback(JSCS);
		});
	};

	/**
	 * This method will be exposed to the extension. Given a path to a file, and a callback,
	 * will run the file at the path through the JSCS
	 * checker and return back the errors via the callback.
	 *
	 * @param	{string}	fullPath		- Path to the file to scan
	 * @param	{function}	callback		- Callback method
	 *
	 * @returns {void}
	 */
	var lintFile = function (fullPath, callback) {
		return _prepareJSCS(fullPath, function (JSCS, err) {
			if (err) return callback(err);

			JSCS.checkPath(fullPath).then(function (response) {
				callback(response[0]._errorList);
			}).catch(function (err) {
				callback(err);
			});
		});
	};

	/**
	 * This method will be exposed to the extension. Given a path to a file, and a callback,
	 * will run the file at the path through the JSCS
	 * auto-fixer.
	 *
	 * @param	{string}	code		- The code source to fix
	 * @param	{string}	fullPath	- Path to the file to fix
	 * @param	{function}	callback	- Callback method
	 *
	 * @returns {void}
	 */
	var fixFile = function (code, fullPath, callback) {
		return _prepareJSCS(fullPath, function (JSCS, err) {
			if (err) throw new Error(err);
			var result = JSCS.fixString(code, fullPath);
			callback(null, result.output);
		});
	};

	exports.init = function (domainManager) {
		if (!domainManager.hasDomain(domainName)) {
			domainManager.registerDomain(domainName, {
				major: 0,
				minor: 1
			});
		}

		// Registered Command: lintFile
		domainManager.registerCommand(
			domainName,
			'lintFile',
			lintFile,
			true,
			'Returns the results of linting the given file with JSCS',
			[{
				name: 'fullPath',
				type: 'string'
			}], [{
				name: "errors",
				type: "array"
			}]
		);

		// Registered Command: fixFile
		domainManager.registerCommand(
			domainName,
			'fixFile',
			fixFile,
			true,
			'Fixes the current file using the JSCS auto-fixing feature',
			[{
				name: 'code',
				type: 'string'
			}, {
				name: 'fullPath',
				type: 'string'
			}]
		);
	};
}());