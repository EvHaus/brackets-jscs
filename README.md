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

Release Notes
=====

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

Credit
=====

Based heavily on [brackets-jshint](https://github.com/cfjedimaster/brackets-jshint/).