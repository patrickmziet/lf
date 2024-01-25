# Generated by Django 3.2.8 on 2024-01-15 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_document_document'),
    ]

    operations = [
        migrations.AddField(
            model_name='flashcard',
            name='due_date',
            field=models.FloatField(default=1705327856.3814867),
        ),
        migrations.AddField(
            model_name='flashcard',
            name='easiness',
            field=models.FloatField(default=2.4),
        ),
        migrations.AddField(
            model_name='flashcard',
            name='interval',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='flashcard',
            name='record',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='flashcard',
            name='repetitions',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='topic',
            name='card_msg_chain',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='flashcard',
            name='answer',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='flashcard',
            name='question',
            field=models.TextField(),
        ),
    ]
