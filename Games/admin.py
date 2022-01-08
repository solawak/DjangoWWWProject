from django.contrib import admin

#admin - admin1password - admin@gmail.com
# Register your models here.
from .models import Scores
admin.site.register(Scores)
