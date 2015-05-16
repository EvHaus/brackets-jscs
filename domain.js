/*eslint no-process-env:0*/
/*global require, exports*/

'use strict';

(function () {
	var oldNodePath = '',
		platform = process.platform,
		NODE_PATH = process.env.NODE_PATH;

	if (NODE_PATH) {
		oldNodePath = NODE_PATH + (platform === 'win32' ? ';' : ':');
	}

	if (platform === 'win32') {
		NODE_PATH = oldNodePath + process.env.APPDATA + '\\npm\\node_modules';
	} else if (process.platform === 'darwin') {
		NODE_PATH = oldNodePath + '/usr/local/lib/node_modules';
	} else {
		NODE_PATH = oldNodePath + '/usr/lib/node_modules';
	}

	require('module').Module._initPaths();

	var path = require('path'),
		Checker = require('jscs'),
		jscsConfig = require('jscs/lib/cli-config'),
		cli = new Checker(),
		currentProjectRoot = null,
		domainName = 'evnaverniouk.brackets-jscs';

	function _setProjectRoot(projectRoot) {

		cli = new Checker();
		console.log("NODE PATH", NODE_PATH)
		
		var config = jscsConfig.load(path.join(projectRoot, '.jscsrc'))
		
		cli.configure(config);
	}

	function lintFile(fullPath, projectRoot, callback) {
		if (projectRoot !== currentProjectRoot) {
			_setProjectRoot(projectRoot);
			currentProjectRoot = projectRoot;
		}

		return cli.checkPath(fullPath).then(function (response) {
			callback(response[0]._errorList);
		});
	}

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