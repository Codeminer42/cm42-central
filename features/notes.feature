Feature: Stories can contain notes
  Background:
    Given the following users exist:
      | email                | name         | initials | teams | projects        |
      | micah@botandrose.com | Micah Geisel | MG       | BARD  | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title | state       |
      | feature | WOW   | unscheduled |

    And the "WOW" story has the following notes:
      | user | note           |
      | MG   | this is a note |

  Scenario: User adds note to a story
    Given I am logged in as "micah@botandrose.com"
    When I follow "Select project" within the "Example Project" project
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note | Micah Geisel |

    When I fill in "Notes" with "this is another note"
    And I press "Add note"

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note       | Micah Geisel |
      | this is another note | Micah Geisel |

  Scenario: User deletes note from a story
    Given I am logged in as "micah@botandrose.com"
    When I follow "Select project" within the "Example Project" project
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    Then I should see the following notes:
      | this is a note | Micah Geisel |
    When I follow "Delete" within the "this is a note" note
    And I open the "WOW" story
    Then I should see no notes

