from django.urls import path, include
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
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('openid/', include('oidc_provider.urls', namespace='oidc_provider')),
]
