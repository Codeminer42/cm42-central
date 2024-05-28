Feature: Users can search stories
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

  Scenario: User searches stories by title & description
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page

    When I fill in "Search" with "started" and press enter
    Then I should see the following project board:
      | Done | Todo                      | Icebox              | Search results    |
      |      | F Accepted                | F Unscheduled start | F Started finish  |
      |      | F Rejected restart        |                     | F Unstarted start |
      |      | F Delivered accept reject |                     |                   |
      |      | F Finished deliver        |                     |                   |
      |      | F Started finish          |                     |                   |
      |      | F Unstarted start         |                     |                   |

   # Scenario: User searches stories by owner

