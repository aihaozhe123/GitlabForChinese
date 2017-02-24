module Gitlab
  module Ci
    module Status
      class Success < Status::Core
        def text
          '已通过'
        end

        def label
          '已通过'
        end

        def icon
          'icon_status_success'
        end
      end
    end
  end
end
