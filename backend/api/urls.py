from django.urls import path
from . import views
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    about_page,
    contact_page,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('about/', about_page, name='about-page'),
    path('contact/', contact_page, name='contact-page'),
    path('protected-resource/', views.ProtectedResourceView.as_view(), name='protected-resource'),
]
