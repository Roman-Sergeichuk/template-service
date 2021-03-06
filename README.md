# template-service

Веб-сервис на node.js, который рендерит текстовые шаблоны со вставками на JavaScript.

## Функциональные возможности

Сервис имеет один POST-метод render, который:

- в запросе принимает текст шаблона и значения подстановок;
- в ответе возвращает отрендеренный шаблон или сообщение об ошибке (например, если шаблон не удалось распарсить);
- для передачи запроса и ответа использует JSON.

Шаблонизатор умеет обрабатывать вставки на языке JavaScript, заключенные в конструкцию вида:

    <? ... ?>

Для вывода значения подстановок используется конструкция вида:

    <?= subst_name ?>

## Запуск приложения

Для запуска приложения, склонируйте репозиторий:

    git clone https://github.com/Roman-Sergeichuk/template-service.git

Приложение написано на node.js 14.15.1. При необходимости установите данную версию командой:

    nvm install 14.15.1

Установите необходимые зависимости, выполнив команду:

    npm install

Запустите сервер, выполнив команду:

    npm start

## Запуск тестов

Для запуска тестов используйте команду:

    npm test

## Пример использования приложения

Для отправки запроса установите следующие параметры:

- request method: POST;
- URL: http://127.0.0.1:3000/render/;
- Content-Type: application/json;

В тело запроса поместите данные в следующем формате:

    {
    "template": "Hi I'm <?= name ?>. I'm <?= age ?>. My languages: <? for (let i = 0; i < languages.length; i++) { languages[i] } ?>",
    "substitutions": {
        "name": "Roman",
        "age": "34",
        "languages": ["russian", "english"]
        }
    }

Ответ при успешной обработке:

    status code: 200

    {
    "result": "Hi I'm Roman. I'm 34. My languages: russian, english"
    }
