// import information object
import { information } from "./index.js";

// utility function to convert runtime in the form (72h3m0.5s) to minutes
function convertRuntimeToMinutes(runtime) {
  let minutes = 0;

  // regular expression to match the runtime string
  const hourMatch = runtime.match(/(\d+)h/);
  const minuteMatch = runtime.match(/(\d+)m/);

  // add hours to minutes if present
  if (hourMatch) {
    minutes += parseInt(hourMatch[1], 10) * 60;
  }

  // add remaining minutes if present
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

  // after year references
  if (preferences["afterYear(inclusive)"]) {
    if (parseInt(movie.Year) >= preferences["afterYear(inclusive)"].value) {
      score += preferences["afterYear(inclusive)"].weight;
    }
  }

  // before year preference
  if (preferences["beforeYear(exclusive)"]) {
    if (parseInt(movie.Year) < preferences["beforeYear(exclusive)"].value) {
      score += preferences["beforeYear(exclusive)"].weight;
    }
  }

  // age rating preference
  if (preferences["maximumAgeRating(inclusive)"]) {
    if (movie.Rated <= preferences["maximumAgeRating(inclusive)"].value) {
      score += preferences["maximumAgeRating(inclusive)"].weight;
    }
  }

  // runtime preference
  if (preferences["shorterThan(exclusive)"]) {
    const movieRuntime = convertRuntimeToMinutes(movie.Runtime);
    const preferenceRuntime = convertRuntimeToMinutes(
      preferences["shorterThan(exclusive)"].value
    );
    if (movieRuntime < preferenceRuntime) {
      score += preferences["shorterThan(exclusive)"].weight;
    }
  }

  // genre preference
  if (preferences.favoriteGenre) {
    const genreList = movie.Genre.split(", ");
    for (let i = 0; i < genreList.length; i++) {
      if (genreList[i] === preferences.favoriteGenre.value) {
        score += preferences.favoriteGenre.weight;
      }
    }
  }

  // director preference
  if (preferences.leastFavoriteDirector) {
    if (movie.Director !== preferences.leastFavoriteDirector.value) {
      score += preferences.leastFavoriteDirector.weight;
    }
  }

  // actor preference
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

  // plot element preference
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

  // rotten Tomatoes score preference
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
  return rankedMovies;
}

// function to determine final optimal ranking
function determineOptimalRanking(information) {
  const individualRankings = information.people.map((person) => ({
    name: person.name,
    rankedMovies: rankMoviesForPerson(information.movies, person),
  }));

  // initialize array to store imdbID for each movie and corresponding score
  const movieScores = {};

  // calculate scores for each movie based on individual rankings
  individualRankings.forEach((ranking) => {
    ranking.rankedMovies.forEach((movie, index) => {
      const movieID = information.movies.find(
        (m) => m.Title === movie.title
      ).imdbID;
      // if the movie does not have a score, initialize it to 0
      if (!movieScores[movieID]) {
        movieScores[movieID] = 0;
      }
      // add points to a particular movie based on where it is in the persons ranking
      movieScores[movieID] += information.movies.length - index;
    });
  });

  // create the optimal ranking as an array of IMDb IDs, sorted by score
  const optimalRanking = Object.keys(movieScores)
    .map((imdbID) => ({ imdbID, score: movieScores[imdbID] }))
    .sort((a, b) => b.score - a.score)
    .map((movie) => movie.imdbID);

  return optimalRanking;
}

export { determineOptimalRanking };
