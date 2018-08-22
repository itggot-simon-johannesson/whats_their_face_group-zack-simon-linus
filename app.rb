class App < Sinatra::Base

  enable :sessions

  get '/' do
    puts Person.all
    slim :index
  end

=begin
  get '/guess_game/:class' do
    
    p session[:person_id] = Person.all(:class => params[:class].upcase)[]
  
    #session[:person_id] = Person.first(:offset => rand(Person.count), :class = params[:class]).id


    "random person is #{session[:person_id]}"

    session[:alternatives] = [0, 2, 3, 4]
  	slim :guess_game
  end

  get '/answer/:guess_id' do
    redirect '/' unless session[:person_id]
    the_person_guessed = Person.get(params[:guess_id])
    the_person_it_is = Person.get(session[:person_id])
    puts the_person_guessed.name
    puts the_person_it_is.name
    slim :answer
  end
=end
end