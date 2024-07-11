Feature: Stories can contain comments
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title | state       |
      | feature | WOW   | unscheduled |

    And the "WOW" story has the following comments:
      | user | body              |
      | MG   | this is a comment |

  Scenario: User adds comment to a story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Todo | Icebox      |
      |      |      | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |

    When I fill in "Comments" with "this is another comment"
    And I press "Add comment"
    Then I should see the following comments:
      | this is a comment       | Micah Geisel |
      | this is another comment | Micah Geisel |
    And "micah@botandrose.com" should receive no emails
    And "gubs@botandrose.com" should receive no emails

  Scenario: User tags another user in a comment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Todo | Icebox      |
      |      |      | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |

    When I fill in "Comments" with "@gubs this is another comment"
    And I press "Add comment"
    Then I should see the following comments:
      | this is a comment             | Micah Geisel |
      | @gubs this is another comment | Micah Geisel |
    And "gubs@botandrose.com" should receive an email from "notifications@tracker.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Micah Geisel added the following comment to the story 'WOW':

      @gubs this is another comment

      http://tracker.botandrose.com/projects/example-project#story-1
      """
    And "micah@botandrose.com" should receive no emails

  Scenario: User tags self in a comment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Todo | Icebox      |
      |      |      | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |

    When I fill in "Comments" with "@micahg this is another comment"
    And I press "Add comment"
    Then I should see the following comments:
      | this is a comment               | Micah Geisel |
      | @micahg this is another comment | Micah Geisel |
    And "micah@botandrose.com" should receive an email from "notifications@tracker.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Micah Geisel added the following comment to the story 'WOW':

      @micahg this is another comment

      http://tracker.botandrose.com/projects/example-project#story-1
      """
    And "gubs@botandrose.com" should receive no emails

  Scenario: User adds comment to a story with attachment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Todo | Icebox      |
      |      |      | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |

    When I fill in "Comments" with "@gubs this is a comment with an attachment"
    And I attach "screenshot.png" to "Attachment(s)"
    And I press "Add comment"
    Then I should see the following comments:
      | Micah Geisel | this is a comment                          |                |
      | Micah Geisel | @gubs this is a comment with an attachment | screenshot.png |
    And "gubs@botandrose.com" should receive an email from "notifications@tracker.botandrose.com" with the subject "[Example Project] WOW" and the following body:
      """
      Micah Geisel added the following comment to the story 'WOW':

      @gubs this is a comment with an attachment

      Attachments:
      http://tracker.botandrose.com/rails/active_storage/blobs/redirect
      """
      # FIXME
      # /eyJfcmFpbHMiOnsiZGF0YSI6MSwicHVyIjoiYmxvYl9pZCJ9fQ==--833ecff332dc6d31906849d4f58409ab87bd6e6d/screenshot.png?disposition=attachment

      # http://tracker.botandrose.com/projects/example-project#story-1
      # """

  Scenario: User edits a comment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    And I open the "WOW" story
    Then I should see the following comments:
      | Micah Geisel | this is a comment |
    When I follow "Edit" within the "this is a comment" comment
    And I fill in "comment_body" with "edit comment" within the edit comment form
    And I press "Update comment"
    Then I should see the following comments:
      | Micah Geisel | edit comment |

  Scenario: User deletes comment from a story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Todo | Icebox      |
      |      |      | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |
    When I follow "Delete" within the "this is a comment" comment
    Then I should see no comments

  Scenario: User creates story with comment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page

    Then I should see the following project board:
      | Done | Todo | Icebox      |
      |      |      | F WOW start |
    When I click the "Add Story" label within the "Icebox" column
    And I fill in the following form within the "Icebox" column:
      | Title    | With comment                  |
      | Comments | this is a comment on creation |
    And I press "Save"
    Then I should see the following project board:
      | Done | Todo | Icebox               |
      |      |      | F With comment start |
      |      |      | F WOW start          |

    When I open the "With comment" story
    Then I should see the following comments:
      | this is a comment on creation | Micah Geisel |
