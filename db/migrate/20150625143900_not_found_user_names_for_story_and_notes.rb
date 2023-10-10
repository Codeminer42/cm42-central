class NotFoundUserNamesForStoryAndNotes < ActiveRecord::Migration[4.2]
  def change
    add_column :stories, :requested_by_name, :string, limit: 255
    add_column :stories, :owned_by_name, :string, limit: 255
    add_column :stories, :owned_by_initials, :string, limit: 255
    add_column :notes, :user_name, :string,  limit: 255

    Story.find_each do |s|
      s.requested_by_name = s.requested_by.try(:name)
      s.owned_by_name = s.owned_by.try(:name)
      s.owned_by_initials = s.owned_by_name.split(' ').map { |n| n[0].upcase }.join('') unless s.owned_by_name.blank?
      s.save
    end

    Note.find_each do |n|
      next if n.story.nil?
      n.user_name = n.user.try(:name)
      n.save
    end
  end
end
