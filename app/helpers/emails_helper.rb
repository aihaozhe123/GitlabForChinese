module EmailsHelper
  include AppearancesHelper

  # Google Actions
  # https://developers.google.com/gmail/markup/reference/go-to-action
  def email_action(url)
    name = action_title(url)
    if name
      data = {
        "@context" => "http://schema.org",
        "@type" => "EmailMessage",
        "action" => {
          "@type" => "ViewAction",
          "name" => name,
          "url" => url,
          }
        }

      content_tag :script, type: 'application/ld+json' do
        data.to_json.html_safe
      end
    end
  end

  def action_title(url)
    return unless url
    %w(merge_requests issues commit).each do |action|
      if url.split("/").include?(action)
        return "View #{action.humanize.singularize}"
      end
    end

    nil
  end

  def password_reset_token_valid_time
    valid_hours = Devise.reset_password_within / 60 / 60
    if valid_hours >= 24
      unit = '天'
      valid_length = (valid_hours / 24).floor
    else
      unit = '小时'
      valid_length = valid_hours.floor
    end

    pluralize(valid_length, unit, unit)
  end

  def reset_token_expire_message
    link_tag = link_to('申请', new_user_password_url(user_email: @user.email))
    msg = "此链接在 #{password_reset_token_valid_time}内有效。"
    msg << "过期后请重新#{link_tag}。"
  end

  def header_logo
    if brand_item && brand_item.header_logo?
      image_tag(
        brand_item.header_logo,
        style: 'height: 50px'
      )
    else
      image_tag(
        image_url('mailers/gitlab_header_logo.gif'),
        size: "55x50",
        alt: "GitLab"
      )
    end
  end
end
