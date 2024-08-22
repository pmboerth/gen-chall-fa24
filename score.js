// import information object
import { information } from "./index.js";

// utility function to convert runtime in the form "72h3m0.5s" to minutes
function convertRuntimeToMinutes(runtime) {
  const parts = runtime.match(/(\d+)h(\d+)m(\d+)s/);
  const hours = parseInt(parts[1]);
  const minutes = parseInt(parts[2]);
  const seconds = parts[3] ? parseInt(parts[3]) : 0;
  return hours * 60 + minutes + seconds / 60;
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
    const movieRuntime = movie.Runtime.replace(" min", "");
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

// function to determine final optimal ranking
function determineOptimalRanking(information) {
  let todo = [];
  
  for (let movie of information.movies) {
    let movieScore = 0;
    for (let person of information.people) {
      movieScore += calculateMovieScore(movie, person.preferences);
    }
    todo.push({"movieID": movie.imdbID, "score": movieScore})
  }

  todo.sort((a, b) => b.score - a.score);
  let ranking = todo.map((movie) => movie.movieID);

  return ranking;
}

export { determineOptimalRanking, convertRuntimeToMinutes };
