Configuration.for('fulcrum') do
  app_host "clients.botandrose.com"
  mailer_sender "noreply@clients.example.com"
  disable_registration true
  column_order "progress_to_left"
end
