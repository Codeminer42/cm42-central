Feature: Stories can be added
  Background:
    Given the following users exist:
      | email                | name             | initials | username | teams | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | BARD  | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | BARD  | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title | state       |
      | feature | WOW   | unscheduled |

  Scenario: User creates a story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I follow "Add story"
    Then I should see the following new story form:
      | Title        |             |
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
      | Done | Current          | Icebox      |
      |      | B WOW! MG finish | F WOW start |

    And "gubs@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW!" and the following body:
      """
      Bug WOW! was created by Micah Geisel (@micahg)

      description

      http://clients.botandrose.com/projects/example-project/stories/71
      """

    And "micah@botandrose.com" should receive no emails

