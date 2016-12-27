class SlackService < ChatNotificationService
  def title
    'Slack通知'
  end

  def description
    '在Slack上接收事件通知'
  end

  def to_param
    'slack'
  end

  def help
    '此服务会向您的Slack频道发送通知。<br />
    设置此服务：
    <ol>
      <li>在Slack团队中添加一个<a href="https://slack.com/apps/A0F7XDUAZ-incoming-webhooks">传入的Webhook</a> 。可以为每个事件覆盖默认通道。</li>
      <li>将 <strong>Webhook URL</strong> 粘贴到以下字段中。</li>
      <li>选择以下事件以启用通知。频道和用户名是可选的。</li>
    </ol>'
  end

  def fields
    default_fields + build_event_channels
  end

  def default_fields
    [
      { type: 'text', name: 'webhook', placeholder: 'https://hooks.slack.com/services/...' },
      { type: 'text', name: 'username', placeholder: '用户名' },
      { type: 'checkbox', name: 'notify_only_broken_builds' },
      { type: 'checkbox', name: 'notify_only_broken_pipelines' },
    ]
  end

  def default_channel_placeholder
    "#general"
  end
end
