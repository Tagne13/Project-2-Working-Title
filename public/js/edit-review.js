const editFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('input[name="review-title"]').value.trim();
    const description = document.querySelector('textarea[name="review-description"]').value.trim();
    const rating = document.querySelector('input[name="review-rating"').value.trim();
    const review_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const response = await fetch(`/api/reviews/${review_id}`, {
        method: 'PUT',
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
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.edit-review-form').addEventListener('submit', editFormHandler);