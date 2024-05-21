Configuration.for('fulcrum') do
  app_host "tracker.botandrose.com"
  mailer_sender "BARD Tracker <notifications@tracker.botandrose.com>"
  disable_registration true
  column_order "progress_to_left"
end
