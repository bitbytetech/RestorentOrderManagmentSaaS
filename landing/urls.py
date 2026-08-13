from django.urls import path
from . import views

app_name = 'landing'

urlpatterns = [
    path('', views.index, name='home'),
    path('demo-menu/', views.demo_menu, name='demo_menu'),
    path('quick-signup/', views.quick_signup, name='quick_signup'),
]
