module Gitlab
  module Ci
    module Status
      module Pipeline
        class SuccessWithWarnings < SimpleDelegator
          include Status::Extended

          def text
            '通过'
          end

          def label
            '通过但有警告'
          end

          def icon
            'icon_status_warning'
          end

          def group
            'success_with_warnings'
          end

          def self.matches?(pipeline, user)
            pipeline.success? && pipeline.has_warnings?
          end
        end
      end
    end
  end
end
