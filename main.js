/*global $, brackets, define*/

"use strict";

define(function (require, exports, module) {

	var CodeInspection =	brackets.getModule('language/CodeInspection'),
		LanguageManager =	brackets.getModule('language/LanguageManager'),
		ProjectManager =	brackets.getModule('project/ProjectManager'),
		ExtensionUtils =	brackets.getModule('utils/ExtensionUtils'),
		NodeDomain =		brackets.getModule('utils/NodeDomain'),
		JS_LANGUAGE =		LanguageManager.getLanguageForExtension('js'),
		LINTER_NAME =		'JSCS',
		ExtDomain =			ExtensionUtils.getModulePath(module, 'domain'),
		nodeDomain =		new NodeDomain('evnaverniouk.brackets-jscs', ExtDomain);

	// This will map JSCS output to match format expected by Brackets
	function remapResults(results) {
		return {
			errors: results.map(function (result) {
				var message = result.message,
					isConfigError = result.rule === "";
				
				if (result.rule) message += ' [' + result.rule + ']';
				return {
					message: message,
					pos: {
						line: isConfigError ? -1 : result.line - 1,
						ch: isConfigError ? -1 : result.column
					},
					type: result.rule
				};
			})
		};
	}

	function handleLintSync(text, fullPath) {
		throw new Error('JSCS is not available in synchronous mode, use async for ' + fullPath);
	}

	function handleLintAsync(text, fullPath) {
		var deferred = new $.Deferred();
		var projectRoot = ProjectManager.getProjectRoot().fullPath;

		nodeDomain.exec('lintFile', fullPath, projectRoot)
			.then(function () {
				return deferred.reject();
			}, function (err) {
				if (typeof err === 'string') {
					return deferred.resolve({
						errors: [{
							pos: {
								line: -1,
								ch: -1
							},
							message: "Unexpected JSCS processing error: " + err
						}]
					});;
				}
				
				deferred.resolve(remapResults(err));
			});

		return deferred.promise();
	}

	// Register a linter with CodeInspection
	CodeInspection.register(JS_LANGUAGE.getId(), {
		name: LINTER_NAME,
		scanFile: handleLintSync,
		scanFileAsync: handleLintAsync
	});
});