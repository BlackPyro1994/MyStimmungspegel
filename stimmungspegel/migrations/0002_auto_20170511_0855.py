# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-11 08:55
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('stimmungspegel', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='rating',
            old_name='rating',
            new_name='value',
        ),
    ]
