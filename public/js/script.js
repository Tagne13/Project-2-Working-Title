const fetch = require('isomorphic-fetch');

const albumTitle = 'Watch my moves';
const apiUrl = `https://api.deezer.com/search/album?q=${encodeURIComponent(albumTitle)}`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    if (data.data && data.data.length > 0) {
      const albumId = data.data[0].id;
      const albumUrl = `https://api.deezer.com/album/${albumId}`;
      return fetch(albumUrl);
    } else {
      throw new Error('No albums found');
    }
  })
  .then(response => response.json())
  .then(albumData => {
    console.log(albumData);

    const albumTitle = albumData.title;
    const artistName = albumData.artist.name;
    const coverImage = albumData.cover_medium;

    console.log('Album Title:', albumTitle);
    console.log('Artist Name:', artistName);
    console.log('Cover Image:', coverImage);

  })
  .catch(error => {
    console.error('Error:', error);
  });




