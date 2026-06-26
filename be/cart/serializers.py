from rest_framework import serializers
from cart.models import CartItem

class CartItemSerializer(serializers.ModelSerializer):
    book_id     = serializers.IntegerField(source='book.id', read_only=True)
    book_title  = serializers.CharField(source='book.title', read_only=True)
    book_author = serializers.CharField(source='book.author', read_only=True)
    book_price  = serializers.DecimalField(source='book.price', max_digits=10, decimal_places=2, read_only=True)
    book_status = serializers.CharField(source='book.status', read_only=True)

    class Meta:
        model  = CartItem
        fields = ['id', 'book_id', 'book_title', 'book_author', 'book_price', 'book_status', 'added_at']
        read_only_fields = ['added_at']
