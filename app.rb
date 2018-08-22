class App < Sinatra::Base

  enable :sessions

  get '/' do
    slim :index
  end

  get '/guess_game' do
    @person = Person.first(:offset => rand(Person.count))
    puts @person.name
  	slim :guess_game
  end

end