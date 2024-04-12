Feature: Stories can be deleted
  Background:
    Given the following users exist:
      | email                | name         | initials |
      | micah@botandrose.com | Micah Geisel | MG       |

    Given the following projects exist:
      | name            | users                |
      | Example Project | micah@botandrose.com |

    Given the following teams exist:
      | name | projects        | users                |
      | BARD | Example Project | micah@botandrose.com |

    And the "Example Project" project has the following stories:
      | type    | title | state       |
      | feature | WOW   | unscheduled |

  Scenario: Delete an existing story
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I open the "WOW" story
    And I press "Delete"
    Then I should see the following project board:
      | Done | Current | Icebox |

