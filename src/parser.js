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
  try {
    const str = response.data.contents;
    const domParser = new DOMParser();
    const data = domParser.parseFromString(str, 'application/xml');
    const channel = data.querySelector('channel');
    const items = Array.from(channel.children).filter(({ localName }) => (localName === 'item'));
    const posts = parseData(items);
    const feed = parseData([channel]);
    return { posts, feed };
  } catch (error) {
    throw new Error('not contain valid');
  }
};

export default parser;
