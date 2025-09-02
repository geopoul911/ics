# webapp/signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Client, Document

@receiver(post_delete, sender=Client)
def purge_orphan_documents_after_client_delete(sender, instance, **kwargs):
    # Remove docs that now have neither client nor project
    Document.objects.filter(client__isnull=True, project__isnull=True).delete()
