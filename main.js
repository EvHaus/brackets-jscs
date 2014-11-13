/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, brackets, define */

define(function (require, exports, module) {
	"use strict";

	// Brackets Modules
	var CodeInspection		= brackets.getModule("language/CodeInspection"),
		FileSystem			= brackets.getModule("filesystem/FileSystem"),
		FileUtils			= brackets.getModule("file/FileUtils"),
		PreferencesManager	= brackets.getModule("preferences/PreferencesManager"),
		ProjectManager		= brackets.getModule("project/ProjectManager"),
		globmatch			= brackets.getModule("thirdparty/globmatch"),
		JSXTransformer		= require('bower_components/react/JSXTransformer'),

		// node-jscs Library
		JscsStringChecker = require("jscs/jscs-browser"),

		// Config file name
		_configFileNames = [".jscs.json", ".jscsrc"],

		// Default configuration
		defaultConfig = {},

		// Current configuration
		config = defaultConfig,

		// Files to exclude from validation
		excludeFiles = [];


	// ==========================================================================================


	var PREF_SCAN_PROJECT_ONLY = "scanProjectOnly",
		JSCS_NAME = "JSCS";

	var pm = PreferencesManager.getExtensionPrefs("jscs");

	pm.definePreference(PREF_SCAN_PROJECT_ONLY, "boolean", false)
		.on("change", function (e, d) {
			var val = pm.get(PREF_SCAN_PROJECT_ONLY);
			if (_scanProjectOnly !== val) {
				_scanProjectOnly = val;
				CodeInspection.requestRun(JSCS_NAME);
			}
		});

	/**
	* Extension preference which when set to true will limit the look up for configuration file
	* to the project sub-tree. If false, the entire file tree will be searched. The default is
	* false.
	* @private
	* @type {boolean}
	*/
	var _scanProjectOnly = pm.get(PREF_SCAN_PROJECT_ONLY);


	// ==========================================================================================


	/**
	 * Synchronous linting entry point.
	 * @method handleJSCS
	 *
	 * @param	{string}	text		- The string of code to validate
	 * @param	{string}	fullPath	- File path to the file
	 * @param	{object}	config		- Configuration object
	 *
	 * @return	{object}	Results of code inspection.
	 */
	function handleJSCS(text, fullPath, config) {
		var checker;

		// Make sure that synchronous linter does not break
		if (!config) config = defaultConfig;

		// Initialize JSCS
		try {
			var projectRootEntry = ProjectManager.getProjectRoot(),
				projectBasedPath = fullPath.replace(projectRootEntry.fullPath, '');

			// Skip excluded files
			for (var i = 0, l = excludeFiles.length; i < l; i++) {
				if (globmatch(projectBasedPath, excludeFiles[0])) return null;
			}

			// Execute JSCS checker
			checker = new JscsStringChecker();
			checker.registerDefaultRules();
			checker.configure(config);
		} catch (e) {
			console.error("JSCS failed to initialize: " + e);
			return null;
		}

		// Run JSCS
		try {
			var errors = checker.checkString(text),
				errList = errors.getErrorList(),
				result = {
					errors: []
				};

			// Get errors
			if (errList.length) {
				errList.forEach(function (error) {
					result.errors.push({
						pos: {
							line: error.line - 1,
							ch: error.column
						},
						message: error.message,
						type: CodeInspection.Type.WARNING
					});
				});

				return result;
			} else {
				return null;
			}
		} catch (e) {
			if (e.message) {
				// Try to find line number in message
				var lineCheck = e.message.match('Line ([0-9]+):'),
					line = lineCheck ? parseInt(lineCheck[1], 10) - 1 : 0;

				return {
					errors: [{
						pos: {
							line: line,
							ch: 1
						},
						message: e.message,
						type: CodeInspection.Type.WARNING
					}]
				};
			} else {
				return {
					errors: [{
						pos: {
							line: 0,
							ch: 1
						},
						message: "JSCS failed processing code due to an unexpected error.",
						type: CodeInspection.Type.WARNING
					}]
				};
			}
		}
	}


	/**
	 * Synchronous linting entry point for .jsx files
	 * @method handleJSXJSCS
	 *
	 * @param	{string}	text		- The string of code to validate
	 * @param	{string}	fullPath	- File path to the file
	 * @param	{object}	config		- Configuration object
	 *
	 * @return	{object}	Results of code inspection.
	 */
	function handleJSXJSCS(text, fullPath, config) {
		var JSXCode,
			result = {
				errors: []
			};

		try {
			JSXCode = JSXTransformer.transform(text).code;
		} catch (e) {
			// Try to find a line number
			var line = null,
				linematch = e.message.match(/Line (\d+)/g);
			if (linematch) line = parseInt(linematch[0].replace('Line ', ''), 10) - 1;

			result.errors.push({
				pos: {line: line},
				message: e.message,
				type: CodeInspection.Type.ERROR
			});
			return result;
		}

		return handleJSCS(JSXCode, fullPath, config);
	}


	// ==========================================================================================


	/**
	* Asynchronous linting entry point
	*
	* @param	{string}	text		- File contents
	* @param	{string}	fullPath	- Absolute path to the file
	*
	* @return {$.Promise} Promise to return results of code inspection
	*/
	function handleJSCSAsync(text, fullPath) {
		var deferred = new $.Deferred();
		_loadConfig(fullPath)
			.done(function (cfg) {
				deferred.resolve(handleJSCS(text, fullPath, cfg));
			});

		return deferred.promise();
	}


	/**
	* Asynchronous linting entry point for .jsx files
	*
	* @param	{string}	text		- File contents
	* @param	{string}	fullPath	- Absolute path to the file
	*
	* @return {$.Promise} Promise to return results of code inspection
	*/
	function handleJSXJSCSAsync(text, fullPath) {
		var deferred = new $.Deferred();
		_loadConfig(fullPath)
			.done(function (cfg) {
				deferred.resolve(handleJSXJSCS(text, fullPath, cfg));
			});

		return deferred.promise();
	}


	// ==========================================================================================


	/**
	 * Reads configuration file in the specified directory.
	 * Returns a promise for configuration object.
	 *
	 * @param	{string}	dir			- Absolute path to a directory
	 * @param	{string}	file_name	- Name of file to load
	 *
	 * @returns {$.Promise} a promise to return configuration object.
	 */
	function _readConfig(dir, file_name) {
		var result = new $.Deferred(),
			file;

		file = FileSystem.getFileForPath(dir + file_name);
		file.read(function (err, content) {
			if (!err) {
				var cfg = {};
				try {
					cfg = JSON.parse(content);
				} catch (e) {
					console.error("JSCS: Error parsing " + file.fullPath + ". Details: " + e);
					result.reject(e);
					return;
				}

				// JSCS handling for excludeFiles
				if (cfg.excludeFiles) {
					excludeFiles = cfg.excludeFiles;
					delete cfg.excludeFiles;
				}

				result.resolve(cfg);
			} else {
				result.reject(err);
			}
		});
		return result.promise();
	}


	// ==========================================================================================


	/**
	 * Looks up the configuration file in the filesystem hierarchy and loads it.
	 *
	 * @param	{string}	root		- Relative path to directory to start with
	 * @param	{string}	dir			- Relative directory to scan inside
	 * @param	{function}	readConfig	- Function to read and load configuration file
	 *
	 * @returns {$.Promise} A promise for configuration.
	 */
	function _lookupAndLoad(root, dir, readConfig) {
		var deferred = new $.Deferred(),
			done = false,
			_configFileName,
			configdone = false,
			configIndex = 0,
			cdir = dir,
			file,
			iter = {
				next: function () {
					if (done) return;
					_configFileName = _configFileNames[configIndex];
					readConfig(root + cdir, _configFileName)
						.then(function (cfg) {
							this.stop(cfg);
						}.bind(this))
						.fail(function () {
							if (configIndex < _configFileNames.length) {
								configIndex++;
								this.next();
							}
							configIndex = 0;
							if (!cdir) this.stop(defaultConfig);
							if (!done) {
								cdir = FileUtils.getDirectoryPath(cdir.substring(0, cdir.length - 1));
								this.next();
							}
						}.bind(this));
				},
				stop: function (cfg) {
					deferred.resolve(cfg);
					configdone = true;
					done = true;
				}
			};

		if (cdir === undefined || cdir === null) {
			deferred.resolve(defaultConfig);
		} else {
			iter.next();
		}

		return deferred.promise();
	}


	// ==========================================================================================


	/**
	 * Loads JSCS configuration for the specified file.
	 *
	 * If the specified file is outside the current project root, then defaultConfiguration is used.
	 * Otherwise, the configuration file is looked up starting from the directory where the specified
	 * file is located, going up to the project root, but no further.
	 *
	 * @param {string}		fullPath	- Absolute path for the file linted.
	 *
	 * @returns {$.Promise} Promise to return a configuration object.
	 */
	function _loadConfig(fullPath) {

		var projectRootEntry = ProjectManager.getProjectRoot(),
			result = new $.Deferred(),
			pathPiece,
			relPath,
			rootPath,
			file,
			config;

		if (!projectRootEntry) {
			return result.reject().promise();
		}

		if (!_scanProjectOnly) {
			// scan entire filesystem
			pathPiece = projectRootEntry.fullPath.indexOf("/") + 1;
			rootPath = projectRootEntry.fullPath.substring(0, pathPiece);
		} else {
			rootPath = projectRootEntry.fullPath;
		}

		// for files outside the root, use default config
		if (!(relPath = FileUtils.getRelativeFilename(rootPath, fullPath))) {
			result.resolve(defaultConfig);
			return result.promise();
		}

		relPath = FileUtils.getDirectoryPath(relPath);

		_lookupAndLoad(rootPath, relPath, _readConfig)
			.done(function (cfg) {
				result.resolve(cfg);
			});
		return result.promise();
	}


	// ==========================================================================================


	CodeInspection.register("javascript", {
		name: JSCS_NAME,
		scanFile: handleJSXJSCS,
		scanFileAsync: handleJSXJSCSAsync
	});

	CodeInspection.register("jsx", {
		name: JSCS_NAME,
		scanFile: handleJSXJSCS,
		scanFileAsync: handleJSXJSCSAsync
	});
});