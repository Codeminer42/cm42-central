Feature: Users can search stories
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title       | state       | owner  |
      | feature | Accepted    | accepted    | micahg |
      | feature | Rejected    | rejected    | gubs   |
      | feature | Delivered   | delivered   | micahg |
      | feature | Finished    | finished    | gubs   |
      | feature | Started     | started     | micahg |
      | feature | Unstarted   | unstarted   | gubs   |
      | feature | Unscheduled | unscheduled | micahg |

    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page

  Scenario: User searches stories by title & description
    When I fill in "Search" with "started" and press enter
    Then I should see the following project board:
      | Done | Todo                         | Icebox                 | Search results         |
      |      | F Accepted MG                | F Unscheduled MG start | F Started MG finish    |
      |      | F Rejected GUBS restart      |                        | F Unstarted GUBS start |
      |      | F Delivered MG accept reject |                        |                        |
      |      | F Finished GUBS deliver      |                        |                        |
      |      | F Started MG finish          |                        |                        |
      |      | F Unstarted GUBS start       |                        |                        |

  Scenario: User searches stories by owner
    When I fill in "Search" with "user:MG" and press enter
    Then I should see the following project board:
      | Done | Todo                         | Icebox                 | Search results               |
      |      | F Accepted MG                | F Unscheduled MG start | F Delivered MG accept reject |
      |      | F Rejected GUBS restart      |                        | F Started MG finish          |
      |      | F Delivered MG accept reject |                        | F Unscheduled MG start       |
      |      | F Finished GUBS deliver      |                        |                              |
      |      | F Started MG finish          |                        |                              |
      |      | F Unstarted GUBS start       |                        |                              |

    When I uncheck "1 accepted stories" within the "Search results" column
    Then I should see the following project board:
      | Done | Todo                         | Icebox                 | Search results               |
      |      | F Accepted MG                | F Unscheduled MG start | F Accepted MG                |
      |      | F Rejected GUBS restart      |                        | F Delivered MG accept reject |
      |      | F Delivered MG accept reject |                        | F Started MG finish          |
      |      | F Finished GUBS deliver      |                        | F Unscheduled MG start       |
      |      | F Started MG finish          |                        |                              |
      |      | F Unstarted GUBS start       |                        |                              |

