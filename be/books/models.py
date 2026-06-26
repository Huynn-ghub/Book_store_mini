from django.db import models
from django.contrib.auth.models import User


# ─── Category ─────────────────────────────────────────────────────────────────

class Category(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ─── Book ─────────────────────────────────────────────────────────────────────

class Book(models.Model):
    STATUS_CHOICES = [
        ('available',    'Available'),
        ('out_of_stock', 'Out of Stock'),
    ]

    title          = models.CharField(max_length=200)
    author         = models.CharField(max_length=100)
    published_date = models.DateField()
    price          = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    quantity       = models.IntegerField(default=0)
    category       = models.ForeignKey(
        Category, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='books'
    )
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    def save(self, *args, **kwargs):
        # Tự động đồng bộ status theo quantity
        if self.quantity <= 0:
            self.status = 'out_of_stock'
        else:
            self.status = 'available'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

