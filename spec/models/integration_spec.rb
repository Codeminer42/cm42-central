require 'rails_helper'

describe Integration, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:project) }
    it { is_expected.to validate_presence_of(:kind) }
  end

  
  describe "#kind" do
    subject { build :integration }
    
    it "should have a valid kind" do
      subject.kind = 'foo'
      subject.valid?
      expect(subject.errors[:kind].size).to eq(1)
    end

    it "should have a kind" do
      subject.kind = nil
      subject.valid?
      expect(subject.errors[:kind].size).to eq(2)
    end
  end

  describe "#data" do
    subject { build :integration }
    
    it "should have a valid serializable data field" do
      payload = { channel: 'foo', bot_username: 'bar', private_uri: 'baz' }
      subject.data = payload
      subject.save
      subject.reload

      expect(subject.data['channel']).to eq('foo')
      expect(subject.data['bot_username']).to eq('bar')
      expect(subject.data['private_uri']).to eq('baz')
    end
  end
end

