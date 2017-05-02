from django.shortcuts import render


def index(request):
    return render(request, 'stimmungspegel/index.html')


def search(request):
    return render(request, 'stimmungspegel/search.html')

def add(request):
    return render(request, 'stimmungspegel/add.html')
