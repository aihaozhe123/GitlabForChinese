module Gitlab
  module Ci
    module Status
      class Canceled < Status::Core
        def text
          '已取消'
        end

        def label
          '已取消'
        end

        def icon
          'icon_status_canceled'
        end
      end
    end
  end
end
