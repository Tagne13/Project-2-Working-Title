const deleteFormHandler = async (event) => {
    event.preventDefault();

    const review_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const response = await fetch(`/api/reviews/${review_id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        document.location.replace('/homepage');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.delete-review.btn').addEventListener('click', deleteFormHandler);