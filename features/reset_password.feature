Feature: Reset password
  Background:
    Given the following users exist:
      | email                | name             | initials | username | projects        |
      | micah@botandrose.com | Micah Geisel     | MG       | micahg   | Example Project |
      | gubs@botandrose.com  | Michael Gubitosa | GUBS     | gubs     | Example Project |

  Scenario: User can request password reset
    Given I am on the homepage
    When I follow "Forgot your password"
    And I fill in "Email" with "gubs@botandrose.com"
    And I press "Send me reset password instructions"

    Then "gubs@botandrose.com" should receive an email from "noreply@tracker.botandrose.com" with the subject "[BARD Tracker] Password reset instructions" and the following html body:
      """
      Password Reset Instructions
      
      
        A request to reset your password has been made. If you did not make
        this request, simply ignore this email. If you did make this
        request, please follow the link below.
      
      
      Reset Password
      """
    When I follow the first link in the email
    And I fill in "New password" with "newpassword"
    And I fill in "Confirm new password" with "newpassword"
    And I press "Confirm new password"
    Then I should see "Your password was changed successfully. You are now signed in."

    When I follow "Log out" within the user dropdown menu
    Then I should see "Welcome to BARD Tracker"

    When I fill in "Email" with "gubs@botandrose.com"
    And I fill in "Password" with "newpassword"
    And I press "Log in"
    Then I should see "Signed in successfully."
