from rest_framework import routers
from .views import AdAPI, ExchangeProposalAPI, LoginAPIView, LogoutAPIView, RegisterView, MyCardsAPIView
from django.urls import path, include
from django.views.generic import TemplateView

router = routers.SimpleRouter()
router.register(r'Ad', AdAPI)
routerEx = routers.SimpleRouter()
routerEx.register(r'ExchangeProposal', ExchangeProposalAPI)

urlpatterns = [
    # API
    path('api/', include(router.urls)),
    path('api/', include(routerEx.urls)),
    path('api/signup/', RegisterView.as_view(), name='signup_api'),
    path('api/login/', LoginAPIView.as_view(), name='login_api'),
    path('api/logout/', LogoutAPIView.as_view(), name='api-logout'),
    path('api/my_cards/', MyCardsAPIView.as_view(), name='my_cards'),
    
    # Front-end
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('register/', TemplateView.as_view(template_name='register.html'), name='register-page'),
    path('login/', TemplateView.as_view(template_name='login.html'), name='register-page'),
    path('ads/<int:pk>/', TemplateView.as_view(template_name='card.html'), name='ad-detail'),
    path('ads/', TemplateView.as_view(template_name='cards.html'), name='ad-detail'),
    path('ads/my_cards/', TemplateView.as_view(template_name='my_cards.html'), name='ad-detail'),
    path('ads/card_make/', TemplateView.as_view(template_name='card_make.html'), name='card-make'),
    path('exchange/', TemplateView.as_view(template_name='my_exchange.html'), name='exchange'),
    path('exchange/<int:pk>/', TemplateView.as_view(template_name='exchange_proposal_detail.html'), name='exchange'),
]