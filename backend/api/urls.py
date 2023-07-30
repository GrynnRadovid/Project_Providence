from django.urls import path
from django.contrib.auth import views as auth_views
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    about_page,
    contact_page,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='user-login'),
    path('logout/', auth_views.LogoutView.as_view(), name='user-logout'),
    path('about/', about_page, name='about-page'),
    path('contact/', contact_page, name='contact-page'),
]
