brackets-jscs
=================

A Brackets extension that enables JSCS validation for Javascript files. For more information about JSCS see <https://github.com/mdevils/node-jscs>.

JSCS can be configured by a .jscs.json file located in the project root directory.

Requirements
=====

Brackets 1.2.0 or greater

Configuration Files
=====

This extension will search for a **.jscs.json** file in your project's root directory, if not found, it will look for a **.jscsrc** file in your project's root directory, and if that isn't found either, JSCS will use a default configuration spec with no rules defined.

Enabling the Extension
=====

If you have disabled the default Brackets JSLinting service, you will need to manually enable JSCS in your prefs file:

- Go to Debug > Open Preferences File
- Make sure your `language.javascript.linting.prefer` definition includes "JSCS" as such:

```
"language": {
	"javascript": {
		"linting.prefer": [
			"JSHint",
			"JSCS"
		]
	}
},
```

Using with JSX
=====

JSCS (and brackets-jscs) can be used to validate JSX files. First you'll need to install `esprima-fb' via:

```
npm install -g esprima-fb
```

Then in your .jscsrc file, add the following line:

```
"esprima": "./node_modules/esprima-fb"
```

Now your JSX syntax should be properly parsed by JSCS via this extension and the commandline JSCS parser.

Building This Extension
=====

```
npm install
grunt build
```

Credit
=====

Based heavily on [brackets-jshint](https://github.com/cfjedimaster/brackets-jshint/).
