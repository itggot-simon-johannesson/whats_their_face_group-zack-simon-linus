class App < Sinatra::Base

  enable :sessions

  before do
    @classes = repository(:default).adapter.select('SELECT DISTINCT class FROM people')
  end

  get '/' do
    slim :index
  end

  get '/guess_game/:class' do
    @minigame = params[:minigame]
    redirect '/' unless @minigame
    redirect "/memory_game/#{params[:class]}?minigame=memory_game" if @minigame == "memory_game"
    redirect "/learn_game/#{params[:class]}?minigame=learn_their_name" if @minigame == "learn_their_name"

    @all_people = repository(:default).adapter.select('SELECT id, name, class, image_path FROM people WHERE class LIKE ? ORDER BY random() LIMIT 4;', params[:class])
    @the_person_it_is = @all_people.sample

    session[:alternatives] = @all_people.map{|person| person.id}
    session[:person_id] = @the_person_it_is.id

    slim :guess_game
  end

  get '/learn_game/:class' do
    @people = repository(:default).adapter.select('SELECT id, name, class, image_path FROM people WHERE class LIKE ?;', params[:class])
    @people_json = "[#{@people.map{|person| person.to_h.to_json}.join(',')}]"
    slim :learn_game
  end

  get '/memory_game/:class' do
    @people = repository(:default).adapter.select('SELECT id, name, class, image_path FROM people WHERE class LIKE ? ORDER BY random() LIMIT 8;', params[:class])
    func = ->(person, isset){person.to_h.merge({is_image: isset}).to_json}
    @cards_json = "[#{@people.flat_map{|person| [func.call(person, true), func.call(person, false)]}.shuffle().join(',')}]"
    slim :memory_game
  end

  get '/hangman_game/:class' do
    @person_json = repository(:default).adapter.select('SELECT id, name, class, image_path FROM people WHERE class LIKE ? ORDER BY random() LIMIT 1;', params[:class]).first.to_h.to_json
    slim :hangman
  end

  get '/answer/:guess_id' do
    redirect '/' unless session[:person_id] or @minigame

    @minigame = params[:minigame]
    @the_person_guessed = Person.get(params[:guess_id])
    @the_person_it_is = Person.get(session[:person_id])

    @is_correct = @the_person_guessed.id == @the_person_it_is.id

    if @is_correct
      @message = "Your guess is correct :D"
    else
      @message = "Your guess is wrong !!! >:("
    end

    slim :answer
  end

  def partial(page, options={}, &block)        
      if block_given?
          slim page, options.merge!(:layout => false), @locals, &block
      else
          slim page, options.merge!(:layout => false), @locals
      end
  end

end