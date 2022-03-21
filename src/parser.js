const parseData = (data) => data.map((node) => {
  const children = Array.from(node.children);
  const [title] = children.filter((item) => item.localName === 'title');
  const [link] = children.filter((item) => item.localName === 'link');
  const [description] = children.filter((item) => item.localName === 'description');
  return {
    title: title.textContent,
    link: link.textContent,
    description: description.textContent,
  };
});

const parser = (response, errorMessage) => {
  const regexp = /<rss|version="2\.0"|channel/ig;
  const str = response.data.contents;
  if (regexp.test(str)) {
    const domParser = new DOMParser();
    const data = domParser.parseFromString(str, 'application/xml');
    const [channel] = Array.from(data.activeElement.children).filter((item) => item.localName === 'channel');
    const items = Array.from(channel.children).filter((item) => item.localName === 'item');
    const posts = parseData(items);
    const feed = parseData([channel]);
    return { posts, feed };
  }
  throw new Error(errorMessage);
};

export default parser;
