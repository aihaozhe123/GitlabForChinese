module Gitlab
  module Ci
    module Status
      class Failed < Status::Core
        def text
          '已失败'
        end

        def label
          '已失败'
        end

        def icon
          'icon_status_failed'
        end
      end
    end
  end
end
