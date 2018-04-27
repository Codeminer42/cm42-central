require 'rails_helper'
require 'json'

describe StoryOperations do
  let(:story_params) do
    { title: 'Test Story', requested_by: user, state: 'unstarted', accepted_at: nil }
  end

  let!(:membership) { create(:membership) }
  let(:user)        { User.first }
  let(:project)     { Project.first }
  let(:story)       { project.stories.build(story_params) }

  describe '::Create' do
    subject { -> { StoryOperations::Create.call(story, user) } }

    context 'with valid params' do
      it { expect { subject.call }.to change { Story.count } }
      it { expect { subject.call }.to change { Changeset.count } }
      it { expect(subject.call).to be_eql Story.last }
    end

    context 'with invalid params' do
      before { story.title = '' }

      it { is_expected.to_not change { Story.count } }
      it { expect(subject.call).to be_falsy }
      it { expect(Notifications).to_not receive(:story_mention) }
    end

    context '::MemberNotification' do
      let(:mailer) { double('mailer') }
      let(:username_user) do
        project.users.create(
          build(:unconfirmed_user, username: 'username').attributes
        )
      end
      let(:story) do
        project.stories.create(
          story_params.merge(description: 'Foo @username')
        )
      end

      it 'also sends notification for the found username' do
        expect(Notifications).to receive(:story_mention)
          .with(story, [username_user.email]).and_return(mailer)
        expect(mailer).to receive(:deliver_later)

        subject.call
      end
    end
  end

  describe '#documents_attributes' do
    before do
      story.save!
    end

    subject { -> { StoryOperations::Update.call(story, { documents: new_documents }, user) } }

    let(:attachments) do
      [
        {
          'id' => 30,
          'public_id' => 'hello.jpg',
          'version' => '1471624237',
          'format' => 'png',
          'resource_type' => 'image'
        },
        {
          'id' => 31,
          'public_id' => 'hello2.jpg',
          'version' => '1471624237',
          'format' => 'png',
          'resource_type' => 'image'
        }
      ]
    end

    let(:new_documents) do
      [
        {
          'public_id' => 'hello3.jpg',
          'version' => '1471624237',
          'format' => 'png',
          'resource_type' => 'image'
        },
        {
          'id' => 31,
          'public_id' => 'hello2.jpg',
          'version' => '1471624237',
          'format' => 'png',
          'resource_type' => 'image'
        }
      ]
    end

    before do
      attachments.each do |a|
        Story.connection.execute(
          'insert into attachinary_files ' \
          "(#{a.keys.join(', ')}, scope, attachinariable_id, attachinariable_type) " \
          "values ('#{a.values.join("', '")}', 'documents', #{story.id}, 'Story')"
        )
      end
    end

    it 'must record the documents attributes changes' do
      VCR.use_cassette('cloudinary_upload_activity') do
        subject.call
      end
      expect(Activity.last.subject_changes['documents_attributes'])
        .to eq([['hello2.jpg', 'hello.jpg'], ['hello2.jpg', 'hello3.jpg']])
    end
  end

  describe '::Update' do
    before do
      story.save!
    end

    subject do
      lambda do
        StoryOperations::Update.call(story, { state: 'accepted', accepted_at: Date.current }, user)
      end
    end

    context '::LegacyFixes' do
      it "sets the project start date if it doesn't exist" do
        story.project.update_attribute(:start_date, nil)
        expect(subject.call.project.start_date).to_not be_nil
      end

      it "sets the project start date if it's newer than the accepted story" do
        story.project.update_attribute(:start_date, Date.current + 2.days)
        expect(subject.call.project.start_date).to eq(story.accepted_at.to_date)
      end
    end

    context '::StateChangeNotification' do
      let(:acting_user)   { mock_model(User) }
      let(:requested_by)  { mock_model(User, email_delivery?: true) }
      let(:owned_by)      do
        mock_model(User, email_acceptance?: true,
                         email_rejection?: true)
      end
      let(:notifier) { double('notifier', subject: 'hello') }

      before do
        allow(story).to receive_messages(acting_user: acting_user)
        allow(story).to receive_messages(requested_by: requested_by)
        allow(story).to receive_messages(owned_by: owned_by)
        allow(project).to receive_messages(start_date: true)
        allow(project).to receive_message_chain(:integrations, :count).and_return(1)
        allow(story).to receive_messages(base_uri: 'http://foo.com/projects/123')
        expect(notifier).to receive(:deliver_later)
      end

      it "sends 'started' email notification" do
        allow(story).to receive_messages(state: 'started')
        expect(Notifications).to receive(:story_changed).with(story, acting_user) { notifier }
        expect(IntegrationWorker).to receive(:perform_async).with(
          project.id,
          discord: [
            {
              color: 0x36a64f,
              title: 'Test Project',
              url: "http://foo.com/projects/123#story-#{story.id}",
              description: "The story 'Test Story' has been started.",
              fields: [
                {
                  name: 'Assigned to',
                  value: '',
                  inline: true
                },
                {
                  name: 'Points',
                  value: '',
                  inline: true
                }
              ]
            }
          ],
          slack: [
            {
              fallback: "The story 'Test Story' has been started.",
              color: '#36a64f',
              title: 'Test Project',
              title_link: "http://foo.com/projects/123#story-#{story.id}",
              text: "The story 'Test Story' has been started.",
              fields: [
                {
                  title: 'Assigned to',
                  value: '',
                  short: true
                },
                {
                  title: 'Points',
                  value: '',
                  short: true
                }
              ]
            }
          ],
          mattermost: "[Test Project] The story ['Test Story']" \
            "(http://foo.com/projects/123#story-#{story.id}) has been started."
        )

        subject.call
      end
      it "sends 'delivered' email notification" do
        allow(story).to receive_messages(state: 'delivered')
        expect(Notifications).to receive(:story_changed).with(story, acting_user) { notifier }
        expect(IntegrationWorker).to receive(:perform_async).with(
          project.id,
          discord: [
            {
              color: 0x36a64f,
              title: 'Test Project',
              url: "http://foo.com/projects/123#story-#{story.id}",
              description: "The story 'Test Story' has been delivered.",
              fields: [
                {
                  name: 'Assigned to',
                  value: '',
                  inline: true
                },
                {
                  name: 'Points',
                  value: '',
                  inline: true
                }
              ]
            }
          ],
          slack: [
            {
              fallback: "The story 'Test Story' has been delivered.",
              color: '#36a64f',
              title: 'Test Project',
              title_link: "http://foo.com/projects/123#story-#{story.id}",
              text: "The story 'Test Story' has been delivered.",
              fields: [
                {
                  title: 'Assigned to',
                  value: '',
                  short: true
                },
                {
                  title: 'Points',
                  value: '',
                  short: true
                }
              ]
            }
          ],
          mattermost: "[Test Project] The story ['Test Story']" \
            "(http://foo.com/projects/123#story-#{story.id}) has been delivered."
        )

        subject.call
      end
      it "sends 'accepted' email notification" do
        allow(story).to receive_messages(state: 'accepted')
        expect(Notifications).to receive(:story_changed).with(story, acting_user) { notifier }
        expect(IntegrationWorker).to receive(:perform_async).with(
          project.id,
          discord: [
            {
              color: 0x36a64f,
              title: 'Test Project',
              url: "http://foo.com/projects/123#story-#{story.id}",
              description: "The story 'Test Story' has been accepted.",
              fields: [
                {
                  name: 'Assigned to',
                  value: '',
                  inline: true
                },
                {
                  name: 'Points',
                  value: '',
                  inline: true
                }
              ]
            }
          ],
          slack: [
            {
              fallback: "The story 'Test Story' has been accepted.",
              color: '#36a64f',
              title: 'Test Project',
              title_link: "http://foo.com/projects/123#story-#{story.id}",
              text: "The story 'Test Story' has been accepted.",
              fields: [
                {
                  title: 'Assigned to',
                  value: '',
                  short: true
                },
                {
                  title: 'Points',
                  value: '',
                  short: true
                }
              ]
            }
          ],
          mattermost: "[Test Project] The story ['Test Story']" \
            "(http://foo.com/projects/123#story-#{story.id}) has been accepted."
        )

        subject.call
      end
      it "sends 'rejected' email notification" do
        allow(story).to receive_messages(state: 'rejected')
        expect(Notifications).to receive(:story_changed).with(story, acting_user) { notifier }
        expect(IntegrationWorker).to receive(:perform_async).with(
          project.id,
          discord: [
            {
              color: 0x36a64f,
              title: 'Test Project',
              url: "http://foo.com/projects/123#story-#{story.id}",
              description: "The story 'Test Story' has been rejected.",
              fields: [
                {
                  name: 'Assigned to',
                  value: '',
                  inline: true
                },
                {
                  name: 'Points',
                  value: '',
                  inline: true
                }
              ]
            }
          ],
          slack: [
            {
              fallback: "The story 'Test Story' has been rejected.",
              color: '#36a64f',
              title: 'Test Project',
              title_link: "http://foo.com/projects/123#story-#{story.id}",
              text: "The story 'Test Story' has been rejected.",
              fields: [
                {
                  title: 'Assigned to',
                  value: '',
                  short: true
                },
                {
                  title: 'Points',
                  value: '',
                  short: true
                }
              ]
            }
          ],
          mattermost: "[Test Project] The story ['Test Story']" \
            "(http://foo.com/projects/123#story-#{story.id}) has been rejected."
          )
        subject.call
      end
    end
  end

  describe '::ReadAll' do
    def expect_past_iteration_attrs(subject_past_iteration, past_iteration)
      expect(subject_past_iteration.start_date).to eq(past_iteration.start_date)
      expect(subject_past_iteration.end_date).to eq(past_iteration.end_date)
      expect(subject_past_iteration.points).to eq(past_iteration.points)
      expect(subject_past_iteration.iteration_number).to eq(1)
    end

    let(:user)          { create(:user, :with_team) }
    let(:current_team)  { user.teams.first }
    let!(:done_story)   { create(:story, :done, project: project, requested_by: user) }
    let!(:active_story) { create(:story, :active, project: project, requested_by: user) }

    let!(:past_iteration) do
      iteration_start = project.created_at.to_date
      iteration_end = ((project.created_at + project.iteration_length * 7.days) - 1.day).to_date
      Iterations::PastIteration.new(start_date: iteration_start,
                                    end_date: iteration_end,
                                    project: project)
    end

    subject { StoryOperations::ReadAll }

    shared_examples 'when there are stories in the done column' do
      it 'does not return done stories as Story objects' do
        expect(result[:active_stories]).to_not include(done_story)
      end

      it 'returns the stories that are active' do
        expect(result[:active_stories]).to contain_exactly(active_story)
      end

      it 'returns the past iterations with its iteration number, points and dates' do
        subject_past_iteration = result[:past_iterations].first

        expect_past_iteration_attrs(subject_past_iteration, past_iteration)
      end
    end

    shared_examples 'when there are no past iterations' do
      it 'does not return past iterations' do
        expect(result[:past_iterations]).to be_empty
      end

      it 'returns the stories that are active' do
        expect(result[:active_stories]).to contain_exactly(active_story)
      end
    end

    shared_examples 'when there are no active stories' do
      it 'does not return active stories' do
        expect(result[:active_stories]).to be_empty
      end

      it 'returns the past iterations with its iteration number, points and dates' do
        subject_past_iteration = result[:past_iterations].first

        expect_past_iteration_attrs(subject_past_iteration, past_iteration)
      end
    end

    shared_examples 'when the project started a month ago' do |iteration_numbers|
      it 'returns the correct amount of past iterations' do
        expect(result[:past_iterations].length).to eq(number_of_iterations)
      end

      it 'returns the right iteration number for each past iteration' do
        expect(result[:past_iterations].map(&:iteration_number)).to eq(iteration_numbers)
      end
    end

    describe 'when not passing iteration length' do
      let(:result) { subject.call(project: project, iteration_length: nil) }

      context 'when there are stories in the done column' do
        let(:project) { create(:project, :with_past_iteration, users: [user], teams: [current_team]) }

        include_examples 'when there are stories in the done column'
      end

      context 'when there are no past iterations' do
        let(:project) { create(:project, users: [user], teams: [current_team]) }

        include_examples 'when there are no past iterations'
      end

      context 'when there are no active stories' do
        let(:project) { create(:project, :with_past_iteration, users: [user], teams: [current_team]) }
        let(:active_story) { done_story }

        include_examples 'when there are no active stories'
      end

      context 'when the project started a month ago' do
        let(:project) { create(:project, :with_month_ago, users: [user], teams: [current_team]) }
        let(:iteration_length)         { (project.iteration_length) * 7 }
        let(:days_since_project_start) { (Date.current - project.start_date).to_i }
        let(:number_of_iterations)     { days_since_project_start / iteration_length }

        include_examples 'when the project started a month ago', [1, 2, 3, 4]
      end
    end

    describe 'when passing iteration length' do
      let(:result) { subject.call(project: project, iteration_length: 2) }

      let!(:past_iteration) do
        iteration_start = project.created_at.to_date
        iteration_end = ((project.created_at + (project.iteration_length + 1) * 7.days) - 1.day).to_date
        Iterations::PastIteration.new(start_date: iteration_start,
                                      end_date: iteration_end,
                                      project: project)
      end

      context 'when there are stories in the done column' do
        let(:project) { create(:project, :with_month_ago, users: [user], teams: [current_team]) }

        include_examples 'when there are stories in the done column'
      end

      context 'when there are no past iterations' do
        let(:project) { create(:project, users: [user], teams: [current_team]) }

        include_examples 'when there are no past iterations'
      end

      context 'when there are no active stories' do
        let(:project) { create(:project, :with_month_ago, users: [user], teams: [current_team]) }
        let(:active_story) { done_story }

        include_examples 'when there are no active stories'
      end

      context 'when the project started a month ago' do
        let(:project) { create(:project, :with_month_ago, users: [user], teams: [current_team]) }
        let(:iteration_length)         { (project.iteration_length + 1) * 7 }
        let(:days_since_project_start) { (Date.current - project.start_date).to_i }
        let(:number_of_iterations)     { days_since_project_start / iteration_length }

        include_examples 'when the project started a month ago', [1, 2]
      end
    end
  end
end
