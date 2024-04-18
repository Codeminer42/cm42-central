Feature: Stories have a lifecycle
  Background:
    Given the following users exist:
      | email                | name         | initials | teams | projects        |
      | micah@botandrose.com | Micah Geisel | MG       | BARD  | Example Project |

    And the "Example Project" project has the following stories:
      | type    | title | state       |
      | feature | WOW   | unscheduled |

  Scenario: User adds note to a story
    Given I am logged in as "micah@botandrose.com"
    When I follow "Select project" within the "Example Project" project
    Then I should see the following project board:
      | Done | Current | Icebox      |
      |      |         | F WOW start |

    When I press "start" within the "WOW" story
    Then I should see the following project board:
      | Done | Current      | Icebox |
      |      | F WOW finish |        |

    When I press "finish" within the "WOW" story
    Then I should see the following project board:
      | Done | Current       | Icebox |
      |      | F WOW deliver |        |

    When I press "deliver" within the "WOW" story
    Then I should see the following project board:
      | Done | Current             | Icebox |
      |      | F WOW accept reject |        |

    When I press "reject" within the "WOW" story
    Then I should see the following project board:
      | Done | Current       | Icebox |
      |      | F WOW restart |        |

    When I press "restart" within the "WOW" story
    Then I should see the following project board:
      | Done | Current      | Icebox |
      |      | F WOW finish |        |

    When I press "finish" within the "WOW" story
    Then I should see the following project board:
      | Done | Current       | Icebox |
      |      | F WOW deliver |        |

    When I press "deliver" within the "WOW" story
    Then I should see the following project board:
      | Done | Current             | Icebox |
      |      | F WOW accept reject |        |

    When I press "accept" within the "WOW" story
    Then I should see the following project board:
      | Done | Current | Icebox |
      |      | F WOW   |        |

