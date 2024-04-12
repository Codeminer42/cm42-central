Feature: Stories have a lifecycle
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

  Scenario: Take a story through its entire lifecycle
    Given I am logged in as "micah@botandrose.com"
    And I am on the "Example Project" project page
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

