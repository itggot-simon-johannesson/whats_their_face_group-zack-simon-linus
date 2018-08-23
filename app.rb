class App < Sinatra::Base

  enable :sessions

  get '/' do
    @classes = repository(:default).adapter.select('SELECT DISTINCT class FROM people')
    slim :index
  end

  get '/guess_game/:class' do
    session[:alternatives] = repository(:default).adapter.select('SELECT id FROM people WHERE class LIKE ? ORDER BY random() LIMIT 4;', params[:class])
    session[:person_id] = session[:alternatives].sample
  	slim :guess_game
  end

  get '/answer/:guess_id' do
    redirect '/' unless session[:person_id]

    @the_person_guessed = Person.get(params[:guess_id])
    @the_person_it_is = Person.get(session[:person_id])

    if @the_person_guessed.id == @the_person_it_is.id
      @message = "Your guess is correct :D"
    else
      @message = "Your guess is wrong !!! >:("
    end

    slim :answer
  end
end