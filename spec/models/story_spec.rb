require 'rails_helper'

describe Story do
  subject { build :story, :with_project }
  before do
    subject.acting_user = build(:user)
  end

  describe 'validations' do
    describe '#title' do
      it 'is required' do
        subject.title = ''
        subject.valid?
        expect(subject.errors[:title].size).to eq(1)
      end
    end

    describe '#story_type' do
      it { is_expected.to validate_presence_of(:story_type) }
      it { is_expected.to enumerize(:story_type).in('feature', 'chore', 'bug', 'release') }
    end

    describe '#state' do
      it 'must be a valid state' do
        subject.state = 'flum'
        subject.valid?
        expect(subject.errors[:state].size).to eq(1)
      end
    end

    describe '#project' do
      it 'cannot be nil' do
        subject.project_id = nil
        subject.valid?
        expect(subject.errors[:project].size).to eq(1)
      end

      it 'must have a valid project_id' do
        subject.project_id = 'invalid'
        subject.valid?
        expect(subject.errors[:project].size).to eq(1)
      end

      it 'must have a project' do
        subject.project = nil
        subject.valid?
        expect(subject.errors[:project].size).to eq(1)
      end
    end

    describe '#estimate' do
      before do
        subject.project.users = [subject.requested_by]
      end

      it 'must be valid for the project point scale' do
        subject.project.point_scale = 'fibonacci'
        subject.estimate = 4 # not in the fibonacci series
        subject.valid?
        expect(subject.errors[:estimate].size).to eq(1)
      end

      context 'when try to estimate' do
        %w[chore bug release].each do |type|
          context "a #{type} story" do
            before { subject.attributes = { story_type: type, estimate: 1 } }

            it { is_expected.to be_invalid }
          end
        end

        context 'a feature story' do
          before { subject.attributes = { story_type: 'feature', estimate: 1 } }

          it { is_expected.to be_valid }
        end
      end
    end

    it { is_expected.to accept_nested_attributes_for(:tasks) }
    it { is_expected.to accept_nested_attributes_for(:notes) }
  end

  describe 'associations' do
    describe 'notes' do
      let!(:user) { create :user }
      let!(:project) { create :project, users: [user] }
      let!(:story) { create :story, project: project, requested_by: user }
      let!(:note) { create(:note, created_at: Date.current + 2.days, user: user, story: story) }
      let!(:note2) { create(:note, created_at: Date.current, user: user, story: story) }

      it 'order by created at' do
        story.reload

        expect(story.notes).to eq [note2, note]
      end
    end
  end

  describe '#to_s' do
    before { subject.title = 'Dummy Title' }
    its(:to_s) { should == 'Dummy Title' }
  end

  describe '#estimated?' do
    context 'when the story estimation is nil' do
      before { subject.estimate = nil }

      it { is_expected.not_to be_estimated }
    end

    context 'when the story estimation is 1' do
      before { subject.estimate = 1 }

      it { is_expected.to be_estimated }
    end
  end

  describe '#estimable_type?' do
    %w[chore bug release].each do |type|
      context "when is a #{type} story" do
        before { subject.story_type = type }

        it { is_expected.not_to be_estimable_type }
      end
    end

    context 'when is a feature story' do
      before { subject.story_type = 'feature' }

      it { is_expected.to be_estimable_type }
    end
  end

  describe '#set_position_to_last' do
    context 'when position is set' do
      before { subject.position = 42 }

      it 'does nothing' do
        expect(subject.set_position_to_last).to be true
        subject.position = 42
      end
    end

    context 'when there are no other stories' do
      before { allow(subject).to receive_message_chain(:project, :stories, :order, :first).and_return(nil) }

      it 'sets position to 1' do
        subject.set_position_to_last
        expect(subject.position).to eq(1)
      end
    end

    context 'when there are other stories' do
      let(:last_story) { mock_model(Story, position: 41) }

      before do
        allow(subject).to receive_message_chain(:project, :stories, :order, :first).and_return(last_story)
      end

      it 'incrememnts the position by 1' do
        subject.set_position_to_last
        expect(subject.position).to eq(42)
      end
    end
  end

  describe '#accepted_at' do
    context 'when not set' do
      before { subject.accepted_at = nil }

      # FIXME: This is non-deterministic
      it "gets set when state changes to 'accepted'" do
        Timecop.freeze(Time.zone.parse('2016-08-31 12:00:00')) do
          subject.started_at = 5.days.ago
          subject.update_attribute :state, 'accepted'
          expect(subject.accepted_at).to eq(Time.current)
          expect(subject.cycle_time_in(:days)).to eq(5)
        end
      end
    end

    context 'when set' do
      before { subject.accepted_at = Time.zone.parse('1999/01/01') }

      # FIXME: This is non-deterministic
      it "is unchanged when state changes to 'accepted'" do
        subject.update_attribute :state, 'accepted'
        expect(subject.accepted_at).to eq(Time.zone.parse('1999/01/01'))
      end
    end
  end

  describe '#delivered_at' do
    context 'when not set' do
      before { subject.delivered_at = nil }

      it 'gets set when state changes to delivered_at' do
        Timecop.freeze(Time.zone.parse('2016-08-31 12:00:00')) do
          subject.update_attribute :state, 'delivered'
          expect(subject.delivered_at).to eq(Time.current)
        end
      end
    end

    context 'when there is already a delivered_at' do
      before { subject.delivered_at = Time.zone.parse('1999/01/01') }

      it 'is unchanged' do
        subject.update_attribute :state, 'delivered'
        expect(subject.delivered_at).to eq(Time.zone.parse('1999/01/01'))
      end
    end

    context 'when state does not change' do
      before { subject.delivered_at = nil }

      it 'delivered_at is not filled' do
        subject.update_attribute :title, 'New title'
        expect(subject.delivered_at).to eq(nil)
      end
    end
  end

  describe '#started_at' do
    context 'when not set' do
      before do
        subject.started_at = subject.owned_by = nil
      end

      # FIXME: This is non-deterministic
      it "gets set when state changes to 'started'" do
        Timecop.freeze(Time.zone.parse('2016-08-31 12:00:00')) do
          subject.update_attribute :state, 'started'
          expect(subject.started_at).to eq(Time.current)
          expect(subject.owned_by).to eq(subject.acting_user)
        end
      end
    end

    context 'when set' do
      before { subject.started_at = Time.zone.parse('2016-09-01 13:00:00') }

      # FIXME: This is non-deterministic
      it "is unchanged when state changes to 'started'" do
        subject.update_attribute :state, 'started'
        expect(subject.started_at).to eq(Time.zone.parse('2016-09-01 13:00:00'))
        expect(subject.owned_by).to eq(subject.acting_user)
      end
    end
  end

  describe '#to_csv' do
    let(:story) { create(:story, :with_project) }

    let(:number_of_extra_columns) { { tasks: 0, notes: 0, documents: 0 } }
    let(:task) { double('task') }
    let(:tasks) { [task] }

    let(:note) { double('note') }
    let(:notes) { [note] }

    let(:document) { double('document') }
    let(:documents) { [document] }

    before do
      allow(story).to receive(:tasks).and_return(tasks)
      allow(story).to receive(:notes).and_return(notes)
      allow(story).to receive(:documents).and_return(documents)
    end

    it 'returns an array' do
      expect(story.to_csv(number_of_extra_columns)).to be_kind_of(Array)
    end

    context 'when story have tasks' do
      let(:task_name) { 'task_name' }
      let(:task_status) { 'completed' }

      before do
        allow(task).to receive(:to_csv).and_return([task_name, task_status])
        number_of_extra_columns[:tasks] = 1
      end

      it 'return task name' do
        expect(story.to_csv(number_of_extra_columns)).to include(task_name)
      end

      it 'return task status' do
        expect(story.to_csv(number_of_extra_columns)).to include(task_status)
      end
    end

    context 'when story have notes' do
      let(:note_body) { 'This is the note body text (Note Author - Dec 25, 2011)' }

      before do
        allow(note).to receive(:to_csv).and_return(note_body)
        number_of_extra_columns[:notes] = 1
      end

      it 'return note body' do
        expect(story.to_csv(number_of_extra_columns)).to include(note_body)
      end
    end

    context 'when story have documents' do
      let(:document_content) do
        '{"attachinariable_type"=>"Story",
          "scope"=>"documents",
          "public_id"=>"programming-motherfucker-1-728_qhl2tl",
          "version"=>"1540488712",
          "width"=>728,
          "height"=>546,
          "format"=>"jpg",
          "resource_type"=>"image"}'
      end

      before do
        allow(document).to receive(:to_csv).and_return(document_content)
        number_of_extra_columns[:documents] = 1
      end

      it 'return note body' do
        expect(story.to_csv(number_of_extra_columns)).to include(document_content)
      end
    end
  end

  describe '#stakeholders_users' do
    let(:requested_by)  { mock_model(User) }
    let(:owned_by)      { mock_model(User) }
    let(:note_user)     { mock_model(User) }
    let(:notes)         { [build_stubbed(:note, user: note_user)] }

    before do
      subject.requested_by  = requested_by
      subject.owned_by      = owned_by
      subject.notes         = notes
    end

    specify do
      expect(subject.stakeholders_users).to include(requested_by)
    end

    specify do
      expect(subject.stakeholders_users).to include(owned_by)
    end

    specify do
      expect(subject.stakeholders_users).to include(note_user)
    end

    it 'strips out nil values' do
      subject.requested_by = subject.owned_by = nil
      expect(subject.stakeholders_users).not_to include(nil)
    end
  end

  context 'when unscheduled' do
    before { subject.state = 'unscheduled' }
    its(:events)  { should == [:start] }
    its(:column)  { should == '#chilly_bin' }
  end

  context 'when unstarted' do
    before { subject.state = 'unstarted' }
    its(:events)  { should == [:start] }
    its(:column)  { should == '#backlog' }
  end

  context 'when started' do
    before { subject.state = 'started' }
    its(:events)  { should == [:finish] }
    its(:column)  { should == '#in_progress' }
  end

  context 'when finished' do
    before { subject.state = 'finished' }
    its(:events)  { should == [:deliver] }
    its(:column)  { should == '#in_progress' }
  end

  context 'when delivered' do
    before { subject.state = 'delivered' }
    its(:events)  { should include(:accept) }
    its(:events)  { should include(:reject) }
    its(:column)  { should == '#in_progress' }
  end

  context 'when rejected' do
    before { subject.state = 'rejected' }
    its(:events)  { should == [:restart] }
    its(:column)  { should == '#in_progress' }
  end

  context 'when accepted' do
    before { subject.state = 'accepted' }
    its(:events)  { should == [] }
    its(:column)  { should == '#done' }
  end

  describe '.csv_headers' do
    specify { expect(Story.csv_headers).to be_kind_of(Array) }
  end

  describe '#cache_user_names' do
    context 'when adding a requester and owner to a story' do
      let(:requester)  { create(:user) }
      let(:owner)      { create(:user) }
      let(:story) { create(:story, :with_project, owned_by: nil, requested_by: requester) }

      before do
        story.project.users << owner
        story.update(owned_by: owner)
      end

      specify { expect(story.requested_by_name).to eq(requester.name) }
      specify { expect(story.owned_by_name).to eq(owner.name) }
      specify { expect(story.owned_by_initials).to eq(owner.initials) }
    end

    context 'when removing a owner to a story' do
      let(:owner)     { create(:user) }
      let(:requester) { create(:user) }
      let(:project) { create(:project, users: [owner, requester]) }
      let(:story)   { create(:story, project: project, owned_by: owner, requested_by: requester) }

      before do
        story.update(owned_by: nil)
      end

      specify { expect(story.owned_by_name).to be_nil }
      specify { expect(story.owned_by_initials).to be_nil }
    end

    context 'when changing a requested and owner of a story' do
      let(:requester)     { create(:user) }
      let(:owner)         { create(:user) }
      let(:requester2)    { create(:user) }
      let(:owner2)        { create(:user) }
      let(:project)       { create(:project, users: [owner, owner2, requester, requester2]) }
      let(:story) { create(:story, project: project, owned_by: owner, requested_by: requester) }

      before do
        project.users + [owner, owner2, requester, requester2]
        story.update(owned_by: owner2, requested_by: requester2)
      end

      specify { expect(story.requested_by_name).to eq(requester2.name) }
      specify { expect(story.owned_by_name).to eq(owner2.name) }
      specify { expect(story.owned_by_initials).to eq(owner2.initials) }
    end
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
          state position id errors labels notes tasks documents new_position
        ].sort
      )
    end
  end

  describe 'scopes' do
    let!(:user) { create(:user, :with_team) }

    let!(:project) do
      create(:project,
              users: [user],
              teams: [user.teams.first])
    end

    let!(:story) { create(:story, :done, project: project, requested_by: user) }

    context '.accepted' do
      it 'include accepted story' do
        expect(Story.accepted).to include(story)
      end

      it 'not include non accepted story' do
        story.accepted_at = nil
        story.save!

        expect(Story.accepted).not_to include(story)
      end
    end

    context '.accepted_between()' do
      let(:start_date) { Time.current.days_ago(16) }
      let(:end_date) { Time.current.days_ago(14) }

      it 'include story accepted beetween start_date and end_date' do
        story.accepted_at = start_date + 2.days
        story.save!

        expect(Story.accepted_between(start_date, end_date)).to include(story)
      end

      it 'not include story accepted before start_date' do
        story.accepted_at = start_date - 1.day
        story.save!

        expect(Story.accepted_between(start_date, end_date)).not_to include(story)
      end

      it 'not include story accepted after end_date' do
        story.accepted_at = end_date + 1.day
        story.save!

        expect(Story.accepted_between(start_date, end_date)).not_to include(story)
      end
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

    it 'can destroy accepted story when deleting the project' do
      expect { subject.project.destroy }.not_to raise_error
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
    let(:story)           { project.stories.create(story_params) }

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
    let(:story)        { project.stories.create(story_params) }

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


  describe '.can_be_estimated?' do
    STORY_TYPES = { feature: true, chore: false, bug: false, release: false }.freeze

    STORY_TYPES.each do |type, estimable|
      context "when check if a #{type} story is estimable" do
        it "returns #{estimable}" do
          expect(Story.can_be_estimated?(type)).to eq(estimable)
        end
      end
    end
  end
end
