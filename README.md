# Hexlet Chat

### Hexlet tests and linter status:

[![Actions Status](https://github.com/Hex1er/js-react-development-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Hex1er/js-react-development-project-12/actions)

Hexlet Chat — упрощённый аналог Slack. Пользователи могут регистрироваться, входить в систему, обмениваться сообщениями в реальном времени и управлять каналами.

## Демо

[Открыть развёрнутое приложение](https://js-react-development-project-12-95qi.onrender.com)

## Возможности

- Регистрация, вход, выход и защищённые маршруты чата
- Обмен сообщениями и обновление каналов в реальном времени через Socket.IO
- Создание, переименование и удаление каналов
- Фильтрация нецензурной лексики в сообщениях и названиях каналов
- Валидация форм авторизации и управления каналами
- Всплывающие уведомления о действиях с каналами и сетевых ошибках
- Локализация интерфейса через i18next (ru/en)
- Отслеживание ошибок через Sentry SDK (Bugsink)

## Технологии

- React
- Vite
- Redux Toolkit и RTK Query
- React Router
- Socket.IO Client
- Formik и Yup
- React Bootstrap
- i18next
- leo-profanity
- Sentry SDK (Bugsink)

## Локальный запуск

Клонируйте репозиторий и установите зависимости (фронтенд и сервер):

```bash
make install
```

Соберите фронтенд и запустите сервер:

```bash
make build
make start
```

## Разработка

Для запуска фронтенда с горячей перезагрузкой (в отдельном терминале должен быть запущен сервер):

```bash
cd frontend
npm install
npm run dev
```

## Структура проекта

```text
frontend/
  src/
    components/       Переиспользуемые компоненты интерфейса
      modal/           Модальные окна управления каналами
    pages/             Страницы: логин, регистрация, чат, 404
    slices/            Redux-слайсы и RTK Query API
    locales/           Файлы переводов
    validationSchemas/ Схемы валидации Yup
    contexts/          React-контексты (сокет)
    hooks/             Пользовательские хуки
```
