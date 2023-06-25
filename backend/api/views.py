from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Additional logic for user registration
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        # Logic for user login
        data = {'message': 'User login successful'}
        return Response(data, status=status.HTTP_200_OK)

class UserLogoutView(APIView):
    def post(self, request):
        # Logic for user logout
        return Response(status=status.HTTP_204_NO_CONTENT)
