module ActionpackExtensions
  module ActionDispatch
    module Request
      module Utils
        def deep_munge(hash, keys = [])
          return hash unless perform_deep_munge
          hash.each do |k, v|
            keys << k
            case v
            when Array
              v.grep(Hash) { |x| deep_munge(x, keys) }
              v.compact!
            when Hash
              deep_munge(v, keys)
            end
            keys.pop
          end
          hash
        end
      end
    end
  end
end

Rails.configuration.to_prepare do
  ActionDispatch::Request::Utils.singleton_class
    .prepend ActionpackExtensions::ActionDispatch::Request::Utils
end
