module Projects
  class ParticipantsService < BaseService
    attr_reader :noteable

    def execute(noteable)
      @noteable = noteable

      project_members = sorted(project.team.members)
      participants = noteable_owner + participants_in_noteable + all_members + groups + project_members
      participants.uniq
    end

    def noteable_owner
      return [] unless noteable && noteable.author.present?

      [{
        name: noteable.author.name,
        username: noteable.author.username,
        avatar_url: noteable.author.avatar_url
      }]
    end

    def participants_in_noteable
      return [] unless noteable

      users = noteable.participants(current_user)
      sorted(users)
    end

    def sorted(users)
      users.uniq.to_a.compact.sort_by(&:username).map do |user|
        { username: user.username, name: user.name, avatar_url: user.avatar_url }
      end
    end

    def groups
      current_user.authorized_groups.sort_by(&:path).map do |group|
        count = group.users.count
        { username: group.full_path, name: group.full_name, count: count, avatar_url: group.avatar_url }
      end
    end

    def all_members
      count = project.team.members.flatten.count
      [{ username: "所有", name: "所有项目和群组成员", count: count }]
    end
  end
end
