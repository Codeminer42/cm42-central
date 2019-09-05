const getHash = key => {
  switch (key) {
    case 'story':
      const match = window.location.hash.match(/#story-(\d+).*/);

      if(match) {
        return parseInt(match[1]) || null;
      }

      return null
    default:
      const [, rest] = window.location.hash.split(`${key}=`)

      if (rest) {
        return rest.split('&')[0]
      }

      return null
  }
}

export { getHash }
