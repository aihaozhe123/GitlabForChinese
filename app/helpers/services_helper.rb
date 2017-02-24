module ServicesHelper
  def service_event_description(event)
    case event
    when "push", "push_events"
      "事件将通过推送到存储库来触发"
    when "tag_push", "tag_push_events"
      "将新标签推送到存储库时将触发事件"
    when "note", "note_events"
      "当有人添加评论时将触发事件"
    when "issue", "issue_events"
      "创建/更新/关闭问题时将触发事件"
    when "confidential_issue", "confidential_issue_events"
      "创建/更新/关闭机密问题时将触发事件"
    when "merge_request", "merge_request_events"
      "创建/更新/合并合并请求时将触发事件"
    when "build", "build_events"
      "构建状态更改时将触发事件"
    when "wiki_page", "wiki_page_events"
      "创建/更新Wiki页面时将触发事件"
    when "commit", "commit_events"
      "创建/更新提交时将触发事件"
    end
  end

  def service_event_field_name(event)
    event = event.pluralize if %w[merge_request issue confidential_issue].include?(event)
    "#{event}_events"
  end

  extend self
end
