# Generated by Django 3.2.8 on 2024-03-20 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20240320_1559'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flashcard',
            name='due_date',
            field=models.FloatField(default=1710950848.4567688),
        ),
        migrations.AlterField(
            model_name='flashcard',
            name='updated_at',
            field=models.FloatField(default=1710950908.4567857),
        ),
    ]
