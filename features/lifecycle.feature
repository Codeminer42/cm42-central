Feature: Stories have a lifecycle
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Example Project |

  Scenario: Requester and owner take a story through its entire lifecycle
    Given I am logged in as "gubs@botandrose.com"
    And I am on the "Example Project" project page
    When I click the "Add Story" label within the "Icebox" column
    And I fill in the following form:
      | Title        | WOW              |
      | Estimate     | 0                |
      | Story type   | feature          |
      | Requested by | Michael Gubitosa |
    And I press "Save"
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |
    And "micah@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Feature WOW was created by Michael Gubitosa (@gubs)

      http://clients.botandrose.com/projects/example-project#story-1
      """
    And "gubs@botandrose.com" should receive no emails

    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    When I press "start" within the "WOW" story
    Then I should see the following project board:
      | Done | Current         | Icebox |
      |      | F WOW MG finish |        |
    And no emails should have been sent

    Given a clear email queue
    When I open the "WOW" story
    And I select "Michael Gubitosa" from "Owned by"
    And I press "Save"
    Then I should see the following project board:
      | Done | Current           | Icebox |
      |      | F WOW GUBS finish |        |
    And "gubs@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      You were added as a story owner to
      <a href="http://clients.botandrose.com/projects/example-project#story-1">WOW</a><br>
      by
      Micah Geisel
      (@micahg)<br>
      <br>
      <a href="http://clients.botandrose.com/projects/example-project#story-1">http://clients.botandrose.com/projects/example-project#story-1</a>
      """
    And "micah@botandrose.com" should receive no emails

    Given I am logged in as "gubs@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    When I open the "WOW" story
    And I select "Micah Geisel" from "Owned by"
    And I press "Save"
    Then I should see the following project board:
      | Done | Current         | Icebox |
      |      | F WOW MG finish |        |
    And "micah@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      You were added as a story owner to
      <a href="http://clients.botandrose.com/projects/example-project#story-1">WOW</a><br>
      by
      Michael Gubitosa
      (@gubs)<br>
      <br>
      <a href="http://clients.botandrose.com/projects/example-project#story-1">http://clients.botandrose.com/projects/example-project#story-1</a>
      """
    And "gubs@botandrose.com" should receive no emails

    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
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
    And "gubs@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Micah Geisel has delivered your story 'WOW'.

      You can now review the story, and either accept or reject it.

      http://clients.botandrose.com/projects/example-project#story-1
      """
    And "micah@botandrose.com" should receive no emails

    Given I am logged in as "gubs@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    When I press "reject" within the "WOW" story
    Then I should see the following project board:
      | Done | Current          | Icebox |
      |      | F WOW MG restart |        |
    And "micah@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Michael Gubitosa has rejected the story 'WOW'.

      http://clients.botandrose.com/projects/example-project#story-1
      """
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
    And "gubs@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Micah Geisel has delivered your story 'WOW'.

      You can now review the story, and either accept or reject it.

      http://clients.botandrose.com/projects/example-project#story-1
      """
    And "micah@botandrose.com" should receive no emails

    Given I am logged in as "gubs@botandrose.com"
    And I am on the "Example Project" project page
    And a clear email queue
    When I press "accept" within the "WOW" story
    Then I should see the following project board:
      | Done | Current  | Icebox |
      |      | F WOW MG |        |
    And "micah@botandrose.com" should receive an email from "notifications@clients.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Michael Gubitosa has accepted the story 'WOW'.

      http://clients.botandrose.com/projects/example-project#story-1
      """
    And "gubs@botandrose.com" should receive no emails

