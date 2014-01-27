brackets-jscs
=================

A Brackets extension that enables JSCS validation for Javascript files. For more information about JSCS see <https://github.com/mdevils/node-jscs>.

JSCS can be configured by a .jscs.json file located in the project root directory.

Issues/Updates
=====

The extension currently works with the Brackets master branch and should work in Sprint 36 (pending official release of [PR #5935](https://github.com/adobe/brackets/pull/5935)).

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