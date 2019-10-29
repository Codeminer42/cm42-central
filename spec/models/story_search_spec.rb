require 'rails_helper'

describe StorySearch do
  let(:project) { create :project }
  let(:story) { create :story, title: 'Simple Story FOO BAR', project: project }

  describe 'enumerize operand ' do
    let(:query_params) { 'FOO' }
    subject { StorySearch.new(project.stories, query_params) }
    it 'should define enumerize :operand' do
      expect(subject).to enumerize(:operand).in(  :title,
                                                  :state,
                                                  :labels,
                                                  :estimate,
                                                  :created_at,
                                                  :story_type,
                                                  :release_date,
                                                  :owned_by_initials,
                                                  :owned_by_name,
                                                  :requested_by_name)
    end
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

    describe 'when try do the search with valid labels' do
      context 'when the single label used is valid' do
        subject { StorySearch.new(project.stories, 'title: HELL') }

        it 'should returns array with HELL and HELLO stories' do
          expect(subject.search).to eq([@story1, @story3])
        end
      end

      context 'when all labels used are valid' do
        subject { StorySearch.new(project.stories, 'title: HELL, labels: foo') }

        it 'should returns HELL story' do
          expect(subject.search).to eq([@story1])
        end
      end
    end

    describe 'when try do the search with wrong labels' do
      context 'when the single label used is invalid' do
        subject { StorySearch.new(project.stories, 'wrong: HELL') }

        it 'should returns empty array' do
          expect(subject.search).to eq([])
        end
      end

      context 'when one of the labels are valid and the other is invalid' do
        subject { StorySearch.new(project.stories, 'title: HELL, wrong: WOR') }

        it 'should returns empty array' do
          expect(subject.search).to eq([])
        end
      end
    end
  end
end
