require 'rails_helper'

describe ApplicationHelper do
  describe 'global_alert' do
    subject { global_alert }

    context 'when ENV["GLOBAL_ALERT_TEXT"] is set' do
      before { ENV["GLOBAL_ALERT_TEXT"] = 'some alert text' }
      after  { ENV["GLOBAL_ALERT_TEXT"] = nil }

      it 'returns text containing ENV["GLOBAL_ALERT_TEXT"] content' do
        expect(subject).to match(/some alert text/)
      end

      it 'returns element with global-alert class' do
        expect(subject).to match(/class="global-alert"/)
      end
    end

    context 'when ENV["GLOBAL_ALERT_TEXT"] is nil' do
      before { ENV["GLOBAL_ALERT_TEXT"] = nil }

      it 'returns nil' do
        expect(subject).to be_nil
      end
    end

    context 'when ENV["GLOBAL_ALERT_TEXT"] is empty string' do
      before { ENV["GLOBAL_ALERT_TEXT"] = '' }

      it 'returns nil' do
        expect(subject).to be_nil
      end
    end
  end
end
