server :production do
  ssh "www@ssh.botandrose.com:22022"
  ping "clients.botandrose.com"
end
