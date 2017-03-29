module Gitlab
  module Ci
    module Status
      class Manual < Status::Core
        def text
          '手动的'
        end

        def label
          '手动操作'
        end

        def icon
          'icon_status_manual'
        end
      end
    end
  end
end
