const parseData = (data) => data.map((nodes) => {
  const children = Array.from(nodes.children);
  const [title] = children.filter((item) => item.localName === 'title');
  const [link] = children.filter((item) => item.localName === 'link');
  const [description] = children.filter(({ localName }) => (localName === 'description'));
  return {
    title: title.textContent,
    link: link.textContent,
    description: description.textContent,
  };
});

const parser = (response) => {
  const regexp = /<rss|version="2\.0"|channel/gi;
  const str = response.data.contents;
  if (regexp.test(str)) {
    const domParser = new DOMParser();
    const data = domParser.parseFromString(str, 'application/xml');
    const channel = data.querySelector('channel');
    const items = Array.from(channel.children).filter(({ localName }) => (localName === 'item'));
    const posts = parseData(items);
    const feed = parseData([channel]);
    return { posts, feed };
  }
  throw new Error('not contain valid URL');
};

export default parser;
