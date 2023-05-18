const commentFormHandler = async (event) => {
    event.preventDefault();

    const description = document.querySelector('textarea[name="comment-description"]').value.trim();
    const review_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (description) {
        const response = await fetch('api/comments', {
            method: 'POST',
            body: JSON.stringify({
                review_id,
                description
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);