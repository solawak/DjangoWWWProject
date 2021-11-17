from django import forms
from .models import Scores


class GameForm(forms.ModelForm):
    class Meta:
        model = Scores
        fields = ["score"]
        labels = {"score": "Your Score"}