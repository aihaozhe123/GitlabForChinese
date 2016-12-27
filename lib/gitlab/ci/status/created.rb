module Gitlab
  module Ci
    module Status
      class Created < Status::Core
        def text
          '已创建'
        end

        def label
          '已创建'
        end

        def icon
          'icon_status_created'
        end
      end
    end
  end
end
