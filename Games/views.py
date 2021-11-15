from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Scores
from django.http import HttpResponse


# Create your views here.
def index(request):
    return render(request, 'Games/index.html')


def game_render(request, game_name):
    scoreboard_sorted = Scores.objects.filter(game=game_name).order_by('-score')
    scoreboard_top10 = scoreboard_sorted[:10]
    if request.user.is_authenticated:
        user_scores = scoreboard_sorted.filter(user=request.user)[:10]
    else:
        user_scores = []
    context = {'game_name': game_name, 'scoreboard': scoreboard_top10, 'user_scores': user_scores}
    return render(request, 'Games/game_template.html', context)


def game1(request):
    game_name = 'Snake'
    return game_render(request, game_name)


def game2(request):
    game_name = 'Flappy_Bird'
    return game_render(request, game_name)


def game3(request):
    game_name = 'Blank'
    return game_render(request, game_name)


def register_request(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful.")
            return redirect("index")
        messages.error(request, "Unsuccessful registration. Invalid information.")
    form = UserCreationForm()
    return render(request=request, template_name="Games/register.html", context={"register_form": form})
