from django.conf.urls import url
from django.views.generic import TemplateView
from . import views


urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='stimmungspegel/index.html'), name='index'),
    url(r'^about$', TemplateView.as_view(template_name='stimmungspegel/about.html'), name='about'),
    url(r'^add$', views.add_location, name='add'),
    url(r'^api/getlocations$', views.get_locations, name='getlocations'),
    url(r'^api/getratings/(?P<location_id>[0-9]+)$', views.get_ratings, name='getratings'),
    url(r'^api/rate/(?P<location_id>[0-9]+)$', views.rate, name='rate'),
    url(r'^detail/(?P<pk>[0-9]+)$', views.LocationDetail.as_view(), name='detail'),
    url(r'^search$', TemplateView.as_view(template_name='stimmungspegel/search.html'), name='search'),
    url(r'^searchoptions$', TemplateView.as_view(template_name='stimmungspegel/searchoptions.html'), name='searchoptions'),
    url(r'^upload_audio/(?P<location_id>[0-9]+)$', views.upload_audio, name='upload_audio'),
]
