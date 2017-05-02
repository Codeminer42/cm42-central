# Changelog

## [Unreleased]
### Fixed
- Remove the API module used in `using` params into Project Entity
- Clean up DatabaseCleaner config

### Added
- tag group form
- Project now uses yarn 

## [1.3.0] - 2017-04-25
### Added
- The option to each project has its own tag group
- Links to stories within the same project can be added to a story description.

### Fixed
- Docker setup for development env.
- User list refreshing when adding or removing team members

## [1.2.0] - 2017-04-7
### Changed
- Redirect automatically to project#index after the user authentication, when there is only one team on enrollments
- **Increase decimal precision from Stories position**
- Change story controls to react component

## [1.1.3] - 2017-03-30
### Changed
- Central-Support gem version updated to fix volatility issues

## [1.1.2] - 2017-03-30
### Added
- Option on stories to show their activity history.

### Changed
- Fix docker setup for development mode.
- Fix bug keeping .story-controls disabled after a failed upload.
- Added ES2015 support
- Improve project list

## [1.1.1] - 2017-03-14
### Changed
- Stories drag and drop bug fixed

## [1.1.0] - 2017-03-09
### Added
- User Endpoint
- Integrations in Project Endpoint
- Sidebar option to invert columns order.

### Changed
- Refactor /admin/users views using a Presenter.

## [1.0.0] - 2017-02-15
### Added
- Added a changelog. We will keep tracking from now and on!
- Added translations on reports description.

### Changed
- Redesign project reports and edit password pages.
- Redesign Admin Users pages.
- Changed the design of the edit teams page

### Fixed
- Fix a locale select bug to make the options visible on a dark navbar.
- Some improvements to fix some issues reported by codeclimate.

The format is based on [Keep a Changelog](http://keepachangelog.com)
and this project adheres to [Semantic Versioning](http://semver.org).

[Unreleased]: https://github.com/Codeminer42/cm42-central/compare/v1.3.0...HEAD
[1.0.0]: https://github.com/Codeminer42/cm42-central/tree/v1.0.0
[1.1.0]: https://github.com/Codeminer42/cm42-central/tree/v1.1.0
[1.1.1]: https://github.com/Codeminer42/cm42-central/tree/v1.1.1
[1.1.2]: https://github.com/Codeminer42/cm42-central/tree/v1.1.2
[1.1.3]: https://github.com/Codeminer42/cm42-central/tree/v1.1.3
[1.2.0]: https://github.com/Codeminer42/cm42-central/tree/v1.2.0
[1.3.0]: https://github.com/Codeminer42/cm42-central/tree/v1.3.0
