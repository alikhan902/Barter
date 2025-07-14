from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import Ad, ExchangeProposal


class APITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user1', password='pass123')
        self.other_user = User.objects.create_user(username='user2', password='pass123')
        self.client = APIClient()

    def test_register(self):
        response = self.client.post('/api/signup/', {
            'username': 'newuser',
            'password': 'newpassword123',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_login_logout(self):
        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Войти
        response = self.client.post('/api/login/', {
            'username': 'user1',
            'password': 'pass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ad_create_and_list(self):
        self.client.login(username='user1', password='pass123')
        response = self.client.post('/api/Ad/', {
            'title': 'Test Ad',
            'description': 'Ad Description',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        Ad.objects.create(user=self.other_user, title='Other Ad', description='Other desc')

        response = self.client.get('/api/Ad/')
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Other Ad')

    def test_my_cards(self):
        Ad.objects.create(user=self.user, title='My Ad 1', description='Desc')
        Ad.objects.create(user=self.other_user, title='Other Ad', description='Other desc')

        self.client.login(username='user1', password='pass123')
        response = self.client.get('/api/my_cards/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'My Ad 1')

    def test_exchange_proposal_filter(self):
        ad1 = Ad.objects.create(user=self.other_user, title='Other Ad', description='Other desc')
        proposal = ExchangeProposal.objects.create(
            ad_sender=Ad.objects.create(user=self.user, title='My Ad', description='Desc'),
            ad_receiver=ad1
        )

        self.client.login(username='user2', password='pass123')  
        response = self.client.get('/api/ExchangeProposal/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
