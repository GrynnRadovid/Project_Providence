from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

@api_view(['GET'])
def about_page(request):
    return Response({'message': 'About page'})

@api_view(['GET'])
def contact_page(request):
    return Response({'message': 'Contact page'})

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Additional logic for user registration
            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        # Logic for user login
        return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)

class UserLogoutView(APIView):
    def post(self, request):
        # Logic for user logout
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
