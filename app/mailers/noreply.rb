class Noreply < Devise::Mailer
  self.deliver_later_wait = 5.seconds if Rails.env.production?

  default from: "noreply@clients.botandrose.com"

  def confirmation_instructions(user, token, opts = {})
    @user = user
    @token = token
    mail({
      to: user.email,
      subject: "You have been invited to join the BARD project tracker",
    })
  end
end

