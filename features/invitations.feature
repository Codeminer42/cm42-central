Feature: Stories can be added
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        | admin |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project | true  |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     |                 | false |

  Scenario: User adds an existing user to project
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    When I follow "Members"
    Then I should see the following project members:
      | Micah Geisel | micah@botandrose.com |
    And I should see the following available members:
      | Michael Gubitosa | gubs@botandrose.com  |

    When I fill in "Email" with "gubs@botandrose.com"
    And I press "Add user"
    Then I should see "gubs@botandrose.com was added to this project"
    And I should see the following project members:
      | Micah Geisel     | micah@botandrose.com |
      | Michael Gubitosa | gubs@botandrose.com  |

