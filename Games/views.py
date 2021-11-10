from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse


# Create your views here.
def index(request):
    return render(request, 'Games/index.html')


def game1(request):
    context = {'game_name': 'Game1'}
    return render(request, 'Games/game_template.html', context)


def game2(request):
    context = {'game_name': 'Game2'}
    return render(request, 'Games/game_template.html', context)


def game3(request):
    context = {'game_name': 'Game3'}
    return render(request, 'Games/game_template.html', context)


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
