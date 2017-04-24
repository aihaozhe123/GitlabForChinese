class ProtectedTag::CreateAccessLevel < ActiveRecord::Base
  include ProtectedTagAccess

  validates :access_level, presence: true, inclusion: { in: [Gitlab::Access::MASTER,
                                                             Gitlab::Access::DEVELOPER,
                                                             Gitlab::Access::NO_ACCESS] }

  def self.human_access_levels
    {
      Gitlab::Access::MASTER => "主程序猿",
      Gitlab::Access::DEVELOPER => "开发人员 + 主程序猿",
      Gitlab::Access::NO_ACCESS => "没有人"
    }.with_indifferent_access
  end

  def check_access(user)
    return false if access_level == Gitlab::Access::NO_ACCESS

    super
  end
end
