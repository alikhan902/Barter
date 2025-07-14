from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .pagination import AdPagination
from .models import Ad, ExchangeProposal
from .serializers import AdSerializer, ProposalSerializer, RegisterSerializer
from rest_framework.response import Response
from rest_framework import status, filters, viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsNotAuthenticated, IsOwnerOrReadOnly
from rest_framework import filters as drf_filters
from django_filters.rest_framework import DjangoFilterBackend

class AdAPI(viewsets.ModelViewSet):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly] 
    pagination_class = AdPagination
    filter_backends = [DjangoFilterBackend, drf_filters.SearchFilter]
    filterset_fields = ['category', 'condition']
    search_fields = ['title', 'description']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        user = self.request.user
        if self.action == 'list' and user.is_authenticated:
            return Ad.objects.exclude(user=user)
        return Ad.objects.all()
    
class ExchangeProposalAPI(viewsets.ModelViewSet):
    queryset = ExchangeProposal.objects.all()
    serializer_class = ProposalSerializer    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ad_sender', 'ad_receiver', 'status']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return ExchangeProposal.objects.all()
        else:
            return ExchangeProposal.objects.filter(ad_receiver__user=user)

    
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsNotAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        login(request, user)
        
        return Response({
            "message": "Пользователь зарегистрирован и авторизован",
            "username": user.username
        }, status=status.HTTP_201_CREATED)
    
class LoginAPIView(APIView):
    permission_classes = [IsNotAuthenticated]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({'message': 'Успешная авторизация'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Неверный пароль или логин'}, status=status.HTTP_400_BAD_REQUEST)
        
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Вы успешно вышли."}, status=status.HTTP_200_OK)
    
class MyCardsAPIView(ListAPIView):
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ad.objects.filter(user=self.request.user)