const createFormHandler = async (event) => {
  event.preventDefault();

  const title = document
    .querySelector('input[name="review-title"]')
    .value.trim();
  const description = document
    .querySelector('textarea[name="review-description"]')
    .value.trim();
  const rating = document
    .querySelector('input[name="review-rating"]')
    .value.trim();
  const apiUrl = `/retrieve-album?albumName=${title}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then(async (data) => {
      if (data.data && data.data.length > 0) {
        const response = await fetch(`api/reviews`, {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            rating,
            albumId: data.data[0].id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          document.location.replace("/");
        } else {
          alert(response.statusText);
        }
      } else {
        alert("Album name not found");
      }
    });
};

document
  .querySelector(".new-review-form")
  .addEventListener("submit", createFormHandler);
