
// Utility function to convert runtime to minutes
function convertRuntimeToMinutes(runtime) {
    const parts = runtime.match(/(\d+)h(\d+)m/);
    return parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
  }
  
  // Utility function to extract Rotten Tomatoes score
  function getRottenTomatoesScore(ratings) {
    const rtRating = ratings.find(rating => rating.Source === "Rotten Tomatoes");
    return rtRating ? parseInt(rtRating.Value.replace('%', ''), 10) : 0;
  }