require 'rails_helper'

describe Admin::UserPresenter do
  include Capybara::RSpecMatchers

  let(:user) { build(:user) }
  subject { Admin::UserPresenter.new(user) }

  it "should render a Make just Member button when user is admin" do
    expect(subject.toggle_admin_button(true)).to have_link("Make just Member")
  end

  it "should render a Make Administrator button when user is not admin" do
    expect(subject.toggle_admin_button(false)).to have_link("Make Administrator")
  end
end
