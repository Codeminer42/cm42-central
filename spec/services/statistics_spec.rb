require 'rails_helper'

describe Statistics do
  let(:array) { [10, 20, 30, 12, 12, 27, 34, 20, 16] }

  describe '.mean' do
    subject { Statistics.mean(array) }
    it 'should returns the mean of the array'do
      expect('%.4f' % subject).to eq('20.1111')
    end
  end

  describe '.standard_deviation' do
    let(:number_of_iterations) { 10 }

    subject { Statistics.standard_deviation(array, number_of_iterations) }
    it 'should returns standard deviation of the array' do
      expect('%.4f' % subject).to eq('7.6739')
    end
  end

  describe '.volatility' do
    let(:number_of_iterations) { 8 }

    subject { Statistics.volatility(array, number_of_iterations) }
    it 'should returns the volatility of array with iterations' do
      expect('%.4f' % subject).to eq('0.3849')
    end
  end

  describe '.sum' do
    subject { Statistics.sum(array) }
    it 'should returns the sum from array' do
      expect(subject).to eq(181)
    end
  end

  describe '.total' do
    subject { Statistics.total(array) }
    it 'should returns the size of array' do
      expect(subject).to eq(9.0)
    end
  end

  describe '.slice_to_sample_size' do
    let(:number_of_iterations) { 3 }
    subject { Statistics.slice_to_sample_size(array, number_of_iterations) }
    it 'should returns the last from array' do
      expect(subject).to eq([16, 20, 34])
    end
  end
end