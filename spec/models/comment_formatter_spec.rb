$: << "app/models"
require "comment_formatter"

describe CommentFormatter do
  let(:comment) { Struct.new(:project, :body).new(project) }
  let(:project) { double(slug: "tracker", usernames: usernames) }
  let(:usernames) { %w[gubs micahg simonm] }

  subject do
    described_class.call(comment)
  end

  def assert input, output
    comment.body = input
    expect(subject).to eq output
  end

  it "does markdown" do
    assert "* omg", <<~HTML
      <ul>
      <li>omg</li>
      </ul>
    HTML
  end

  it "autolinks" do
    assert "Visit https://google.com please", <<~HTML
      <p>Visit <a href="https://google.com">https://google.com</a> please</p>
    HTML
  end

  it "highlights recognized usernames" do
    assert "@micahg have we invited @nhogle to this project?", <<~HTML
      <p><b class=\"red\">@micahg</b> have we invited @nhogle to this project?</p>
    HTML
  end

  it "simplifies story references" do
    assert "duplicate of #1234", <<~HTML
      <p>duplicate of <a class="story-link" href="/projects/tracker#story-1234">#1234</a></p>
    HTML
  end
end
