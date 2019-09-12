const getHash = word => {
  const hash = window.location.hash;

  if (hash.includes(word)) {
    const cleanHash = hash.replace(hash, '');
    return cleanHash;
  }

  return null;
}

export { getHash }
