module Gitlab
  module Ci
    module Status
      class Skipped < Status::Core
        def text
          '已跳过'
        end

        def label
          '已跳过'
        end

        def icon
          'icon_status_skipped'
        end
      end
    end
  end
end
