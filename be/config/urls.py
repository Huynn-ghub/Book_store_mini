from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Accounts/Auth endpoints
    path('api/', include('accounts.urls')),
    
    # Cart endpoints
    path('api/cart/', include('cart.urls')),
    
    # Orders endpoints
    path('api/orders/', include('orders.urls')),
    
    # Books & Categories endpoints (ViewSet router)
    path('api/', include('books.urls')),
]
