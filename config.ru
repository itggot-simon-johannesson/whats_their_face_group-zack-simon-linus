# Use bundler to load gems
require 'bundler'

# Load gems from Gemfile
Bundler.require

# Load settings for development/production/test environments
require_relative 'config/environment'

DataMapper.auto_upgrade!

@person = Person.new(:name => 'aiden garcia', :class => '4T', :image_path => 'images/4T aiden garcia.jpg')
@person.save

# Start the application
run App