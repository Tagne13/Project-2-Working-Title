const btn = document.querySelector(".comment-btn");

const commentFormHandler = async (event) => {
  event.preventDefault();

  const description = document
    .querySelector('textarea[name="comment-description"]')
    .value.trim();
  const review_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  if (description) {
    const response = await fetch("/api/comments/", {
      method: "POST",
      body: JSON.stringify({
        review_id,
        description,
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
  }
};

btn.addEventListener("click", commentFormHandler);
