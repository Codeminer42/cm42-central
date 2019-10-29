class StorySearch
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
    new(relation, query_params).search
  end

  def self.labels(relation, query_params)
    new(relation, query_params).search_labels
  end

  def initialize(relation, query_params)
    @relation      = relation
    @query_params  = query_params
    @parsed_params = []
    @conditions    = {}
    parse(query_params)
  end

  def search
    add_conditions_to :search
  end

  def search_labels
    add_conditions_to :search_labels
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
    new_relation.limit(SEARCH_RESULTS_LIMIT)
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
