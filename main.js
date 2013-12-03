/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, brackets, define */

define(function (require, exports, module) {
	"use strict";

	var AppInit = brackets.getModule("utils/AppInit"),
		CodeInspection = brackets.getModule("language/CodeInspection"),
		FileSystem = brackets.getModule("filesystem/FileSystem"),
		ProjectManager = brackets.getModule("project/ProjectManager"),
		DocumentManager = brackets.getModule("document/DocumentManager"),
		
		JscsStringChecker = require("jscs/jscs-browser"),
		
		_configFileName = ".jscs.json",
		
		defaultConfig = {
			disallowMultipleVarDecl: true
		},
		config = defaultConfig;

	
	// JSCSParser()
	// Main function for the Brackets Linting API
	//
	// @param	text		string		The string of code to validate
	// @param	fullpath	string		File path to the file
	//
	function JSCSParser(text, fullPath) {
		var checker;
		
		// Initialize JSCS
		try {
			checker = new JscsStringChecker();
			checker.registerDefaultRules();
			checker.configure(config);
		} catch (e) {
			console.error("JSCS Failed to initialize: " + e);
			return;	
		}
		
		// Run JSCS
		var errors = checker.checkString(text),
			errList = errors.getErrorList();
		
		var result = {
			errors: []
		};
		
		// Get errors
		if (errList.length) {
			errList.forEach(function(error) {
				result.errors.push({
					pos: {
						line: error.line,
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
	}
	

	// _loadProjectConfig()
	// Loads project-wide JSCS configuration.
	//
	// JSCS project file should be located at <Project Root>/.jscs.json. It
	// is loaded each time project is changed or the configuration file is
	// modified.
	//
	// @return Promise to return JSCS configuration object.
	//
	function _loadProjectConfig() {

		var projectRootEntry = ProjectManager.getProjectRoot(),
			result = new $.Deferred(),
			file,
			config;
		
		file = FileSystem.getFileForPath(projectRootEntry.fullPath + _configFileName);
		file.read(function (err, content) {
			if (!err) {
				var cfg = {};
				
				try {
					config = JSON.parse(content);
				} catch (e) {
					console.error("JSCS: Error parsing " + file.fullPath + ". Details: " + e);
					result.reject(e);
					return;
				}
				
				result.resolve(config);
			} else {
				result.reject(err);
			}
		});
		return result.promise();
	}
	

	// tryLoadConfig()
	// Attempts to load project configuration file.
	//
	function tryLoadConfig() {
		function _refreshCodeInspection() {
			CodeInspection.toggleEnabled();
			CodeInspection.toggleEnabled();
		}
		
		_loadProjectConfig()
			.done(function (newConfig) {
				config = newConfig;
			})
			.fail(function () {
				config = defaultConfig;
			})
			.always(function () {
				_refreshCodeInspection();
			});
	}
	

	AppInit.appReady(function () {
		
		CodeInspection.register("javascript", {
			name: "JSCS",
			scanFile: JSCSParser
		});
		
		$(DocumentManager)
            .on("documentSaved.jscs documentRefreshed.jscs", function (e, document) {
                if (document.file.fullPath === ProjectManager.getProjectRoot().fullPath + _configFileName) {
                    tryLoadConfig();
                }
            });
        
        $(ProjectManager)
            .on("projectOpen.jscs", function () {
                tryLoadConfig();
            });
        
        tryLoadConfig();
	});

});