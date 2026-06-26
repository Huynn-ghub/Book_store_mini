from django.db import models
from django.contrib.auth.models import User
from books.models import Book

class CartItem(models.Model):
    user     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    book     = models.ForeignKey(Book, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} – {self.book.title}"
