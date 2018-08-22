class App < Sinatra::Base

  enable :sessions
  require_relative './public/main.css'
  get '/' do
  	"Hello, Sinatra!"
  end

  

end