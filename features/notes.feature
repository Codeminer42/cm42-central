Feature: Stories can contain notes
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title | state       |
      | feature | WOW   | unscheduled |

    And the "WOW" story has the following notes:
      | user | note           |
      | MG   | this is a note |

  Scenario: User adds note to a story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note | Micah Geisel |

    When I fill in "Notes" with "this is another note"
    And I press "Add note"
    Then I should see the following notes:
      | this is a note       | Micah Geisel |
      | this is another note | Micah Geisel |
    And "micah@botandrose.com" should receive no emails
    And "gubs@botandrose.com" should receive no emails

  Scenario: User tags another user in a note
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note | Micah Geisel |

    When I fill in "Notes" with "@gubs this is another note"
    And I press "Add note"
    Then I should see the following notes:
      | this is a note       | Micah Geisel |
      | @gubs this is another note | Micah Geisel |
    And "gubs@botandrose.com" should receive an email
    And "micah@botandrose.com" should receive no emails

  Scenario: User tags self in a note
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note | Micah Geisel |

    When I fill in "Notes" with "@micahg this is another note"
    And I press "Add note"
    Then I should see the following notes:
      | this is a note               | Micah Geisel |
      | @micahg this is another note | Micah Geisel |
    And "micah@botandrose.com" should receive an email
    And "gubs@botandrose.com" should receive no emails

  Scenario: User adds note to a story with attachment
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note | Micah Geisel |

    When I fill in "Notes" with "this is another note"
    And I attach "screenshot.png" to "Attachment(s)"
    And I press "Add note"
    Then I should see the following notes:
      | this is a note       | Micah Geisel |                |
      | this is another note | Micah Geisel | screenshot.png |

  Scenario: User deletes note from a story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note | Micah Geisel |
    When I follow "Delete" within the "this is a note" note
    Then I should see no notes

