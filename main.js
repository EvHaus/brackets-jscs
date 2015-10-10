/*global $, brackets, define*/

"use strict";

define(function (require, exports, module) {

	var CommandManager			= brackets.getModule('command/CommandManager'),
		Menus					= brackets.getModule('command/Menus'),
		DocumentManager			= brackets.getModule('document/DocumentManager'),
		EditorManager			= brackets.getModule('editor/EditorManager'),
		CodeInspection			= brackets.getModule('language/CodeInspection'),
		LanguageManager			= brackets.getModule('language/LanguageManager'),
		ExtensionUtils			= brackets.getModule('utils/ExtensionUtils'),
		NodeDomain				= brackets.getModule('utils/NodeDomain'),
		JS_LANGUAGE				= LanguageManager.getLanguageForExtension('js'),
		AUTOFIX_COMMAND_ID		= "brackets-jscs.autofix",
		AUTOFIX_COMMAND_NAME	= "Auto-fix with JSCS",
		LINTER_NAME				= "JSCS",
		ExtDomain				= ExtensionUtils.getModulePath(module, 'domain'),
		nodeDomain				= new NodeDomain('globexdesigns.brackets-jscs', ExtDomain);

	// =================================================================================

	/**
	 * This will map JSCS error output to match format expected by Brackets linter API.
	 *
	 * @param	{?array}		[results]		- Results object from JSCS's checkFile method
	 *
	 * @returns {object} Brackets lint object
	 */
	var remapResults = function (results) {
		return {
			errors: (results || []).map(function (result) {
				var message = result.message,
					isConfigError = result.rule === "";

				if (result.rule) message += ' [' + result.rule + ']';
				return {
					message: message,
					pos: {
						line: isConfigError ? -1 : result.line - 1,
						ch: isConfigError ? -1 : result.column
					},
					type: CodeInspection.Type.ERROR
				};
			})
		};
	};

	/**
	 * Handler for the "Auto-fix with JSCS" command
	 * @returns {void}
	 */
	var handleAutoFix = function () {
		var doc			= DocumentManager.getCurrentDocument(),
			language	= doc.getLanguage(),
			fileType	= language._id,
			fullPath	= doc.file.fullPath,
			editor		= EditorManager.getCurrentFullEditor(),
			cursor		= editor.getCursorPos(),
			scroll		= editor.getScrollPos();

		// Do nothing unless it's a Javascript file
		if (fileType !== 'javascript') return;

		nodeDomain.exec('fixFile', doc.getText(), fullPath)
			.then(function (response) {
				doc.setText(response);

				// Reset editor back to previous cursor position
				editor.setCursorPos(cursor);
				editor.setScrollPos(scroll.x, scroll.y);
			}/* TODO: Error handling?*/);
	};

	/**
	 * Handler for Brackets Linting API in synchronous mode
	 *
	 * @param	{string}	text		- Code text to lint
	 * @param	{string}	fullPath	- Path to the current file
	 *
	 */
	var handleLintSync = function (text, fullPath) {
		throw new Error('JSCS is not available in synchronous mode, use async for ' + fullPath);
	};

	/**
	 * Handler for Brackets Linting API in asynchronous mode
	 *
	 * @param	{string}	text		- Code text to lint
	 * @param	{string}	fullPath	- Path to the current file
	 *
	 * @returns {Promise} Promise object
	 */
	var handleLintAsync = function (text, fullPath) {
		var deferred = new $.Deferred();

		nodeDomain.exec('lintFile', fullPath)
			.then(function () {
				return deferred.reject();
			}, function (err) {
				if (typeof err === 'string') {
                    var message = "Unexpected JSCS processing error: " + err;
                    if (err.indexOf('Unable to load one of the modules') >= 0) {
                        message = "JSCS has not been installed in the extension. See Installation steps here: https://github.com/globexdesigns/brackets-jscs";
                    }
                    
					return deferred.resolve({
						errors: [{
							pos: {
								line: -1,
								ch: -1
							},
							message: message
						}]
					});
				}

				// If we got back an empty error object - just convert it to an empty array
				if (typeof err === 'object' && !Array.isArray(err)) err = [];

				deferred.resolve(remapResults(err));
			});

		return deferred.promise();
	};

	// =================================================================================

	// Register the auto-fix command
	CommandManager.register(AUTOFIX_COMMAND_NAME, AUTOFIX_COMMAND_ID, handleAutoFix);

	// Add to Edit menu
	var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
	editMenu.addMenuDivider();
	editMenu.addMenuItem(AUTOFIX_COMMAND_ID);

	// Add context-menu option (only for Javascript files)
	var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
	contextMenu.addMenuItem(AUTOFIX_COMMAND_ID);

	// Register a linter with CodeInspection
	CodeInspection.register(JS_LANGUAGE.getId(), {
		name: LINTER_NAME,
		scanFile: handleLintSync,
		scanFileAsync: handleLintAsync
	});

	LanguageManager.getLanguage('json').addFileName('.jscsrc');
});
