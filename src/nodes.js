const findNodes = (i18nInstance) => {
  const nodes = {
    container: document.querySelector('div.d-flex'),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    main: document.querySelector('.main'),
    title: document.querySelector('h1.title'),
    description: document.querySelector('p.lead'),
    add: document.querySelector('button.add'),
    example: document.querySelector('.text-muted'),
    footerContent: document.querySelector('.footer-content'),
    message: document.querySelector('p.feedback'),
    content: document.querySelector('.content'),
    postsTitle: document.querySelector('.posts-title'),
    feedsTitle: document.querySelector('.feeds-title'),
    postsList: document.querySelector('.posts-list'),
    feedsList: document.querySelector('.feeds-list'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-body'),
    modalBtnClose: document.querySelector('.close'),
    modalBtnReadAll: document.querySelector('.read-all'),
  };

  nodes.title.textContent = i18nInstance.t('static.title');
  nodes.description.textContent = i18nInstance.t('static.description');
  nodes.add.textContent = i18nInstance.t('buttons.add');
  nodes.example.textContent = i18nInstance.t('static.example');
  nodes.footerContent.textContent = i18nInstance.t('static.footerContent');
  nodes.input.setAttribute(
    'placeholder',
    i18nInstance.t('static.placeholder'),
  );
  nodes.postsTitle.textContent = i18nInstance.t('static.posts');
  nodes.feedsTitle.textContent = i18nInstance.t('static.feeds');

  return nodes;
};

export default findNodes;
