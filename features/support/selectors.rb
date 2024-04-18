module WithinHelpers
  # Maps a name to a selector. Used primarily by the
  #
  #   When /^(.+) within (.+)$/ do |step, scope|
  #
  # step definitions in web_steps.rb
  #
  def selector_for(locator)
    case locator

    when /the header/
      "header"

    when /the body/
      "main"

    when /the sidebar/
      "aside"

    when /the "(.+)?" story/
      [".story", text: $1]

    when /the "(.+)?" project/
      [".project-item", text: $1]

    # Add more mappings here.
    # Here is an example that pulls values out of the Regexp:
    #
    #  when /^the (notice|error|info) flash$/
    #    ".flash.#{$1}"

    # You can also return an array to use a different selector
    # type, like:
    #
    #  when /the header/
    #    [:xpath, "//header"]

    # This allows you to provide a quoted selector as the scope
    # for "within" steps as was previously the default for the
    # web steps:

    else
      raise "Can't find mapping from \"#{locator}\" to a selector.\n" +
        "Now, go and add a mapping in #{__FILE__}"
    end
  end

  def element_for(locator)
    args = Array(selector_for(locator))
    find(args.shift, **(args.shift || {}))
  end

  def with_scope(locator)
    args = Array(selector_for(locator))
    within(args.shift, **(args.shift || {})) { yield }
  end
end
World(WithinHelpers)

# Single-line step scoper
When /^(.*) within (.*[^:])$/ do |step_fragment, parent|
  with_scope(parent) { step step_fragment }
end

# Multi-line step scoper
When /^(.*) within (.*[^:]):$/ do |step_fragment, parent, table_or_string|
  with_scope(parent) { step "#{step_fragment}:", table_or_string }
end

