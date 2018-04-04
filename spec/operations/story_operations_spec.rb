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

    describe '::ReadAll' do
      let(:user) { create(:user, :with_team) }
      let(:project) { create(:project, :with_past_date, users: [user], teams: [current_team]) }
      let(:pundit_context) { PunditContext.new(current_team, user, current_project: project) }
      let(:current_team)   { user.teams.first }
      let(:policy_scope)   { Pundit.policy_scope(pundit_context, done_story) }

      let(:done_story_params) do
        {
          title: 'Done story',
          state: 'accepted',
          estimate: 8,
          created_at: DateTime.current.days_ago(10),
          accepted_at: DateTime.current.days_ago(10),
          started_at: DateTime.current.days_ago(10)
        }
      end

      let(:active_story_params) do
        {
          title: 'Active story',
          state: 'started',
          started_at: DateTime.current.days_ago(2),
        }
      end

      subject { StoryOperations::ReadAll.call(story_scope: policy_scope, project: project) }

      context 'when there are stories in the done column' do
        let(:done_story)     { project.stories.create!(done_story_params) }
        let(:active_story) { project.stories.create!(active_story_params) }
        let(:past_iteration) { StoryOperations::ReadAll::PastIteration.new(project.created_at.to_date, ((project.created_at + project.iteration_length * 7.days) - 1.days).to_date, project) }

        it 'does not return done stories as Story objects' do
          expect(subject[:active_stories]).to_not include(done_story)
        end

        it 'returns the past iterations with its points and dates' do
          expect(subject[:past_iterations].first.to_json).to eq(past_iteration.to_json)
        end

        it 'returns the stories that are not done' do
          expect(subject[:active_stories]).to contain_exactly(story, active_story)
        end
      end
    end
  end
end
