from django.contrib import admin
from books.models import Book, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'price', 'quantity', 'status')
    search_fields = ('title', 'author')
    list_filter = ('category', 'status')
    ordering = ('-id',)
