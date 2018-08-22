class App < Sinatra::Base

  enable :sessions
  require_relative './main.css'
  get '/' do
  	"Hello, Sinatra!"
  end

  

end