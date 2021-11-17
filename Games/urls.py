from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('snake/', views.snake, name="snake"),
    path('flappy/', views.flappy, name="flappy"),
    path('game3/', views.game3, name="game3"),
    path('register/', views.register_request, name='register'),
]