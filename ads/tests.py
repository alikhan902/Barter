from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Ad, ExchangeProposal, Condition, Status

class AdExchangeTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass1234')
        self.user2 = User.objects.create_user(username='user2', password='pass1234')

        self.ad1 = Ad.objects.create(user=self.user1, title='Bike', description='Mountain bike', category='Transport', condition=Condition.NEW)
        self.ad2 = Ad.objects.create(user=self.user2, title='Laptop', description='Gaming laptop', category='Electronics', condition=Condition.USED)

        self.client1 = APIClient()
        self.client1.login(username='user1', password='pass1234')

        self.client2 = APIClient()
        self.client2.login(username='user2', password='pass1234')

    def test_create_ad(self):
        data = {
            'title': 'Phone',
            'description': 'Smartphone',
            'category': 'Electronics',
            'condition': Condition.NEW
        }
        response = self.client1.post('/api/Ad/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ad.objects.count(), 3)

    def test_edit_own_ad(self):
        data = {'title': 'Bike - Updated'}
        response = self.client1.patch(f'/api/Ad/{self.ad1.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ad1.refresh_from_db()
        self.assertEqual(self.ad1.title, 'Bike - Updated')

    def test_edit_foreign_ad_forbidden(self):
        data = {'title': 'Hack attempt'}
        response = self.client1.patch(f'/api/Ad/{self.ad2.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_ad(self):
        response = self.client1.delete(f'/api/Ad/{self.ad1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Ad.objects.filter(id=self.ad1.id).exists())

    def test_delete_foreign_ad_forbidden(self):
        response = self.client1.delete(f'/api/Ad/{self.ad2.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_search_ads(self):
        response = self.client1.get('/api/Ad/', {'search': 'Laptop'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Laptop')

    def test_filter_ads_by_category(self):
        response = self.client1.get('/api/Ad/', {'category': 'Electronics'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_exchange_proposal(self):
        data = {
            'ad_sender': self.ad1.id,
            'ad_receiver': self.ad2.id,
            'comment': 'Wanna trade?'
        }
        response = self.client1.post('/api/ExchangeProposal/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ExchangeProposal.objects.count(), 1)

    def test_view_own_received_proposals(self):
        ExchangeProposal.objects.create(ad_sender=self.ad1, ad_receiver=self.ad2, comment='Let’s trade')
        response = self.client2.get('/api/ExchangeProposal/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_view_other_user_proposals_forbidden(self):
        ExchangeProposal.objects.create(ad_sender=self.ad1, ad_receiver=self.ad2, comment='Let’s trade')
        response = self.client1.get('/api/ExchangeProposal/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
