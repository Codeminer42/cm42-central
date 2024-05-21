class FixesCommentStoryLinks < Struct.new(:comment)
  def self.call comment
    new(comment).call
  end

  def call
    return unless comment.body.present?
    comment.body.gsub!(/#\d+/) do |match|
      pivotal_id = match[1..]
      if story = comment.project.stories.find_by(pivotal_id:)
        "##{story.id}"
      else
        match
      end
    end
    comment.save!
  end
end
