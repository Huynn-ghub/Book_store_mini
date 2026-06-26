from django.urls import path
from cart import views

urlpatterns = [
    path('',                  views.CartView.as_view(),           name='cart'),
    path('<int:book_id>/',    views.CartItemDeleteView.as_view(), name='cart-item-delete'),
]
