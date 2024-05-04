class IncomingEmail < Struct.new(:id)
  def self.all
    S3Gateway["bard-clients-emails"].filenames.map do |filename|
      new(filename)
    end
  end

  def self.find id
    new(id)
  end

  def read
    S3Gateway["bard-clients-emails"].read(id)
  end

  def destroy
    S3Gateway["bard-clients-emails"].delete(id)
  end
end
