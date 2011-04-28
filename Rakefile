require 'rubygems'
require File.join(File.dirname(__FILE__), 'config.rb')
include Config

task :default => ["build:iphone"]

namespace :project do
  desc "Get project information"
  task :info do
    puts "#{PROJECT_NAME} at version #{PROJECT_VERSION}."
    puts " App ID: #{APP_ID}."
    puts " App Name: #{APP_NAME}."
    puts " Building for: #{APP_DEVICE}."
    puts "  Using iOS SDK Version #{IPHONE_SDK_VERSION}."
    puts "  Using Android Version #{ANDROID_SDK_VERSION}."
    puts "  Titanium Build Version #{TI_SDK_VERSION}."
  end
end


desc "Compile Coffee files"
task :compile do
  compile
end

namespace :build do
  desc "Build the app for the iPhone"
  task :iphone do
    build
  end
end

def compile
  puts "Compiling CoffeeScript"
  
  # TODO: APP_NAME needs to be changed to the real name, but set dynamically.
  # `coffee -p --join --bare #{paths.join(' ')} > Resources/#{APP_NAME}.js`
  `coffee -p --bare src/app.coffee > Resources/app.js`
end

def build(options={})
  compile
  system `tt_run iphone`
end
