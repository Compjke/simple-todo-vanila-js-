const TODOS_KEY = 'todos';

export const saveInLS = (key = TODOS_KEY, item) => {
	localStorage.setItem(key, JSON.stringify(item));
};

export const getFromLS = (key = TODOS_KEY) => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};

export const formatDate = (date) =>
	Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	}).format(date);
