module Gitlab
  module Ci
    module Status
      class Running < Status::Core
        def text
          '运行中'
        end

        def label
          '运行中'
        end

        def icon
          'icon_status_running'
        end
      end
    end
  end
end
