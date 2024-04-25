Feature: Stories have a lifecycle
  Background:
    Given the following users exist:
      | email                | name             | initials | username | teams | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | BARD  | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | BARD  | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title | state       | requested_by |
      | feature | WOW   | unscheduled | gubs         |

  Scenario: Requester and owner take a story through its entire lifecycle
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |
    And no emails should have been sent

    Given a clear email queue
    When I press "start" within the "WOW" story
    Then I should see the following project board:
      | Done | Current         | Icebox |
      |      | F WOW MG finish |        |
    And no emails should have been sent

    Given a clear email queue
    When I press "finish" within the "WOW" story
    Then I should see the following project board:
      | Done | Current          | Icebox |
      |      | F WOW MG deliver |        |
    And no emails should have been sent

    Given a clear email queue
    When I press "deliver" within the "WOW" story
    Then I should see the following project board:
      | Done | Current                | Icebox |
      |      | F WOW MG accept reject |        |
    And "gubs@botandrose.com" should receive an email
    And "micah@botandrose.com" should receive no emails

    Given I am logged in as "gubs@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    When I press "reject" within the "WOW" story
    Then I should see the following project board:
      | Done | Current          | Icebox |
      |      | F WOW MG restart |        |
    And "micah@botandrose.com" should receive an email
    And "gubs@botandrose.com" should receive no emails

    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    When I press "restart" within the "WOW" story
    Then I should see the following project board:
      | Done | Current         | Icebox |
      |      | F WOW MG finish |        |
    And no emails should have been sent

    Given a clear email queue
    When I press "finish" within the "WOW" story
    Then I should see the following project board:
      | Done | Current          | Icebox |
      |      | F WOW MG deliver |        |
    And no emails should have been sent

    Given a clear email queue
    When I press "deliver" within the "WOW" story
    Then I should see the following project board:
      | Done | Current                | Icebox |
      |      | F WOW MG accept reject |        |
    And "gubs@botandrose.com" should receive an email
    And "micah@botandrose.com" should receive no emails

    Given I am logged in as "gubs@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    When I press "accept" within the "WOW" story
    Then I should see the following project board:
      | Done | Current  | Icebox |
      |      | F WOW MG |        |
    And "micah@botandrose.com" should receive an email
    And "gubs@botandrose.com" should receive no emails

