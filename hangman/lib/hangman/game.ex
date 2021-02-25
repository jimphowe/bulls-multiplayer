defmodule Hangman.Game do
  # This module doesn't do stuff,
  # it computes stuff.

  def new do
    %{
      secret: random_secret(),
      view: "",
      guesses: [],
      players: MapSet.new(),
    }
  end

  def addUser(st, name) do
    %{
      st | players: MapSet.put(st.players, name),
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

  def guess(st, codeGuess) do
    
    guesses = st.guesses ++ [codeGuess]
    view = renderView(st, guesses, "")
    

    %{
      secret: st.secret,
      view: view,
      guesses: guesses,
      players: st.players,
    }
  end
  

  def view(st, name) do
    %{
      view: st.view,
      guesses: st.guesses,
      name: name,
      players: MapSet.to_list(st.players)
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