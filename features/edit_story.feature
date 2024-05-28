Feature: Stories can be edited
  Background:
    Given the following users exist:
      | email                | name         | initials | projects        |
      | micah@botandrose.com | Micah Geisel | MG       | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title | state       |
      | feature | WOW   | unscheduled |

  Scenario: User edits a story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Todo | Icebox      |
      |      |      | F WOW start |

    When I open the "WOW" story
    Then I should see the following "WOW" story form:
      | Title        | WOW         |
      | Story type   | feature     |
      | State        | unscheduled |
      | Requested by |             |
      | Owned by     |             |
      | Labels       |             |
      | Description  |             |

    When I fill in the following form:
      | Title        | WOW!         |
      | Story type   | bug          |
      | State        | started      |
      | Requested by | Micah Geisel |
      | Owned by     | Micah Geisel |
      | Labels       | test         |
      | Description  | description  |
    And I press "Save"
    Then I should see the following project board:
      | Done | Todo             | Icebox |
      |      | B WOW! MG finish |        |

