# Changelog

## [Unreleased]

## [3.0.0] 2023-10-10

- Remove "Story attachments" feature
- Implement real-time updates in the beta board
- Refactor some components to be functional components

## [2.10.0] 2023-06-08

- Refactor Note Operations to use dry-monads
- Refactor Project Operations to use dry-monads
- Refactor Team Operations to use dry-monads
- Refactor Task Operations to use dry-monads
- Refactor Project Board Operations to use dry-monads
- Refactor Iteration Operations to use dry-monads
- Remove Grape Gem
- Add global message about attachments feature removal

## [2.9.0] 2023-05-26

- Migrate from Webpacker to Vite Ruby

## [2.8.0] 2023-05-15

- Update Ruby to version 2.7.8
- Upgrade Node to 16.20

## [2.7.3] 2023-05-09

- Refactor Story operations to use dry-monads

## [2.7.2] 2022-12-28

### Update

- Rails to 5.2.6.2
- Puma to 5.6.2

## [2.7.1] 2021-07-12

### Update

- Ruby to 2.6.8
- Rails to 5.2.5

## [2.7.0] 2021-07-12

### Fixed

- Bug when change release date of story.

### Added

- New position column to Story

### Changed

- Change drag and drop logic in beta version

## [2.6.0] 2020-03-11

### Added

- [ V2 ] Drag-n-drop

### Fixed

- Bug when change release date of story.

### Changed

- [ V2 ] When story is accepted and release it has a different background color.

## [2.5.0] 2020-01-17

### Removed

- Rewire and Rewire Webpack
- Inject loader
- Karma and all dependencies related

### Changed

- [ V2 ] When story is accepted it has a different background color.
- Unscheduled stories may or not may have a estimate.
- Chilly Bin column have stories with or no estimate.
- Migrate all the javascripts tests from jasmine to jest.

### Update

- Front-End Dependencies
- NodeJS from 9.11.2 to 10.17.0
- Webpack Dev Server from 3.1.14 to 3.9.0

### Added

- babel-jest and @testing-library/jest-dom
- [ V2 ] Dialog confirmation when story state is changed in expanded shape.
- [ V2 ] Spinner when project is loading.
- [ V2 ] User mention.
- [ V2 ] Button to reverse story flow.
- [ V2 ] Actor in history of changes.
- [ V2 ] Buttons to show and hide columns.

### Fixed

- [ V2 ] Internationalization date.
- [ V2 ] Sprints calc bug.

## [2.4.0] 2019-10-21

### Added

- [ V2 ] Search feature

### Changed

- The app will automatically switch between teams when a user opens a link to a project of a team that is not the current selected one

## [2.3.0] 2019-10-08

### Changed

- [ V2 ] Reversed the order of done column sprints

### Fixed

- [ V2 ] Remove redundant switch cases from the stories reducer.
- [ V2 ] Fix number, date and points of sprints.
- [ V2 ] Sprints are shown in easier order in "done" column

### Added

- [ V2 ] Add project navigation bar
- [ V2 ] Fetch and show stories on the done column
- [ V2 ] Story:
  - Stories of release type
  - Option to Clone Stories
  - Disable fields when story is read-only
  - Link directly to stories
  - History
- [ V2 ] Centralized notification system
- [ V2 ] Top nav

## [2.2.0] 2019-03-15

### Added

- [ V2 ] Story:
  - Stories can be updated when it's closed
- Block reserved words for new teams name
- Refactor `.csv` renderer

### Fixed

- Fix error in recaptcha when access page new team
- Fix team user not found in api request

## [2.1.0] 2019-02-20

### Update

- Front-End Dependencies
  - Webpack from 2.6.1 to 4.29.1
  - React from 15.4.2 to 16.8.0
  - Redux from 3.7.2 to 4.0.1
  - Babel from 6.25.0 to 7.2.2
- Test Dependencies
  - Enzyme from 2.7.1 to 3.8.0
  - Jasmine from 2.5.1 to 3.3.0
  - Karma from 1.3.0 to 4.0.0
  - Sinon from 2.0.0 to 7.2.3

### Fixed

- [ V2 ] Board style to permit scrolling
- Fix alert favicon in production environment
- Export projects with no stories

### Added

- [ V2 ] Story:
  - Attachments:
    - With this change makes it necessary to set unsigned upload in cloudinary and set the ENV `CLOUDINARY_UPLOAD_PRESET`. For help you can see [this](https://cloudinary.com/documentation/upload_images#unsigned_upload) tutorial.

## [2.0.1] 2019-01-31

### Fix

- Enable Sidekiq Delayed Extensions

## [2.0.0] 2019-01-31

### Added

- [ V2 ] Story:
  - Title;
  - Type;
  - Requested By;
  - Owned By;
  - Estimate;
  - Description;
  - State;
  - Save, Cancel and Delete;
  - Notes;
  - Tasks;
  - Labels;

### Fix

- [ V2 ] Refactor Redux flow to remove stories duplication
- Bug on unarchive projects
- Wrong serialization in JSON
- Amount of backlog points in reports page
- Bug on creating two teams with the same name

### Change

- Package: camelcase-object-deep: 1.0.7 to change-object-case: 0.2.0
- Due to the update of the recaptcha gem, changed recaptcha's ENV variable names from `PUBLIC_KEY` and `PRIVATE_KEY` to `SITE_KEY` and `SECRET_KEY` respectively.

### Update

- Package: sinon: 1.17.5 to 2.0.0
- Ruby from 2.3.1 to 2.6.0
- Rails from 4.2.11 to 5.2.1

## [1.22.0] 2018-11-30

### Added

- Added supports to upload libre office formats
- Imports/exports of stories
  - Documents
  - Tasks
- Added Popover when Story is collapsed in board V2
- Resouce to expand/collapse a story in board V2
- Button to copy story url to clipboard in board V2

### Changed

- Change estimate button to dynamic values when story is collapsed in board V2

### Fixed

- Fix imports notes of stories
- Fix project delete when tasks or notes are readonly
- Fix exporting unnecessary fields from documents and done to export in JSON
- Fix pusher missing api key
- Special character in project title

### Security

- Updated rails from 4.2.7.1 to 4.2.11 (CVE-2018-16476)
- Updated rack from 1.6.10 to 1.6.11 (CVE-2018-16471)
- Updated loofah from 2.2.2 to 2.2.3 (CVE-2018-16468)
- Updated nokogiri from 1.8.4 to 1.8.5 (CVE-2018-14404
  and CVE-2018-14567)
- Update gem rollbar from 2.13.3 to 2.18.0

## [1.21.1] 2018-10-18

### Fixed

- Fix stories in the done sprints

## [1.21.0] 2018-10-15

### Added

- Option to archive teams
- Added pusher-fake to the project
- Project delete confirmation
- Field velocity_strategy to projects

### Fixed

- Fixed locale change when accessing user edit page
- Fixed Project delete
- Fixed `story-description` and `.note` by adding to sortable column canceled elements/nodes
- Fix calculation of first sprint size

### Changed

- pusherSockets.js to allow empty pusher env vars

## [1.20.1] 2018-09-26

### Removed

- Remove Velocity / Volatility from ProjectCard to optimize performance

## [1.20.0] 2018-09-14

### Added

- New endpoint to update batch stories
- Replace polling with Pusher to fetch project updates

### Fixed

- StoryOperations reading refactored to optimize queries and performance
- Fixes the project export process, to properly generate the downloadable CSV file
- Fixes the rendering of charts

## [1.19.0] 2018-05-25

### Added

- New way to load past stories
- New route to destroy batch stories.
- Missing button titles in story component

### Fixed

- CVE-2018-1000119 issue, updating rack-protection gem
- CVE-2018-8048 issue, updating loofah gem

## [1.18.0] 2018-02-16

### Added

- Update attachinary options before it gets invalid.
- Added memcached service to docker-compose, now action import work well

### Changed

- Change in import project, switch button attachinary_file_field to file_field
- Change the verification to refuse if const files is null, otherwise return the value files
- Request signature for file uploads once and all stories get this from a global place

## [1.17.0] 2018-01-23

### Fixed

- Adjusted README to use yarn install instead npm install on project setup
- Remove auto scroll to bottom when adding a story and highlights it instead
- Fix a bug in stories movement, now this action doesn't select the stories texts

### Changed

- Moved the story estimate buttons to a react component.

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

### Changed

- Moved the story action state buttons to a react component.

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
- Fixing freeze from screen when create a new story

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
[1.17.0]: https://github.com/Codeminer42/cm42-central/tree/v1.17.0
[1.18.0]: https://github.com/Codeminer42/cm42-central/tree/v1.18.0
[1.19.0]: https://github.com/Codeminer42/cm42-central/tree/v1.19.0
[1.20.0]: https://github.com/Codeminer42/cm42-central/tree/v1.20.0
[1.20.1]: https://github.com/Codeminer42/cm42-central/tree/v1.20.1
[1.21.0]: https://github.com/Codeminer42/cm42-central/tree/v1.21.0
[1.21.1]: https://github.com/Codeminer42/cm42-central/tree/v1.21.1
[1.22.0]: https://github.com/Codeminer42/cm42-central/tree/v1.22.0
[2.0.0]: https://github.com/Codeminer42/cm42-central/tree/v2.0.0
[2.0.1]: https://github.com/Codeminer42/cm42-central/tree/v2.0.1
[2.1.0]: https://github.com/Codeminer42/cm42-central/tree/v2.1.0
[2.2.0]: https://github.com/Codeminer42/cm42-central/tree/v2.2.0
[2.3.0]: https://github.com/Codeminer42/cm42-central/tree/v2.3.0
[2.4.0]: https://github.com/Codeminer42/cm42-central/tree/v2.4.0
[2.5.0]: https://github.com/Codeminer42/cm42-central/tree/v2.5.0
[2.6.0]: https://github.com/Codeminer42/cm42-central/tree/v2.6.0
[2.7.0]: https://github.com/Codeminer42/cm42-central/tree/v2.7.0
[2.7.1]: https://github.com/Codeminer42/cm42-central/tree/v2.7.1
[2.7.2]: https://github.com/Codeminer42/cm42-central/tree/v2.7.2
[2.7.3]: https://github.com/Codeminer42/cm42-central/tree/v2.7.3
[2.8.0]: https://github.com/Codeminer42/cm42-central/tree/v2.8.0
[2.9.0]: https://github.com/Codeminer42/cm42-central/tree/v2.9.0
[2.10.0]: https://github.com/Codeminer42/cm42-central/tree/v2.10.0
[3.0.0]: https://github.com/Codeminer42/cm42-central/tree/v3.0.0
