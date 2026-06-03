class Task < ApplicationRecord
    belongs_to :tag, optional: true

    validates :priority, numericality: { only_integer: true, greater_than: 0 }
    validates :title, presence: true
end
