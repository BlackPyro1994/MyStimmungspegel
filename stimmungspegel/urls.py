from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^add$', views.add, name='add'),
    url(r'^search$', views.search, name='search'),
    url(r'^about$', views.about, name='about'),
    url(r'^searchoptions$', views.searchoptions, name='searchoptions'),
]
