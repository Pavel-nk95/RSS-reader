const createUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.append('disableCache', true);
  urlWithProxy.searchParams.append('url', url);
  return urlWithProxy.toString();
};

export default createUrl;
