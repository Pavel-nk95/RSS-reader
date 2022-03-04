const parser = (response) => {
  const regexp = /<rss version="2.0">/i;
  const str = response.data;
  if (regexp.test(str)) {
    const domParser = new DOMParser();
    return domParser.parseFromString(str, 'application/xml');
  }
  throw new Error('Resource does not contain valid rss');
};

export default parser;
