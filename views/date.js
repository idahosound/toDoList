exports = function () {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let day = today.toLocaleDateString('en-US', options);
  let year = today.getFullYear();
  return {
    day: day,
    year: year
  }
}
