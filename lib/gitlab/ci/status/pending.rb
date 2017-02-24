module Gitlab
  module Ci
    module Status
      class Pending < Status::Core
        def text
          '等待中'
        end

        def label
          '等待中'
        end

        def icon
          'icon_status_pending'
        end
      end
    end
  end
end
