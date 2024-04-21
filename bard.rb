server :production do
  ssh "www@ssh.botandrose.com:22022"
  ping "clients.botandrose.com"
end

server :staging do
  ssh "www@clients-staging.botandrose.com:22022"
end
