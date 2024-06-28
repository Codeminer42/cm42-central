module Enumerable
  # The method '#sort_by' is unstable. When two keys are equal, the order of
  # the corresponding elements is unpredictable. For this reason, we do the
  # workaround below to guarantee the correct order.
  # https://groups.google.com/g/comp.lang.ruby/c/JcDGbaFHifI/m/2gKpc9FQbCoJ?pli=1
  def guaranteed_sort_by(&block)
    n = 0
    self.sort_by do |element|
      n += 1
      [yield(element), n]
    end
  end
end
