defmodule Bulls.Game do
  # This module doesn't do stuff,
  # it computes stuff.

  def new do
    %{
      secret: random_secret(),
      view: "",
      gameWon: false,
      guesses: [],
      lives: 8,
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

  defp gameCheck(st, letter) do
    cond do
      letter == st.secret -> true
      true -> false
    end
  end


  def guess(st, letter) do

    guesses = st.guesses ++[letter]
    view = renderView(st, guesses, "")


    %{
      secret: st.secret,
      view: view,
      gameWon: gameCheck(st, letter),
      guesses: guesses,
      lives: st.lives - 1
    }
  end

  def view(st) do
    %{
      #secret: st.secret,
      view: st.view,
      gameWon: st.gameWon,
      guesses: st.guesses,
      lives: st.lives
    }
  end

  def has_duplicates?(list) do
    Enum.uniq(list) != list
  end

  def random_secret() do
    random_number = :rand.uniform(8999) + 1000
    output = String.graphemes(Integer.to_string(random_number))
    if has_duplicates?(output) do
      random_secret()
    else
      Enum.join(output, "")
    end
  end
end