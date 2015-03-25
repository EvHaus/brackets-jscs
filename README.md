brackets-jscs
=================

A Brackets extension that enables JSCS validation for Javascript files. For more information about JSCS see <https://github.com/mdevils/node-jscs>.

JSCS can be configured by a .jscs.json file located in the project root directory.

Requirements
=====

Brackets Sprint 37 or greater

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

Release Notes
=====

**v0.3.0** (2015-03-25)

- Upgrade to latest node-jscs
- Remove support for JSX Transformation. It was causing too many issues. The behaviour of this extension will now work the same as running JSCS on the command line. We're looking into whether or not Babel (https://babeljs.io/) may be a good alternative for handling JSX processing through JSCS. This should fix issues #16, #17 and #19.

**v0.2.2** (2015-03-12)

- Fix for #15 Trailing space in comment breaks brackets-jscs

**v0.2.1** (2015-02-27)

- Upgrade to latest node-jscs
- Whitespace is now trimmed from JSX files to fix whitespace errors during JSX->JS compilation

**v0.2.0** (2015-01-24)

- Extension now supports comments in the JSCS config files (Thanks to xlitter)

**v0.1.7** (2014-11-13)

- Enable JSXTransform harmony mode

**v0.1.6** (2014-11-13)

- Upgrade to latest node-jscs
- Upgrade React to v0.12
- All .js and .jsx files now run through the JSXTransformer first (as JSX files can no longer be identified)

**v0.1.5** (2014-10-18)

- Upgrade to node-jscs 1.7.3

**v0.1.4** (2014-09-26)

- Upgrade to node-jscs 1.6.2
- Add support for .jsx files

**v0.1.3** (2014-08-17)

- Upgrade to node-jscs 1.5.9

**v0.1.2** (2014-06-27)

- Upgrade to node-jscs 1.5.6 [Issue #10](https://github.com/globexdesigns/brackets-jscs/issues/10)

**v0.1.1** (2014-06-05)

- Upgrade to node-jscs 1.4.5 [Issue #9](https://github.com/globexdesigns/brackets-jscs/issues/9)
- Fix issue with .jscs.json not being recognized in subfolders [Issue #8](https://github.com/globexdesigns/brackets-jscs/issues/8)

**v0.1.0** (2014-05-11)

- Upgrade to node-jscs 1.4.2
- Added support for asynchronous linting [Issue #7](https://github.com/globexdesigns/brackets-jscs/issues/7)
- Will now properly lookup for configuration files starting from the current folder all the way up

**v0.0.9** (2014-04-18)

- Minor change to fix the package.json package name now that Brackets Extension registry allows you to remove extensions

**v0.0.8** (2014-04-05)

- Upgrade to node-jscs 1.3.0
- Fix for [Issue #5](https://github.com/globexdesigns/brackets-jscs/issues/5)

**v0.0.7** (2014-03-27)

- Added support for .jscsrc files [Issue #4](https://github.com/globexdesigns/brackets-jscs/issues/4)

**v0.0.6** (2014-01-29)

- Fix for [Issue #2](https://github.com/globexdesigns/brackets-jscs/issues/2)
- Temporarily changing extension package name back to incorrect value, pending response to [this thread](https://groups.google.com/forum/#!topic/brackets-dev/VK2T211fRx8)

**v0.0.5** (2014-01-25)

- Upgrade to node-jscs 1.2.4
- Remove default "disallowMultipleVarDecl" config
- Add support for "excludeFiles" option
- Fix for extension package name
- Added NOTICE for third-party licenses

**v0.0.4** (2014-01-09)

- Fixed bug with error line number being reported 1 line down

**v0.0.3** (2014-01-09)

- Updating to latest version of JSCS

**v0.0.2** (2013-12-15)

- Updating to latest version of JSCS

**v0.0.1** (2013-12-02)

- Initial release

Building This Extension
=====

```
npm install
bower install
grunt build
```

Credit
=====

Based heavily on [brackets-jshint](https://github.com/cfjedimaster/brackets-jshint/).
