/* eslint-disable no-param-reassign */
const renderFeeds = (data, elements) => {
  const list = elements.feedsList;
  list.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm0');
    h3.textContent = `${item.title}`;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = `${item.description}`;
    li.append(h3);
    li.append(p);
    list.append(li);
  });
};

const renderPosts = (data, elements, i18nInstance) => {
  const list = elements.postsList;
  list.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const link = document.createElement('a');
    link.setAttribute('href', `${item.link}`);
    link.classList.add('fw-bold');
    link.setAttribute('target', '_blank');
    link.textContent = `${item.title}`;
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.dataset.id = item.id;
    btn.dataset.feedId = item.feedId;
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18nInstance.t('buttons.view');
    li.append(link);
    li.append(btn);
    list.append(li);
  });
};

const render = (elements, i18nInstance) => (path, value, prevValue) => {
  if (path === 'valid' && value) {
    if (!prevValue) {
      elements.message.classList.remove('text-danger');
    }
    elements.input.classList.remove('is-invalid');
    elements.message.classList.add('text-success');
    elements.message.textContent = i18nInstance.t('messages.correct');
    elements.content.classList.remove('visually-hidden');
  }

  if (path === 'feeds') {
    renderFeeds(value, elements);
  }

  if (path === 'posts') {
    renderPosts(value, elements, i18nInstance);
  }

  if (path === 'error' && value !== '') {
    elements.input.classList.add('is-invalid');
    elements.message.classList.remove('text-success');
    elements.message.classList.add('text-danger');
    elements.message.textContent = value;
  }
  elements.form.reset();
  elements.input.focus();
};

export default render;
