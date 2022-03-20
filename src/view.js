/* eslint-disable no-param-reassign */
const render = (elements, i18nInstance) => (path, value, prevValue) => {
  if (path === 'valid' && value) {
    if (!prevValue) {
      elements.message.classList.remove('text-danger');
    }
    if (value) {
      elements.input.classList.remove('is-invalid');
      elements.message.classList.add('text-success');
      elements.message.textContent = i18nInstance.t('messages.correct');
    }
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
