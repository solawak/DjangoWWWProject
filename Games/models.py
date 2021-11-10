from django.conf import settings
from django.db import models

class Scores(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    score = models.PositiveIntegerField()
    game = models.CharField(max_length=32)

    def __str__(self):
        return f"{self.user}: {self.score} in {self.game}"
