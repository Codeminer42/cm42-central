Feature: Admins can add users to projects
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        | admin |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project | true  |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     |                 | false |

    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    When I follow "Members"

  Scenario: Admin sees list of members for project
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    When I follow "Members"
    Then I should see the following project members:
      | Micah Geisel | micah@botandrose.com |
    And I should see the following available members:
      | Michael Gubitosa | gubs@botandrose.com  |

  Scenario: Admin adds an existing user to project
    When I fill in "Email" with "gubs@botandrose.com"
    And I press "Add user"
    Then I should see "gubs@botandrose.com was added to this project"
    And I should see the following project members:
      | Micah Geisel     | micah@botandrose.com |
      | Michael Gubitosa | gubs@botandrose.com  |

  Scenario: Admin invites a new user to project, who accepts and creates account
    When I fill in "Email" with "lindsay@gmail.com"
    And I press "Add user"
    Then I should see "lindsay@gmail.com was not found."

    When I fill in the following form:
      | Name     | Lindsay Caron |
      | Initials | LC            |
      | Username | lindsay       |
      | Role     | Manager       |
    And I press "Create and invite user"
    Then I should see "lindsay@gmail.com was invited to this project"
    And I should see the following project members:
      | Lindsay Caron (pending) | lindsay@gmail.com    |
      | Micah Geisel            | micah@botandrose.com |
    And "lindsay@gmail.com" should receive an email from "noreply@tracker.botandrose.com" with the subject "You have been invited to join BARD Tracker" and the following body:
      """
      Hello, Lindsay Caron!

      You have been invited to join BARD Tracker.

      Please click on the following link to accept your invitation:

      https://tracker.botandrose.com/invitations/
      """

    Given I am logged out
    When I follow the first link in the email
    Then I should see "Welcome, Lindsay Caron!"

    When I fill in the following form:
      | New password         | secret! |
      | Confirm new password | secret! |
    And I press "Confirm new password"
    Then I should see "Your password was changed successfully."
    And I should see the following project board:
      | Done | Todo | Icebox |

    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    When I follow "Members"
    Then I should see the following project members:
      | Lindsay Caron | lindsay@gmail.com    |
      | Micah Geisel  | micah@botandrose.com |

