from django.urls import reverse
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class UserRegistrationViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('user-registration')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }

    def test_user_registration(self):
        response = self.client.post(self.url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'message': 'Registration successful'})

    def test_user_registration_invalid_data(self):
        invalid_data = {
            'username': '',
            'email': 'testexample.com',  # Missing @ symbol
            'password': '123'
        }
        response = self.client.post(self.url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_user_registration(self):
        # First registration
        self.client.post(self.url, self.user_data)
        # Attempt to register the same user again
        response = self.client.post(self.url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UserLoginViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('user-login')
        self.protected_url = reverse('protected-resource') # Replace with your actual protected URL
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.login_data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }

    def test_user_login(self):
        self.client.force_login(self.user)
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK) # Assuming a successful access returns 200 OK

        # Access a protected resource
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK) # Assuming a successful access returns 200 OK

    def test_user_login_invalid_password(self):
        self.login_data['password'] = 'wrongpassword'
        response = self.client.post(self.url, self.login_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Attempt to access the protected resource
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # Assuming unauthorized access returns 401

    def test_user_login_nonexistent_username(self):
        self.login_data['username'] = 'nonexistentuser'
        response = self.client.post(self.url, self.login_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Attempt to access the protected resource
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # Assuming unauthorized access returns 401




class UserLoginLogoutTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('user-login')
        self.logout_url = reverse('user-logout')
        self.protected_url = reverse('protected-resource')
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.login_data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
    def test_user_login_logout(self):
        # Log in
        response = self.client.post(self.login_url, self.login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

        # Access a protected resource
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK) # Assuming a successful access returns 200 OK

        # Log out
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Attempt to access the protected resource again
        response = self.client.get(self.protected_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) # Assuming unauthorized access returns 401