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
      | Done | Current | Icebox      |
      |      |         | F WOW start |

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
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |

    When I fill in "Comments" with "@gubs this is another comment"
    And I press "Add comment"
    Then I should see the following comments:
      | this is a comment             | Micah Geisel |
      | @gubs this is another comment | Micah Geisel |
    And "gubs@botandrose.com" should receive an email
    And "micah@botandrose.com" should receive no emails

  Scenario: User tags self in a comment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |

    When I fill in "Comments" with "@micahg this is another comment"
    And I press "Add comment"
    Then I should see the following comments:
      | this is a comment               | Micah Geisel |
      | @micahg this is another comment | Micah Geisel |
    And "micah@botandrose.com" should receive an email
    And "gubs@botandrose.com" should receive no emails

  Scenario: User adds comment to a story with attachment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |

    When I fill in "Comments" with "this is another comment"
    And I attach "screenshot.png" to "Attachment(s)"
    And I press "Add comment"
    Then I should see the following comments:
      | this is a comment       | Micah Geisel |                |
      | this is another comment | Micah Geisel | screenshot.png |

  Scenario: User deletes comment from a story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following comments:
      | this is a comment | Micah Geisel |
    When I follow "Delete" within the "this is a comment" comment
    Then I should see no comments

  Scenario: User creates story with comment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page

    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |
    When I click the "Add Story" label within the "Icebox" column
    And I fill in the following form within the "Icebox" column:
      | Title    | With comment                  |
      | Comments | this is a comment on creation |
    And I press "Save"
    Then I should see the following project board:
      | Done | Current | Icebox               |
      |      |         | F With comment start |
      |      |         | F WOW start          |

    When I open the "With comment" story
    Then I should see the following comments:
      | this is a comment on creation | Micah Geisel |

