require 'rails_helper'

describe StorySearch do
  let(:project) { create :project }
  let(:story) { create :story, title: 'Simple Story FOO BAR', project: project }

  describe StorySearch do
    let(:query_params) { 'FOO' }
    subject { StorySearch.new(project.stories, query_params) }
    it { expect(subject).to enumerize(:operand).in( :title,
                                                    :state,
                                                    :labels,
                                                    :estimate,
                                                    :created_at,
                                                    :story_type,
                                                    :release_date,
                                                    :owned_by_initials,
                                                    :owned_by_name,
                                                    :requested_by_name) }
  end
  describe 'simple query' do
    let(:query_params) { 'FOO' }
    subject { StorySearch.new(project.stories, query_params) }

    it 'returns a story' do
      expect(subject.conditions).to eq({})
      expect(subject.parsed_params).to eq(['FOO'])
    end
  end

  describe 'complex query' do
    let(:query_params) { 'title:FOO, state:unstarted, estimate:3, FOO' }
    subject { StorySearch.new(project.stories, query_params) }

    it 'returns a story' do
      expect(subject.conditions).to eq('title' => 'FOO', 'state' => 'unstarted', 'estimate' => '3')
      expect(subject.parsed_params).to eq(['FOO'])
    end
  end

  describe 'real searching' do
    before do
      user = create :user
      project.users << user

      @story1 = create(
        :story,
        title: 'HELLO',
        labels: 'foo,bar',
        project: project,
        requested_by: user
      )

      @story2 = create(
        :story,
        title: 'WORLD',
        labels: 'foo,bar',
        project: project,
        requested_by: user
      )

      @story3 = create(
        :story,
        title: 'HELL',
        labels: 'abc',
        project: project,
        requested_by: user
      )

      @story4 = create(
        :story,
        title: 'WORD',
        labels: 'abc,def',
        project: project,
        requested_by: user
      )
    end

    it 'returns the HEL stories' do
      expect(StorySearch.new(project.stories, 'HELL').search).to eq([@story1, @story3])
      expect(StorySearch.new(project.stories, 'WORD').search).to eq([@story4])
    end

    it 'returns the foo labeled stories' do
      expect(StorySearch.new(project.stories, 'abc').search_labels).to eq([@story3, @story4])
    end

    context 'search with labels' do
      describe 'right labels' do
        it 'one label' do
          expect(StorySearch.new(project.stories, 'title: HELL').search).to eq([@story1, @story3])
        end

        subject(:search) { StorySearch.new(project.stories, 'title: HELL, labels: foo').search }
        it 'two labels' do
          expect(search).to eq([@story1])
        end
      end

      describe 'wrong labels' do
        it 'one label' do
          expect(StorySearch.new(project.stories, 'wrong: HELL').search).to eq([])
        end

        it 'one right label and one wrong label' do
          expect(StorySearch.new(project.stories, 'title: HELL, wrong: WOR').search).to eq([])
        end
      end
    end
  end
end
