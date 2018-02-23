require "refile/cloudinary"
raw_data = ENV['CLOUDINARY_URL']
without_protocol = raw_data.gsub(/cloudinary:\/\//, '')
api_key, api_secret_and_cloud_name = without_protocol.split(':')
api_secret, cloud_name = api_secret_and_cloud_name.split('@')

cloudinary = {
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
}

Refile.cache = Refile::Cloudinary.new({**cloudinary }, max_size: nil)
Refile.store = Refile::Cloudinary.new({**cloudinary }, max_size: nil)
