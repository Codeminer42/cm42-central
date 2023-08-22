module Operation
  def self.included(base)
    base.extend(ClassMethods)
    base.include(Dry::Monads[:result, :do])
  end

  module ClassMethods
    def call(**args)
      new(**args).call
    end
  end
end
