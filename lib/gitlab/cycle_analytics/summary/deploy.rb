module Gitlab
  module CycleAnalytics
    module Summary
      class Deploy < Base
        def value
          @value ||= @project.deployments.where("created_at > ?", @from).count
        end
        def title
          '部署'
        end
      end
    end
  end
end
