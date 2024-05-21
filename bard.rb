server :production do
  ssh "www@ssh.botandrose.com:22022"
  ping "tracker.botandrose.com"
end

server :staging do
  ssh "www@tracker-staging.botandrose.com:22022"
end
