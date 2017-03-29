module Gitlab
  module Ci
    module Status
      module Build
        class FailedAllowed < SimpleDelegator
          include Status::Extended

          def label
            '失败（允许失败）'
          end

          def icon
            'icon_status_warning'
          end

          def group
            'failed_with_warnings'
          end

          def self.matches?(build, user)
            build.failed? && build.allow_failure?
          end
        end
      end
    end
  end
end
