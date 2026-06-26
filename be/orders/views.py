from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action

from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer
from cart.models import CartItem

class OrderViewSet(ModelViewSet):
    serializer_class   = OrderSerializer
    http_method_names  = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        if self.action == 'confirm':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Order.objects.prefetch_related('items__book').select_related('user')
        if self.request.user.is_staff:
            return qs.all().order_by('-created_at')
        return qs.filter(user=self.request.user).order_by('-created_at')

    def list(self, request: Request, *args, **kwargs):
        queryset   = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request: Request, *args, **kwargs):
        """Checkout: tạo Order từ giỏ hàng → xóa giỏ."""
        cart_items = CartItem.objects.filter(user=request.user).select_related('book')
        if not cart_items.exists():
            return Response(
                {'error': 'Giỏ hàng trống, không thể đặt hàng.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = Order.objects.create(user=request.user)
        for item in cart_items:
            OrderItem.objects.create(order=order, book=item.book, price=item.book.price)

        cart_items.delete()

        serializer = self.serializer_class(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request: Request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            order = Order.objects.prefetch_related('items__book').select_related('user').get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': f'Không tìm thấy đơn hàng id={pk}.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if not request.user.is_staff and order.user != request.user:
            return Response({'error': 'Không có quyền truy cập.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(order)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='confirm')
    def confirm(self, request: Request, pk=None):
        try:
            order = Order.objects.prefetch_related('items__book').select_related('user').get(pk=pk)
        except Order.DoesNotExist:
            return Response(
                {'error': f'Không tìm thấy đơn hàng id={pk}.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if order.status != 'pending':
            return Response(
                {'error': 'Chỉ có thể xác nhận đơn hàng đang chờ (pending).'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = 'confirmed'
        order.save()
        serializer = self.serializer_class(order)
        return Response(serializer.data)
