class App < Sinatra::Base

  enable :sessions

  get '/' do
  	slim 'index'
  end

  get '/guess_game/?' do
  	slim 'guess_game'
  end

end