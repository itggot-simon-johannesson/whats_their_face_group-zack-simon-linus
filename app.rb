class App < Sinatra::Base

  enable :sessions

  get '/' do
    @classes = repository(:default).adapter.select('SELECT DISTINCT class FROM people')
    slim :index
  end

  get '/guess_game/:class' do

  session[:guessed_correct] = []

  one_not_guessed_correct = false
  none_valid_answers = []

  while one_not_guessed_correct == false
    answers = repository(:default).adapter.select('SELECT id FROM people WHERE class LIKE ? ORDER BY random() LIMIT 4;', params[:class])

    if session[:guessed_correct].size > 0
      for person in session[:guessed_correct]
        if answers.include?(person)
          p "hej"
            none_valid_answers << person
        else
          one_not_guessed_correct = true
        end
      end
    else
      one_not_guessed_correct = true
    end

  end

  if none_valid_answers.size > 0
    session[:person_id] = false
    while session[:person_id] == false
      for none_valid_answer in none_valid_answers
        p "hej"
        answer = answers.sample
        session[:person_id] = answer unless answer == none_valid_answer
      end
    end
  else
    session[:person_id] = answers.sample
  end

  p none_valid_answers
  p answers
  p session[:guessed_correct]


    #redirect '/' unless person_query_result.length > 0

    puts "random person is #{session[:person_id]}"

    session[:alternatives] = [0, 2, 3, 4]
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