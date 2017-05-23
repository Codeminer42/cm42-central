# Changelog

## [Unreleased]
### Added
- Story History is now able to listen for changes on the story

### Changed
- story type select to react component
- Story state select into react component
- Story requested_by select to react component
- Move select components to renderSelects function
- Alter route button Manage Members Team and associate user in team

### Fixed
- Story History bug when story actions where triggered
- Ticket not being reassigned to current user when state change to "started"

## [1.4.2] - 2017-05-24
### Removed
- YARN temporarily

## [1.4.1] - 2017-05-24
### Fixed
- Move "babel-preset-airbnb" outside devDependencies in package.json

## [1.4.0] - 2017-05-23
### Added
- tag group form
- Added First time tour.
- Basic style for Labels
- Slack Support
- Release date to Story
- Project now uses yarn

### Changed
- Story id, location and history input-form-group into a react component
- Story estimate select into a react component
- The attributes of a release story when creating or editing

### Fixed
- Remove the API module used in `using` params into Project Entity
- Clean up DatabaseCleaner config
- Admin assignment
- 'Velocity per member' report title translation
- Disable registration using enviroment variable `DISABLE_REGISTRATION`
- Display of throbber animated gif when adding a note or a task
- Labels autocomplete overflow

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

[Unreleased]: https://github.com/Codeminer42/cm42-central/compare/v1.4.2...HEAD
[1.0.0]: https://github.com/Codeminer42/cm42-central/tree/v1.0.0
[1.1.0]: https://github.com/Codeminer42/cm42-central/tree/v1.1.0
[1.1.1]: https://github.com/Codeminer42/cm42-central/tree/v1.1.1
[1.1.2]: https://github.com/Codeminer42/cm42-central/tree/v1.1.2
[1.1.3]: https://github.com/Codeminer42/cm42-central/tree/v1.1.3
[1.2.0]: https://github.com/Codeminer42/cm42-central/tree/v1.2.0
[1.3.0]: https://github.com/Codeminer42/cm42-central/tree/v1.3.0
[1.4.0]: https://github.com/Codeminer42/cm42-central/tree/v1.4.0
[1.4.1]: https://github.com/Codeminer42/cm42-central/tree/v1.4.1
[1.4.2]: https://github.com/Codeminer42/cm42-central/tree/v1.4.2
