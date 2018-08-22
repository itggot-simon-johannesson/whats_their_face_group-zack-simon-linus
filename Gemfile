# Tell bundler where to fetch gems
source 'https://rubygems.org'

# Tell heroku and bundler which version of ruby to use
ruby '2.5.1'

# Gems used by all environments (development, production & test)
gem 'sinatra'
gem 'sinatra-partial'
gem 'data_mapper'
gem 'slim'
gem 'tilt', '~> 1.4.1' #temporary fix
gem 'racksh'

# Used during local development (on your own machine)
group :development do

  # Use SQLite
  gem 'dm-sqlite-adapter', group: :development
  gem 'rerun'
  gem 'thin'
  
end

# Used when running tests (rake test:[acceptance|models|routes])
group :test do

  gem 'rspec' # Use rspec to write tests
  gem 'capybara' # Use capybara to simulate a web browser (no javascript)
  gem 'selenium-webdriver' # Use selenium to programmatically control a web browser (javascript capable)

end
