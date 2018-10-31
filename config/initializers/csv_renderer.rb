# Currently only used for rendering collections of stories, so make an
# assumption that that is what we get passed.
ActionController::Renderers.add :csv do |stories, options|
  number_of_extra_columns = {}
  number_of_extra_columns[:notes] = stories.map{|story| story.notes.length}.max
  number_of_extra_columns[:documents] = stories.map{|story| story.documents.length}.max
  number_of_extra_columns[:tasks] = stories.map{|story| story.tasks.length}.max
  
  filename = options[:filename] || 'export.csv'
  headers = Story.csv_headers.dup
  headers.concat(extra_headers(number_of_extra_columns))

  csv_string = CSV.generate do |csv|
    csv << headers

    stories.each do |story|
      csv << story.to_csv(number_of_extra_columns)
    end
  end

  send_data csv_string, type: Mime::CSV, filename: filename

end

def extra_headers(number_of_extra_columns)
  [Array.new(number_of_extra_columns[:notes], "Note"),
   Array.new(number_of_extra_columns[:documents], "Document"),
   Array.new(number_of_extra_columns[:tasks], ["Task", "Task Status"]).flatten].flatten
end
