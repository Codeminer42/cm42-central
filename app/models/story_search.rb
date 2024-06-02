class StorySearch
  # include PgSearch::Model
  # pg_search_scope :search,
  #                 against: {
  #                   title: 'A',
  #                   description: 'B',
  #                   labels: 'C'
  #                 },
  #                 using: {
  #                   tsearch: {
  #                     prefix: true,
  #                     negation: true
  #                   }
  #                 }

  # pg_search_scope :search_labels,
  #                 against: :labels,
  #                 ranked_by: ':trigram'

  include Minidusen::Filter

  filter :text do |scope, phrases|
    columns = [:title, :description, :labels]
    scope.where_like(columns => phrases)
  end

  filter :user do |scope, initials|
    scope.where(:owned_by_initials => initials)
  end

  extend Enumerize
  SEARCH_RESULTS_LIMIT = 40
  attr_reader :relation, :query_params, :parsed_params, :conditions

  enumerize :operand, in:
    %I[ title
        state
        labels
        estimate
        created_at
        story_type
        release_date
        owned_by_initials
        owned_by_name
        requested_by_name ]

  def self.query(relation, query_params)
    new(relation, query_params)
  end

  def initialize(relation, query_params)
    @relation      = relation
      .with_dependencies
      .where("accepted_at IS NULL OR accepted_at > ?", Time.zone.now.beginning_of_week)
      .order(Arel.sql("accepted_at IS NULL")).order(:accepted_at)
      .order(Arel.sql("find_in_set(positioning_column, '#todo,#icebox')"))
      .order(:position)

    @query_params  = query_params
    @parsed_params = []
    @conditions    = {}
    parse(query_params)
  end

  def results
    @results ||= filter(relation, query_params)
  end

  private

  def parse(query_params)
    query_params.split(',').each do |token|
      if token =~ /^(.+?)\:(.+?)$/
        conditions.merge!(Regexp.last_match(1).lstrip => Regexp.last_match(2).lstrip).symbolize_keys
      else
        parsed_params << token.lstrip
      end
    end
  end

  def valid?(conditions)
    conditions.keys.all? { |value| StorySearch.operand.find_value(value) }
  end

  def add_conditions_to(search_method)
    new_relation = relation.with_dependencies.send(search_method, parsed_params.join(','))
    new_relation = parse_queries(relation) if conditions.present? && valid?(conditions)
    new_relation.order(:id).limit(SEARCH_RESULTS_LIMIT)
  end

  def parse_queries(table)
    conditions.each do |key, value|
      table = table.where(create_queries(table, key, value))
    end
    table
  end

  def create_queries(table, key, value)
    if date? value
      { key => value.to_date.beginning_of_day..value.to_date.end_of_day }
    elsif value.to_i != 0
      table.arel_table[key].eq(value)
    else
      table.arel_table[key].matches("#{value}%")
    end
  end

  def date?(value)
    Date.parse(value) && true
  rescue
    false
  end
end
