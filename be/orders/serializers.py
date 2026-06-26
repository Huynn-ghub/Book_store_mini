from rest_framework import serializers
from orders.models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model  = OrderItem
        fields = ['id', 'book', 'book_title', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items      = OrderItemSerializer(many=True, read_only=True)
    username   = serializers.CharField(source='user.username', read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model  = Order
        fields = ['id', 'user', 'username', 'status', 'created_at', 'item_count', 'items']
        read_only_fields = ['user', 'status', 'created_at']

    def get_item_count(self, obj):
        return obj.items.count()
