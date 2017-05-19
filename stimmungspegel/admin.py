from django.contrib import admin
from stimmungspegel.models import Location, Rating, AudioSnippet

admin.site.register([Location, Rating, AudioSnippet])
