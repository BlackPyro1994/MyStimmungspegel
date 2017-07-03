from django.shortcuts import get_object_or_404, render
from django.views.generic import DetailView
from django.http import *
from stimmungspegel import models
from stimmungspegel import serializers


class LocationDetail(DetailView):
    model = models.Location
    template_name = 'stimmungspegel/detail.html'
    context_object_name = 'location'


def get_locations(request):
    """
    Gibt eine Liste von 'Location'-Objeckten zurück, Aufruf über AJAX.

    Die Auswahl kann über Parameter eingegrenzt werden:
        * Längengrad, Breitengrad und Suchradius ('lon', 'lat' und 'radius')

    @return Array von Locations als JSON,
            HTTP400 (Bad request) wenn 'lon', 'lat' und 'radius' nicht vorhanden oder fehlerhaft
            HTTP405 (Method not allowed) bei Aufruf mit falscher HTTP Methode
    """
    if request.is_ajax() and request.method == 'GET':
        data = request.GET
        try:
            lat = float(data['lat'])
            lon = float(data['lon'])
            radius = float(data['radius'])
            ret = []
            # FIXME: Die performance der folgenden drei Zeilen wird sooo scheiße sein...
            for location in models.Location.objects.all():
                if location.distance_to(lat, lon) <= radius:
                    ret.append(location)
        except (ValueError, KeyError):
            return HttpResponseBadRequest()
        ser = serializers.LocationSerializer(ret, many=True)
        return JsonResponse(ser.data, safe=False)
    raise HttpResponseNotAllowed(['GET'])


def rate(request, location_id):
    if request.method == 'POST' and request.is_ajax():
        location = get_object_or_404(models.Location, id=location_id)
        rating = models.Rating()
        rating.location = location
        rating.value = int(request.POST['rating'])
        rating.save()
        return JsonResponse({'location_id': location_id, 'new_rating': location.rating})
    return HttpResponseNotAllowed(['POST'])


def get_ratings(request, location_id):
    ratings = models.Rating.objects.filter(location_id=location_id).order_by('-date')[:20]
    ser = serializers.RatingSerializer(ratings, many=True)
    return JsonResponse(ser.data, safe=False)


def upload_audio(request, location_id):
    if request.method == 'POST' and request.is_ajax():
        location = get_object_or_404(models.Location, id=location_id)
        snippet = models.AudioSnippet()
        snippet.location = location
        snippet.data = request.FILE['snippet']
        snippet.save()
        return HttpResponse(status=200)
    return HttpResponseNotAllowed(['POST'])


def search(request):
    pass


def add_location(request):
    if request.method == 'POST':
        try:
            loc = models.Location()
            loc.name = request.POST['name']
            loc.type = int(request.POST['kind'])
            loc.admission = request.POST['admission']
            loc.beer_price = request.POST['beer_price']
            loc.address = request.POST['street']
            loc.zipcode = request.POST['zipcode']
            loc.city = request.POST['city']
            loc.save()
            return HttpResponseRedirect(loc.get_absolute_url())
        except KeyError:
            return HttpResponseBadRequest()
    else:
        return render(request, "stimmungspegel/add.html")
