class BambooService < CiService
  include ReactiveService

  prop_accessor :bamboo_url, :build_key, :username, :password

  validates :bamboo_url, presence: true, url: true, if: :activated?
  validates :build_key, presence: true, if: :activated?
  validates :username,
    presence: true,
    if: ->(service) { service.activated? && service.password }
  validates :password,
    presence: true,
    if: ->(service) { service.activated? && service.username }

  attr_accessor :response

  after_save :compose_service_hook, if: :activated?
  before_update :reset_password

  def compose_service_hook
    hook = service_hook || build_service_hook
    hook.save
  end

  def reset_password
    if bamboo_url_changed? && !password_touched?
      self.password = nil
    end
  end

  def title
    'Atlassian Bamboo CI'
  end

  def description
    '持续集成和构建服务器'
  end

  def help
    '您必须在Bamboo中设置自动修订标记和存储库触发器。'
  end

  def self.to_param
    'bamboo'
  end

  def fields
    [
        { type: 'text', name: 'bamboo_url',
          placeholder: 'Bamboo 网址，例如https://bamboo.example.com' },
        { type: 'text', name: 'build_key',
          placeholder: 'Bamboo 构建计划键，例如KEY' },
        { type: 'text', name: 'username',
          placeholder: '具有API访问权限的用户（如果适用）' },
        { type: 'password', name: 'password' },
    ]
  end

  def build_page(sha, ref)
    with_reactive_cache(sha, ref) {|cached| cached[:build_page] }
  end

  def commit_status(sha, ref)
    with_reactive_cache(sha, ref) {|cached| cached[:commit_status] }
  end

  def execute(data)
    return unless supported_events.include?(data[:object_kind])

    get_path("updateAndBuild.action?buildKey=#{build_key}")
  end

  def calculate_reactive_cache(sha, ref)
    response = get_path("rest/api/latest/result?label=#{sha}")

    { build_page: read_build_page(response), commit_status: read_commit_status(response) }
  end

  private

  def read_build_page(response)
    if response.code != 200 || response['results']['results']['size'] == '0'
      # If actual build link can't be determined, send user to build summary page.
      URI.join("#{bamboo_url}/", "browse/#{build_key}").to_s
    else
      # If actual build link is available, go to build result page.
      result_key = response['results']['results']['result']['planResultKey']['key']
      URI.join("#{bamboo_url}/", "browse/#{result_key}").to_s
    end
  end

  def read_commit_status(response)
    return :error unless response.code == 200 || response.code == 404

    status = if response.code == 404 || response['results']['results']['size'] == '0'
               'Pending'
             else
               response['results']['results']['result']['buildState']
             end

    if status.include?('Success')
      'success'
    elsif status.include?('Failed')
      'failed'
    elsif status.include?('Pending')
      'pending'
    else
      :error
    end
  end

  def build_url(path)
    URI.join("#{bamboo_url}/", path).to_s
  end

  def get_path(path)
    url = build_url(path)

    if username.blank? && password.blank?
      HTTParty.get(url, verify: false)
    else
      url << '&os_authType=basic'
      HTTParty.get(url, verify: false,
                        basic_auth: {
                          username: username,
                          password: password
                        })
    end
  end
end
