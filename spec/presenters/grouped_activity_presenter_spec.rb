require 'rails_helper'

describe GroupedActivityPresenter do
  let(:story) { create(:story, :with_project) }
  let(:comment) { create(:comment, story: story) }
  let(:activity) { build(:activity, project: story.project, user: story.requested_by) }
  let(:user_name) { story.requested_by.name }
  let(:project) { story.project }

  subject { described_class.new(activity) }

  context 'destroyed' do
    before { activity.action = 'destroy' }

    it 'describes story destroyed' do
      activity.subject = story
      activity.save
      expect(subject.description).to eq("#{user_name} destroyed Story ##{story.id}")
    end

    it 'describes project destroyed' do
      activity.subject = project
      activity.save
      expect(subject.description).to eq("#{user_name} destroyed Project ##{project.id}")
    end

    it 'describes comment destroyed' do
      activity.subject = comment
      activity.save
      expect(subject.description).to eq("#{user_name} destroyed Comment ##{comment.id}")
    end
  end

  context 'created' do
    before { activity.action = 'create' }

    it 'describes story created' do
      activity.subject = story
      activity.save
      expect(subject.description).to eq(
        "#{user_name} created Story ##{story.id} - " \
        "'<a href=\"/projects/#{project.id}#story-#{story.id}\">Test story</a>'"
      )
    end

    it 'describes project created' do
      activity.subject = project
      activity.save
      expect(subject.description).to eq(
        "#{user_name} created Project '<a href=\"/projects/test-project\">Test Project</a>'"
      )
    end

    it 'describes comment created' do
      activity.subject = comment
      activity.save
      expect(subject.description).to eq(
        "#{user_name} created Comment 'Test comment' for Story " \
        "'<a href=\"/projects/#{project.id}#story-#{story.id}\">Test story</a>'"
      )
    end
  end

  context 'updated' do
    before { activity.action = 'update' }

    context 'from empty values' do
      it 'describes new values in story' do
        story.estimate = 2
        story.description = 'new description'
        story.save
        activity.subject = story
        activity.save
        expect(subject.description).to eq(
          "#{user_name} updated Story ##{story.id} - " \
          "'<a href=\"/projects/#{project.id}#story-#{story.id}\">Test story</a>' " \
          "changing description to 'new description', estimate to '2'"
        )
      end

      it 'describes new values in project' do
        project.start_date = nil
        project.save

        project.start_date = Date.parse('2016-08-30').in_time_zone
        project.save
        activity.subject = project
        activity.save
        expect(subject.description).to eq(
          "#{user_name} updated Project '<a href=\"/projects/test-project\">Test Project</a>' " \
          "changing start_date to '2016/08/30'"
        )
      end

      it 'describes new values in comment' do
        comment.body = nil
        comment.save

        comment.body = 'new comment'
        comment.save
        activity.subject = comment
        activity.save
        expect(subject.description).to eq(
          "#{user_name} updated Comment 'new comment' for Story " \
          "'<a href=\"/projects/#{project.id}#story-#{story.id}\">Test story</a>' " \
          "changing body from 'Test comment' to 'new comment'"
        )
      end
    end

    context 'changing values for new ones' do
      it 'describes changes in story' do
        Timecop.freeze Date.parse('2016-07-01').in_time_zone do
          story.estimate = 2
          story.description = 'old description'
          story.state = 'unstarted'
          story.save

          story.estimate = 4
          story.description = 'new description'
          story.state = 'started'
          story.project.point_scale = 'linear'
          story.save
          activity.subject = story
          activity.save
          expect(subject.description).to eq(
            "#{user_name} updated Story ##{story.id} - " \
            "'<a href=\"/projects/#{project.id}#story-#{story.id}\">Test story</a>' " \
            "changing description to " \
            "'<del class=\"differ\">old</del><ins class=\"differ\">new</ins> description', estimate from '2' to '4', " \
            "state moved forward to started, started_at to '2016/07/01 00:00:00 -0700'"
          )
        end
      end

      it 'describes changes in project' do
        project.start_date = Date.parse('2016-07-01').in_time_zone
        project.save

        project.name = 'New Project'
        project.start_date = Date.parse('2016-08-30').in_time_zone
        project.save
        activity.subject = project
        activity.save
        expect(subject.description).to eq(
          "#{user_name} updated Project '<a href=\"/projects/test-project\">New Project</a>' " \
          "changing name from 'Test Project' to 'New Project', start_date from '2016/07/01' to " \
          "'2016/08/30'"
        )
      end

      it 'describes changes in comment' do
        comment.body = 'new comment'
        comment.save
        activity.subject = comment
        activity.save
        expect(subject.description).to eq(
          "#{user_name} updated Comment 'new comment' for Story " \
          "'<a href=\"/projects/#{project.id}#story-#{story.id}\">Test story</a>' " \
          "changing body from 'Test comment' to 'new comment'"
        )
      end
    end
  end
end
