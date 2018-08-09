require 'rails_helper'

describe Story do
  subject { build :story, :with_project }
  before do
    subject.acting_user = build(:user)
  end

  describe 'defaults' do
    subject { Story.new }

    its(:state)       { should == 'unstarted' }
    its(:story_type)  { should == 'feature' }
  end

  describe '#as_json' do
    before { subject.id = 42 }

    specify do
      expect(subject.as_json['story'].keys.sort).to eq(
        %w[
          title accepted_at created_at release_date updated_at delivered_at description
          project_id story_type owned_by_id requested_by_id
          requested_by_name owned_by_name owned_by_initials estimate
          state position id errors labels notes tasks documents
        ].sort
      )
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
      expect { subject.update_attribute(:state, 'unscheduled') }
        .to raise_error(ActiveRecord::ReadOnlyRecord)
    end

    it "can't delete accepted story" do
      expect { subject.destroy }.to raise_error(ActiveRecord::ReadOnlyRecord)
    end

    context 'with attachments' do
      let(:attachments) do
        [
          {
            'id' => 30,
            'public_id' => 'Screen_Shot_2016-08-19_at_09.30.57_blnr1a',
            'version' => '1471624237',
            'format' => 'png',
            'resource_type' => 'image',
            'path' => 'v1471624237/Screen_Shot_2016-08-19_at_09.30.57_blnr1a.png'
          },
          {
            'id' => 31,
            'public_id' => 'Screen_Shot_2016-08-19_at_09.30.57_blnr1a',
            'version' => '1471624237',
            'format' => 'png',
            'resource_type' => 'image',
            'path' => 'v1471624237/Screen_Shot_2016-08-19_at_09.30.57_blnr1a.png'
          }
        ]
      end

      before do
        attachments.each do |a|
          a.delete('path')
          Story.connection.execute(
            'insert into attachinary_files ' \
            "(#{a.keys.join(', ')}, scope, attachinariable_id, attachinariable_type) " \
            "values ('#{a.values.join("', '")}', 'documents', #{subject.id}, 'Story')"
          )
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
    let(:project)         { create(:project, start_date: nil) }
    let(:story_params)    { { title: 'Test Story', state: 'started', accepted_at: nil } }
    let(:story)           { project.stories.build(story_params) }

    it 'sets the project start_date to current' do
      expect { story.fix_project_start_date }
        .to change(story.project, :start_date)
        .from(nil)
        .to(Date.current)
    end

    context 'when the state has not changed' do
      let(:story_params)    { { title: 'Test Story', accepted_at: nil } }

      it 'does not set the project start_date to current' do
        expect { story.fix_project_start_date }.not_to change(story.project, :start_date)
      end
    end

    context 'when a project is inexistent' do
      let(:project) { nil }
      let(:story) { build(:story, story_params) }

      it 'does not set the project start_date to current' do
        expect(story.fix_project_start_date).to be_falsey
      end
    end

    context 'when a project has a start_date' do
      let(:project) { create(:project, start_date: Date.today) }

      it 'does not set the project start_date to current' do
        expect { story.fix_project_start_date }.not_to change(story.project, :start_date)
      end
    end

    context 'when the state is unstarted or unscheduled' do
      %w[unstarted unscheduled].each do |state|
        let(:story_params) { { state: state } }

        it 'does not set the project start_date to current' do
          expect { story.fix_project_start_date }.not_to change(story.project, :start_date)
        end
      end
    end
  end

  describe '#fix_story_accepted_at' do
    let(:project)      { create(:project, start_date: Date.today) }
    let(:story_params) { { title: 'Test Story', state: 'accepted', accepted_at: Date.yesterday } }
    let(:story)        { project.stories.build(story_params) }

    it 'sets the project start_date to the same as story.accepted_at' do
      expect { story.fix_story_accepted_at }
        .to change(story.project, :start_date)
        .from(Date.today)
        .to(Date.yesterday)
    end

    context 'when accepted_at is inexistent' do
      let(:story_params) { { title: 'Test Story', state: 'accepted' } }

      it 'does not set the project start_date to the same as story.accepted_at' do
        expect { story.fix_story_accepted_at }.not_to change(story.project, :start_date)
      end
    end

    context 'when accepted_at is later than project start_date' do
      let(:story_params) { { title: 'Test Story', state: 'accepted', accepted_at: Date.tomorrow } }

      it 'does not set the project start_date to the same as story.accepted_at' do
        expect { story.fix_story_accepted_at }.not_to change(story.project, :start_date)
      end
    end
  end
  describe '#release_date' do
    context 'Date in the format MM-DD-YYYY' do
      let(:story_params) { { title: 'Test Story', release_date: '12/22/2017' } }
      let(:story) { build(:story, story_params) }

      it 'parses date to correct format' do
        correct_date = Date.parse('22/12/2017')
        expect(story.release_date).to eq(correct_date)
      end
    end
    context 'Date in the format DD-MM-YYYY' do
      let(:story_params) { { title: 'Test Story', release_date: '22/12/2017' } }
      let(:story) { build(:story, story_params) }

      it 'parses date to correct format' do
        correct_date = Date.parse('22/12/2017')
        expect(story.release_date).to eq(correct_date)
      end
    end
    context 'Date in invalid format' do
      let(:story_params) { { title: 'Test Story', release_date: 'bad_string' } }
      let(:story) { build(:story, story_params) }

      it 'return nill' do
        expect(story.release_date).to eq(nil)
      end
    end
  end
end
