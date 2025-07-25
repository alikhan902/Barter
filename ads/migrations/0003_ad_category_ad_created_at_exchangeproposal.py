# Generated by Django 5.2.4 on 2025-07-10 09:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ads', '0002_ad_description_ad_image_url_ad_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='ad',
            name='category',
            field=models.CharField(default='category', max_length=50),
        ),
        migrations.AddField(
            model_name='ad',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=None),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='ExchangeProposal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.CharField(default='comment', max_length=250)),
                ('status', models.CharField(choices=[('pending', 'Ожидает'), ('approved', 'Принята'), ('rejected', 'Отклонена')], default='pending', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ad_receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to='ads.ad')),
                ('ad_sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to='ads.ad')),
            ],
        ),
    ]
