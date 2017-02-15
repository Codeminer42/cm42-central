require 'rails_helper'

describe Story do

  subject { build :story, :with_project }
  before {
    subject.acting_user = build(:user)
  }

  describe "defaults" do
    subject { Story.new }

    its(:state)       { should == "unstarted" }
    its(:story_type)  { should == "feature" }
  end

  describe "#as_json" do
    before { subject.id = 42 }

    specify do
      expect(subject.as_json['story'].keys.sort).to eq([
        "title", "accepted_at", "created_at", "updated_at", "description",
        "project_id", "story_type", "owned_by_id", "requested_by_id",
        "requested_by_name", "owned_by_name", "owned_by_initials", "estimate",
        "state", "position", "id", "errors", "labels", "notes", "tasks", "documents"
      ].sort)
    end
  end

  describe '#readonly?' do
    subject { create :story, :with_project }

    before { subject.update_attribute(:state, 'accepted') }

    it "can't save model if it is already accepted" do
      subject.title = 'new title override'
      expect { subject.save }.to raise_error(ActiveRecord::ReadOnlyRecord)
    end

    it "can't change state back from accepted to anything else" do
      expect { subject.update_attribute(:state, 'unscheduled') }.to raise_error(ActiveRecord::ReadOnlyRecord)
    end

    it "can't delete accepted story" do
      expect { subject.destroy }.to raise_error(ActiveRecord::ReadOnlyRecord)
    end

    context "with attachments" do
      let(:attachments) { [
        {"id"=>30, "public_id"=>"Screen_Shot_2016-08-19_at_09.30.57_blnr1a", "version"=>"1471624237", "format"=>"png", "resource_type"=>"image", "path"=>"v1471624237/Screen_Shot_2016-08-19_at_09.30.57_blnr1a.png"},
        {"id"=>31, "public_id"=>"Screen_Shot_2016-08-19_at_09.30.57_blnr1a", "version"=>"1471624237", "format"=>"png", "resource_type"=>"image", "path"=>"v1471624237/Screen_Shot_2016-08-19_at_09.30.57_blnr1a.png"}
      ]}

      before do
        attachments.each do |a|
          a.delete('path')
          Story.connection.execute("insert into attachinary_files (#{a.keys.join(", ")}, scope, attachinariable_id, attachinariable_type) values ('#{a.values.join("', '")}', 'documents', #{subject.id}, 'Story')")
        end
      end

      it "can't delete attachments of an accepted story" do
        expect(subject.documents.count).to eq(2)

        expect { subject.documents = [] }.to raise_error(ActiveRecord::ReadOnlyRecord)

        subject.reload
        expect(subject.documents.count).to eq(2)
      end
    end
  end

  describe '#fix_project_start_date' do
    let(:project)         { Project.create(name: 'test project', start_date: nil) }
    let(:story_params)    { { title: 'Test Story', state: 'started', accepted_at: nil } }
    let(:story)           { project.stories.build(story_params) }

    it "sets the project start_date to current" do
      expect{story.fix_project_start_date}.to change(story.project, :start_date).from(nil).to(Date.current)
    end
  end

  describe '#fix_story_accepted_at' do
    let(:project)         { Project.create(name: 'test project', start_date: Date.today) }
    let(:story_params)    { { title: 'Test Story', state: 'accepted', accepted_at: Date.yesterday } }
    let(:story)           { project.stories.build(story_params) }

    it "sets the project start_date to the same as story.accepted_at" do
      expect{story.fix_story_accepted_at}.to change(story.project, :start_date).from(Date.today).to(Date.yesterday)
    end
  end
end
