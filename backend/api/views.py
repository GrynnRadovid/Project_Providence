from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LogoutView
from django.contrib.auth import login, authenticate
from django import forms
from django.views.generic import View
from django.http import JsonResponse


@api_view(['GET'])
def about_page(request):
    return Response({'message': 'About page'})

@api_view(['GET'])
def contact_page(request):
    return Response({'message': 'Contact page'})

class ProtectedResourceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = {
            "status": "success",
            "message": "This is a placeholder for the protected resource endpoint.",
        }
        return Response(data, status=status.HTTP_200_OK)
    
class UserRegistrationForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)
    email = forms.EmailField()


class UserRegistrationView(APIView):
    def post(self, request):
        form = UserRegistrationForm(request.data)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']

            try:
                user = User.objects.create_user(username=username, email=email, password=password)
                # Logic for user registration
                return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
            except:
                return Response({'message': 'Registration failed'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)  # Log the user in
            return Response({
                'message': 'Login successful',
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)


class UserLogoutView(APIView):
    def post(self, request):
        from django.contrib.auth import logout
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
