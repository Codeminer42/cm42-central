Feature: Stories can be added
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title       | state       |
      | feature | Accepted    | accepted    |
      | feature | Rejected    | rejected    |
      | feature | Delivered   | delivered   |
      | feature | Finished    | finished    |
      | feature | Started     | started     |
      | feature | Unstarted   | unstarted   |
      | feature | Unscheduled | unscheduled |

  Scenario: User creates a story in the Todo column
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page

    When I click the "Add Story" label within the "Todo" column
    Then I should see the following new story form within the "Todo" column:
      | Title        |             |
      | Story type   | feature     |
      | State        | unstarted   |
      | Requested by |             |
      | Owned by     |             |
      | Labels       |             |
      | Description  |             |

    When I fill in the following form within the "Todo" column:
      | Title        | WOW!         |
      | Story type   | bug          |
      | State        | unstarted    |
      | Requested by | Micah Geisel |
      | Owned by     | Micah Geisel |
      | Labels       | test         |
      | Description  | description  |
    And I press "Save"

    Then I should see the following project board:
      | Done | Todo                      | Icebox              |
      |      | F Accepted                | F Unscheduled start |
      |      | F Rejected restart        |                     |
      |      | F Delivered accept reject |                     |
      |      | F Finished deliver        |                     |
      |      | F Started finish          |                     |
      |      | B WOW! MG start           |                     |
      |      | F Unstarted start         |                     |

    And "gubs@botandrose.com" should receive an email from "notifications@tracker.botandrose.com" with the subject "[Example Project] WOW!" and the following body:
      """
      Bug WOW! was created by Micah Geisel (@micahg)

      description

      http://tracker.botandrose.com/projects/example-project#story-8
      """

    And "micah@botandrose.com" should receive no emails

    When I press "start" within the "WOW!" story
    Then I should see the following project board:
      | Done | Todo                      | Icebox              |
      |      | F Accepted                | F Unscheduled start |
      |      | F Rejected restart        |                     |
      |      | F Delivered accept reject |                     |
      |      | F Finished deliver        |                     |
      |      | F Started finish          |                     |
      |      | B WOW! MG finish          |                     |
      |      | F Unstarted start         |                     |

  Scenario: User creates a story in the Icebox column
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page

    When I click the "Add Story" label within the "Icebox" column
    Then I should see the following new story form within the "Icebox" column:
      | Title        |             |
      | Story type   | feature     |
      | State        | unscheduled |
      | Requested by |             |
      | Owned by     |             |
      | Labels       |             |
      | Description  |             |

    When I fill in the following form within the "Icebox" column:
      | Title        | WOW!         |
      | Story type   | bug          |
      | State        | unscheduled  |
      | Requested by | Micah Geisel |
      | Owned by     | Micah Geisel |
      | Labels       | test         |
      | Description  | description  |
    And I press "Save"
    Then I should see the following project board:
      | Done | Todo                      | Icebox              |
      |      | F Accepted                | B WOW! MG start     |
      |      | F Rejected restart        | F Unscheduled start |
      |      | F Delivered accept reject |                     |
      |      | F Finished deliver        |                     |
      |      | F Started finish          |                     |
      |      | F Unstarted start         |                     |

    And "gubs@botandrose.com" should receive an email from "notifications@tracker.botandrose.com" with the subject "[Example Project] WOW!" and the following body:
      """
      Bug WOW! was created by Micah Geisel (@micahg)

      description

      http://tracker.botandrose.com/projects/example-project#story-8
      """

    And "micah@botandrose.com" should receive no emails

    When I press "start" within the "WOW!" story
    Then I should see the following project board:
      | Done | Todo                      | Icebox              |
      |      | F Accepted                | F Unscheduled start |
      |      | F Rejected restart        |                     |
      |      | F Delivered accept reject |                     |
      |      | F Finished deliver        |                     |
      |      | F Started finish          |                     |
      |      | B WOW! MG finish          |                     |
      |      | F Unstarted start         |                     |

