const parser = (response, errorMessage) => {
  const regexp = /<rss version="2.0">/ig;
  const str = response.data.contents;
  if (regexp.test(str)) {
    const domParser = new DOMParser();
    console.log(str);
    return domParser.parseFromString(str, 'application/xml');
  }
  throw new Error(errorMessage);
};

export default parser;
