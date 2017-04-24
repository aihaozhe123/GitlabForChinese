module Gitlab
  module Graphs
    class Commits
      attr_reader :commits, :start_date, :end_date, :duration,
        :commits_per_week_days, :commits_per_time, :commits_per_month

      def initialize(commits)
        @commits = commits
        @start_date = commits.last.committed_date.to_date
        @end_date = commits.first.committed_date.to_date
        @duration = (@end_date - @start_date).to_i

        collect_data
      end

      def authors
        @authors ||= @commits.map(&:author_email).uniq.size
      end

      def commit_per_day
        @commit_per_day ||= @commits.size / (@duration + 1)
      end

      def get_chinese_weekday(date_num_string)
        case date_num_string
          when '0'
            return '星期日'
          when '1'
            return '星期一'
          when '2'
            return '星期二'
          when '3'
            return '星期三'
          when '4'
            return '星期四'
          when '5'
            return '星期五'
          when '6'
            return '星期六'
        end
      end

      def collect_data
        @commits_per_week_days = {get_chinese_weekday('0')=>0,get_chinese_weekday('1')=>0,get_chinese_weekday('2')=>0,get_chinese_weekday('3')=>0,get_chinese_weekday('4')=>0,get_chinese_weekday('5')=>0,get_chinese_weekday('6')=>0}

        @commits_per_time = {}
        (0..23).to_a.each { |hour| @commits_per_time[hour] = 0 }

        @commits_per_month = {}
        (1..31).to_a.each { |day| @commits_per_month[day] = 0 }

        @commits.each do |commit|
          hour = commit.committed_date.strftime('%k').to_i
          day_of_month = commit.committed_date.strftime('%e').to_i
          weekday = get_chinese_weekday(commit.committed_date.strftime('%w'))

          @commits_per_week_days[weekday] ||= 0
          @commits_per_week_days[weekday] += 1
          @commits_per_time[hour] ||= 0
          @commits_per_time[hour] += 1
          @commits_per_month[day_of_month] ||= 0
          @commits_per_month[day_of_month] += 1
        end
      end
    end
  end
end
