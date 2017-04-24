关于  
----------------------
Git是一个非常好的东西 , 也是目前为止地球上最好的版本管理工具 . 但有些时候 , 我们更愿意我们能完全控制着代码 , 例如天朝公司所谓的'代码安全' , 于是乎我们使用了Gitlab . 但是Gitlab的全英文操作对于我们这些母语是中文的天朝程序猿/程序媛来说 , 操作起来确实有一点点的困难 . 于是 , 我利用业余时间 , 整理和汉化了Gitlab . 关于汉化 , 因为时间和精力 , 我将努力跟进每一个大版本并提供汉化 , 如果小版本修复了致命Bug也将跟进 .  
关于汉化内容 , 主要参考了gitlab.com/larryli/gitlab和gitlab.com/xhang/gitlab , 外加个人的一些汉化整理 ! 对于汉化的质量 , 也许包含一些不足的地方 , 如果您有更好的建议与意见 , 欢迎联系我或提Issues .  
by: 黄涛

CentOS 7 最小安装后操作  
----------------------
1. 设置时区  
  `timedatectl set-timezone Asia/Shanghai`
2. 添加 Gitlab 清华源
   1. `vi /etc/yum.repos.d/gitlab-ce.repo`
   2. [gitlab-ce]  
	  name=gitlab-ce  
	  baseurl=http://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7  
	  repo_gpgcheck=0  
	  gpgcheck=0  
	  enabled=1  
	  gpgkey=https://packages.gitlab.com/gpg.key
3. 添加 yum 163源并更新CentOS  
    `yum -y install wget`  
	`mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup`  
	`wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo`  
	`yum clean all && yum makecache && yum -y update`  
4. 安装依赖  
    `sudo yum -y install gcc gcc-c++ zlib-devel openssl-devel postgresql-devel patch libicu-devel libstdc++-devel cmake` 
5. 安装Ruby  
    `mkdir /tmp/ruby && cd /tmp/ruby`  
	`wget https://ruby.taobao.org/mirrors/ruby/2.3/ruby-2.3.3.tar.gz`  
	`tar xzf ruby-* && cd ruby-* && ./configure --disable-install-rdoc`  
	`make && make install`  
6. 安装GEM  
	`mkdir /tmp/gem && cd /tmp/gem`  
	`wget https://rubygems.org/rubygems/rubygems-2.6.11.tgz`  
	`tar xzf rubygems-* && cd rubygems-* && ruby setup.rb`  
7. 安装bundler  
	`gem install bundler --no-ri --no-rdoc`  
	`bundle config mirror.https://rubygems.org https://gems.ruby-china.org`
8. 安装Node.js  
	`cd /tmp && wget https://nodejs.org/download/release/v7.7.4/node-v7.7.4-linux-x64.tar.gz | tar xz`  
	`sudo tar --strip-components 1 -xzvf node-v* -C /usr/local`
9. 安装Yarn  
	`npm install --global yarn`  
	`yarn config set registry https://registry.npm.taobao.org`
10. 安装GItlab
	1. 安装最新Gitlab  
		`sudo yum install gitlab-ce`
	2. 安装指定版本  
		`cd /tmp && wget https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/gitlab-ce-9.0.0-ce.0.el7.x86_64.rpm`  
		`rpm -i gitlab-ce-9.0.0-*.rpm`  
11. 编辑gitlab.rb文件  
	1. `vi /etc/gitlab/gitlab.rb`
	2. 将`external_url 'http://localhost'`改成将`external_url 'http://您服务器的ip或域名'`
12. 汉化  
	`cd /opt && curl -LJO https://github.com/htve/GitlabForChinese/releases/download/v9.0.0.zh/v9.0.0.zh1.diff`  
	`patch -d /opt/gitlab/embedded/service/gitlab-rails -p1 < v9.0.0.*.diff`
13. 重新编译Assets (耗时大约20分钟)  
	`sudo gitlab-ctl reconfigure`  
    `rm -rf /opt/gitlab/etc/gitlab-rails/env/EXECJS_RUNTIME`  
	`cd /opt/gitlab/embedded/service/gitlab-rails && bundle install --deployment --without development test mysql aws kerberos`  
	`yarn install --production --pure-lockfile`  
	`NO_PRIVILEGE_DROP=true USE_DB=false bundle exec rake gitlab:assets:compile RAILS_ENV=production NODE_ENV=production` 
14. 配置gitlab  
	`sudo gitlab-ctl reconfigure`  
	`sudo gitlab-ctl restart`  
15. 开启防火墙  
    `firewall-cmd --zone=public --add-port=80/tcp --permanent`
    `firewall-cmd --reload`
    `systemctl restart firewalld.service` 

CentOS 7 安装后更新  
----------------------
1. 卸载已有Gitlab安装(放心,数据是安全的)  
	`yum -y remove gitlab-ce`  
2. 删除卸载后残留  
	`rm -rf /opt/gitlab`  
3. 执行安装的  
	10,12,13,14
