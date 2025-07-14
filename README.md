Иструкция по запуску:
1. Создать и активировать виртуальное пространство
2. Прописать pip install -r requirements.txt для установки всех нужных библиотек
3.Перейти в корневую папку проекта. Создать и активировать миграции командами
python manage.py makemigrations
python manage.py migrate
4. Запустить проект командой
python manage.py runserver
///
Для запуска тестов ввести команду python manage.py test
