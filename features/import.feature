@vcr
Feature: Admins can import project from Pivotal Tracker via its API
  Background:
    Given the following users exist:
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

    When I follow "Import project" within the "Adapt2Play" pivotal project with a 600 second timeout
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
    And "lindsaycaron37@gmail.com" should receive 1 email

