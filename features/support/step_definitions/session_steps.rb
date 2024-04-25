Given "I am logged in as an admin" do
  user = User.where(email: "admin@email.com", role: "Admin")
    .first_or_create!({
      name: "Admin",
      password: "secret",
      password_confirmation: "secret",
      organization: Organization.find_by!(name: "Admins"),
    })
  login_user user
end

Given "I am logged in as {string}" do |email|
  user = User.find_by_email!(email)
  login_user user
end

def login_user user
  visit "/users/sign_out"
  fill_in "Email", with: user.email
  fill_in "Password", with: "secretsecret"
  click_button "Log in"
  expect(page).to have_text("Signed in successfully")
end
