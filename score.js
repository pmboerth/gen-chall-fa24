// utility function to convert runtime to minutes (72h3m0.5s)
function convertRuntimeToMinutes(runtime) {
  const parts = runtime.match(/(\d+)h(\d+)m/);
  return parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
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
  if (preferences.afterYear) {
    if (parseInt(movie.Year) >= preferences.aferYear.value) {
      score += preferences.afterYear.weight;
    }
  }

  if (preferences.beforeYear) {
    if (parseInt(movie.Year) >= preferences.aferYear.value) {
      score += preferences.afterYear.weight;
    }
  }
  
  // Age rating preference
  if (preferences.maximumAgeRating) {
    if (movie.Rated <= preferences.maximumAgeRating.value) {
        score += preferences.maximumAgeRating.weight;
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
    for (let i = 0; i < preferences.favoriteActors.length()) {

    }
  }

  // Genre preference
  if (preferences.favoriteGenre) {
  }

  // Plot element preference
  if (preferences.favoritePlotElements) {
  }

  // Runtime preference
  if (preferences.shorterThan) {
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
