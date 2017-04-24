module Gitlab
  module Ci
    module Status
      module Pipeline
        class Blocked < SimpleDelegator
          include Status::Extended

          def text
            '已阻塞'
          end

          def label
            '等待手动操作'
          end

          def self.matches?(pipeline, user)
            pipeline.blocked?
          end
        end
      end
    end
  end
end
