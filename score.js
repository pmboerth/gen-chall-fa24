// utility function to convert runtime to minutes (72h3m0.5s)
function convertRuntimeToMinutes(runtime) {
  let minutes = 0;
  
  // Regular expression to match the runtime string
  const hourMatch = runtime.match(/(\d+)h/);
  const minuteMatch = runtime.match(/(\d+)m/);

  // Add hours to minutes if present
  if (hourMatch) {
    minutes += parseInt(hourMatch[1], 10) * 60;
  }

  // Add remaining minutes if present
  if (minuteMatch) {
    minutes += parseInt(minuteMatch[1], 10);
  }

  return minutes;
}

// utility function to extract Rotten Tomatoes score
function getRottenTomatoesScore(ratings) {
  const rtRating = ratings.find(
    (rating) => rating.Source === "Rotten Tomatoes"
  );
  return rtRating ? parseInt(rtRating.Value.replace("%", ""), 10) : 0;
}

// function that calculates a movie score based on a person and their preferences
function calculateMovieScore(movie, preferences) {
  // initialize score to 0 to start
  let score = 0;

  // Year preferences
  if (preferences["afterYear(inclusive)"]) {
    if (parseInt(movie.Year) >= preferences["afterYear(inclusive)"].value) {
      score += preferences["afterYear(inclusive)"].weight;
    }
  }

  if (preferences["beforeYear(exclusive)"]) {
    if (parseInt(movie.Year) < preferences["beforeYear(exclusive)"].value) {
      score += preferences["beforeYear(exclusive)"].weight;
    }
  }

  // Age rating preference
  if (preferences["maximumAgeRating(inclusive)"]) {
    if (movie.Rated <= preferences["maximumAgeRating(inclusive)"].value) {
      score += preferences["maximumAgeRating(inclusive)"].weight;
    }
  }

  // Runtime preference
  if (preferences["shorterThan(exclusive)"]) {
    const movieRuntime = convertRuntimeToMinutes(movie.Runtime);
    const preferenceRuntime = convertRuntimeToMinutes(
      preferences["shorterThan(exclusive)"].value
    );
    if (movieRuntime < preferenceRuntime) {
      score += preferences["shorterThan(exclusive)"].weight;
    }
  }

  // Genre preference
  if (preferences.favoriteGenre) {
    const genreList = movie.Genre.split(", ");
    for (let i = 0; i < genreList.length; i++) {
      if (genreList[i] === preferences.favoriteGenre.value) {
        score += preferences.favoriteGenre.weight;
      }
    }
  }

  // Director preference
  if (preferences.leastFavoriteDirector) {
    if (movie.Director !== preferences.leastFavoriteDirector.value) {
      score += preferences.leastFavoriteDirector.weight;
    }
  }

  // Actor preference
  if (preferences.favoriteActors) {
    let matchingActors = 0;
    const actors = movie.Actors.split(", ");

    for (let i = 0; i < preferences.favoriteActors.value.length; i++) {
      for (let j = 0; j < actors.length; j++) {
        if (preferences.favoriteActors.value[i] === actors[j]) {
          matchingActors += 1;
        }
      }
    }
    score += matchingActors * preferences.favoriteActors.weight;
  }

  // Plot element preference
  if (preferences.favoritePlotElements) {
    const plotElements = preferences.favoritePlotElements.value;
    for (let i = 0; i < plotElements.length; i++) {
      const element = plotElements[i].toLowerCase();
      if (movie.Plot.toLowerCase().includes(element)) {
        score += preferences.favoritePlotElements.weight;
        break;
      }
    }
  }

  // Rotten Tomatoes score preference
  if (preferences.minimumRottenTomatoesScore) {
    const rtScore = getRottenTomatoesScore(movie.Ratings);
    if (rtScore >= preferences.minimumRottenTomatoesScore.value) {
      score += preferences.minimumRottenTomatoesScore.weight;
    }
  }

  return score;
}

// function that finds the optimal ranking of movies for each person
function rankMoviesForPerson(movies, person) {
  const rankedMovies = information.movies.map((movie) => ({
    title: movie.Title,
    score: calculateMovieScore(movie, person.preferences),
  }));

  rankedMovies.sort((a, b) => b.score - a.score);
  console.log(rankedMovies);
}