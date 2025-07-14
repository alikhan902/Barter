from rest_framework import serializers
from .models import Ad, ExchangeProposal
from django.contrib.auth.models import User

class AdSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Ad
        fields = '__all__'

class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeProposal
        fields = '__all__'
        
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user