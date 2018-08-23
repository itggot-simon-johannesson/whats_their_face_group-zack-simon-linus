class App < Sinatra::Base

  enable :sessions

  get '/' do
    puts Person.all
    slim :index
  end

  get '/guess_game/:class' do
    
    #p session[:person_id] = Person.all(:class => params[:class].upcase)[]

    person_query_result = repository(:default).adapter.select('SELECT id FROM people WHERE class LIKE ? ORDER BY random() LIMIT 1;', params[:class])

    redirect '/' unless person_query_result.length > 0
    
    session[:person_id] = person_query_result[0]
  
    #session[:person_id] = Person.first(:offset => rand(Person.count), :class = params[:class]).id


    puts "random person is #{session[:person_id]}"

    session[:alternatives] = [0, 2, 3, 4]
  	slim :guess_game
  end

  get '/answer/:guess_id' do
    redirect '/' unless session[:person_id]
    @the_person_guessed = Person.get(params[:guess_id])
    @the_person_it_is = Person.get(session[:person_id])
    slim :answer
  end
end