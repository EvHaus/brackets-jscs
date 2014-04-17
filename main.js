/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, brackets, define */

define(function (require, exports, module) {
	"use strict";

	// Brackets Modules
	var AppInit			= brackets.getModule("utils/AppInit"),
		CodeInspection	= brackets.getModule("language/CodeInspection"),
		FileSystem		= brackets.getModule("filesystem/FileSystem"),
		ProjectManager	= brackets.getModule("project/ProjectManager"),
		DocumentManager	= brackets.getModule("document/DocumentManager"),
        globmatch       = brackets.getModule("thirdparty/globmatch"),
		
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
	
	
	/**
	 * Main function for the Brackets Linting API
	 * @method JSCSParser
	 * 
	 * @param	{string}	text		- The string of code to validate
	 * @param	{string}	fullPath	- File path to the file
	 * 
	 */
	function JSCSParser(text, fullPath) {
		var checker;
		
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
				errList.forEach(function(error) {
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
	
	
	// ==========================================================================================
	

	/**
	 * Loads project-wide JSCS configuration.
	 * @method loadProjectConfig
	 * 
	 * JSCS project file should be located at <Project Root>/.jscs.json. It
	 * is loaded each time project is changed or the configuration file is
	 * modified.
	 * 
	 * @param	{string}	file_name		- Name of file to try and load
	 * 
	 * @results {functions}	Promise to return JSCS configuration object.
	 * 
	 */
	function loadProjectConfig(file_name) {
		
		var result = new $.Deferred(),
			file = FileSystem.getFileForPath(file_name),
			cfg;
		
		file.read(function (err, content) {
			if (!err) {
				try {
					cfg = JSON.parse(content);
				} catch (e) {
					console.error("JSCS: Error parsing " + file.fullPath + ". Details: " + e);
					result.reject(e);
					return;
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
	 * Attempts to load project configuration file.
	 * @method tryLoadConfig
	 * 
	 * @param	{array}		file_paths		- List of file paths to try and load the config from
	 * 
	 */
	function tryLoadConfig(file_paths) {
		function _refreshCodeInspection() {
			CodeInspection.toggleEnabled();
			CodeInspection.toggleEnabled();
		}
		
		var tried = 0,
			loadConfig = function (index) {
				loadProjectConfig(file_paths[index])
					.done(function (newConfig) {
						if (newConfig.excludeFiles) {
							excludeFiles = newConfig.excludeFiles;
							delete newConfig.excludeFiles;
						}

						config = newConfig;
					})
					.fail(function () {
						tried++;

						// Try the next config
						if (tried < file_paths.length) {
							loadConfig(tried);
						} else {
							// If all config fail to load - load the default
							config = defaultConfig;
						}
					})
					.always(function () {
						_refreshCodeInspection();
					});	
			};
		
		// Try loading the first config
		loadConfig(tried);
	}
	
	
	// ==========================================================================================
	
	AppInit.appReady(function () {
		
		CodeInspection.register("javascript", {
			name: "JSCS",
			scanFile: JSCSParser
		});
		
		var config_paths = _configFileNames.map(function (fn) {
			return ProjectManager.getProjectRoot().fullPath + fn;
		});
		
		$(DocumentManager)
			.on("documentSaved.jscs documentRefreshed.jscs", function (e, document) {
				if (document.file && config_paths.indexOf(document.file.fullPath) < 0) {
					tryLoadConfig(config_paths);
				}
			});
		
		$(ProjectManager)
			.on("projectOpen.jscs", function () {
				tryLoadConfig(config_paths);
			});
		
		tryLoadConfig(config_paths);
	});
});