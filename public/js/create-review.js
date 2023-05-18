const createFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('input[name="review-title"]').value.trim();
    const description = document.querySelector('textarea[name="review-description"]').value.trim();
    const rating = document.querySelector('input[name="review-rating"').value.trim();

    const response = await fetch(`api/reviews`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            description,
            rating
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/homepage');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-review-form').addEventListener('submit', createFormHandler);