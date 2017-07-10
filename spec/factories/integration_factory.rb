FactoryGirl.define do
  factory :integration do |i|
    i.association :project
    i.kind 'mattermost'
    i.data ( { channel: 'test-channel', bot_username: 'marvin', private_uri: 'http://foo.com' } )
  end
end
