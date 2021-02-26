defmodule Hangman.Game do
  # This module doesn't do stuff,
  # it computes stuff.


  def new do
    %{
      secret: random_secret(),
      observers: MapSet.new(),
      players: MapSet.new(),
      players_ready: %{},

      guesses: %{},
      current_guesses: %{},

      game_started: false,


      view: "",


      # secret: random_secret(),
      # view: [],
      # players: MapSet.new(),
      
      # winLoss: %{}, 
      # lastWiners: [],
      
    }
  end

  def addUser(st, name) do
    IO.puts "addUser:"
    IO.puts name

    observers = MapSet.put(st.observers, name)

    %{
      secret: st.secret,
      observers: observers,
      players: st.players,
      players_ready: st.players_ready,

      guesses: st.guesses,
      current_guesses: st.current_guesses,

      game_started: st.game_started,


      view: st.view,
      

      # secret: st.secret,
      # view: [],
      # players: MapSet.put(st.players, name),
      # guesses: Map.put(st.guesses, name, []),

      # winLoss: Map.put(st.winLoss, name, %{:win => 0, :loss => 0}),

      # lastWiners: st.lastWiners,
    }
  end

  def addPlayer(st, name) do
    observers = MapSet.delete(st.observers, name)
    players = MapSet.put(st.players, name)
    players_ready = Map.put(st.players_ready, name, false)
    
    guesses = Map.put(st.guesses, name, [])

    current_guesses = Map.put(st.current_guesses, name, "")

    %{
      secret: st.secret,
      observers: observers,
      players: players,
      players_ready: players_ready,

      guesses: guesses,
      current_guesses: current_guesses,

      game_started: st.game_started,

      view: st.view,
      
    }
  end

  def addObserver(st, name) do
    observers = MapSet.put(st.observers, name)
    players = MapSet.delete(st.players, name)
    players_ready = Map.delete(st.players_ready, name)

    guesses = Map.delete(st.guesses, name)
    current_guesses = Map.delete(st.current_guesses, name)

    %{
      secret: st.secret,
      observers: observers,
      players: players,
      players_ready: players_ready,

      guesses: guesses,
      current_guesses: current_guesses,

      game_started: st.game_started,

      view: st.view,
      
    }
  end

  def ready(st, name) do
    
    players_ready = Map.put(st.players_ready, name, true)
    game_started = Enum.all?(Map.values(players_ready))

    

    %{
      secret: st.secret,
      observers: st.observers,
      players: st.players,
      players_ready: players_ready,

      guesses: st.guesses,
      current_guesses: st.current_guesses,

      game_started: game_started,

      view: st.view,
      
    }
  end

  def notReady(st, name) do

    players_ready = Map.put(st.players_ready, name, false)

    %{
      secret: st.secret,
      observers: st.observers,
      players: st.players,
      players_ready: players_ready,

      guesses: st.guesses,
      current_guesses: st.current_guesses,

      game_started: st.game_started,

      view: st.view,
      
    }
  end

  

  defp updateArr(guess, secret, arr, idx) do
    if Enum.member?(guess, Enum.at(secret, idx)) do
       if Enum.at(guess, idx) == Enum.at(secret, idx) do
         [Enum.at(arr, 0) + 1, Enum.at(arr, 1)]
       else
         [Enum.at(arr, 0), Enum.at(arr, 1) + 1]
       end
     else
       arr
     end
   end
 
   defp numberOfBullsAndCows(guess, secret, arr, idx) do
     
     cond do 
       idx == Enum.count(secret) -> [Integer.to_string(Enum.at(arr, 0)), Integer.to_string(Enum.at(arr, 1))]
       true -> numberOfBullsAndCows(guess,
        secret,
         updateArr(guess, secret, arr, idx),
          idx + 1)
     end
   end
 
   defp renderView(st, guesses, acc) do
     
     if Enum.count(guesses) == 0 do
       acc
     else
       
       numBC = numberOfBullsAndCows(String.graphemes(Enum.at(guesses, 0)), String.graphemes(st.secret), [0, 0], 0)
       renderView(st,
        Enum.slice(guesses, 1, Enum.count(guesses) - 1),
       acc 
       <> " " 
       <> Enum.at(guesses,0) 
       <> " "
       <> Enum.at(numBC,0) 
       <> "B "
       <> Enum.at(numBC,1) 
       <> "C"
       <> "\n")
     end
   end

  defp notEmptyString(value) do
    
    result = false
    result = if value != "" do
              true
            end
    result
  end

  def guess(st, codeGuess, name) do
    
    persons_new_guesses = (Map.get(st.guesses, name) ++ [codeGuess])
    
    guesses = Map.put(st.guesses, name, persons_new_guesses)


    
    # guesses = st.guesses
    current_guesses = Map.put(st.current_guesses, name, codeGuess)

    has_guess_list = Enum.map(current_guesses, fn({k, v}) -> notEmptyString(v) end)
    
    flag = Enum.all?(has_guess_list)

    if flag do
      # Map.new(current_guesses, fn {k, v} -> {k, (Map.get(st.guesses, k) ++ [v])} end)
      # st.guesses
      IO.puts "Got into the flag"
    end

    # current_guesses = if Enum.all?(Map.values(current_guesses), fn(v) -> v != "" end) do
    #   # Map.new(current_guesses, fn {k, v} -> {k, ""} end)
    #   current_guesses
    # end

    

    %{
      secret: st.secret,
      observers: st.observers,
      players: st.players,
      players_ready: st.players_ready,

      guesses: guesses,
      current_guesses: current_guesses,

      game_started: st.game_started,

      view: st.view,
      
      # secret: st.secret,
      # view: st.view,
      # players: st.players,
      # guesses: guesses,
      

      # ##Todo change
      # winLoss: st.winLoss,

      # lastWiners: st.lastWiners,
  
      
    }
  end

  
  def reset(st) do

    #guesses = Map.new(st.guesses, fn {k, v} -> {k, []} end)

    %{
      secret: random_secret(),
      observers: st.observers,
      players: st.players,
      players_ready: st.players_ready,

      guesses: st.guesses,
      current_guesses: st.current_guesses,

      game_started: st.game_started,

      view: st.view,

      
      # secret: random_secret(),
      # view: [],
      # guesses: guesses,
      # players: st.players,

      # winLoss: st.winLoss,

      # lastWiners: st.lastWiners,
    }

  end

  def view(st, name) do
    
    # view = []
    # apple = ""
    # apple = if Map.has_key?(st.guesses, "ted") do
    #   IO.puts name
    #   IO.puts "gotintotheif!"
    #   IO.puts "ted attempted to render:"
    #   IO.puts Map.get(st.guesses, name)
    #   renderView(st, Map.get(st.guesses, "ted"), "")
    # end
    # view = view ++ [apple]

    # view = Enum.map(st.guesses, fn({k, v}) -> (k <> "\n" <> renderView(st, v, "")) end)


    # winLoss = Enum.map(st.winLoss, fn({k, v}) -> (k <> ": " <> Integer.to_string(Map.get(v, :win)) <> "W " <> Integer.to_string(Map.get(v, :loss)) <> "L") end)
    #winLoss = []
    values = Map.values(st.guesses)
    

    view = Enum.map(st.guesses, fn({k, v}) -> (k <> "\n" <> renderView(st, v, "")) end)

    %{
      
      observers: MapSet.to_list(st.observers),
      players: MapSet.to_list(st.players),
      players_ready: st.players_ready,

      guesses: st.guesses,
      current_guesses: st.current_guesses,

      game_started: st.game_started,

      view: view,
      

      # view: view,
      # guesses: st.guesses,
      name: name,
      # players: MapSet.to_list(st.players),

      # winLoss: winLoss,
      # lastWiners: st.lastWiners,

    }
  end




  def build_secret(secret) do
    if String.length(secret) == 4 do
      secret
    else
      new_val = Integer.to_string(Enum.random(0..9))
      if secret =~ new_val do
        build_secret(secret)
      else
        build_secret(secret <> new_val)
      end
    end
  end

  def random_secret() do
    build_secret("")
  end
end