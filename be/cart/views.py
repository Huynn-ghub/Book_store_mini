from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from cart.models import CartItem
from cart.serializers import CartItemSerializer
from books.models import Book

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        items = CartItem.objects.filter(user=request.user).select_related('book')
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request: Request):
        book_id = request.data.get('book_id')
        if not book_id:
            return Response(
                {'error': 'book_id is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response(
                {'error': 'Sách không tồn tại.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        _, created = CartItem.objects.get_or_create(user=request.user, book=book)
        if not created:
            return Response(
                {'error': 'Sách đã có trong giỏ hàng.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({'message': f'Đã thêm "{book.title}" vào giỏ hàng.'}, status=status.HTTP_201_CREATED)


class CartItemDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request: Request, book_id: int):
        try:
            item = CartItem.objects.get(user=request.user, book_id=book_id)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Sách không có trong giỏ hàng.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        item.delete()
        return Response({'message': 'Đã xóa khỏi giỏ hàng.'}, status=status.HTTP_200_OK)
