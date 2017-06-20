from django.conf.urls import url
from django.views.generic import TemplateView
from . import views


urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='stimmungspegel/index.html'), name='index'),
    url(r'^add$', TemplateView.as_view(template_name='stimmungspegel/add.html'), name='add'),
    url(r'^search$', TemplateView.as_view(template_name='stimmungspegel/search.html'), name='search'),
    url(r'^about$', TemplateView.as_view(template_name='stimmungspegel/about.html'), name='about'),
    url(r'^searchoptions$', TemplateView.as_view(template_name='stimmungspegel/searchoptions.html'), name='searchoptions'),

    url(r'^detail/(?P<pk>[0-9]+)$', views.LocationDetail.as_view(), name='detail'),

    url(r'^api/getlocations$', views.get_locations, name='getlocations'),
    url(r'^api/rate/(?P<location_id>[0-9]+)$', views.rate, name='rate'),
    url(r'^api/getratings/(?P<location_id>[0-9]+)$', views.get_ratings, name='getratings'),
]
