from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LogoutView
from django.contrib.auth import login, authenticate
from django import forms
from oauth2_provider.decorators import protected_resource

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@protected_resource()
def about_page(request):
    return Response({'message': 'About page'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@protected_resource()
def contact_page(request):
    return Response({'message': 'Contact page'})

class UserRegistrationForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)
    email = forms.EmailField()

class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        form = UserRegistrationForm(request.data)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']

            try:
                user = User.objects.create_user(username=username, email=email, password=password)
                return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
            except:
                return Response({'message': 'Registration failed'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        form = AuthenticationForm(data=request.data)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        return Response({'message': 'Please use POST request to log in'}, status=status.HTTP_200_OK)

class UserLogoutView(LogoutView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        super().post(request)  # Call the parent class method to perform the logout
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
