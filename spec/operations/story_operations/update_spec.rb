require 'rails_helper'

describe StoryOperations::Update, :vcr do
  let(:story_params) do
    { title: 'Test Story', requested_by: user, state: 'unstarted', accepted_at: nil }
  end

  let!(:membership) { create(:membership) }
  let(:user)        { membership.user }
  let(:project)     { membership.project }
  let(:story)       { project.stories.build(story_params) }

  describe '#documents_attributes' do
    before { story.save! }

    subject { -> { StoryOperations::Update.new.call(story: story, data: { documents: new_documents }, current_user: user) } }

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
      VCR.use_cassette('cloudinary_upload_activity', match_requests_on: %i[uri method]) do
        subject.call
      end
      expect(Activity.last.subject_changes['documents_attributes'].map(&:sort))
        .to eq([%w[hello.jpg hello2.jpg], %w[hello2.jpg hello3.jpg]])
    end
  end

  before { story.save! }

  let(:params) { { state: 'accepted', accepted_at: Date.current } }

  subject { -> { StoryOperations::Update.new.call(story: story, data: params, current_user: user) } }

  Story::ESTIMABLE_TYPES.each do |story_type|
    context "when estimate #{story_type} story" do
      let(:params) { { 'estimate' => 1, 'story_type' => story_type, 'state' => 'unscheduled' } }

      it 'keeps the story state unscheduled' do
        story.state = 'unscheduled'
        subject.call
        expect(story.state).to eq('unscheduled')
      end
    end

    context "when underestimate #{story_type} story" do
      let(:params) { { 'estimate' => nil, 'story_type' => story_type } }

      it 'sets the story state as unscheduled' do
        story.attributes = { estimate: 1, state: 'unstarted' }
        subject.call
        expect(story.state).to eq('unscheduled')
      end
    end

    context "when change the estimate value of a #{story_type} story" do
      let(:params) { { 'estimate' => 2, 'story_type' => 'started' } }

      context 'and its state is started' do
        it 'keeps the state as started' do
          story.attributes = { estimate: 1, state: 'started' }
          subject.call
          expect(story.state).to eq('started')
        end
      end
    end
  end

  context '#apply_fixes' do
    it "sets the project start date if it doesn't exist" do
      story.project.update_attribute(:start_date, nil)
      expect(subject.call.value!.project.start_date).to_not be_nil
    end

    it "sets the project start date if it's newer than the accepted story" do
      story.project.update_attribute(:start_date, Date.current + 2.days)
      expect(subject.call.value!.project.start_date).to eq(story.accepted_at.to_date)
    end
  end

  context '::PusherNotification' do
    it 'notifies the pusher that the board has changes' do
      expect(PusherNotificationWorker).to receive(:perform_async)

      subject.call
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
