Change Log
=====

**v0.7.4** (2015-10-07)

- Upgrade to latest jscs (v2.3.0) (Fixes #35)

**v0.7.3** (2015-06-12)

- Fixed a syntax error

**v0.7.2** (2015-06-12)

- Fixed an issue with JSCS reporting timeouts when there are no errors found (Fixes #27)

**v0.7.1** (2015-05-26)

- Fix issue with extension printing a "checkPath not a valid function" error when a JSCS config file cannot be found
- Remove a setTimeout call to help avoid timeout issues

**v0.7.0** (2015-05-23)

- JSCS auto-fixing is now possible from Brackets. A new "Auto-fix with JSCS" option is now available in the Edit menu as well as in the editor context menu!

**v0.6.5** (2015-05-21)

- Bundle JSCS with the extension again. Global module imports refuse to work reliably. (I've admitted surrender).

**v0.6.4** (2015-05-20)

- Attempt to fix #24 by using zaggino's enable-global-packages module

**v0.6.3** (2015-05-17)

- Fix for globally installed JSCS. No longer need to bundle JSCS with the extension.

**v0.6.2** (2015-05-17)

- Another attempt to fix #23. JSCS is now bundled directly with the extension.

**v0.6.1** (2015-05-17)

- Attempt to fix #23

**v0.6.0** (2015-05-16)

- Minimum Brackets dependency change to v1.2.0
- Rewrite extension to make use of node-jscs node.js module (instead of browser build)
- Extension will now look for JSCS config files in all parent directories from the current file (Fixes #11)
- additionalRules is now supported (Fixes #6)

**v0.5.0** (2015-05-07)

- Upgrade to latest node-jscs (v1.13.1) (Fixes #22)

**v0.4.0** (2015-04-07)

- Add support for custom `esprima` paths in the .jscs file. This allows us to use this extension for JSX files

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
