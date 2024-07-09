Feature: Stories can be added
  Background:
    Given today is "2024-05-13"
    And the following users exist:
      | email                | name             | initials | username | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Example Project |
    And the "Example Project" project has the following stories:
      | type    | title      | state       | accepted_at |
      | feature | Accepted1  | accepted    | 2024-06-24  |
      | feature | Accepted2  | accepted    | 2024-06-17  |
      | feature | Accepted3  | accepted    | 2024-06-10  |
      | feature | Accepted4  | accepted    | 2024-06-03  |
      | feature | Accepted5  | accepted    | 2024-05-27  |
      | feature | Accepted6  | accepted    | 2024-05-20  |

    Given today is "2024-07-01"
    And I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page

  Scenario: See previous 4 iterations
    Then I should see the following project board:
      | Done          | Todo  | Icebox  |
      | F Accepted4   |       |         |
      | F Accepted3   |       |         |
      | F Accepted2   |       |         |
      | F Accepted1   |       |         |

  Scenario: Toggle all previous iterations
    When I uncheck "previous iterations"
    Then I should see the following project board:
      | Done          | Todo  | Icebox  |
      | F Accepted6   |       |         |
      | F Accepted5   |       |         |
      | F Accepted4   |       |         |
      | F Accepted3   |       |         |
      | F Accepted2   |       |         |
      | F Accepted1   |       |         |
