# Changelog

## [Unreleased]

### Fixed
- Adjusted README to use yarn install instead npm install on project setup
- Remove auto scroll to bottom when adding a story and highlights it instead
- Fix a bug in stories movement, now this action doesn't select the stories texts

## [1.16.1] 2018-01-03
### Fixed
- Add jquery-ui to fit cloudinary-js missing dependency
- Preload tag_group in projects query on projects controller
- Sort all stories in backlog to keep intended priority

## [1.16.0] 2017-11-28
### Added
- Auto collapse done stories.
- Ability to drag stories from the epic column.

### Changed
- Updated rails to 4.2.7.1
- Updated rubocop to 0.49.1

### Fixed
- Webpack manifest host path set to localhost, so webpack pack file load on Windows is fixed
- Highlight the searched stories not behaving properly.

## [1.15.0] 2017-10-30
### Added
- Added the option to clone a story.
- Contextual search using operands.

### Changed
- Updated central-support gem version, so Slack can be used in integrations here now.
- Updated central-support gem version, to fix story cache_names bug when it was removed

### Fixed
- Tasks labels aren't escaping special characters anymore.
- Activities from a story is now showing correctly to non-admins project members

## [1.14.0] 2017-10-18
### Added
- Added adminer service to docker-compose.
- Added nginx proxy to docker-compose, to enable us to use custom domain names on development.

### Changed
- Changes on the style of the estimation form, on a story card.
- Changes the order which stories appear in the chilly bin column

### Fixed
- Show the form to estimate a task without having to open it
- Search results column being cleared after dragging a story between columns
- Search results wrongly appearing during searches
- Updated "central-support" gem to fix the volatility calculation.

## [1.13.0] 2017-10-11
### Fixed
- On projects index, velocity is not always falling to fallback value anymore
- Story Attachments not being properly uploaded
- Update central-support gem version which fixes velocity calculations
- Update velocity calculation on the dashboard

### Added
- Changes to the browser tab as a notification of a change
- User is able to drag and drop stories from search column.

## [1.12.0] 2017-09-26
### Changed
- Updated the favicon with the current logo
- Update Heroku stack

### Fixed
- Minor UI glitches on smaller screen resolutions

## [1.11.0] 2017-09-19
### Added
- Burn Down chart
- Highlights the release stories if the release date is compromised
- User impersonate gem for debugging purposes

### Changed
- Update cm42-central-support version to save delivered_at

### Fixed
- Fix webpack entry files
- Bring back description component when story type is release
- Show story errors on save failures
- Don't duplicate a story after save process fails once

## [1.10.0] 2017-09-13
### Fixed
- Allowed params to update project via API
- Fix central manage login and logout bugs

### Added
- Don't show projects to guests that he's not member of
- Disallow guests to make changes on projects

## [1.9.0] 2017-09-11
### Changed
- Changing `webpack-rails` gem to new `webpacker` gem

## [1.8.0] 2017-09-06
### Added
- Action into API to update project
- ENV variable to check if the captcha is enable

### Changed
- Adjust ESLint config and solve issues

## [1.7.0] 2017-09-04
### Added
- Enables rubocop Metrics/AbcSize
- Enabled PerceivedComplexity rubocop metric
- Enabled CyclomaticComplexity rubocop metric
- Added flag to mail reports
- Enabled AndOr rubocop style
- Enabled BlockNesting rubocop metric
- Enabled RedundantReturn rubocop style

### Changed
- Move users/form from projects to teams

## [1.6.0] 2017-08-22
### Added
- Discord integration

### Changed
- Story tasks to react components
- Story attachments input to react component
- Story description to react component
- Updated central-support gem to enable discord webhook integration support

### Fixed
- Fixing compatibility of docker-composer with webpack
- Fixing 'stop loading when save' javascript spec

## [1.5.0] 2017-06-23
### Added
- Story History is now able to listen for changes on the story
- Codeclimate file with engines and removed files from analysis

### Changed
- Story type select to react component
- Story state select into react component
- Story requested_by select to react component
- Move select components to renderSelects function
- Story owned_by select to react component
- Alter route button Manage Members Team and associate user in team
- Story notes into react components
- Story labels to react component

### Fixed
- Story History bug when story actions where triggered
- Ticket not being reassigned to current user when state change to "started"
- Fix permission users to update others users
- Fix action create in user_policy

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

[Unreleased]: https://github.com/Codeminer42/cm42-central/compare/v1.16.1...HEAD
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
[1.5.0]: https://github.com/Codeminer42/cm42-central/tree/v1.5.0
[1.6.0]: https://github.com/Codeminer42/cm42-central/tree/v1.6.0
[1.7.0]: https://github.com/Codeminer42/cm42-central/tree/v1.7.0
[1.8.0]: https://github.com/Codeminer42/cm42-central/tree/v1.8.0
[1.9.0]: https://github.com/Codeminer42/cm42-central/tree/v1.9.0
[1.10.0]: https://github.com/Codeminer42/cm42-central/tree/v1.10.0
[1.11.0]: https://github.com/Codeminer42/cm42-central/tree/v1.11.0
[1.12.0]: https://github.com/Codeminer42/cm42-central/tree/v1.12.0
[1.13.0]: https://github.com/Codeminer42/cm42-central/tree/v1.13.0
[1.14.0]: https://github.com/Codeminer42/cm42-central/tree/v1.14.0
[1.15.0]: https://github.com/Codeminer42/cm42-central/tree/v1.15.0
[1.16.0]: https://github.com/Codeminer42/cm42-central/tree/v1.16.0
[1.16.1]: https://github.com/Codeminer42/cm42-central/tree/v1.16.1
