class DefaultEmailPrefsToTrue < ActiveRecord::Migration[4.2]
  def self.up
    User.where('email_delivery IS NULL or email_acceptance IS NULL OR email_rejection IS NULL').each do |u|
      u.update email_delivery: true, email_acceptance: true, email_rejection: true
    end
  end

  def self.down
  end
end
