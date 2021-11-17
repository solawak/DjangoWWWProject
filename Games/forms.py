from django import forms
from .models import Scores


class GameForm(forms.ModelForm):
    class Meta:
        model = Scores
        #fields = ["user", "score", "game"]
        #labels = {'user': "Username", "score": "Your Score", "game":"Game"}
        fields = ["score"]
        labels = {"score": "Your Score"}