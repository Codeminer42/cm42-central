require 'rails_helper'

RSpec.describe Entities::Integration do
  let(:integration) { create :integration }

  subject { described_class.represent(integration).as_json }

  it { expect(subject[:id]).to eq(integration.id) }
  it { expect(subject[:project_id]).to eq(integration.project_id) }
  it { expect(subject[:kind]).to eq(integration.kind) }
  it { expect(subject[:data]).to eq(integration.data) }
end
