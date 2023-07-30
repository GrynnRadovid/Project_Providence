from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LogoutView
from django.contrib.auth import login

@api_view(['GET'])
def about_page(request):
    return Response({'message': 'About page'})

@api_view(['GET'])
def contact_page(request):
    return Response({'message': 'Contact page'})

class UserRegistrationView(APIView):
    def post(self, request):
        # Use Django's built-in UserCreationForm to handle user registration
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            # Logic for user registration
            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'message': 'Registration failed'}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            # Logic for successful login
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            # Logic for failed login
            return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)

class UserLogoutView(LogoutView):
    def post(self, request):
        return super().post(request)  # Call the parent class method to perform the logout
