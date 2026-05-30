class Task < ApplicationRecord
    validates :priority, numericality: { only_integer: true, greater_than: 0 }
    
end
