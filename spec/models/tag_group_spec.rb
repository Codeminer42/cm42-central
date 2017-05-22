require 'rails_helper'

describe TagGroup, type: :model do

  describe "#bg_color" do

    context "with valid json" do
      let(:valid_json) { { r: 241, g: 112, b: 19, a: 1 }.to_json }

      subject { described_class.create(name: 'tag_group', bg_color: valid_json) }

      it "calls the bg_color= method" do
        expect_any_instance_of(TagGroup)
        .to receive(:bg_color=)
        .with(valid_json)

        subject
      end

      it { expect(subject.bg_color).to eq "#f17013" }

      it { expect(subject.foreground_color).to eq RGBUtils::SimpleContrastColorResolver.for(subject.bg_color) }
    end

    context "with invalid json" do
      let(:invalid_json) { "#fc0000" }

      subject { described_class.new(bg_color: invalid_json) }

      it "calls the bg_color= method" do
        expect_any_instance_of(TagGroup)
        .to receive(:bg_color=)
        .with(invalid_json)

        subject
      end

      it "return the invalid json" do
        expect(subject.bg_color).to eq "#fc0000"
      end
    end
  end
end
