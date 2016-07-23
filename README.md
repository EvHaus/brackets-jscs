brackets-jscs
=================

A Brackets extension that enables JSCS validation for Javascript files. For more information about JSCS see <https://github.com/jscs-dev/node-jscs>.

JSCS can be configured by a `.jscsrc` or `.jscs.json` file located somewhere in your project.

THIS EXTENSION IS BEING DEPRECATED
=====

This extension is going to be deprecated soon. JSCS is being merged into ESLint. As such, there is going to be no more need it. Use the wonderful [brackets-eslint](https://github.com/zaggino/brackets-eslint) extension instead.

I will still happily accept Pull Requests if you wish to fix issues, but I will no longer be actively working on it.

Requirements
=====

- [Brackets 1.2.0 or greater](http://brackets.io/)
- [node.js](https://nodejs.org/download/)

Installation
=====

- Install the extension from the Brackets Extension registry
- Go to `Help > Show Extensions Folder`
- In the extensions folder navigate to `/user/globexdesigns.brackets-jscs`
- Open a terminal to this folder and run `npm install`
- Restart Brackets

Configuration
=====

If you have disabled the default Brackets JSLint service, you will need to manually enable JSCS in your prefs file:

- Go to `Debug > Open Preferences File`
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

JSCS (and brackets-jscs) can be used to validate JSX files. To enable this, add this line to your `.jscsrc` file:

```
"esprima": "babel-jscs"
```

Note about Additional Rules
=====

The extension supports the `additionalRules` for JSCS however, changes/additions/removals of additional rules will require your to close and restart Brackets before the extension will respect the changes.

Building This Extension
=====

```
npm install
grunt build
```

A new ZIP package will be created in `/build/`.

Credit
=====

Based heavily on [brackets-jshint](https://github.com/cfjedimaster/brackets-jshint/) and [brackets-eslint](https://github.com/zaggino/brackets-eslint).
