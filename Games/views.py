from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def index(request):
    return render(request, 'Games/index.html')


def game1(request):
    context = {'game_name' : 'Game1'}
    return render(request, 'Games/game_template.html', context)


def game2(request):
    context = {'game_name' : 'Game2'}
    return render(request, 'Games/game_template.html', context)


def game3(request):
    context = {'game_name' : 'Game3'}
    return render(request, 'Games/game_template.html', context)
