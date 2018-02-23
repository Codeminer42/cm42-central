require "refile/cloudinary"

cloudinary = {
    cloud_name: (/(?<=\@).*/).match(ENV['CLOUDINARY_URL']),
    api_key: (/(?<=\/.).*(?=.*?\:)/).match(ENV['CLOUDINARY_URL']),
    api_secret: (/(?<=:)\w+/).match(ENV['CLOUDINARY_URL']),
}

Refile.cache = Refile::Cloudinary.new({**cloudinary }, max_size: nil)
Refile.store = Refile::Cloudinary.new({**cloudinary }, max_size: nil)
