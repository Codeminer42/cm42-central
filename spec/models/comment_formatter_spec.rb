$: << "app/models"
require "comment_formatter"

describe CommentFormatter do
  let(:comment) { Struct.new(:body).new }
  let(:project) { double(slug: "tracker", usernames: usernames, story_ids: [1234], stories: stories) }
  let(:usernames) { %w[gubs micahg simonm] }
  let(:stories) { double(find: story) }
  let(:story) { double(title: "bash face into javascript ecosystem") }

  subject do
    described_class.call(comment, project)
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

  it "detects and expands story links" do
    assert "duplicate of http://tracker.localhost/projects/tracker#story-1234", <<~HTML
      <p>duplicate of <a class="story-link" href="http://tracker.localhost/projects/tracker#story-1234" data-turbo="false">#1234: bash face into javascript ecosystem</a></p>
    HTML
  end

  it "doesn't try with links to non-existant stories" do
    assert "reminds me of http://tracker.localhost/projects/tracker#story-69", <<~HTML
      <p>reminds me of <a href="http://tracker.localhost/projects/tracker#story-69">http://tracker.localhost/projects/tracker#story-69</a></p>
    HTML
  end

  it "doesn't try with links to other projects' stories" do
    assert "reminds me of http://tracker.localhost/projects/eboshi#story-1234", <<~HTML
      <p>reminds me of <a href="http://tracker.localhost/projects/eboshi#story-1234">http://tracker.localhost/projects/eboshi#story-1234</a></p>
    HTML
  end

  it "escapes inline html" do
    assert "here is some inline html: <div><h1>invalid</div>", <<~HTML
      <p>here is some inline html: &lt;div&gt;&lt;h1&gt;invalid&lt;/div&gt;</p>
    HTML
  end

  it "renders inline html surrounded by backtics" do
    assert "here is some html: `<div><h1>invalid</div>`", <<~HTML
      <p>here is some html: <code>&lt;div&gt;&lt;h1&gt;invalid&lt;/div&gt;</code></p>
    HTML
  end

  it "renders multiline inline html surrounded by triple backtics" do
    assert "here is some html: ```
      <div>
        <h1>invalid
      </div>
      ```", <<~HTML
      <p>here is some html: <code>&lt;div&gt; &lt;h1&gt;invalid &lt;/div&gt;</code></p>
    HTML
  end

  it "renders multiline inline html surrounded by triple backtics with html formatting" do
    assert <<~TEXT, <<~HTML
      ```html
      <div></div>
      ```
    TEXT
      <pre style="background-color:#2b303b;"><code class="language-html"><span style="color:#c0c5ce;">&lt;</span><span style="color:#bf616a;">div</span><span style="color:#c0c5ce;">&gt;&lt;/</span><span style="color:#bf616a;">div</span><span style="color:#c0c5ce;">&gt;
      </span></code></pre>
    HTML
  end
end
