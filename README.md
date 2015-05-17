brackets-jscs
=================

A Brackets extension that enables JSCS validation for Javascript files. For more information about JSCS see <https://github.com/mdevils/node-jscs>.

JSCS can be configured by a .jscsrc or .jscs.json file located somewhere in your project.

Requirements
=====

Brackets 1.2.0 or greater

Installation
=====

The extension assumes you have JSCS installed as a global NPM module. If it isn't simply run this first:

```
npm install -g jscs
```

If you have disabled the default Brackets JSLint service, you will need to manually enable JSCS in your prefs file:

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
"esprima": "esprima-fb"
```

Now your JSX syntax should be properly parsed by JSCS via this extension and the commandline JSCS parser.

Note about Additional Rules
=====

The extension supports the `additionalRules` for JSCS however, changes/additions/removals of additional rules will require your to close and restart Brackets before the extension will respect the changes.

Building This Extension
=====

```
npm install
grunt build
```

Credit
=====

Based heavily on [brackets-jshint](https://github.com/cfjedimaster/brackets-jshint/) and [brackets-eslint](https://github.com/zaggino/brackets-eslint)
