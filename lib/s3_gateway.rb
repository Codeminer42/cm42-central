class S3Gateway < Struct.new(:bucket_name)
  def [] bucket_name
    new(bucket_name)
  end

  def filenames
    response = client.list_objects_v2(bucket: bucket_name)
    response.contents.map(&:key)
  end

  def read filename
    response = client.get_object(bucket: bucket_name, key: filename)
    response.body.read
  end

  def delete filename
    client.delete_object(bucket: bucket_name, key: filename)
  end

  private

  def client
    @client ||= begin
      aws_credentials = Rails.application.credentials.aws
      Aws::S3::Client.new(
        access_key_id: aws_credentials[:access_key_id],
        secret_access_key: aws_credentials[:secret_access_key],
        region: aws_credentials[:region],
      )
    end
  end
end
