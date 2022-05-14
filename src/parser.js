const parseData = (data) => data.map((node) => {
  const title = node.querySelector('title').textContent;
  const link = node.querySelector('link').textContent;
  const description = node.querySelector('description').textContent;
  return {
    title,
    link,
    description,
  };
});

const parser = (content) => {
    const domParser = new DOMParser();
    const data = domParser.parseFromString(content, 'application/xml');
    const channel = data.querySelector('channel');
    const items = Array.from(channel.querySelectorAll('item'));
    const posts = parseData(items);
    const feed = parseData([channel]);
    return { posts, feed };
};

export default parser;
