require "email_spec"
require "email_spec/cucumber"
require "nokogiri"

# Commonly used email steps
#
# To add your own steps make a custom_email_steps.rb
# The provided methods are:
#
# last_email_address
# reset_mailer
# open_last_email
# visit_in_email
# unread_emails_for
# mailbox_for
# current_email
# open_email
# read_emails_for
# find_email
#
# General form for email scenarios are:
#   - clear the email queue (done automatically by email_spec)
#   - execute steps that sends an email
#   - check the user received an/no/[0-9] emails
#   - open the email
#   - inspect the email contents
#   - interact with the email (e.g. click links)
#
# The Cucumber steps below are setup in this order.

module EmailHelpers
  def current_email_address
    # Replace with your a way to find your current email. e.g @current_user.email
    # last_email_address will return the last email address used by email spec to find an email.
    # Note that last_email_address will be reset after each Scenario.
    last_email_address || "example@example.com"
  end
end

World(EmailHelpers)

#
# Reset the e-mail queue within a scenario.
# This is done automatically before each scenario.
#

Given /^(?:a clear email queue|no emails have been sent)$/ do
  reset_mailer
end

#
# Check how many emails have been sent/received
#

Then /^(?:I|they|"([^"]*?)") should receive (an|no|\d+) emails?$/ do |address, amount|
  expect(unread_emails_for(address).size).to eql parse_email_count(amount)
end

Then /^(?:I|they|"([^"]*?)") should have (an|no|\d+) emails?$/ do |address, amount|
  expect(mailbox_for(address).size).to eql parse_email_count(amount)
end

Then /^(?:I|they|"([^"]*?)") should receive (an|no|\d+) emails? with subject "([^"]*?)"$/ do |address, amount, subject|
  expect(unread_emails_for(address).select { |m| m.subject =~ Regexp.new(Regexp.escape(subject)) }.size).to eql parse_email_count(amount)
end

Then /^(?:I|they|"([^"]*?)") should receive (an|no|\d+) emails? with subject \/([^"]*?)\/$/ do |address, amount, subject|
  expect(unread_emails_for(address).select { |m| m.subject =~ Regexp.new(subject) }.size).to eql parse_email_count(amount)
end

Then /^(?:I|they|"([^"]*?)") should receive an email with the following body:$/ do |address, expected_body|
  open_email(address, :with_text => expected_body)
end

Then /^"([^"]*)" should all receive an email from "([^"]*)"$/ do |emails, from|
  actual = all_emails.select do |email|
    email.header[:from].addrs.first.to_s == from
  end.map(&:to).flatten.sort
  expected = emails.split(", ").sort
  expect(actual).to eq expected
end

Then "no emails should have been sent" do
  expect(all_emails).to be_empty
end

#
# Accessing emails
#

# Opens the most recently received email
When /^(?:I|they|"([^"]*?)") opens? the email$/ do |address|
  open_email(address)
end

When /^(?:I|they|"([^"]*?)") opens? the email with subject "([^"]*?)"$/ do |address, subject|
  open_email(address, :with_subject => subject)
end

When /^(?:I|they|"([^"]*?)") opens? the email with subject \/([^"]*?)\/$/ do |address, subject|
  open_email(address, :with_subject => Regexp.new(subject))
end

When /^(?:I|they|"([^"]*?)") opens? the email with text "([^"]*?)"$/ do |address, text|
  open_email(address, :with_text => text)
end

When /^(?:I|they|"([^"]*?)") opens? the email with text \/([^"]*?)\/$/ do |address, text|
  open_email(address, :with_text => Regexp.new(text))
end

#
# Inspect the Email Contents
#

Then /^(?:I|they) should see "([^"]*?)" in the email subject$/ do |text|
  expect(current_email).to have_subject(text)
end

Then /^(?:I|they) should see \/([^"]*?)\/ in the email subject$/ do |text|
  expect(current_email).to have_subject(Regexp.new(text))
end

Then /^(?:I|they) should not see "([^"]*?)" in the email subject$/ do |text|
  expect(current_email).not_to have_subject(text)
end

Then /^(?:I|they) should not see \/([^"]*?)\/ in the email subject$/ do |text|
  expect(current_email).not_to have_subject(Regexp.new(text))
end

Then /^(?:I|they) should see "([^"]*?)" in the email body$/ do |text|
  expect(current_email.default_part_body.to_s).to include(text)
end

Then /^(?:I|they) should not see "([^"]*?)" in the email body$/ do |text|
  expect(current_email.default_part_body.to_s).not_to include(text)
end

Then /^(?:I|they) should see \/([^"]*?)\/ in the email body$/ do |text|
  expect(current_email.default_part_body.to_s).to match Regexp.new(text)
end

Then /^(?:I|they) should not see \/([^"]*?)\/ in the email body$/ do |text|
  expect(current_email.default_part_body.to_s).not_to match Regexp.new(text)
end

Then /^(?:I|they) should see the email delivered from "([^"]*?)"$/ do |text|
  expect(current_email).to be_delivered_from(text)
end

Then /^(?:I|they) should see the email reply to "([^"]*?)"$/ do |text|
  expect(current_email).to have_reply_to(text)
end

Then /^(?:I|they) should see "([^\"]*)" in the email "([^"]*?)" header$/ do |text, name|
  expect(current_email).to have_header(name, text)
end

Then /^(?:I|they) should see \/([^\"]*)\/ in the email "([^"]*?)" header$/ do |text, name|
  expect(current_email).to have_header(name, Regexp.new(text))
end

Then /^I should see it is a multi\-part email$/ do
    expect(current_email).to be_multipart
end

Then /^(?:I|they) should see "([^"]*?)" in the email html part body$/ do |text|
    expect(current_email.html_part.body.to_s).to include(text)
end

Then /^(?:I|they) should see "([^"]*?)" in the email text part body$/ do |text|
    expect(current_email.text_part.body.to_s).to include(text)
end

#
# Inspect the Email Attachments
#

Then /^(?:I|they) should see (an|no|\d+) attachments? with the email$/ do |amount|
  expect(current_email_attachments.size).to eql parse_email_count(amount)
end

Then /^there should be (an|no|\d+) attachments? named "([^"]*?)"$/ do |amount, filename|
  expect(current_email_attachments.select { |a| a.filename == filename }.size).to eql parse_email_count(amount)
end

Then /^attachment (\d+) should be named "([^"]*?)"$/ do |index, filename|
  expect(current_email_attachments[(index.to_i - 1)].filename).to eql filename
end

Then /^there should be (an|no|\d+) attachments? of type "([^"]*?)"$/ do |amount, content_type|
  expect(current_email_attachments.select { |a| a.content_type.include?(content_type) }.size).to eql parse_email_count(amount)
end

Then /^attachment (\d+) should be of type "([^"]*?)"$/ do |index, content_type|
  expect(current_email_attachments[(index.to_i - 1)].content_type).to include(content_type)
end

Then /^all attachments should not be blank$/ do
  current_email_attachments.each do |attachment|
    expect(attachment.read.size).to_not eql 0
  end
end

Then /^show me a list of email attachments$/ do
  EmailSpec::EmailViewer::save_and_open_email_attachments_list(current_email)
end

#
# Interact with Email Contents
#

When /^(?:I|they|"([^"]*?)") follows? "([^"]*?)" in the email$/ do |address, link|
  visit_in_email(link, address)
end

When /^(?:I|they) (?:click|follow) the first link in the email$/ do
  click_first_link_in_email
end

When "they download all the images in the email" do
  current_email.html.scan /<img src="(.+?)"/ do |matches|
    path = URI(matches.first).path
    window = open_new_window
    window.session.visit path
    window.close
  end
end

#
# Debugging
# These only work with Rails and OSx ATM since EmailViewer uses RAILS_ROOT and OSx's 'open' command.
# Patches accepted. ;)
#

Then /^save and open current email$/ do
  EmailSpec::EmailViewer::save_and_open_email(current_email)
end

Then /^save and open all text emails$/ do
  EmailSpec::EmailViewer::save_and_open_all_text_emails
end

Then /^save and open all html emails$/ do
  EmailSpec::EmailViewer::save_and_open_all_html_emails
end

Then /^save and open all raw emails$/ do
  EmailSpec::EmailViewer::save_and_open_all_raw_emails
end

# MORE

Then /^(?:I|they|"([^"]*?)") should receive (an|no|\d+) emails? from "(.*)"$/ do |address, amount, sender|
  page.document.synchronize Capybara.default_max_wait_time, errors: [EmailSpec::CouldNotFindEmailError] do
    emails = unread_emails_for(address)
    expect(emails.size).to eq parse_email_count(amount)
    emails.each do |email|
      expect(email).to be_delivered_from(sender)
    end
  end
end

Then /^(?:I|they) should see the following in the email body:$/ do |text|
  expect(current_email.default_part_body.to_s.gsub("\r\n", "\n")).to include(text)
end

Then /^"(.*?)" should (?:all |)receive an email from "(.*?)" with the subject "(.*?)" and the following body:$/ do |recipients, from, subject, body|
  page.document.synchronize Capybara.default_max_wait_time, errors: [EmailSpec::CouldNotFindEmailError] do
    emails_for(recipients, from, subject).each do |email|
      expect(email.default_part_body.to_s.gsub("\r\n","\n")).to include(body)
    end
  end
end

Then /^"(.*?)" should (?:all |)receive an email from "(.*?)" with the subject "(.*?)" and the following html body:$/ do |recipients, from, subject, body|
  page.document.synchronize Capybara.default_max_wait_time, errors: [EmailSpec::CouldNotFindEmailError] do
    emails_for(recipients, from, subject).each do |email|
      expect(Nokogiri::HTML(email.body.to_s).text).to include(body)
    end
  end
end

def emails_for recipients, from, subject
  recipients.split(", ").map do |address|
    email = unread_emails_for(address).find do |email|
      email.header[:from].value == from &&
        email.subject == subject
    end || find_email!(address, from: from, subject: subject)
    set_current_email(email)
    current_email
  end
end


