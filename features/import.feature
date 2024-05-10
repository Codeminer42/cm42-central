@vcr
Feature: Admins can import project from Pivotal Tracker via its API
  Background:
    Given today is "2024-05-10"
    And the following users exist:
      | email                | name             | initials | username | admin |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Yes   | 
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Yes   | 

  Scenario: Admin imports a project from Pivotal Tracker
    Given I am logged in as "micah@botandrose.com"
    When I follow "Refresh"
    Then I should see the following importable projects:
      | AC Community Connections                |
      | Adapt2Play                              |
      | ARBOR Telehealth                        |
      | Art & Space Staging                     |
      | BARD gem                                |
      | Brian Porter                            |
      | Complexity Explorer                     |
      | David Rumsey                            |
      | David Rumsey - Interactive Walk-through |
      | David Rumsey - Terra                    |
      | Eboshi                                  |
      | Helga Van Helgenwagen                   |
      | JHU - Lives Saved                       |
      | Joseph Holmes                           |
      | K-State CMS                             |
      | METRC - NSAID                           |
      | METRC - NSAID Adjudication Sites        |
      | METRC - POvIV2                          |
      | METRC.ORG                               |
      | MIMIC                                   |
      | PALS                                    |
      | PEP                                     |
      | PEP - Diabetes                          |
      | Portland Duplex                         |
      | REC                                     |
      | Red Hat CMS                             |
      | REPAIR                                  |
      | Riverwest24                             |
      | Sharebears                              |
      | SMH Casting                             |
      | Take Charge                             |
      | TSN                                     |
      | Vagrant VM                              |

    When I follow "Import project" within the "Adapt2Play" pivotal project with a 30 second timeout
    Then I should see "Import from Pivotal Tracker"
    And I should see the following project import results:
      | Resource    | Count      |
      | Project     | ✓          |
      | Users       | 3 / 3      |
      | Stories     | 84 / 84    |
      | Tasks       | 0 / 0      |
      | Comments    | 308 / 308  |
      | Attachments | 41 / 41    |
      | Activities  | 988 / 1026 |

    And "micah@botandrose.com" should receive no emails
    And "gubs@botandrose.com" should receive no emails
    And "lindsaycaron37@gmail.com" should receive no emails

    When I follow "Visit imported project" with a 10 second timeout
    Then I should see the following project board:
      | Done                                                                                                               | Current                                                                                        | Icebox                                                                                   |
      | C If the URL does not literally state the resource, how can it still show up towards the top of Google Results? LC | F Optimize for mobile gubs                                                                     | F Show linked calendars on Organizations gubs start                                      |
      | C Survey to send to Adaptive Athletes for appropriate name options LC                                              | B About Page: wrong Insta Link gubs                                                            | F Update site fonts? gubs start                                                          |
      | C Switch to dartsass MG                                                                                            | F New homepage gubs                                                                            | C Transfer disabilityinspiration.com registration from Wordpress to Cloudflare? MG start |
      | F Redirect all other domains to adapt2play.org MG                                                                  | F Add "Organization Name" field to events gubs                                                 | C Open source? LC start                                                                  |
      | B mockup_form_for not working MG                                                                                   | F Some way to solicit feedback from users gubs                                                 |                                                                                          |
      | B link_to_current not working MG                                                                                   | B When I share an event, the image displayed is the sponsor listed in the margin. gubs         |                                                                                          |
      | B bard data broken MG                                                                                              | B Multiple Events on a Day UX gubs                                                             |                                                                                          |
      | F Design application layout gubs                                                                                   | F Re-calibrate search distance options MG finish                                               |                                                                                          |
      | B Can't deploy MG                                                                                                  | B Clone function no bueno MG finish                                                            |                                                                                          |
      | B Fix FOUT gubs                                                                                                    | F Basic organization create / edit / delete functionality MG finish                            |                                                                                          |
      | F Events page MG                                                                                                   | F Organizations can add events from iCal URL gubs start                                        |                                                                                          |
      | F Set up work email address LC                                                                                     | R MVP - Present at Wellness Business Networking Event start                                    |                                                                                          |
      | C How does event sorting work? LC                                                                                  | F Do we actually need the event sorting? LC start                                              |                                                                                          |
      | F Set up adapt2play.org MG                                                                                         | F Show associated events on Organizations gubs start                                           |                                                                                          |
      | F Events can be filtered by tag gubs                                                                               | F Masthead slideshow? LC start                                                                 |                                                                                          |
      | B Excessive space in events sort by options gubs                                                                   | F Require valid address for creating an event MG start                                         |                                                                                          |
      | F Advertising gubs                                                                                                 | F Patreon: Yes please! LC start                                                                |                                                                                          |
      | F About page gubs                                                                                                  | F Delete orphaned tags MG start                                                                |                                                                                          |
      | F Events can be filtered by date range MG                                                                          | F Add "Organized by" prefix text to organization name on event index and show views gubs start |                                                                                          |
      | F Add MP4 video to About page LC                                                                                   | F Change "export" buttons' texts gubs start                                                    |                                                                                          |
      | F Create / Manage Events MG                                                                                        | F Use taggle for event tags MG start                                                           |                                                                                          |
      | F Style flash alerts gubs                                                                                          | F Allow commenting on events start                                                             |                                                                                          |
      | B Text areas are using markdown MG                                                                                 | F CMS About page start                                                                         |                                                                                          |
      | B Editing events loses location and times MG                                                                       | F Social buttons to share events gubs start                                                    |                                                                                          |
      | F Rebrand site with new Adapt2Play name LC                                                                         | F Events can repeat? gubs start                                                                |                                                                                          |
      | F Basic filtering of events by location MG                                                                         | F Redesign layout with red gubs start                                                          |                                                                                          |
      | F Upgrade About Page gubs                                                                                          | F Accessibility LC start                                                                       |                                                                                          |
      | F Add "add your own tags" help text to event form gubs                                                             | F Filterable directory of organizations start                                                  |                                                                                          |
      | F Remove hCalendar markup gubs                                                                                     | F Changing event form auto refreshes events start                                              |                                                                                          |
      | B Error when entering a non-location into the location field MG                                                    | C Get variable fonts working? MG start                                                         |                                                                                          |
      |                                                                                                                    | F Merchandise Page start                                                                       |                                                                                          |
      |                                                                                                                    | F Register as participant gubs start                                                           |                                                                                          |
      |                                                                                                                    | F Filterable directory of Adaptive Sports start                                                |                                                                                          |
      |                                                                                                                    | F Filterable directory of participants start                                                   |                                                                                          |
      |                                                                                                                    | F Event comments / discussions start                                                           |                                                                                          |
      |                                                                                                                    | F Auto import tags on source import? MG start                                                  |                                                                                          |
      |                                                                                                                    | F Add participants? gubs start                                                                 |                                                                                          |
      |                                                                                                                    | F Submit an advertisement start                                                                |                                                                                          |

    When I follow "Members"
    Then I should see the following project members:
      | Lindsay Caron (pending) | lindsaycaron37@gmail.com | REMOVE | SEND INVITATION EMAIL |
      | Micah Geisel            | micah@botandrose.com     | REMOVE |                       |
      | Michael Gubitosa        | gubs@botandrose.com      | REMOVE |                       |

    When I follow "Send invitation email"
    Then I should see "Invitation email sent to lindsaycaron37@gmail.com"
    And I should see the following project members:
      | Lindsay Caron (pending) | lindsaycaron37@gmail.com | REMOVE | RESEND INVITATION EMAIL |
      | Micah Geisel            | micah@botandrose.com     | REMOVE |                         |
      | Michael Gubitosa        | gubs@botandrose.com      | REMOVE |                         |

    And "lindsaycaron37@gmail.com" should receive 1 email

