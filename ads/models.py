import os
from django.db import models
from django.contrib.auth.models import User
from simple_history.models import HistoricalRecords

class Condition(models.TextChoices):
    NEW = 'Новый', 'Новый'
    USED = 'Б/У', 'Б/У'

class Ad(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50, default='title')
    description = models.TextField(max_length=250, default='descriptions')
    image_url = models.ImageField(upload_to='products/', default= None)
    category = models.CharField(max_length=50, default='category')
    condition = models.CharField(max_length=10, choices=Condition.choices, default=Condition.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    history = HistoricalRecords()
    
    def delete(self, *args, **kwargs):
        image_path = self.image_url.path if self.image_url else None
        super().delete(*args, **kwargs)

        if image_path and not Ad.objects.filter(image_url=self.image_url.name).exists():
            if os.path.exists(image_path):
                os.remove(image_path)
   
class Status(models.TextChoices):
    PENDING = 'Ожидание',
    APPROVED = 'Принято', 
    REJECTED = 'Отказано', 
 
class ExchangeProposal(models.Model):
    ad_sender = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='sender')
    ad_receiver = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='receiver')
    comment = models.CharField(max_length=250, default='comment')
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    history = HistoricalRecords()
    
    class Meta:
        unique_together = ('ad_sender', 'ad_receiver')